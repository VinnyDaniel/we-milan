'use client';

import React, { useState } from 'react';
import { MoodQuestionnaireAnswers, WearableService } from '@/services/wearableService';
import { WearableMoodSignal } from '@/types/wardrobe';
import { X, Check, Activity, Sparkles, Heart, Sliders } from 'lucide-react';

interface ManualMoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (signal: WearableMoodSignal) => void;
}

export const ManualMoodModal: React.FC<ManualMoodModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const [energy, setEnergy] = useState<MoodQuestionnaireAnswers['energy']>('moderate');
  const [emotion, setEmotion] = useState<MoodQuestionnaireAnswers['emotion']>('calm');
  const [tactile, setTactile] = useState<MoodQuestionnaireAnswers['tactilePreference']>('breathable');
  const [thermal, setThermal] = useState<MoodQuestionnaireAnswers['thermalPreference']>('neutral');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedSignal = WearableService.submitManualAssessment({
      energy,
      emotion,
      tactilePreference: tactile,
      thermalPreference: thermal
    });
    onComplete(updatedSignal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-[390px] bg-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl p-5 shadow-2xl relative text-[#F2ECDD] max-h-[90vh] overflow-y-auto scrollbar-none">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center border border-[rgba(242,236,221,0.1)] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4">
          <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-[#CCA166] font-semibold mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>SENSORY & MOOD CHECK-IN</span>
          </div>
          <h2 className="font-serif text-xl font-medium text-[#F2ECDD]">
            Manual Mood Calibration
          </h2>
          <p className="font-sans text-xs text-[#9C9FBE] mt-1 leading-relaxed">
            No Bluetooth band connected? Answer 4 quick questions to tailor your outfit to your physical comfort and emotional energy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Question 1: Energy & Physical Pace */}
          <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-2 font-semibold">
              1. Physical Energy & Pace Today
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'high', label: 'High & Active', desc: '~90 bpm' },
                { id: 'moderate', label: 'Balanced Rhythm', desc: '~72 bpm' },
                { id: 'focused', label: 'Deep Focus', desc: '~80 bpm' },
                { id: 'relaxed', label: 'Slow & Restful', desc: '~62 bpm' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setEnergy(item.id as any)}
                  className={`p-2 rounded-xl text-left font-sans text-xs transition-all border ${
                    energy === item.id
                      ? 'bg-[#E44C4E] text-[#181A31] border-[#E44C4E] font-bold shadow-sm'
                      : 'bg-[#181A31] text-[#F2ECDD] border-[rgba(242,236,221,0.1)] hover:border-[#CCA166]'
                  }`}
                >
                  <div className="font-medium">{item.label}</div>
                  <div className={`font-mono text-[9px] ${energy === item.id ? 'text-[#181A31]/80' : 'text-[#9C9FBE]'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 2: Emotional State */}
          <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-2 font-semibold">
              2. Emotional Vibe & Mental Space
            </label>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'calm', label: 'Calm & Grounded' },
                { id: 'bold', label: 'Confident & Bold' },
                { id: 'hyped', label: 'Energetic & Social' },
                { id: 'chill', label: 'Low-key & Subtle' },
                { id: 'sensitive', label: 'Cozy & Seeking Softness' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setEmotion(item.id as any)}
                  className={`px-3 py-1.5 rounded-full font-mono text-[10px] transition-all border ${
                    emotion === item.id
                      ? 'bg-[#CCA166] text-[#181A31] border-[#CCA166] font-bold shadow-sm'
                      : 'bg-[#181A31] text-[#9C9FBE] border-[rgba(242,236,221,0.1)] hover:text-[#F2ECDD]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Question 3: Fabric & Tactile Preference */}
          <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-2 font-semibold">
              3. Fabric & Skin Contact Preference
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'breathable', label: 'Light & Breathable', note: 'Linen, fine cotton' },
                { id: 'structured', label: 'Defined & Crisp', note: 'Tailored twill, blazer' },
                { id: 'plush', label: 'Ultra-Soft & Plush', note: 'Knitwear, cashmere' },
                { id: 'minimal', label: 'Second-Skin Minimal', note: 'Clean drape, fluid' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setTactile(item.id as any)}
                  className={`p-2 rounded-xl text-left font-sans text-xs transition-all border ${
                    tactile === item.id
                      ? 'bg-[#3E437A] text-[#F2ECDD] border-[#CCA166] font-semibold'
                      : 'bg-[#181A31] text-[#9C9FBE] border-[rgba(242,236,221,0.1)] hover:border-[rgba(242,236,221,0.2)]'
                  }`}
                >
                  <div className="text-[11px] text-[#F2ECDD]">{item.label}</div>
                  <div className="font-mono text-[9px] text-[#CCA166]">{item.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question 4: Thermal Comfort */}
          <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3.5">
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-2 font-semibold">
              4. Temperature Sensitivity
            </label>
            <div className="flex gap-2">
              {[
                { id: 'run_warm', label: 'Tend to overheat' },
                { id: 'neutral', label: 'Balanced' },
                { id: 'run_cold', label: 'Tend to get chilly' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setThermal(item.id as any)}
                  className={`flex-1 py-1.5 px-2 rounded-xl font-mono text-[10px] text-center transition-all border ${
                    thermal === item.id
                      ? 'bg-[#CCA166]/20 border-[#CCA166] text-[#CCA166] font-bold'
                      : 'bg-[#181A31] text-[#9C9FBE] border-[rgba(242,236,221,0.1)]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold py-3.5 rounded-full text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 mt-2"
          >
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
            <span>CALIBRATE STYLIST WITH MY ANSWERS</span>
          </button>
        </form>
      </div>
    </div>
  );
};
