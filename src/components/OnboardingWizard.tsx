'use client';

import React, { useState } from 'react';
import { StorageService } from '@/services/storageService';
import { useTheme } from '@/context/ThemeContext';
import { assetPath } from '@/utils/asset';
import sound from '@/services/soundService';
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  User,
  Shirt,
  Ruler,
  Check,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface OnboardingData {
  name: string;
  handle: string;
  gender: string;
  aesthetic: string;
  fitPreference: string;
  topSize: string;
  bottomSize: string;
  shoeSize: string;
}

interface OnboardingWizardProps {
  email: string;
  onComplete: () => void;
}

// ─── Option sets ─────────────────────────────────────────────────────────────

const AESTHETICS = [
  { id: 'Milano Minimalist', label: 'Minimalist', emoji: '🤍' },
  { id: 'Maximalist Curator', label: 'Maximalist', emoji: '✨' },
  { id: 'Classic Atelier', label: 'Classic', emoji: '🎩' },
  { id: 'Street Luxe', label: 'Streetwear', emoji: '🧢' },
  { id: 'Romantic Effortless', label: 'Romantic', emoji: '🌸' },
  { id: 'Avant-Garde', label: 'Avant-Garde', emoji: '🎨' },
];

const FIT_PREFERENCES = [
  { id: 'Tailored', label: 'Tailored', desc: 'Sharp & precise' },
  { id: 'Relaxed', label: 'Relaxed', desc: 'Easy & breathable' },
  { id: 'Oversized', label: 'Oversized', desc: 'Bold & cozy' },
  { id: 'Slim', label: 'Slim', desc: 'Sleek silhouette' },
  { id: 'Fluid', label: 'Fluid', desc: 'Soft & flowing' },
];

const TOP_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const BOTTOM_SIZES = ['XS / 24W', 'S / 26W', 'M / 28W', 'L / 30W', 'XL / 32W', 'XXL / 34W'];
const SHOE_SIZES_EU = ['EU 35', 'EU 36', 'EU 37', 'EU 38', 'EU 39', 'EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45', 'EU 46'];

