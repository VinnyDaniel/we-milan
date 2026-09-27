'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/services/storageService';
import { GeminiService, GarmentAnalysisResult } from '@/services/geminiService';
import { GarmentCategory, LaundryStatus, WardrobeItem } from '@/types/wardrobe';
import { BottomNav } from '@/components/BottomNav';
import StarBorder from '@/components/reactbits/StarBorder';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Check, 
  RefreshCw, 
  ArrowLeft, 
  X, 
  Layers, 
  ScanLine 
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
  const [fabric, setFabric] = useState('');
  const [style, setStyle] = useState('');
  const [occasions, setOccasions] = useState('');
  const [seasons, setSeasons] = useState('');
  const [laundryStatus, setLaundryStatus] = useState<LaundryStatus>('CLEAN');
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GarmentAnalysisResult | null>(null);

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

  // Trigger AI Analysis
  const triggerAiAnalysis = async (imageDataUrl: string, nameHint: string) => {
    setIsAnalyzing(true);
    setAnalysisDone(false);

    try {
      const result = await GeminiService.analyzeGarment(imageDataUrl, nameHint);
      setAnalysisResult(result);
      setName(result.name);
      setCategory(result.category);
      setColour(result.colour);
      setFabric(result.fabric);
      setStyle(result.style);
      setOccasions(result.occasions.join(', '));
      setSeasons(result.seasons.join(', '));
      setLaundryStatus(result.laundryStatus);
      setAnalysisDone(true);
    } catch (err) {
      console.error('Error during AI analysis', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // FEATURE 2: ADD TO WARDROBE (Persists with actual image)
  const handleAddToWardrobe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;

    StorageService.addItem({
      name,
      category,
      colour,
      fabric,
      style,
      occasions: occasions.split(',').map((s) => s.trim()).filter(Boolean),
      seasons: seasons.split(',').map((s) => s.trim()).filter(Boolean),
      imageUrl: selectedImage, // FEATURE 9: Actual uploaded image
      laundryStatus,
      notes: `Identified by We Milan AI`
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
    'SHOES',
    'ACCESSORIES'
  ];

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#181A31] text-[#F2ECDD] min-h-full">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 border-b border-[rgba(242,236,221,0.08)] space-y-2">
        <div className="flex items-center justify-between">
          <WeMilanLogo variant="header" size="sm" />

          <div className="flex items-center gap-2">
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

                {/* Category & Colour */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                      Category
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
                      Colour
                    </label>
                    <input
                      type="text"
                      required
                      value={colour}
                      onChange={(e) => setColour(e.target.value)}
                      className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
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
                      Style
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
                        Tone {analysisResult.detectedMetrics.dominantHex}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#CCA166]">
                      <ScanLine className="w-3 h-3 text-[#E44C4E]" />
                      <span>
                        Roughness {Math.round(analysisResult.detectedMetrics.textureRoughness * 100)}% · {analysisResult.confidence}% confidence
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
