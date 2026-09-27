'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, Check, Sparkles, AlertCircle } from 'lucide-react';
import StarBorder from '@/components/reactbits/StarBorder';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhoto: string;
  onPhotoSaved: (photoDataUrl: string) => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentPhoto,
  onPhotoSaved
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize camera when camera tab is active
  useEffect(() => {
    if (!isOpen || activeTab !== 'camera' || capturedImage) {
      stopCamera();
      return;
    }

    startCamera();

    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, facingMode, capturedImage]);

  const startCamera = async () => {
    stopCamera();
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera device access is not supported on this browser.');
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 720 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera access issue:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow permission or upload a photo.');
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth || 600, video.videoHeight || 600);
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop to square
        const startX = ((video.videoWidth || size) - size) / 2;
        const startY = ((video.videoHeight || size) - size) / 2;
        ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
        setCapturedImage(dataUrl);
        stopCamera();
      }
    } catch (e) {
      console.error('Error capturing frame:', e);
    } finally {
      setTimeout(() => setIsCapturing(false), 300);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Compress & scale to square max 800px
        const canvas = document.createElement('canvas');
        const maxDim = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.85);
          setCapturedImage(compressed);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPhoto = () => {
    if (capturedImage) {
      onPhotoSaved(capturedImage);
      handleClose();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedImage(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl max-w-sm w-full p-5 text-[#F2ECDD] relative shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Shutter Flash Animation */}
        {isCapturing && (
          <div className="absolute inset-0 bg-white z-50 pointer-events-none animate-[fadeOut_0.3s_ease-out_forwards]" />
        )}

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,236,221,0.1)]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E44C4E]" />
            <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
              Curator Portrait
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        {!capturedImage && (
          <div className="flex bg-[#272A4B] p-1 rounded-full border border-[rgba(242,236,221,0.12)] my-4">
            <button
              onClick={() => {
                setActiveTab('camera');
                setCapturedImage(null);
              }}
              className={`flex-1 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'camera'
                  ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                  : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                  : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
          </div>
        )}

        {/* Viewfinder / Upload Container */}
        <div className="flex-1 flex flex-col items-center justify-center my-2">
          {capturedImage ? (
            /* Snapshot Preview */
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-[#CCA166] shadow-[0_0_25px_rgba(204,161,102,0.25)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedImage}
                alt="Portrait Preview"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2 bg-[#181A31]/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-[rgba(242,236,221,0.2)]">
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#34D399] flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" /> Ready
                </span>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* Live Camera Viewfinder */
            <div className="relative w-64 h-64 rounded-2xl overflow-hidden bg-black border border-[rgba(242,236,221,0.2)] flex items-center justify-center">
              {cameraError ? (
                <div className="text-center p-4">
                  <AlertCircle className="w-8 h-8 text-[#E44C4E] mx-auto mb-2" />
                  <p className="font-mono text-xs text-[#9C9FBE] mb-3">
                    {cameraError}
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="font-mono text-[11px] text-[#CCA166] underline"
                  >
                    Switch to File Upload
                  </button>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Viewfinder Target Reticle */}
                  <div className="absolute inset-4 border border-dashed border-[rgba(242,236,221,0.3)] rounded-xl pointer-events-none flex items-center justify-center">
                    <span className="font-mono text-[9px] text-[#F2ECDD]/40 uppercase tracking-widest">
                      Position Face
                    </span>
                  </div>

                  {/* Flip Camera Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
                    }
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#181A31]/80 backdrop-blur-md border border-[rgba(242,236,221,0.2)] flex items-center justify-center text-[#F2ECDD] hover:text-[#CCA166]"
                    title="Flip camera"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          ) : (
            /* File Upload Zone */
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-64 h-64 rounded-2xl border-2 border-dashed border-[rgba(242,236,221,0.25)] hover:border-[#CCA166] bg-[#272A4B]/40 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-[#CCA166]/15 text-[#CCA166] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="font-serif text-sm font-medium text-[#F2ECDD]">
                Choose Profile Photo
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] mt-1">
                JPG, PNG or WEBP (Max 10MB)
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-4 pt-3 border-t border-[rgba(242,236,221,0.1)] flex items-center gap-2">
          {capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleRetake}
                className="flex-1 py-2.5 rounded-full bg-[#272A4B] hover:bg-[#333866] text-[#F2ECDD] font-sans font-medium text-xs transition-colors"
              >
                Retake
              </button>

              <StarBorder
                as="button"
                onClick={handleConfirmPhoto}
                color="#CCA166"
                speed="3.5s"
                backgroundColor="#CCA166"
                textColor="#181A31"
                className="flex-1 !py-2.5 font-sans font-bold text-xs"
              >
                <span className="flex items-center justify-center gap-1.5">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Use Portrait</span>
                </span>
              </StarBorder>
            </>
          ) : activeTab === 'camera' && !cameraError ? (
            <button
              type="button"
              onClick={handleCapturePhoto}
              className="w-full py-3 rounded-full bg-gradient-to-r from-[#CCA166] via-[#E44C4E] to-[#CCA166] text-[#181A31] font-sans font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Portrait</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 rounded-full bg-[#272A4B] hover:bg-[#333866] text-[#CCA166] font-mono text-xs uppercase tracking-wider transition-colors"
            >
              Browse Gallery
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePhotoModal;
