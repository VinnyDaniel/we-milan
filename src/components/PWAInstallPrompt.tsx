'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share, PlusSquare, Smartphone, CheckCircle2 } from 'lucide-react';
import sound from '@/services/soundService';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swUrl = `${basePath}/sw.js`;
      navigator.serviceWorker.register(swUrl).catch((err) => {
        console.warn('Service Worker registration skipped/failed:', err);
      });
    }

    // 2. Check if already installed
    if (typeof window !== 'undefined') {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      setIsStandalone(isStandaloneMode);

      // Check iOS
      const userAgent = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(userAgent);
      setIsIOS(isApple);

      // Listen for Android / Chrome / Desktop install prompt
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        const dismissed = sessionStorage.getItem('we-milan-pwa-dismissed');
        if (!dismissed && !isStandaloneMode) {
          setShowBanner(true);
        }
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);

      window.addEventListener('appinstalled', () => {
        setInstalled(true);
        setShowBanner(false);
        setDeferredPrompt(null);
      });

      // Show iOS banner after slight delay if not standalone and not dismissed
      if (isApple && !isStandaloneMode) {
        const dismissed = sessionStorage.getItem('we-milan-pwa-dismissed');
        if (!dismissed) {
          const timer = setTimeout(() => setShowBanner(true), 2500);
          return () => clearTimeout(timer);
        }
      }

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    sound.playClick();

    if (deferredPrompt) {
      // Chrome / Edge / Android
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setInstalled(true);
          setShowBanner(false);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.error('Install prompt error:', err);
      }
    } else if (isIOS) {
      // iOS Safari requires manual "Add to Home Screen"
      setShowIOSModal(true);
    } else {
      // Desktop / Other: show manual instructions modal
      setShowIOSModal(true);
    }
  };

  const handleDismiss = () => {
    sound.playClick();
    setShowBanner(false);
    sessionStorage.setItem('we-milan-pwa-dismissed', 'true');
  };

  // Do not render anything if already installed
  if (isStandalone || installed) {
    return null;
  }

  return (
    <>
      {/* Floating Install App Banner */}
      {showBanner && (
        <div className="fixed top-3 left-3 right-3 z-50 max-w-[420px] mx-auto animate-fadeIn">
          <div className="bg-[#272A4B]/95 backdrop-blur-xl border border-[#CCA166]/40 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-3 text-[#F2ECDD]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E44C4E] to-[#CCA166] p-0.5 shrink-0 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
                  alt="We Milan"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>

              <div className="flex flex-col truncate">
                <span className="font-serif text-xs font-semibold text-[#F2ECDD] truncate flex items-center gap-1.5">
                  <span>Download We Milan</span>
                  <span className="font-mono text-[8px] bg-[#CCA166]/20 text-[#CCA166] px-1.5 py-0.2 rounded-full uppercase">
                    App
                  </span>
                </span>
                <span className="font-sans text-[10px] text-[#9C9FBE] truncate">
                  Install on your home screen for full experience
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-[#E44C4E] hover:bg-[#d63f41] text-[#181A31] font-mono text-[10.5px] uppercase font-bold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Install</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-7 h-7 rounded-lg text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center transition-colors"
                title="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* iOS & Manual Installation Guide Modal */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(242,236,221,0.1)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#E44C4E] to-[#CCA166] p-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/logo.png`}
                    alt="We Milan"
                    className="w-full h-full object-cover rounded-[10px]"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-semibold text-[#F2ECDD]">
                    Install We Milan
                  </h3>
                  <p className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166]">
                    Home Screen Download
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="w-7 h-7 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-[#9C9FBE]">
              <p className="text-[#F2ECDD] leading-relaxed">
                Add <strong>We Milan</strong> to your home screen for full-screen mode, instant offline access, and fast performance.
              </p>

              <div className="space-y-2.5 bg-[#272A4B]/60 border border-[rgba(242,236,221,0.08)] rounded-2xl p-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#181A31] border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#CCA166] shrink-0 mt-0.5">
                    <Share className="w-3.5 h-3.5 text-[#38BDF8]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#F2ECDD] block">Step 1: Tap Share</span>
                    <span className="text-[11px] text-[#9C9FBE]">Tap the Share icon at the bottom of Safari or browser bar</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#181A31] border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#CCA166] shrink-0 mt-0.5">
                    <PlusSquare className="w-3.5 h-3.5 text-[#CCA166]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#F2ECDD] block">Step 2: Add to Home Screen</span>
                    <span className="text-[11px] text-[#9C9FBE]">Scroll down and tap &quot;Add to Home Screen&quot;</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#181A31] border border-[rgba(242,236,221,0.1)] flex items-center justify-center text-[#CCA166] shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                  </div>
                  <div>
                    <span className="font-semibold text-[#F2ECDD] block">Step 3: Confirm & Open</span>
                    <span className="text-[11px] text-[#9C9FBE]">Tap &quot;Add&quot; in the top-right corner</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-2.5 bg-[#CCA166] text-[#181A31] font-mono text-xs uppercase font-bold rounded-xl shadow-md active:scale-95 transition-all text-center block"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export const InstallAppTile: React.FC = () => {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;

      setIsStandalone(isStandaloneMode);

      const userAgent = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(userAgent));

      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstall);
      window.addEventListener('appinstalled', () => setInstalled(true));

      return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    }
  }, []);

  const handleInstall = async () => {
    sound.playClick();
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') setInstalled(true);
        setDeferredPrompt(null);
      } catch (err) {
        console.error(err);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.12)] rounded-3xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#E44C4E] to-[#CCA166] p-0.5 shrink-0 flex items-center justify-center text-[#181A31] shadow-md">
            <Smartphone className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166] block">
              Application
            </span>
            <span className="font-serif text-sm font-medium text-[#F2ECDD] block mt-0.5">
              {isStandalone || installed ? 'App Installed' : 'Download App'}
            </span>
            <span className="font-sans text-[11px] text-[#9C9FBE]">
              {isStandalone || installed 
                ? 'Running in full standalone app mode' 
                : 'Install We Milan on your home screen'}
            </span>
          </div>
        </div>

        {isStandalone || installed ? (
          <span className="font-mono text-[10px] text-[#34D399] bg-[#34D399]/15 border border-[#34D399]/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Installed</span>
          </span>
        ) : (
          <button
            type="button"
            onClick={handleInstall}
            className="bg-[#E44C4E] hover:bg-[#d63f41] text-[#181A31] font-mono text-[10px] uppercase font-bold px-3 py-1.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1 shrink-0"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Install</span>
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[rgba(242,236,221,0.1)] pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#CCA166]" />
                <h3 className="font-serif text-sm font-semibold text-[#F2ECDD]">
                  Install to Home Screen
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 font-sans text-xs text-[#9C9FBE]">
              <p className="text-[#F2ECDD] leading-relaxed">
                To download and install <strong>We Milan</strong> on your device:
              </p>

              <div className="space-y-2 bg-[#272A4B]/60 border border-[rgba(242,236,221,0.08)] rounded-2xl p-3">
                {isIOS ? (
                  <>
                    <p className="flex items-center gap-2 text-[#F2ECDD]">
                      <Share className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>1. Tap <strong>Share</strong> in Safari</span>
                    </p>
                    <p className="flex items-center gap-2 text-[#F2ECDD]">
                      <PlusSquare className="w-3.5 h-3.5 text-[#CCA166]" />
                      <span>2. Select <strong>&quot;Add to Home Screen&quot;</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-[#F2ECDD]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>3. Tap <strong>&quot;Add&quot;</strong></span>
                    </p>
                  </>
                ) : (
                  <>
                    <p className="flex items-center gap-2 text-[#F2ECDD]">
                      <Download className="w-3.5 h-3.5 text-[#E44C4E]" />
                      <span>1. Tap browser menu (⋮) in Chrome or Edge</span>
                    </p>
                    <p className="flex items-center gap-2 text-[#F2ECDD]">
                      <PlusSquare className="w-3.5 h-3.5 text-[#CCA166]" />
                      <span>2. Select <strong>&quot;Install app&quot;</strong> or <strong>&quot;Add to Home Screen&quot;</strong></span>
                    </p>
                    <p className="flex items-center gap-2 text-[#F2ECDD]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#34D399]" />
                      <span>3. Open We Milan directly from your app drawer</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full py-2.5 bg-[#CCA166] text-[#181A31] font-mono text-xs uppercase font-bold rounded-xl shadow-md active:scale-95 transition-all text-center block"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
