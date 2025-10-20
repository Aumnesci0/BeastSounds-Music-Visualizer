import React, { useState, useCallback } from 'react';
import Visualizer from './components/Visualizer';

const App: React.FC = () => {
  const [timeSignature, setTimeSignature] = useState<string>('4/4');
  const [bpm, setBpm] = useState<number>(120);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const handleTimeSignatureChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeSignature(e.target.value);
  }, []);

  const handleBpmChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newBpm = parseInt(e.target.value, 10);
    if (!isNaN(newBpm) && newBpm > 0) {
      setBpm(newBpm);
    } else if (e.target.value === '') {
        setBpm(0);
    }
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);
  
  const toggleExportMode = useCallback(() => {
    if (isPlaying) {
      setIsPlaying(false);
    }
    setIsExporting(prev => !prev);
  }, [isPlaying]);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center font-sans p-4 transition-colors duration-300 ${isExporting ? 'bg-green-500' : 'bg-gray-900 text-white'}`}>
       {isExporting && (
        <div className="absolute top-4 left-4 bg-gray-900 bg-opacity-80 p-4 rounded-lg text-white shadow-lg text-left max-w-xs z-10">
          <h3 className="font-bold text-lg mb-2">Recording Mode</h3>
          <p className="text-sm">
            Use screen recording software to capture the animation. The green background can be easily removed (chroma key) in video editing software to achieve transparency.
          </p>
        </div>
      )}
      
      {!isExporting && (
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold tracking-wider uppercase text-gray-300">
            Metronome
            </h1>
            <p className="text-gray-500">A Visual Rhythm Experience</p>
        </header>
      )}

      <main className="flex flex-col items-center">
        <Visualizer timeSignature={timeSignature} bpm={bpm} isPlaying={isPlaying} volume={volume} isExporting={isExporting}/>

        <div className="mt-10 w-full max-w-sm">
          {!isExporting && (
            <div className="space-y-6 mb-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <label htmlFor="time-signature" className="text-sm font-medium text-gray-400 mb-2">
                    Time Signature
                  </label>
                  <input
                    id="time-signature"
                    type="text"
                    value={timeSignature}
                    onChange={handleTimeSignatureChange}
                    className="bg-gray-800 border border-gray-700 rounded-md text-center w-full py-2 text-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
                
                <div className="flex flex-col items-center">
                  <label htmlFor="bpm" className="text-sm font-medium text-gray-400 mb-2">
                    BPM
                  </label>
                  <input
                    id="bpm"
                    type="number"
                    value={bpm}
                    onChange={handleBpmChange}
                    min="1"
                    max="300"
                    className="bg-gray-800 border border-gray-700 rounded-md text-center w-full py-2 text-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <label htmlFor="volume" className="text-sm font-medium text-gray-400 mb-2 w-full text-center">
                  Volume
                </label>
                <input
                  id="volume"
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-600"
                  aria-label="Volume control"
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={togglePlay}
              className={`w-28 py-2 text-lg font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isExporting ? 'focus:ring-offset-green-500 text-gray-900' : 'focus:ring-offset-gray-900'} ${
                isPlaying
                  ? `bg-red-500 hover:bg-red-600 focus:ring-red-400 ${isExporting ? '' : 'text-white'}`
                  : `bg-cyan-500 hover:bg-cyan-600 focus:ring-cyan-400 ${isExporting ? '' : 'text-white'}`
              }`}
            >
              {isPlaying ? 'Stop' : 'Start'}
            </button>
             <button
              onClick={toggleExportMode}
              className={`w-40 py-2 text-lg font-semibold rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isExporting ? 'focus:ring-offset-green-500 text-gray-900 bg-purple-400 hover:bg-purple-500 focus:ring-purple-300' : 'text-white focus:ring-offset-gray-900 bg-purple-600 hover:bg-purple-700 focus:ring-purple-500'}`}
            >
              {isExporting ? 'Finish Export' : 'Export Video'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;