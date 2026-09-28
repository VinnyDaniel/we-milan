'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { StorageService } from '@/services/storageService';
import { WeatherService } from '@/services/weatherService';
import { WearableService } from '@/services/wearableService';
import { GeminiService, AFFILIATE_CATALOG } from '@/services/geminiService';
import { 
  WardrobeItem, 
  WeatherInfo, 
  WearableMoodSignal, 
  OccasionType, 
  VibeType, 
  MoodType, 
  OutfitRecommendation 
} from '@/types/wardrobe';
import { WearableCard } from '@/components/WearableCard';
import { AffiliateShopModal } from '@/components/AffiliateShopModal';
import { BottomNav } from '@/components/BottomNav';
import OutfitDissolveOverlay from '@/components/OutfitDissolveOverlay';
import PaperCrumple from '@/components/reactbits/PaperCrumple';
import StarBorder from '@/components/reactbits/StarBorder';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import sound from '@/services/soundService';
import { 
  Sparkles, 
  Umbrella, 
  Check, 
  RefreshCw, 
  Bookmark, 
  ArrowLeft, 
  ShoppingBag, 
  Tag, 
  CheckCircle2, 
  AlertCircle,
  Layers,
  FileText,
  Hand
} from 'lucide-react';
import confetti from 'canvas-confetti';

function StyleMeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const anchorId = searchParams.get('anchorId');

  // App domain states
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [weather, setWeather] = useState<WeatherInfo | null>(null);
  const [wearable, setWearable] = useState<WearableMoodSignal | null>(null);
  const [anchorItem, setAnchorItem] = useState<WardrobeItem | null>(null);

  // Styling inputs
  const [occasion, setOccasion] = useState<OccasionType>('Casual');
  const [vibe, setVibe] = useState<VibeType>('Minimal');
  const [mood, setMood] = useState<MoodType>('Calm');
  const [customNote, setCustomNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Result state
  const [recommendation, setRecommendation] = useState<OutfitRecommendation | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isWorn, setIsWorn] = useState(false);
  const [isDissolving, setIsDissolving] = useState(false);
  const [lookbookMode, setLookbookMode] = useState<'crumple' | 'grid'>('crumple');
  const [crumpleToast, setCrumpleToast] = useState<string | null>(null);

  // Affiliate modal state
  const [isAffiliateOpen, setIsAffiliateOpen] = useState(false);

  useEffect(() => {
    const items = StorageService.getWardrobe();
    setWardrobe(items);

    if (anchorId) {
      const found = items.find(i => i.id === anchorId);
      if (found) setAnchorItem(found);
    }

    WeatherService.getCurrentWeather().then(setWeather);
    const signal = WearableService.getSignal();
    setWearable(signal);
    setMood(signal.mood);
  }, [anchorId]);

  // Options lists
  const occasions: OccasionType[] = [
    'College',
    'Work',
    'Date',
    'Party',
    'Travel',
    'Casual',
    'Custom'
  ];

  const vibes: VibeType[] = [
    'Minimal',
    'Elegant',
    'Street',
    'Comfy',
    'Bold',
    'Effortless'
  ];

  const moods: MoodType[] = [
    'Calm',
    'Energetic',
    'Low-key',
    'Confident',
    'Cozy'
  ];

  const handleCreateOutfit = async () => {
    if (!weather || !wearable) return;
    setIsGenerating(true);
    setRecommendation(null);
    setIsSaved(false);
    setIsWorn(false);

    // Realistic styling computation delay
    await new Promise(r => setTimeout(r, 1200));

    const result = GeminiService.generateOutfit(
      {
        anchorItem: anchorItem || undefined,
        occasion,
        vibe,
        mood,
        notes: customNote
      },
      wardrobe,
      weather,
      wearable
    );

    setRecommendation(result);
    setIsGenerating(false);
    sound.playSuccess();

    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#CCA166', '#E44C4E', '#F2ECDD']
      });
    } catch {}
  };

  const handleWearThis = () => {
    setIsWorn(true);
    sound.playSuccess();
  };

  const handleSaveOutfit = () => {
    setIsSaved(true);
    sound.playSuccess();
  };

  const handleCrumpleSuggestAnotherLook = () => {
    if (!weather || !wearable) return;
    sound.playDissolve();
    setCrumpleToast('✨ Paper crumpled! Finding another matching look...');

    // Rotate vibe to suggest a distinct alternative look
    const vibeList: VibeType[] = ['Minimal', 'Elegant', 'Street', 'Comfy', 'Bold', 'Effortless'];
    const currentVibeIdx = vibeList.indexOf(vibe);
    const nextVibe = vibeList[(currentVibeIdx + 1) % vibeList.length];
    setVibe(nextVibe);

    setIsWorn(false);
    setIsSaved(false);

    setTimeout(() => {
      const nextResult = GeminiService.generateOutfit(
        {
          anchorItem: anchorItem || undefined,
          occasion,
          vibe: nextVibe,
          mood,
          notes: customNote ? `${customNote} (Alternative Look)` : 'Alternative Look'
        },
        wardrobe,
        weather,
        wearable
      );
      setRecommendation(nextResult);
      sound.playSuccess();
      setTimeout(() => {
        setCrumpleToast(null);
      }, 2600);
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#181A31] text-[#F2ECDD] min-h-full">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 border-b border-[rgba(242,236,221,0.08)] space-y-2">
        <div className="flex items-center justify-between">
          <WeMilanLogo variant="header" size="sm" />

          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />
            {anchorItem && (
              <button
                onClick={() => setAnchorItem(null)}
                className="font-mono text-[9px] text-[#E44C4E] hover:underline px-2 py-1 rounded bg-[#272A4B]/60"
              >
                Clear Main Item
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/wardrobe')}
            className="w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-[#9C9FBE] hover:text-[#F2ECDD]"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="eyebrow">
              Stylist AI &bull; Outfit Matcher
            </div>
            <h1 className="font-serif text-xl font-medium text-[#F2ECDD] tracking-tight">
              {anchorItem ? (
                <span>Style your <em>{anchorItem.name}</em></span>
              ) : (
                <span>Style <em>me.</em></span>
              )}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none space-y-4">
        {/* Anchor Piece Highlight Banner if coming from Wardrobe "STYLE THIS" */}
        {anchorItem && (
          <div className="bg-[#272A4B]/80 border border-[#CCA166]/30 rounded-2xl p-3 flex items-center gap-3">
            <div className="w-12 h-14 rounded-lg overflow-hidden bg-[#181A31] shrink-0 border border-[rgba(242,236,221,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={anchorItem.imageUrl} alt={anchorItem.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#CCA166]">
                ANCHOR PIECE
              </span>
              <h4 className="font-serif text-sm font-medium text-[#F2ECDD]">
                Let&apos;s style your {anchorItem.name}
              </h4>
              <p className="font-mono text-[10px] text-[#9C9FBE]">
                {anchorItem.category} · {anchorItem.colour} · {anchorItem.fabric}
              </p>
            </div>
          </div>
        )}

        {/* Wizard Form: when no recommendation is shown */}
        {!recommendation && (
          <div className="space-y-4">
            {/* Step 1: Occasion */}
            <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-4">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-2 font-semibold">
                What are you dressing for?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {occasions.map((occ) => {
                  const isSelected = occasion === occ;
                  return (
                    <button
                      key={occ}
                      type="button"
                      onClick={() => setOccasion(occ)}
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-all ${
                        isSelected
                          ? 'bg-[#E44C4E] text-[#181A31] font-bold shadow-sm'
                          : 'bg-[#181A31] text-[#9C9FBE] hover:text-[#F2ECDD] border border-[rgba(242,236,221,0.1)]'
                      }`}
                    >
                      {occ}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Vibe */}
            <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-4">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-2 font-semibold">
                What&apos;s the vibe?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {vibes.map((v) => {
                  const isSelected = vibe === v;
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setVibe(v)}
                      className={`px-3 py-1.5 rounded-full font-mono text-[11px] transition-all ${
                        isSelected
                          ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                          : 'bg-[#181A31] text-[#9C9FBE] hover:text-[#F2ECDD] border border-[rgba(242,236,221,0.1)]'
                      }`}
                    >
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Connected Wearable Mood Telemetry */}
            {wearable && (
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1.5 font-semibold">
                  How are you feeling? (Wearable Mood)
                </label>
                <WearableCard
                  wearable={wearable}
                  allowMoodChange={true}
                  onSelectMood={(m) => {
                    WearableService.setMood(m);
                    setWearable(WearableService.getSignal());
                    setMood(m);
                  }}
                  onWearableUpdate={(sig) => {
                    setWearable(sig);
                    setMood(sig.mood);
                  }}
                />
              </div>
            )}

            {/* Step 4: Free text notes */}
            <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-4">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1.5 font-semibold">
                Anything else?
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="e.g. Something comfortable for a long day."
                className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] placeholder-[#9C9FBE]/50 focus:outline-none focus:border-[#CCA166]"
              />
            </div>

            {/* Primary Action with StarBorder */}
            <div className="pt-2">
              <StarBorder
                as="button"
                onClick={handleCreateOutfit}
                disabled={isGenerating}
                color="#CCA166"
                speed="4s"
                className="w-full cursor-pointer"
                backgroundColor="#E44C4E"
                textColor="#181A31"
              >
                <div className="flex items-center justify-center gap-2 py-3.5 px-6 font-sans font-bold text-xs">
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>MATCHING YOUR OUTFIT...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>CREATE MY OUTFIT</span>
                    </>
                  )}
                </div>
              </StarBorder>
            </div>
          </div>
        )}

        {/* AI OUTFIT RECOMMENDATION RESULT VIEW */}
        {recommendation && (
          <div className="space-y-4 animate-fadeIn">
            {/* Header banner */}
            <div className="flex items-center justify-between pb-1">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#CCA166]">
                  CURATED BY WE MILAN
                </span>
                <h2 className="font-serif text-2xl font-medium text-[#F2ECDD]">
                  Your outfit.
                </h2>
              </div>

              <button
                onClick={() => setRecommendation(null)}
                className="font-mono text-xs text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Adjust inputs</span>
              </button>
            </div>

            {/* Weather snapshot for the outfit */}
            {weather && (
              <div className="bg-[#272A4B]/80 border border-[rgba(242,236,221,0.12)] rounded-2xl px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-xs text-[#F2ECDD]">
                  <Umbrella className="w-3.5 h-3.5 text-[#E44C4E]" />
                  <span>Today&apos;s conditions: {weather.temp}°C · {weather.rainChance}% rain chance</span>
                </div>
                <div className="flex items-center gap-1 text-[#CCA166] font-mono text-[9px] font-semibold bg-[#CCA166]/15 border border-[#CCA166]/30 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Rain-safe ✓</span>
                </div>
              </div>
            )}

            {/* View Mode Toggle: Tactile 3D Lookbook (PaperCrumple) vs Pieces Grid */}
            <div className="flex items-center justify-between bg-[#272A4B]/80 p-1 rounded-2xl border border-[rgba(242,236,221,0.12)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] pl-2">
                Outfit View
              </span>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLookbookMode('crumple')}
                  className={`px-3 py-1 rounded-xl font-mono text-[9.5px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    lookbookMode === 'crumple'
                      ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                      : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
                  }`}
                >
                  <FileText className="w-3 h-3" />
                  <span>3D Lookbook</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLookbookMode('grid')}
                  className={`px-3 py-1 rounded-xl font-mono text-[9.5px] uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    lookbookMode === 'grid'
                      ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                      : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Pieces Grid</span>
                </button>
              </div>
            </div>

            {/* 3D Paper Crumple Lookbook Card or 4-Piece Visual Grid */}
            {lookbookMode === 'crumple' && (recommendation.top || recommendation.dress || recommendation.bottom) ? (
              <div className="bg-gradient-to-b from-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.16)] rounded-3xl p-4 shadow-xl text-center space-y-3">
                {(() => {
                  const heroPiece = recommendation.dress || recommendation.top || recommendation.bottom || recommendation.outerwear;
                  if (!heroPiece) return null;
                  return (
                    <>
                      <div className="flex items-center justify-between pb-1 border-b border-[rgba(242,236,221,0.08)]">
                        <div>
                          <span className="font-mono text-[9px] uppercase tracking-widest text-[#CCA166] font-semibold block text-left">
                            FINAL CARD · TACTILE LOOKBOOK
                          </span>
                          <h3 className="font-serif text-base font-medium text-[#F2ECDD] text-left">
                            {heroPiece.name}
                          </h3>
                        </div>
                        <span className="font-mono text-[9px] text-[#9C9FBE]">
                          {heroPiece.fabric}
                        </span>
                      </div>

                      {/* Floating Crumple Toast Banner */}
                      {crumpleToast && (
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 bg-[#E44C4E] text-[#181A31] font-sans font-bold text-[11px] px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 animate-fadeIn border border-[#F2ECDD]/20">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>{crumpleToast}</span>
                        </div>
                      )}

                      {/* PaperCrumple 3D Interactive Component */}
                      <div className="flex justify-center items-center py-1 overflow-hidden relative" style={{ minHeight: '380px' }}>
                        <PaperCrumple
                          src={heroPiece.imageUrl}
                          alt={heroPiece.name}
                          width={260}
                          height={340}
                          sceneHeight={390}
                          releaseBehavior="restore"
                          crumpleAmount={0.82}
                          crumpleDuration={0.55}
                          releaseDuration={0.4}
                          foldCount={6}
                          foldSharpness={0.6}
                          wrinkleDepth={0.65}
                          creaseStrength={0.18}
                          paperColor="#f2ecdd"
                          paperTexture={0.08}
                          draggable={true}
                          returnToOrigin={true}
                          onCrumple={handleCrumpleSuggestAnotherLook}
                        />
                      </div>

                      <div className="flex items-center justify-between w-full pt-1 px-1">
                        <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#CCA166]">
                          <Hand className="w-3.5 h-3.5 text-[#E44C4E] animate-bounce" />
                          <span>Drag paper to crumple &amp; suggest look</span>
                        </div>
                        <button
                          type="button"
                          onClick={handleCrumpleSuggestAnotherLook}
                          className="bg-[#181A31] hover:bg-[#3E437A] text-[#CCA166] border border-[#CCA166]/30 px-3 py-1 rounded-full font-mono text-[9.5px] flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                        >
                          <RefreshCw className="w-3 h-3 text-[#E44C4E]" />
                          <span>Crumple &amp; Pair</span>
                        </button>
                      </div>

                      {/* Miniature paired items list below 3D card */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[rgba(242,236,221,0.08)] text-left w-full">
                        {recommendation.top && (
                          <div className="bg-[#181A31]/90 p-2 rounded-xl border border-[rgba(242,236,221,0.08)] flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={recommendation.top.imageUrl} alt={recommendation.top.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-[8px] text-[#CCA166] uppercase block">Top</span>
                              <p className="font-serif text-[10.5px] text-[#F2ECDD] truncate">{recommendation.top.name}</p>
                            </div>
                          </div>
                        )}
                        {recommendation.bottom && (
                          <div className="bg-[#181A31]/90 p-2 rounded-xl border border-[rgba(242,236,221,0.08)] flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={recommendation.bottom.imageUrl} alt={recommendation.bottom.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-[8px] text-[#CCA166] uppercase block">Bottom</span>
                              <p className="font-serif text-[10.5px] text-[#F2ECDD] truncate">{recommendation.bottom.name}</p>
                            </div>
                          </div>
                        )}
                        {recommendation.shoes && (
                          <div className="bg-[#181A31]/90 p-2 rounded-xl border border-[rgba(242,236,221,0.08)] flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg overflow-hidden bg-black/40 shrink-0">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={recommendation.shoes.imageUrl} alt={recommendation.shoes.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="min-w-0">
                              <span className="font-mono text-[8px] text-[#CCA166] uppercase block">Shoes</span>
                              <p className="font-serif text-[10.5px] text-[#F2ECDD] truncate">{recommendation.shoes.name}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })()}
              </div>
            ) : (
              /* Visual Outfit Grid */
              <div className="grid grid-cols-2 gap-3">
                {/* Top / Dress */}
                {recommendation.top && (
                  <div className="bg-[#272A4B] rounded-2xl p-2.5 border border-[rgba(242,236,221,0.12)] flex flex-col">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.08)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={recommendation.top.imageUrl} alt={recommendation.top.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-mono text-[9px] text-[#CCA166] uppercase tracking-wider mt-2">
                      Top
                    </span>
                    <h4 className="font-serif text-xs font-medium text-[#F2ECDD] truncate">
                      {recommendation.top.name}
                    </h4>
                    <p className="font-mono text-[9px] text-[#9C9FBE]">
                      {recommendation.top.fabric}
                    </p>
                  </div>
                )}

                {/* Bottom */}
                {recommendation.bottom && (
                  <div className="bg-[#272A4B] rounded-2xl p-2.5 border border-[rgba(242,236,221,0.12)] flex flex-col">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.08)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={recommendation.bottom.imageUrl} alt={recommendation.bottom.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-mono text-[9px] text-[#CCA166] uppercase tracking-wider mt-2">
                      Bottom
                    </span>
                    <h4 className="font-serif text-xs font-medium text-[#F2ECDD] truncate">
                      {recommendation.bottom.name}
                    </h4>
                    <p className="font-mono text-[9px] text-[#9C9FBE]">
                      {recommendation.bottom.fabric}
                    </p>
                  </div>
                )}

                {/* Shoes */}
                {recommendation.shoes && (
                  <div className="bg-[#272A4B] rounded-2xl p-2.5 border border-[rgba(242,236,221,0.12)] flex flex-col">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.08)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={recommendation.shoes.imageUrl} alt={recommendation.shoes.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-mono text-[9px] text-[#CCA166] uppercase tracking-wider mt-2">
                      Shoes
                    </span>
                    <h4 className="font-serif text-xs font-medium text-[#F2ECDD] truncate">
                      {recommendation.shoes.name}
                    </h4>
                    <p className="font-mono text-[9px] text-[#9C9FBE]">
                      {recommendation.shoes.fabric}
                    </p>
                  </div>
                )}

                {/* Outerwear or Accessory */}
                {recommendation.outerwear && (
                  <div className="bg-[#272A4B] rounded-2xl p-2.5 border border-[rgba(242,236,221,0.12)] flex flex-col">
                    <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#181A31] border border-[rgba(242,236,221,0.08)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={recommendation.outerwear.imageUrl} alt={recommendation.outerwear.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="font-mono text-[9px] text-[#CCA166] uppercase tracking-wider mt-2">
                      Layer
                    </span>
                    <h4 className="font-serif text-xs font-medium text-[#F2ECDD] truncate">
                      {recommendation.outerwear.name}
                    </h4>
                    <p className="font-mono text-[9px] text-[#9C9FBE]">
                      {recommendation.outerwear.fabric}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* "Why we chose this" Section */}
            <div className="bg-gradient-to-b from-[#272A4B]/90 to-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-3xl p-4 shadow-md space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#CCA166] font-semibold block">
                Why we chose this
              </span>
              <ul className="space-y-1.5 font-sans text-xs text-[#9C9FBE]">
                {recommendation.whyReasons.map((reason, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[#E44C4E] leading-none">•</span>
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Missing Item / Affiliate Commerce Recommendation (FEATURE 10) */}
            <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.14)] rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#CCA166] block">
                  Missing something?
                </span>
                <p className="font-serif text-sm font-medium text-[#F2ECDD]">
                  Find pieces that complete this look.
                </p>
                <p className="font-sans text-[11px] text-[#9C9FBE] mt-0.5">
                  Curated picks from independent emerging fashion designers.
                </p>
              </div>

              <button
                onClick={() => setIsAffiliateOpen(true)}
                className="bg-[#CCA166] hover:bg-[#E2C78C] text-[#181A31] font-sans font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-all active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop</span>
              </button>
            </div>

            {/* Action Buttons: WEAR THIS, SAVE OUTFIT, TRY ANOTHER */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="col-span-1">
                <StarBorder
                  as="button"
                  onClick={handleWearThis}
                  color="#CCA166"
                  speed="4s"
                  className="w-full cursor-pointer"
                  backgroundColor={isWorn ? '#34D399' : '#E44C4E'}
                  textColor="#181A31"
                >
                  <div className="flex items-center justify-center gap-1 py-3 px-1 font-sans font-bold text-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{isWorn ? 'WEARING' : 'WEAR THIS'}</span>
                  </div>
                </StarBorder>
              </div>

              <button
                onClick={handleSaveOutfit}
                className={`py-3 px-2 rounded-xl text-xs font-sans font-medium flex items-center justify-center gap-1 border border-[rgba(242,236,221,0.14)] transition-all active:scale-95 ${
                  isSaved
                    ? 'bg-[#CCA166] text-[#181A31] font-bold'
                    : 'bg-[#272A4B] text-[#F2ECDD] hover:bg-[#3E437A]'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{isSaved ? 'SAVED ✓' : 'SAVE OUTFIT'}</span>
              </button>

              <button
                onClick={handleCreateOutfit}
                className="bg-[#272A4B] hover:bg-[#3E437A] text-[#F2ECDD] border border-[rgba(242,236,221,0.14)] py-3 px-2 rounded-xl text-xs font-sans font-medium flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>TRY ANOTHER</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Affiliate Shop Modal */}
      <AffiliateShopModal
        isOpen={isAffiliateOpen}
        onClose={() => setIsAffiliateOpen(false)}
        items={AFFILIATE_CATALOG}
        categoryTitle="Complete This Look"
        reason="Elevate this outfit with pieces from our partner network of independent sustainable designers."
      />

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}

export default function StylePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-[#CCA166]">Loading styling assistant...</div>}>
      <StyleMeContent />
    </Suspense>
  );
}
