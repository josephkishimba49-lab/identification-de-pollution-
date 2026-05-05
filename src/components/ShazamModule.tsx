import React, { useRef, useState, useEffect } from 'react';
import { Camera, Image as ImageIcon, Loader2, Upload, Scan, AlertTriangle, Fingerprint, Mic, Radio } from 'lucide-react';
import { analyzePollutionImage } from '../services/geminiService';

interface ScanResult {
  sourceType: string;
  confidence: number;
  reasoning: string;
  suggestedMarkers: { symbol: string; estimatedConcentration: number }[];
}

export const ShazamModule: React.FC = () => {
  const [activeMode, setActiveMode] = useState<'visual' | 'acoustic' | 'spectral'>('visual');
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(() => localStorage.getItem('shazam_image') || null);
  const [result, setResult] = useState<ScanResult | null>(() => {
    const saved = localStorage.getItem('shazam_result');
    return saved ? JSON.parse(saved) : null;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (previewUrl) {
      localStorage.setItem('shazam_image', previewUrl);
    } else {
      localStorage.removeItem('shazam_image');
    }
  }, [previewUrl]);

  useEffect(() => {
    if (result) {
      localStorage.setItem('shazam_result', JSON.stringify(result));
    } else {
      localStorage.removeItem('shazam_result');
    }
  }, [result]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const mimeType = file.type;
      
      setPreviewUrl(reader.result as string);
      setResult(null);

      try {
        setIsScanning(true);
        setError(null);
        const scanResult = await analyzePollutionImage(base64String, mimeType);
        setResult(scanResult);
      } catch (err) {
        setError('Failed to analyze image. Please try again.');
        console.error(err);
      } finally {
        setIsScanning(false);
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const clearScan = () => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }

  const simulateAcousticScan = () => {
    setIsScanning(true);
    setResult(null);
    setError(null);
    
    // Simulate ambient listening for 4 seconds
    setTimeout(() => {
      setResult({
        sourceType: "Industrial Pumping Station",
        confidence: 0.92,
        reasoning: "Acoustic fingerprint matches high-pressure centrifugal pumps typical of wastewater bypass or illegal dumping activities. Harmonic distortion at 400Hz suggests failing bearings, often found in unmaintained clandestine setups.",
        suggestedMarkers: [
           { symbol: "TSS", estimatedConcentration: 1200 },
           { symbol: "Zn", estimatedConcentration: 5.4 }
        ]
      });
      setIsScanning(false);
    }, 4000);
  };

  const simulateSpectralScan = () => {
    setIsScanning(true);
    setResult(null);
    setError(null);
    
    setTimeout(() => {
      setResult({
        sourceType: "Heavy Metallurgy (Smelting)",
        confidence: 0.88,
        reasoning: "Electromagnetic spectral analysis reveals interference patterns consistent with high-voltage arc furnaces. The specific RF noise signature strongly correlates with unregulated arc melting often associated with off-the-books metal recycling.",
        suggestedMarkers: [
           { symbol: "Pb", estimatedConcentration: 1.2 },
           { symbol: "Cd", estimatedConcentration: 0.3 }
        ]
      });
      setIsScanning(false);
    }, 4000);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6 flex gap-2">
         <button 
           onClick={() => { setActiveMode('visual'); clearScan(); }} 
           className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${activeMode === 'visual' ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line text-brand-ink hover:bg-brand-line/5'}`}
         >
           <Camera className="w-4 h-4" /> Visual
         </button>
         <button 
           onClick={() => { setActiveMode('acoustic'); clearScan(); }} 
           className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${activeMode === 'acoustic' ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line text-brand-ink hover:bg-brand-line/5'}`}
         >
           <Mic className="w-4 h-4" /> Acoustic (Sonar/Audio)
         </button>
         <button 
           onClick={() => { setActiveMode('spectral'); clearScan(); }} 
           className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${activeMode === 'spectral' ? 'bg-brand-ink text-brand-bg border-brand-ink' : 'border-brand-line text-brand-ink hover:bg-brand-line/5'}`}
         >
           <Radio className="w-4 h-4" /> Spectral (EM/RF)
         </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column: Input */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="bg-brand-bg border border-brand-line p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] min-h-[460px]">
            <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2 flex items-center gap-2">
              <Scan className="w-5 h-5" />
              {activeMode === 'visual' && "Visual Assessment"}
              {activeMode === 'acoustic' && "Acoustic Fingerprinting"}
              {activeMode === 'spectral' && "Electromagnetic Sweeping"}
            </h2>

            {/* Visual Mode */}
            {activeMode === 'visual' && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  ref={fileInputRef}
                />

                {!previewUrl ? (
                  <div 
                    className="border-2 border-dashed border-brand-line/30 hover:border-brand-ink/50 bg-brand-line/5 transition-all p-12 flex flex-col items-center justify-center cursor-pointer group h-64"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <div className="p-4 bg-brand-bg rounded-full border border-brand-line/20 group-hover:border-brand-ink/30 transition-colors mb-4">
                      <Camera className="w-8 h-8 text-brand-ink opacity-70 group-hover:opacity-100" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-widest text-brand-ink mb-1 group-hover:text-brand-ink">Awaiting Image Target</p>
                    <p className="text-[10px] font-mono text-brand-line opacity-70 max-w-[250px] text-center">
                      Upload a photo of a spill, stained soil, or smoke plume to extract visual signatures.
                    </p>
                  </div>
                ) : (
                  <div className="relative border border-brand-line overflow-hidden group h-64 bg-black flex items-center justify-center">
                    <img 
                      src={previewUrl} 
                      alt="Captured Target" 
                      className={`max-w-full max-h-full object-contain transition-opacity duration-700 ${isScanning ? 'opacity-50' : 'opacity-100'}`} 
                    />
                    
                    {isScanning && (
                      <>
                        <div className="absolute inset-0 bg-brand-ink/10 mix-blend-overlay pointer-events-none"></div>
                        <div className="absolute top-0 left-0 right-0 h-1 bg-brand-ink opacity-70 absolute-scanner blur-[2px]"></div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                          <Fingerprint className="w-16 h-16 text-brand-bg animate-pulse drop-shadow-md mb-4" />
                          <div className="bg-brand-ink text-brand-bg px-4 py-2 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Extracting Signatures...
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {previewUrl && !isScanning && (
                  <div className="flex gap-4 mt-6">
                     <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 border border-brand-ink bg-brand-ink text-brand-bg py-3 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
                      >
                        <Upload className="w-4 h-4" />
                        Another Image
                      </button>
                      <button
                        onClick={clearScan}
                        className="flex-1 border border-brand-line py-3 text-xs font-bold uppercase tracking-wider hover:bg-brand-line/5 transition-all text-brand-ink shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
                      >
                        Clear
                      </button>
                  </div>
                )}
              </>
            )}

            {/* Acoustic Mode */}
            {activeMode === 'acoustic' && (
              <div className="flex flex-col items-center justify-center h-full">
                 <div className="mb-8 relative flex items-center justify-center">
                   <div className={`absolute inset-0 bg-brand-ink/10 rounded-full blur-[30px] transition-all duration-1000 ${isScanning ? 'scale-[2] opacity-100' : 'scale-50 opacity-0'}`}></div>
                   <Mic className={`w-24 h-24 ${isScanning ? 'text-red-500 animate-pulse' : 'text-brand-ink opacity-20'}`} />
                 </div>
                 
                 {isScanning ? (
                   <div className="w-full space-y-4">
                     <div className="flex justify-between w-full h-12 items-center gap-1 opacity-70">
                        {Array.from({length: 40}).map((_, i) => (
                           <div key={i} className="w-full bg-brand-ink origin-bottom animate-wave" style={{height: `${Math.max(10, Math.random() * 100)}%`, animationDelay: `${i * 0.05}s`}}></div>
                        ))}
                     </div>
                     <p className="text-center font-mono text-xs uppercase tracking-widest animate-pulse">Capturing ambient acoustic data...</p>
                   </div>
                 ) : (
                    <button
                      onClick={simulateAcousticScan}
                      className="border border-brand-ink bg-brand-ink text-brand-bg py-4 px-8 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
                    >
                      Begin Live Audio Capture
                    </button>
                 )}
              </div>
            )}

            {/* Spectral Mode */}
            {activeMode === 'spectral' && (
              <div className="flex flex-col items-center justify-center h-full">
                 <div className="mb-8 relative flex items-center justify-center overflow-hidden w-full h-32 border border-brand-line/30 bg-black/5">
                   <div className={`absolute top-0 bottom-0 w-1 bg-green-500 shadow-[0_0_10px_green] transition-all duration-3000 ease-linear ${isScanning ? 'left-full animate-[scanline_2s_linear_infinite]' : 'left-0 hidden'}`}></div>
                   {!isScanning && <Radio className="w-16 h-16 text-brand-line opacity-30" />}
                 </div>
                 
                 {isScanning ? (
                   <div className="w-full text-center">
                     <p className="font-mono text-xs uppercase tracking-widest text-green-700 animate-pulse">Sweeping RF / EM bands [30MHz - 3GHz]...</p>
                   </div>
                 ) : (
                    <button
                      onClick={simulateSpectralScan}
                      className="border border-brand-ink bg-brand-ink text-brand-bg py-4 px-8 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]"
                    >
                      Initiate Local EM Sweep
                    </button>
                 )}
              </div>
            )}

            {error && (
              <div className="mt-6 border border-red-500/30 bg-red-500/10 p-4 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs font-mono text-red-700 uppercase">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="w-full lg:w-1/2">
           <div className="bg-brand-bg border border-brand-line p-6 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)] min-h-[460px]">
              <h2 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-brand-line/20 pb-2 flex items-center gap-2">
                <Fingerprint className="w-5 h-5" />
                Extracted Forensics
              </h2>

              {!result && !isScanning ? (
                <div className="h-64 flex flex-col items-center justify-center text-center opacity-30">
                  <Fingerprint className="w-12 h-12 mb-4" />
                  <p className="font-mono text-xs uppercase max-w-[200px]">Awaiting target data to perform multi-modal signature extraction.</p>
                </div>
              ) : isScanning ? (
                 <div className="h-64 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-8 h-8 text-brand-ink animate-spin mb-4" />
                    <p className="font-mono text-xs uppercase animate-pulse">Running neural pattern recognition...</p>
                 </div>
              ) : result ? (
                 <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="flex items-center justify-between mb-8">
                       <div>
                         <p className="text-[10px] font-mono opacity-50 uppercase mb-1">Identified Source Typology</p>
                         <h3 className="text-3xl font-display font-black leading-none uppercase">{result.sourceType}</h3>
                       </div>
                       <div className="text-right">
                         <p className="text-[10px] font-mono opacity-50 uppercase mb-1">Confidence Score</p>
                         <div className={`text-4xl font-display font-black leading-none ${result.confidence > 0.8 ? 'text-red-600' : 'text-brand-ink'}`}>
                           {Math.round(result.confidence * 100)}%
                         </div>
                       </div>
                    </div>

                    <div className="mb-8 p-4 bg-brand-ink flex items-start gap-4 shadow-[4px_4px_0px_0px_rgba(20,20,20,1)]">
                      <AlertTriangle className="w-6 h-6 text-brand-bg shrink-0" />
                      <p className="text-sm font-mono text-brand-bg leading-relaxed">
                        {result.reasoning}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-brand-line/20 pb-2">Inferred Chemical / Physical Markers</p>
                      <div className="space-y-4">
                        {result.suggestedMarkers.map((m, i) => (
                           <div key={i} className="flex flex-col gap-2">
                             <div className="flex justify-between items-end">
                                <span className="font-mono font-bold text-sm">{m.symbol}</span>
                                <span className="font-mono text-xs opacity-70">~{m.estimatedConcentration} mg/L est.</span>
                             </div>
                             <div className="w-full h-1 bg-brand-line/10">
                                <div className="h-full bg-brand-ink" style={{ width: `${Math.min((m.estimatedConcentration / 100) * 100, 100)}%` }}></div>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                 </div>
              ) : null}
           </div>
        </div>
      </div>
      <style>{`
        @keyframes scanner {
          0% { transform: translateY(0); }
          50% { transform: translateY(240px); }
          100% { transform: translateY(0); }
        }
        .absolute-scanner {
          animation: scanner 2.5s ease-in-out infinite;
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.2); }
          50% { transform: scaleY(1); }
        }
        .animate-wave {
          animation: wave 0.8s ease-in-out infinite;
        }
        @keyframes scanline {
          0% { left: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};