const GENDERS = ['Woman', 'Man', 'Non-binary', 'Prefer not to say'];

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-500 ${
            i === current
              ? 'w-6 h-2 bg-[#E44C4E]'
              : i < current
              ? 'w-2 h-2 bg-[#CCA166]'
              : 'w-2 h-2 bg-[rgba(255,255,255,0.2)]'
          }`}
        />
      ))}
    </div>
  );
}

// ─── Pill selector ────────────────────────────────────────────────────────────

function PillSelect({
  options,
  value,
  onChange,
  isLight,
}: {
  options: { id: string; label: string; emoji?: string; desc?: string }[];
  value: string;
  onChange: (v: string) => void;
  isLight: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {options.map((opt) => {
        const active = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => { sound.playCuteClick(); onChange(opt.id); }}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 ${
              active
                ? 'bg-[#E44C4E] border-[#E44C4E] text-[#F2ECDD] shadow-md'
                : isLight
                ? 'bg-white border-[rgba(24,26,49,0.15)] text-[#616584] hover:border-[#CCA166]'
                : 'bg-transparent border-[rgba(242,236,221,0.15)] text-[#9C9FBE] hover:border-[#CCA166]'
            }`}
          >
            {opt.emoji && <span className="mr-1">{opt.emoji}</span>}
            {opt.label}
            {opt.desc && (
              <span className={`ml-1 text-[10px] opacity-70`}>{opt.desc}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function OnboardingWizard({ email, onComplete }: OnboardingWizardProps) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [step, setStep] = useState(0);
  const TOTAL_STEPS = 4;

  const [data, setData] = useState<OnboardingData>({
    name: '',
    handle: '',
    gender: '',
    aesthetic: '',
    fitPreference: '',
    topSize: '',
    bottomSize: '',
    shoeSize: '',
  });

  const set = (key: keyof OnboardingData, val: string) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const canNext = () => {
    if (step === 0) return data.name.trim().length >= 2;
    if (step === 1) return !!data.aesthetic;
    if (step === 2) return !!data.fitPreference;
    if (step === 3) return !!data.topSize && !!data.bottomSize && !!data.shoeSize;
    return true;
  };

  const advance = () => {
    if (!canNext()) return;
    sound.playCuteClick();
    if (step < TOTAL_STEPS - 1) {
      setStep((s) => s + 1);
    } else {
      handleFinish();
    }
  };

  const back = () => {
    sound.playCuteClick();
    setStep((s) => Math.max(0, s - 1));
  };

  const handleFinish = () => {
    StorageService.saveUserProfile({
      name: data.name.trim() || email.split('@')[0],
      email,
      handle: data.handle || data.name.trim().toLowerCase().replace(/\s+/g, '_'),
      gender: data.gender,
      aesthetic: data.aesthetic,
      isGuest: false,
      measurements: {
        topSize: data.topSize,
        bottomSize: data.bottomSize,
        shoeSize: data.shoeSize,
        height: '',
        fitPreference: data.fitPreference as 'Tailored' | 'Relaxed' | 'Oversized' | 'Slim' | 'Fluid',
      },
    });
    onComplete();
  };

  // ── Shared styles ──
  const bg = isLight ? 'bg-[#FAF7F2] text-[#181A31]' : 'bg-[#181A31] text-[#F2ECDD]';
  const label = `block font-mono text-[10px] uppercase tracking-wider mb-1 ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`;
  const inputCls = `w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#CCA166] transition-colors ${
    isLight
      ? 'bg-white border-[rgba(24,26,49,0.15)] text-[#181A31]'
      : 'bg-[#0F1128] border-[rgba(242,236,221,0.15)] text-[#F2ECDD]'
  }`;

  // ── Step renderers ──
  const renderStep = () => {
    switch (step) {
      // ── Step 0: Name & gender ──────────────────────────────────────────────
      case 0:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#E44C4E]/10">
                <User className="w-7 h-7 text-[#E44C4E]" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Who are you?</h2>
              <p className={`text-xs mt-1 ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`}>
                Let&apos;s personalise your Milan experience.
              </p>
            </div>
            <div>
              <label className={label}>Your Name</label>
              <input
                type="text"
                autoFocus
                value={data.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="e.g. Sofia Ricci"
                className={inputCls}
              />
            </div>
            <div>
              <label className={label}>Username (optional)</label>
              <input
                type="text"
                value={data.handle}
                onChange={(e) => set('handle', e.target.value.toLowerCase().replace(/\s+/g, '_'))}
                placeholder="e.g. sofia_milan"
                className={inputCls}
              />
            </div>
            <div>
              <label className={label}>Gender</label>
              <PillSelect
                options={GENDERS.map((g) => ({ id: g, label: g }))}
                value={data.gender}
                onChange={(v) => set('gender', v)}
                isLight={isLight}
              />
            </div>
          </div>
        );

      // ── Step 1: Aesthetic ──────────────────────────────────────────────────
      case 1:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#CCA166]/10">
                <Sparkles className="w-7 h-7 text-[#CCA166]" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Your aesthetic</h2>
              <p className={`text-xs mt-1 ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`}>
                How would you describe your personal style?
              </p>
            </div>
            <PillSelect
              options={AESTHETICS}
              value={data.aesthetic}
              onChange={(v) => set('aesthetic', v)}
              isLight={isLight}
            />
          </div>
        );

      // ── Step 2: Fit preference ─────────────────────────────────────────────
      case 2:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#E44C4E]/10">
                <Shirt className="w-7 h-7 text-[#E44C4E]" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">How do you like to wear it?</h2>
              <p className={`text-xs mt-1 ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`}>
                Pick the silhouette that feels most like you.
              </p>
            </div>
            <PillSelect
              options={FIT_PREFERENCES}
              value={data.fitPreference}
              onChange={(v) => set('fitPreference', v)}
              isLight={isLight}
            />
          </div>
        );

      // ── Step 3: Sizes ──────────────────────────────────────────────────────
      case 3:
        return (
          <div className="space-y-5">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center bg-[#CCA166]/10">
                <Ruler className="w-7 h-7 text-[#CCA166]" />
              </div>
              <h2 className="text-2xl font-serif font-semibold">Your sizes</h2>
              <p className={`text-xs mt-1 ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`}>
                So your outfits actually fit.
              </p>
            </div>

            <div>
              <label className={label}>Top / Shirt Size</label>
              <div className="flex flex-wrap gap-2">
                {TOP_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => { sound.playCuteClick(); set('topSize', sz); }}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 active:scale-95 ${
                      data.topSize === sz
                        ? 'bg-[#E44C4E] border-[#E44C4E] text-[#F2ECDD]'
                        : isLight
                        ? 'bg-white border-[rgba(24,26,49,0.15)] text-[#616584] hover:border-[#CCA166]'
                        : 'bg-transparent border-[rgba(242,236,221,0.15)] text-[#9C9FBE] hover:border-[#CCA166]'
                    }`}
                  >{sz}</button>
                ))}
              </div>
            </div>

            <div>
              <label className={label}>Bottom / Trouser Size</label>
              <div className="flex flex-wrap gap-2">
                {BOTTOM_SIZES.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => { sound.playCuteClick(); set('bottomSize', sz); }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
                      data.bottomSize === sz
                        ? 'bg-[#E44C4E] border-[#E44C4E] text-[#F2ECDD]'
                        : isLight
                        ? 'bg-white border-[rgba(24,26,49,0.15)] text-[#616584] hover:border-[#CCA166]'
                        : 'bg-transparent border-[rgba(242,236,221,0.15)] text-[#9C9FBE] hover:border-[#CCA166]'
                    }`}
                  >{sz}</button>
                ))}
              </div>
            </div>

            <div>
              <label className={label}>Shoe Size</label>
              <div className="flex flex-wrap gap-2">
                {SHOE_SIZES_EU.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => { sound.playCuteClick(); set('shoeSize', sz); }}
                    className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 active:scale-95 ${
                      data.shoeSize === sz
                        ? 'bg-[#E44C4E] border-[#E44C4E] text-[#F2ECDD]'
                        : isLight
                        ? 'bg-white border-[rgba(24,26,49,0.15)] text-[#616584] hover:border-[#CCA166]'
                        : 'bg-transparent border-[rgba(242,236,221,0.15)] text-[#9C9FBE] hover:border-[#CCA166]'
                    }`}
                  >{sz}</button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`relative flex flex-col min-h-full overflow-y-auto ${bg}`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
    >
      {/* Header logo */}
      <div className="flex items-center gap-2 p-5 pb-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={assetPath('/logo.png')} alt="We Milan" className="w-8 h-8 object-contain" />
        <span className={`font-serif font-semibold text-sm ${isLight ? 'text-[#181A31]' : 'text-[#F2ECDD]'}`}>
          We Milan
        </span>
        <span className={`ml-auto font-mono text-[10px] ${isLight ? 'text-[#616584]' : 'text-[#9C9FBE]'}`}>
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      {/* Progress dots */}
      <StepDots total={TOTAL_STEPS} current={step} />

      {/* Step content */}
      <div className="flex-1 px-6 pb-4">
        <div
          key={step}
          className="animate-fade-in"
          style={{ animation: 'fadeSlideUp 0.35s ease both' }}
        >
          {renderStep()}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="sticky bottom-0 px-6 pb-6 pt-3 space-y-3"
        style={{
          background: isLight
            ? 'linear-gradient(to bottom, transparent, #FAF7F2 30%)'
            : 'linear-gradient(to bottom, transparent, #181A31 30%)',
        }}
      >
        <button
          onClick={advance}
          disabled={!canNext()}
          className={`w-full py-3.5 rounded-full font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-95 shadow-lg ${
            canNext()
              ? 'bg-[#E44C4E] hover:bg-[#C43C3E] text-white'
              : isLight
              ? 'bg-[rgba(24,26,49,0.08)] text-[rgba(24,26,49,0.3)] cursor-not-allowed'
              : 'bg-[rgba(242,236,221,0.08)] text-[rgba(242,236,221,0.3)] cursor-not-allowed'
          }`}
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <Check className="w-4 h-4" />
              <span>Enter We Milan</span>
            </>
          ) : (
            <>
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {step > 0 && (
          <button
            onClick={back}
            className={`w-full py-2.5 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
              isLight
                ? 'text-[#616584] hover:text-[#181A31]'
                : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>

      {/* CSS animation */}
      <style jsx>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
