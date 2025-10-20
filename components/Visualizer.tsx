import React, { useState, useEffect, useMemo } from 'react';

interface VisualizerProps {
  timeSignature: string;
  bpm: number;
  isPlaying: boolean;
  volume: number;
  isExporting: boolean;
}

interface Point {
  x: number;
  y: number;
}

const accentClickUrl = 'https://daveceddia.com/freebies/react-metronome/click1.wav';
const regularClickUrl = 'https://daveceddia.com/freebies/react-metronome/click2.wav';


const Visualizer: React.FC<VisualizerProps> = ({ timeSignature, bpm, isPlaying, volume, isExporting }) => {
  const [currentBeat, setCurrentBeat] = useState<number>(0);

  const accentClick = useMemo(() => new Audio(accentClickUrl), []);
  const regularClick = useMemo(() => new Audio(regularClickUrl), []);

  useEffect(() => {
    accentClick.volume = volume;
    regularClick.volume = volume;
  }, [volume, accentClick, regularClick]);

  const beats = useMemo(() => {
    const parts = timeSignature.split('/');
    const numerator = parseInt(parts[0], 10);
    // Default to 4 beats for invalid input, allow 2 beats for a line.
    return !isNaN(numerator) && numerator >= 2 ? numerator : 4;
  }, [timeSignature]);

  const points = useMemo<Point[]>(() => {
    const pointsArray: Point[] = [];
    const svgSize = 400;
    const radius = 150;
    const center = { x: svgSize / 2, y: svgSize / 2 };

    if (beats < 2) return [];

    if (beats === 2) {
      // Special case for 2/4, create a horizontal line
      pointsArray.push({ x: center.x - radius / 1.5, y: center.y });
      pointsArray.push({ x: center.x + radius / 1.5, y: center.y });
    } else {
      // Calculate points for a regular polygon
      for (let i = 0; i < beats; i++) {
        // Subtract PI/2 to start the first point at the top
        const angle = (i / beats) * 2 * Math.PI - Math.PI / 2;
        pointsArray.push({
          x: center.x + radius * Math.cos(angle),
          y: center.y + radius * Math.sin(angle),
        });
      }
    }
    return pointsArray;
  }, [beats]);

  useEffect(() => {
    if (!isPlaying || bpm <= 0 || beats < 2) {
      setCurrentBeat(0);
      return;
    }

    // Immediately start on beat 1 when play is pressed
    accentClick.currentTime = 0;
    accentClick.play().catch(error => console.error("Audio play failed:", error));
    setCurrentBeat(1);

    const intervalTime = (60 / bpm) * 1000;
    const intervalId = setInterval(() => {
      setCurrentBeat(prev => {
          const nextBeat = (prev % beats) + 1;
          if(nextBeat === 1) {
              accentClick.currentTime = 0;
              accentClick.play().catch(error => console.error("Audio play failed:", error));
          } else {
              regularClick.currentTime = 0;
              regularClick.play().catch(error => console.error("Audio play failed:", error));
          }
          return nextBeat;
      });
    }, intervalTime);

    // Cleanup function to clear interval
    return () => {
      clearInterval(intervalId);
    };
  }, [isPlaying, bpm, beats, accentClick, regularClick]);


  const currentPoint = points[currentBeat - 1];
  
  const containerClasses = `w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] flex items-center justify-center ${
    isExporting ? '' : 'bg-gray-800/50 rounded-full border-2 border-gray-700'
  }`;

  return (
    <div className={containerClasses}>
      <svg width="100%" height="100%" viewBox="0 0 400 400">
        <defs>
            <filter id="glow">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>
        
        {/* Draw connecting lines */}
        {beats > 2 && (
          <polygon
            points={points.map(p => `${p.x},${p.y}`).join(' ')}
            className="stroke-gray-600 fill-none"
            strokeWidth="2"
          />
        )}
        {beats === 2 && points.length === 2 && (
          <line
            x1={points[0].x} y1={points[0].y}
            x2={points[1].x} y2={points[1].y}
            className="stroke-gray-600"
            strokeWidth="2"
          />
        )}

        {/* Draw vertex points */}
        {points.map((point, index) => (
          <circle
            key={`vertex-${index}`}
            cx={point.x}
            cy={point.y}
            r="8"
            className={index === 0 ? "fill-red-500" : "fill-gray-500"}
          />
        ))}

        {/* Draw moving beat dot */}
        {isPlaying && currentPoint && (
          <circle
            cx={currentPoint.x}
            cy={currentPoint.y}
            r="16"
            className="fill-white"
            filter="url(#glow)"
          />
        )}
      </svg>
    </div>
  );
};

export default Visualizer;