'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/services/storageService';
import { GeminiService, GarmentAnalysisResult, PairedOutfitResult } from '@/services/geminiService';
import { GarmentCategory, LaundryStatus, WardrobeItem } from '@/types/wardrobe';
import { BottomNav } from '@/components/BottomNav';
import StarBorder from '@/components/reactbits/StarBorder';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import sound from '@/services/soundService';
import confetti from 'canvas-confetti';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ArrowLeft, 
  X, 
  Layers, 
  ScanLine,
  Shuffle,
  Bookmark
} from 'lucide-react';

export default function ScanPage() {
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // States
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Editable AI Analysis Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<GarmentCategory>('TOPS');
  const [colour, setColour] = useState('');
  const [pattern, setPattern] = useState('');
  const [patternType, setPatternType] = useState<string>('Solid');
  const [exactColor, setExactColor] = useState<{ name: string; hex: string; palette: string; temperature: 'Warm' | 'Cool' | 'Neutral' } | null>(null);
  const [fabric, setFabric] = useState('');
  const [style, setStyle] = useState('');
  const [occasions, setOccasions] = useState('');
  const [seasons, setSeasons] = useState('');
  const [laundryStatus, setLaundryStatus] = useState<LaundryStatus>('CLEAN');
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GarmentAnalysisResult | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [pairedOutfit, setPairedOutfit] = useState<PairedOutfitResult | null>(null);
  const [pairingLoading, setPairingLoading] = useState(false);

  // Load wardrobe on mount for pairing
  useEffect(() => {
    const items = StorageService.getWardrobe();
    setWardrobe(items);
  }, []);

  // Handle File Upload from device (FEATURE 1 & 9)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setSelectedImage(dataUrl);
      stopCamera();
      triggerAiAnalysis(dataUrl, file.name);
    };
    reader.readAsDataURL(file);
  };

  // Start Device Camera
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, please use file upload', err);
      setIsCameraActive(false);
      alert('Camera access unavailable. Please choose an image from your device.');
      fileInputRef.current?.click();
    }
  };

  // Stop Device Camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  // Capture Frame from Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setSelectedImage(dataUrl);
      setFileName('camera_capture.jpg');
      stopCamera();
      triggerAiAnalysis(dataUrl, 'camera_capture.jpg');
    }
  };

  // Generate Harmonious Wardrobe Pairing for this Garment
  const generatePairing = (
    itemTitle?: string,
    itemCategory?: GarmentCategory,
    itemColour?: string,
    itemPattern?: string,
    imgUrl?: string
  ) => {
    setPairingLoading(true);
    sound.playShuffle();
    try {
      const currentWardrobe = StorageService.getWardrobe();
      setWardrobe(currentWardrobe);
      const pairing = GeminiService.pairGarmentWithWardrobe(
        {
          name: itemTitle || name || 'Scanned Piece',
          category: itemCategory || category,
          colour: itemColour || colour || 'Neutral',
          pattern: itemPattern || pattern || 'Solid',
          imageUrl: imgUrl || selectedImage || ''
        },
        currentWardrobe
      );
      setPairedOutfit(pairing);
    } catch (e) {
      console.error('Pairing error', e);
    } finally {
      setPairingLoading(false);
    }
  };

  // Trigger AI Analysis with Exact Colour, Pattern & Category
  const triggerAiAnalysis = async (imageDataUrl: string, nameHint: string) => {
    setIsAnalyzing(true);
    setAnalysisDone(false);
    setPairedOutfit(null);

    try {
      const result = await GeminiService.analyzeGarment(imageDataUrl, nameHint);
      setAnalysisResult(result);
      setName(result.name);
      setCategory(result.category);
      setColour(result.colour);
      setPattern(result.pattern);
      setPatternType(result.patternType);
      setExactColor(result.exactColor);
      setFabric(result.fabric);
      setStyle(result.style);
      setOccasions(result.occasions.join(', '));
      setSeasons(result.seasons.join(', '));
      setLaundryStatus(result.laundryStatus);
      setAnalysisDone(true);

      // Auto-pair with user's wardrobe pieces
      const currentWardrobe = StorageService.getWardrobe();
      setWardrobe(currentWardrobe);
      const pairing = GeminiService.pairGarmentWithWardrobe(
        {
          name: result.name,
          category: result.category,
          colour: result.colour,
          pattern: result.pattern,
          imageUrl: imageDataUrl
        },
        currentWardrobe
      );
      setPairedOutfit(pairing);
    } catch (err) {
      console.error('Error during AI analysis', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // FEATURE 2: ADD TO WARDROBE (Persists with actual image & exact attributes)
  const handleAddToWardrobe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    StorageService.addItem({
      name,
      category,
      colour,
      pattern,
      fabric,
      style,
      occasions: occasions.split(',').map((s) => s.trim()).filter(Boolean),
      seasons: seasons.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl: selectedImage, // Actual uploaded image
      laundryStatus,
      notes: `Identified by We Milan Atelier (${patternType}, ${exactColor?.palette || 'Curated'})`,
      colorMetrics: exactColor ? {
        hex: exactColor.hex,
        palette: exactColor.palette,
        temperature: exactColor.temperature
      } : undefined
    });

    setIsSuccess(true);
    setTimeout(() => {
      router.push('/wardrobe');
    }, 900);
  };

  const categories: GarmentCategory[] = [
    'TOPS',
    'BOTTOMS',
    'DRESSES',
    'OUTERWEAR',
    'CO-ORDS',
    'KNITWEAR',
    'ACTIVEWEAR',
    'LOUNGEWEAR',
    'SHOES',
    'BAGS',
    'JEWELRY',
    'ACCESSORIES'
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#181A31] text-[#F2ECDD] min-h-full">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 border-b border-[rgba(242,236,221,0.08)] space-y-2">
        <div className="flex items-center justify-between">
          <WeMilanLogo variant="header" size="sm" />

          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />
            <button
              onClick={() => {
                setSelectedImage(null);
                setAnalysisDone(false);
                stopCamera();
              }}
              className="text-xs font-mono text-[#9C9FBE] hover:text-[#F2ECDD] px-2 py-1 rounded-md bg-[#272A4B]/60"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-[#9C9FBE] hover:text-[#F2ECDD]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="eyebrow">
              Computer Vision &bull; Archive Ingestion
            </div>
            <h1 className="font-serif text-xl font-medium text-[#F2ECDD] tracking-tight">
              Ingest into <em>Wardrobe</em>
            </h1>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none space-y-4">
        {/* Step 1: Camera or File Upload Picker if no image selected */}
        {!selectedImage && !isCameraActive && (
          <div className="space-y-4 my-auto py-8">
            {/* Visual Dropzone / Camera trigger */}
            <div className="border-2 border-dashed border-[rgba(242,236,221,0.2)] rounded-3xl p-8 text-center bg-[#272A4B]/30 flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#E44C4E]/20 to-[#CCA166]/20 border border-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#CCA166] mb-3">
                <ScanLine className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
                Scan Clothing
              </h3>
              <p className="font-sans text-xs text-[#9C9FBE] max-w-[240px] mt-1 mb-6">
                Capture with camera or upload a clear photo of your garment.
              </p>

              {/* Action Buttons */}
              <div className="w-full space-y-2.5 max-w-[260px]">
                <button
                  type="button"
                  onClick={startCamera}
                  className="w-full bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold py-3 px-4 rounded-full text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
                >
                  <Camera className="w-4 h-4" />
                  <span>Take photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#272A4B] hover:bg-[#3E437A] text-[#F2ECDD] border border-[rgba(242,236,221,0.15)] font-sans font-medium py-3 px-4 rounded-full text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Upload className="w-4 h-4 text-[#CCA166]" />
                  <span>Upload from device</span>
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Quick Demo Garment Pre-fills */}
            <div className="pt-2 text-center">
              <p className="font-mono text-[10px] text-[#9C9FBE] uppercase tracking-wider mb-2">
                Or test with sample garments:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  {
                    name: 'Black Pleated Skirt',
                    url: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    name: 'White Linen Shirt',
                    url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'
                  },
                  {
                    name: 'Blue Straight Jeans',
                    url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'
                  }
                ].map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      setSelectedImage(sample.url);
                      setFileName(sample.name);
                      triggerAiAnalysis(sample.url, sample.name);
                    }}
                    className="px-3 py-1.5 rounded-full bg-[#272A4B]/60 hover:bg-[#3E437A] border border-[rgba(242,236,221,0.1)] text-[#CCA166] font-mono text-[10px]"
                  >
                    + {sample.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Live Camera View */}
        {isCameraActive && (
          <div className="relative rounded-3xl overflow-hidden bg-black border border-[rgba(242,236,221,0.2)] aspect-[3/4] flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />

            {/* Reticle Overlay */}
            <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-[#CCA166] rounded-xl" />
            </div>

            {/* Camera Controls */}
            <div className="absolute bottom-5 inset-x-0 flex items-center justify-around px-6">
              <button
                type="button"
                onClick={stopCamera}
                className="w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-white border-4 border-[#E44C4E] shadow-lg flex items-center justify-center active:scale-95 transition-transform"
              />

              <div className="w-10" />
            </div>
          </div>
        )}

        {/* Image Preview & AI Loading State */}
        {selectedImage && (
          <div className="space-y-4">
            {/* Selected Image Thumbnail */}
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-[#272A4B] border border-[rgba(242,236,221,0.18)] shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedImage}
                alt="Selected garment preview"
                className="w-full h-full object-cover"
              />

              {/* Status overlay */}
              <div className="absolute top-3 right-3 bg-[#181A31]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[rgba(242,236,221,0.15)] font-mono text-[9px] text-[#CCA166]">
                {fileName || 'Garment preview'}
              </div>

              {/* Analyzing pulse banner */}
              {isAnalyzing && (
                <div className="absolute inset-0 bg-[#181A31]/85 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                  <div className="relative mb-3">
                    <div className="w-16 h-16 rounded-full border-2 border-[#E44C4E] animate-ping opacity-75" />
                    <div className="absolute inset-0 flex items-center justify-center text-[#CCA166]">
                      <Sparkles className="w-8 h-8" />
                    </div>
                  </div>
                  <h4 className="font-serif text-lg font-medium text-[#F2ECDD]">
                    Analyzing your garment...
                  </h4>
                  <p className="font-mono text-[10.5px] text-[#9C9FBE] mt-1">
                    Detecting fabric texture, silhouette & occasion fit
                  </p>
                </div>
              )}
            </div>

            {/* AI Generated Metadata Form (Editable by user) */}
            {analysisDone && !isAnalyzing && (
              <form onSubmit={handleAddToWardrobe} className="bg-gradient-to-b from-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-3xl p-5 shadow-xl space-y-3.5 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.1)]">
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#CCA166] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#E44C4E]" />
                    <span>Garment Profile Identified</span>
                  </span>
                  <span className="font-mono text-[9px] text-[#9C9FBE]">
                    Tap any field to edit
                  </span>
                </div>

                {/* Clothing Name */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                    Garment Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-sm font-serif font-medium text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                  />
                </div>

                {/* Category & Pattern */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                      Category ({categories.length})
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as GarmentCategory)}
                      className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                      Pattern / Weave
                    </label>
                    <input
                      type="text"
                      required
                      value={pattern}
                      onChange={(e) => setPattern(e.target.value)}
                      placeholder="Solid, Striped, Floral..."
                      className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                    />
                  </div>
                </div>

                {/* Pattern Quick Selector Chips */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166]">
                      Detected Pattern: {patternType}
                    </span>
                    <span className="font-mono text-[9px] text-[#9C9FBE]">
                      Tap to switch pattern
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['Solid', 'Striped', 'Floral', 'Plaid', 'Houndstooth', 'Geometric', 'Animal Print', 'Ombré'].map((pt) => (
                      <button
                        type="button"
                        key={pt}
                        onClick={() => {
                          setPatternType(pt);
                          setPattern(`${colour} ${pt}`);
                        }}
                        className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all ${
                          patternType === pt
                            ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                            : 'bg-[#181A31] text-[#9C9FBE] hover:text-[#F2ECDD] border border-[rgba(242,236,221,0.1)]'
                        }`}
                      >
                        {pt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Exact Colour & Undertone */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE]">
                      Exact Colour & Undertone
                    </label>
                    {exactColor && (
                      <span className="font-mono text-[9px] text-[#CCA166] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#CCA166]" />
                        <span>{exactColor.palette} · {exactColor.temperature}</span>
                      </span>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <div
                      className="absolute left-3 w-4 h-4 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: exactColor?.hex || analysisResult?.detectedMetrics?.dominantHex || '#CCA166' }}
                    />
                    <input
                      type="text"
                      required
                      value={colour}
                      onChange={(e) => setColour(e.target.value)}
                      className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl pl-9 pr-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                    />
                  </div>
                </div>

                {/* Fabric & Style */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                      Fabric / Material
                    </label>
                    <input
                      type="text"
                      required
                      value={fabric}
                      onChange={(e) => setFabric(e.target.value)}
                      className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                      Style / Aesthetic
                    </label>
                    <input
                      type="text"
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                    />
                  </div>
                </div>

                {/* Real Computer Vision Fabric & Color Metrics Chip */}
                {analysisResult?.detectedMetrics && (
                  <div className="bg-[#181A31]/90 border border-[rgba(242,236,221,0.12)] rounded-xl p-2.5 flex items-center justify-between font-mono text-[10px] shadow-inner">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full border border-white/20 shadow-sm"
                        style={{ backgroundColor: analysisResult.detectedMetrics.dominantHex }}
                      />
                      <span className="text-[#F2ECDD]">
                        Hex {analysisResult.detectedMetrics.dominantHex}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[#CCA166]">
                      <ScanLine className="w-3 h-3 text-[#E44C4E]" />
                      <span>
                        Pattern {Math.round(analysisResult.detectedMetrics.patternVariance * 100)}% · Texture {Math.round(analysisResult.detectedMetrics.textureRoughness * 100)}% · {analysisResult.confidence}% confidence
                      </span>
                    </div>
                  </div>
                )}

                {/* Suitable Occasions */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                    Suitable For (Occasions)
                  </label>
                  <input
                    type="text"
                    value={occasions}
                    onChange={(e) => setOccasions(e.target.value)}
                    placeholder="College, Travel, Casual, Summer"
                    className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                  />
                </div>

                {/* Seasons */}
                <div>
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                    Season
                  </label>
                  <input
                    type="text"
                    value={seasons}
                    onChange={(e) => setSeasons(e.target.value)}
                    placeholder="Summer, Spring, All season"
                    className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                  />
                </div>

                {/* FEATURE 9 & 10: ATELIER OUTFIT PAIRING */}
                {pairedOutfit && (
                  <div className="bg-[#181A31]/95 border border-[#CCA166]/30 rounded-2xl p-3.5 space-y-3 shadow-lg animate-fadeIn">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#CCA166]" />
                        <span className="font-serif text-xs font-semibold text-[#F2ECDD] tracking-wide">
                          Atelier Paired Ensemble
                        </span>
                      </div>
                      <span className="font-mono text-[9px] bg-[#CCA166]/15 text-[#CCA166] border border-[#CCA166]/30 px-2 py-0.5 rounded-full font-bold">
                        {pairedOutfit.harmonyScore}% Harmony · {pairedOutfit.colorHarmony}
                      </span>
                    </div>

                    <p className="font-sans text-[11px] text-[#9C9FBE] leading-relaxed">
                      {pairedOutfit.pairingRationale}
                    </p>

                    {/* Ensemble Visual Preview: Anchor + Paired Pieces */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {/* Anchor Scanned Piece */}
                      <div className="relative bg-[#272A4B] rounded-xl p-2 border border-[#CCA166]/40 flex flex-col items-center text-center">
                        <span className="absolute top-1 left-1 bg-[#E44C4E] text-[#181A31] font-mono text-[7.5px] uppercase font-bold px-1.5 py-0.2 rounded-full">
                          Anchor
                        </span>
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 my-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={pairedOutfit.anchorItem.imageUrl || selectedImage || ''}
                            alt={pairedOutfit.anchorItem.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-sans text-[10px] text-[#F2ECDD] font-medium truncate w-full">
                          {pairedOutfit.anchorItem.name}
                        </span>
                        <span className="font-mono text-[8px] text-[#CCA166] uppercase">
                          {pairedOutfit.anchorItem.category}
                        </span>
                      </div>

                      {/* Paired Wardrobe Pieces */}
                      {pairedOutfit.pairedPieces.slice(0, 2).map((piece) => (
                        <div
                          key={piece.id}
                          className="relative bg-[#272A4B]/70 rounded-xl p-2 border border-[rgba(242,236,221,0.1)] flex flex-col items-center text-center"
                        >
                          <span className="absolute top-1 left-1 bg-[#CCA166]/20 text-[#CCA166] font-mono text-[7.5px] uppercase font-semibold px-1.5 py-0.2 rounded-full">
                            Pairing
                          </span>
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 my-1">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={piece.imageUrl}
                              alt={piece.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <span className="font-sans text-[10px] text-[#F2ECDD] font-medium truncate w-full">
                            {piece.name}
                          </span>
                          <span className="font-mono text-[8px] text-[#9C9FBE] uppercase flex items-center gap-1 justify-center">
                            <span
                              className="w-1.5 h-1.5 rounded-full inline-block"
                              style={{ backgroundColor: piece.colorMetrics?.hex || '#CCA166' }}
                            />
                            <span>{piece.category}</span>
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Quick Pairing Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        onClick={() => generatePairing()}
                        disabled={pairingLoading}
                        className="text-[10px] font-mono text-[#CCA166] hover:text-[#F2ECDD] flex items-center gap-1 transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${pairingLoading ? 'animate-spin' : ''}`} />
                        <span>Shuffle Pairing</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          StorageService.addItem({
                            name,
                            category,
                            colour,
                            pattern,
                            fabric,
                            style,
                            occasions: occasions.split(',').map((s) => s.trim()).filter(Boolean),
                            seasons: seasons.split(',').map((s) => s.trim()).filter(Boolean),
                            imageUrl: selectedImage || '',
                            laundryStatus,
                            notes: `Paired Look Ensemble (${pairedOutfit.colorHarmony})`
                          });
                          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
                          router.push('/style');
                        }}
                        className="text-[10px] font-mono text-[#E44C4E] hover:underline flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Style & Wear &rarr;</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* StarBorder ADD TO WARDROBE Button */}
                <div className="pt-2">
                  <StarBorder
                    as="button"
                    type="submit"
                    disabled={isSuccess}
                    color="#CCA166"
                    speed="4s"
                    className="w-full cursor-pointer"
                    backgroundColor={isSuccess ? '#34D399' : '#E44C4E'}
                    textColor="#181A31"
                  >
                    <div className="flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold font-sans">
                      {isSuccess ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>ADDED TO DIGITAL WARDROBE!</span>
                        </>
                      ) : (
                        <>
                          <Layers className="w-4 h-4" />
                          <span>CONFIRM & ADD TO WARDROBE</span>
                        </>
                      )}
                    </div>
                  </StarBorder>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
