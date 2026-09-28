'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/services/storageService';
import { WeatherService } from '@/services/weatherService';
import { WearableService } from '@/services/wearableService';
import { WardrobeItem, WeatherInfo, WearableMoodSignal } from '@/types/wardrobe';
import { SplashLoader } from '@/components/SplashLoader';
import { WeatherWidget } from '@/components/WeatherWidget';
import { WearableCard } from '@/components/WearableCard';
import { BottomNav } from '@/components/BottomNav';
import MoltenMetal from '@/components/reactbits/MoltenMetal';
import FoldText from '@/components/reactbits/FoldText';
import OutfitDissolveOverlay from '@/components/OutfitDissolveOverlay';
import PaperCrumple from '@/components/reactbits/PaperCrumple';
import StarBorder from '@/components/reactbits/StarBorder';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import { assetPath } from '@/utils/asset';
import sound from '@/services/soundService';
import { 
  Sparkles, 
  Layers, 
  Camera, 
  Check, 
  RefreshCw, 
  ArrowRight, 
  User, 
  LogOut, 
  Mail, 
  Lock,
  FileText,
  Hand
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HomePage() {
  const router = useRouter();

  // App lifecycle states
  const [showSplash, setShowSplash] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'welcome' | 'signin' | 'signup'>('welcome');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Domain data states
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [wearable, setWearable] = useState<WearableMoodSignal | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [outfitIndex, setOutfitIndex] = useState(0);
  const [isWornToday, setIsWornToday] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [todayLookbookMode, setTodayLookbookMode] = useState<'grid' | 'crumple'>('grid');

  // Initialize data
  useEffect(() => {
    // Check if user was already in session
    const user = StorageService.getSessionUser();
    if (user && !user.isGuest) {
      setIsAuthenticated(true);
    }

    const items = StorageService.getWardrobe();
    setWardrobe(items);

    WeatherService.getCurrentWeather().then(setWeather);
    setWearable(WearableService.getSignal());
  }, []);

  // Today's Pick Outfit combinations from wardrobe
  const getTodaysOutfit = () => {
    const cleanItems = wardrobe.filter(i => i.laundryStatus !== 'IN_LAUNDRY');
    const tops = cleanItems.filter(i => i.category === 'TOPS');
    const bottoms = cleanItems.filter(i => i.category === 'BOTTOMS');
    const shoes = cleanItems.filter(i => i.category === 'SHOES');

    // Pick based on outfitIndex rotation
    const top = tops[outfitIndex % (tops.length || 1)] || wardrobe.find(i => i.name.includes('Linen'));
    const bottom = bottoms[outfitIndex % (bottoms.length || 1)] || wardrobe.find(i => i.name.includes('Trousers'));
    const shoe = shoes[outfitIndex % (shoes.length || 1)] || wardrobe.find(i => i.name.includes('Sneaker'));

    return { top, bottom, shoe };
  };

  const currentOutfit = getTodaysOutfit();

  const handleWearThis = () => {
    setIsWornToday(true);
    sound.playSuccess();
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#E44C4E', '#CCA166', '#F2ECDD']
      });
    } catch {}
  };

  const handleTryAnother = () => {
    setIsWornToday(false);
    sound.playDissolve();
    setIsDissolving(true);
    setTimeout(() => {
      setOutfitIndex(prev => prev + 1);
      setIsDissolving(false);
    }, 1100);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const current = StorageService.getUserProfile();
    StorageService.saveUserProfile({
      name: current.name || email.split('@')[0] || 'Milan Member',
      email: email || current.email || 'user@wemilan.com',
      password: password || current.password || 'milan2026',
      isGuest: false
    });
    setIsAuthenticated(true);
  };

  const handleGuestEntry = () => {
    StorageService.setSessionUser({
      name: 'Milan Member',
      email: 'guest@wemilan.com',
      isGuest: false
    });
    setIsAuthenticated(true);
  };

  // 1. Splash Screen
  if (showSplash) {
    return <SplashLoader onComplete={() => setShowSplash(false)} />;
  }

  // 2. Welcome & Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="relative flex-1 flex flex-col justify-between p-6 bg-[#181A31] text-[#F2ECDD] min-h-full overflow-hidden">
        {/* Top-right quick controls for Sound & Theme */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <SoundToggle />
          <ThemeToggle />
        </div>

        {/* Ambient Molten Metal Canvas from React Bits */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
          <MoltenMetal
            color1="#181A31"
            color2="#333866"
            color3="#CCA166"
            speed={0.25}
            scale={4}
            glow={1.4}
            brightness={1.1}
            colorMode="molten"
            opacity={0.6}
            mouseInteraction={true}
          />
        </div>

        {/* Brand Header */}
        <div className="relative z-10 pt-8 text-center">
          <div className="inline-flex w-24 h-24 items-center justify-center mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={assetPath('/logo.png')}
              alt="We Milan"
              className="w-full h-full object-contain drop-shadow-[0_12px_28px_rgba(228,76,78,0.4)]"
            />
          </div>
          <div className="flex justify-center">
            <FoldText
              text="We Milan"
              hinge="top"
              trigger="mount"
              duration={0.7}
              fontSize="2.2rem"
              fontWeight={600}
              color="#F2ECDD"
              className="font-serif tracking-tight"
            />
          </div>
          <p className="tagline-cursive text-xl text-[#E2C78C] mt-2 tracking-wide">
            The world&apos;s your runway
          </p>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 my-auto py-6 text-center">
          <div className="flex flex-col items-center">
            <FoldText
              text="Your wardrobe. Reimagined."
              splitBy="word"
              hinge="left"
              trigger="mount"
              duration={0.6}
              stagger={0.06}
              fontSize="1.6rem"
              fontWeight={600}
              color="#F2ECDD"
              className="font-serif leading-snug"
            />
          </div>
          <p className="font-sans text-xs text-[#9C9FBE] mt-3 max-w-[280px] mx-auto">
            Style that adapts to your environment, plans, and emotional state.
          </p>

          {/* Sign In / Sign Up Form */}
          {authMode !== 'welcome' && (
            <form onSubmit={handleAuthSubmit} className="mt-6 text-left space-y-3 max-w-[320px] mx-auto">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9C9FBE] absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.15)] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9C9FBE] absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.15)] rounded-xl pl-9 pr-3 py-2 text-sm text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold py-3 rounded-full transition-all active:scale-95 shadow-md flex items-center justify-center gap-2"
              >
                <span>{authMode === 'signin' ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pb-4">
          {authMode === 'welcome' ? (
            <>
              <button
                onClick={() => setAuthMode('signup')}
                className="w-full bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold py-3.5 rounded-full transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setAuthMode('signin')}
                className="w-full bg-transparent hover:bg-[#272A4B] text-[#F2ECDD] border border-[rgba(242,236,221,0.2)] font-sans font-semibold py-3 rounded-full transition-all"
              >
                Sign In
              </button>

              <button
                onClick={handleGuestEntry}
                className="w-full text-center font-mono text-xs text-[#CCA166] hover:text-[#E2C78C] tracking-wide pt-2"
              >
                Enter Instant Demo Experience →
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthMode('welcome')}
              className="w-full text-center font-mono text-xs text-[#9C9FBE] hover:text-[#F2ECDD]"
            >
              ← Back to options
            </button>
          )}
        </div>
      </div>
    );
  }

  // 3. Main Fashion Dashboard (HOME)
  return (
    <div className="flex-1 flex flex-col justify-between bg-[#181A31] text-[#F2ECDD]">
      {/* Top Greeting & Brand Bar */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between border-b border-[rgba(242,236,221,0.08)]">
        <WeMilanLogo variant="header" size="sm" />

        <div className="flex items-center gap-2">
          <SoundToggle />
          <ThemeToggle />
          <Link
            href="/profile"
            className="w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-[#CCA166] hover:text-[#F2ECDD] transition-all"
            title="Curator Profile & Sizing"
          >
            <User className="w-4 h-4" />
          </Link>
          <button
            onClick={() => {
              StorageService.setSessionUser({ name: 'Guest', email: '', isGuest: true });
              setIsAuthenticated(false);
              setAuthMode('welcome');
            }}
            title="Sign out"
            className="w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-[#9C9FBE] hover:text-[#E44C4E] transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-none">
        {/* Editorial Greeting Headline */}
        <div>
          <div className="eyebrow mb-1">
            Studio Milano &bull; Daily Curation
          </div>
          <h2 className="font-serif text-2xl font-medium text-[#F2ECDD] tracking-tight">
            What are we <em>wearing</em> today?
          </h2>
        </div>

        {/* Weather Information Widget with real live geolocation update */}
        {weather && <WeatherWidget weather={weather} onWeatherUpdate={(w) => setWeather(w)} />}

        {/* Connected Wearable Signal with BLE and manual questionnaire hook */}
        {wearable && (
          <WearableCard
            wearable={wearable}
            onWearableUpdate={(sig) => setWearable(sig)}
            allowMoodChange={true}
            onSelectMood={(m) => {
              WearableService.setMood(m);
              setWearable(WearableService.getSignal());
            }}
          />
        )}

        {/* "Today's Pick" Card */}
        <div className="bg-gradient-to-br from-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-3xl p-5 shadow-xl relative overflow-hidden">
          {/* Molten Metal Outfit Dissolve Overlay when user doesn't like current outfit */}
          <OutfitDissolveOverlay isActive={isDissolving} message="Remixing your look..." />

          {/* Card Label & Lookbook Mode Switcher */}
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#E44C4E] font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              <span>Today&apos;s Pick</span>
            </span>

            <div className="flex items-center gap-1.5">
              {isWornToday && (
                <span className="bg-[#34D399]/20 border border-[#34D399]/40 text-[#34D399] font-mono text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Check className="w-2.5 h-2.5" />
                  <span>Selected</span>
                </span>
              )}

              <div className="flex items-center bg-[#181A31] p-0.5 rounded-full border border-[rgba(242,236,221,0.1)]">
                <button
                  type="button"
                  onClick={() => setTodayLookbookMode('grid')}
                  className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all ${
                    todayLookbookMode === 'grid'
                      ? 'bg-[#CCA166] text-[#181A31] font-bold'
                      : 'text-[#9C9FBE]'
                  }`}
                >
                  Grid
                </button>
                <button
                  type="button"
                  onClick={() => setTodayLookbookMode('crumple')}
                  className={`px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all ${
                    todayLookbookMode === 'crumple'
                      ? 'bg-[#CCA166] text-[#181A31] font-bold'
                      : 'text-[#9C9FBE]'
                  }`}
                >
                  3D Paper
                </button>
              </div>
            </div>
          </div>

          <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
            Your outfit for today
          </h3>

          {/* 3D Paper Crumple Lookbook Card or 3-Piece Grid */}
          {todayLookbookMode === 'crumple' && currentOutfit.top ? (
            <div className="my-3 flex flex-col items-center bg-[#181A31]/60 rounded-2xl p-3 border border-[rgba(242,236,221,0.1)]">
              <div className="w-full flex justify-center overflow-hidden" style={{ minHeight: '340px' }}>
                <PaperCrumple
                  src={currentOutfit.top.imageUrl}
                  alt={currentOutfit.top.name}
                  width={240}
                  height={300}
                  sceneHeight={350}
                  releaseBehavior="restore"
                  crumpleAmount={0.82}
                  crumpleDuration={0.55}
                  releaseDuration={0.4}
                  foldCount={5}
                  paperColor="#f2ecdd"
                  draggable={true}
                  returnToOrigin={true}
                />
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#CCA166] mt-2">
                <Hand className="w-3 h-3 text-[#E44C4E] animate-bounce" />
                <span>Drag to fold, crumple or smooth this lookbook print</span>
              </div>
            </div>
          ) : (
            /* Outfit Piece Previews */
            <div className="grid grid-cols-3 gap-2.5 my-3.5">
              {/* Top */}
              <div className="flex flex-col">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentOutfit.top?.imageUrl}
                    alt={currentOutfit.top?.name || 'Top'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-sans text-[11px] text-[#F2ECDD] font-medium truncate mt-1">
                  {currentOutfit.top?.name || 'White Linen Shirt'}
                </span>
                <span className="font-mono text-[9px] text-[#9C9FBE]">
                  {currentOutfit.top?.fabric || 'Linen'}
                </span>
              </div>

              {/* Bottom */}
              <div className="flex flex-col">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentOutfit.bottom?.imageUrl}
                    alt={currentOutfit.bottom?.name || 'Bottom'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-sans text-[11px] text-[#F2ECDD] font-medium truncate mt-1">
                  {currentOutfit.bottom?.name || 'Beige Trousers'}
                </span>
                <span className="font-mono text-[9px] text-[#9C9FBE]">
                  {currentOutfit.bottom?.fabric || 'Cotton Twill'}
                </span>
              </div>

              {/* Shoe */}
              <div className="flex flex-col">
                <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.1)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentOutfit.shoe?.imageUrl}
                    alt={currentOutfit.shoe?.name || 'Shoe'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-sans text-[11px] text-[#F2ECDD] font-medium truncate mt-1">
                  {currentOutfit.shoe?.name || 'White Sneakers'}
                </span>
                <span className="font-mono text-[9px] text-[#9C9FBE]">
                  {currentOutfit.shoe?.fabric || 'Leather'}
                </span>
              </div>
            </div>
          )}

          {/* "Why this works" Editorial Breakdown */}
          <div className="bg-[#181A31]/80 rounded-2xl p-3.5 border border-[rgba(242,236,221,0.08)] space-y-1.5 my-3">
            <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#CCA166] block font-semibold">
              Why this works
            </span>
            <ul className="space-y-1 font-sans text-xs text-[#9C9FBE]">
              <li className="flex items-start gap-1.5">
                <span className="text-[#CCA166] leading-none">•</span>
                <span>Lightweight fabrics for today&apos;s 28°C weather</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#CCA166] leading-none">•</span>
                <span>Works for your casual vibe and calm mood state</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#CCA166] leading-none">•</span>
                <span>All pieces are clean and already in your wardrobe</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex-1">
              <StarBorder
                as="button"
                onClick={handleWearThis}
                color="#CCA166"
                speed="4s"
                className="w-full cursor-pointer"
                backgroundColor={isWornToday ? '#34D399' : '#E44C4E'}
                textColor="#181A31"
              >
                <div className="flex items-center justify-center gap-1.5 py-2.5 px-4 font-sans font-bold text-xs">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>{isWornToday ? 'WEARING THIS' : 'WEAR THIS'}</span>
                </div>
              </StarBorder>
            </div>

            <button
              onClick={handleTryAnother}
              className="bg-[#272A4B] hover:bg-[#3E437A] text-[#F2ECDD] border border-[rgba(242,236,221,0.15)] font-sans font-medium py-2.5 px-4 rounded-full text-xs transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>TRY ANOTHER</span>
            </button>
          </div>
        </div>

        {/* Quick Hub Navigation Cards */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <Link
            href="/wardrobe"
            className="bg-[#272A4B]/70 hover:bg-[#272A4B] border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-[#3E437A]/50 text-[#CCA166] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs font-medium text-[#F2ECDD]">
              My Wardrobe
            </span>
            <span className="font-mono text-[9px] text-[#9C9FBE] mt-0.5">
              {wardrobe.length} pieces
            </span>
          </Link>

          <Link
            href="/style"
            className="bg-[#272A4B]/70 hover:bg-[#272A4B] border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-[#E44C4E]/20 text-[#E44C4E] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs font-medium text-[#F2ECDD]">
              Style Me
            </span>
            <span className="font-mono text-[9px] text-[#9C9FBE] mt-0.5">
              AI Assistant
            </span>
          </Link>

          <Link
            href="/scan"
            className="bg-[#272A4B]/70 hover:bg-[#272A4B] border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 flex flex-col items-center text-center transition-all group shadow-sm"
          >
            <div className="w-9 h-9 rounded-xl bg-[#CCA166]/20 text-[#CCA166] flex items-center justify-center mb-1.5 group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="font-serif text-xs font-medium text-[#F2ECDD]">
              Scan Clothes
            </span>
            <span className="font-mono text-[9px] text-[#9C9FBE] mt-0.5">
              AI Tagging
            </span>
          </Link>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
