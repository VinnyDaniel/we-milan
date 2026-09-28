'use client';

import React, { useState } from 'react';
import { WearableMoodSignal, MoodType } from '@/types/wardrobe';
import { Bluetooth, Heart, Activity, Check, Sliders, RefreshCw } from 'lucide-react';
import { WearableService } from '@/services/wearableService';
import { ManualMoodModal } from '@/components/ManualMoodModal';

interface WearableCardProps {
  wearable: WearableMoodSignal;
  onSelectMood?: (mood: MoodType) => void;
  onWearableUpdate?: (signal: WearableMoodSignal) => void;
  allowMoodChange?: boolean;
}

export const WearableCard: React.FC<WearableCardProps> = ({
  wearable,
  onSelectMood,
  onWearableUpdate,
  allowMoodChange = false
}) => {
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState(false);
  const [isConnectingBLE, setIsConnectingBLE] = useState(false);
  const moods: MoodType[] = ['Calm', 'Energetic', 'Low-key', 'Confident', 'Cozy'];

  const handleConnectBLE = async () => {
    setIsConnectingBLE(true);
    try {
      const res = await WearableService.requestBluetoothDevice();
      onWearableUpdate?.(res.signal);
    } finally {
      setIsConnectingBLE(false);
    }
  };

  const handleManualComplete = (signal: WearableMoodSignal) => {
    onWearableUpdate?.(signal);
    if (onSelectMood) {
      onSelectMood(signal.mood);
    }
  };

  const isManual = wearable.deviceModel.includes('Manual');

  return (
    <>
      <div className="w-full bg-gradient-to-br from-[#272A4B]/90 via-[#181A31] to-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-2xl p-4 shadow-sm relative overflow-hidden">
        {/* Subtle glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#E44C4E]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header Strip */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isManual ? 'bg-[#CCA166]' : 'bg-[#34D399]'} animate-pulse`} />
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#CCA166] font-semibold">
              {isManual ? 'MANUAL SENSORY' : 'WEARABLE SENSOR'}
            </span>
            <span className="font-mono text-[9.5px] text-[#9C9FBE] truncate max-w-[120px]">
              · {wearable.deviceModel}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleConnectBLE}
              disabled={isConnectingBLE}
              title="Connect or Scan Bluetooth Device"
              className="flex items-center gap-1 bg-[#333866]/70 hover:bg-[#3E437A] border border-[rgba(242,236,221,0.12)] px-2 py-0.5 rounded-full font-mono text-[9px] text-[#F2ECDD] transition-all"
            >
              <Bluetooth className={`w-2.5 h-2.5 text-[#38BDF8] ${isConnectingBLE ? 'animate-spin' : ''}`} />
              <span>{isConnectingBLE ? 'Pairing...' : 'BLE'}</span>
            </button>

            <button
              onClick={() => setIsQuestionnaireOpen(true)}
              title="Answer Manual Mood Questions"
              className="flex items-center gap-1 bg-[#CCA166]/15 hover:bg-[#CCA166]/25 border border-[#CCA166]/30 px-2 py-0.5 rounded-full font-mono text-[9px] text-[#CCA166] transition-all font-semibold"
            >
              <Sliders className="w-2.5 h-2.5" />
              <span>Manual</span>
            </button>
          </div>
        </div>

        {/* Mood & Activity Readout */}
        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-xl font-medium text-[#F2ECDD]">
                {wearable.mood}
              </span>
              <span className="font-mono text-xs text-[#CCA166]">
                · {wearable.confidence}% match
              </span>
            </div>
            <p className="font-sans text-[11px] text-[#9C9FBE] mt-0.5">
              {isManual
                ? 'Selected manually to match your style'
                : 'Synced from your wearable smart band'}
            </p>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs text-[#9C9FBE]">
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#E44C4E] fill-[#E44C4E]/30" />
              <span>{wearable.heartRate} bpm</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{isManual ? 'Calibrated' : 'Optimal'}</span>
            </div>
          </div>
        </div>

        {/* Selectable mood pills if allowed */}
        {allowMoodChange && onSelectMood && (
          <div className="mt-3 pt-3 border-t border-[rgba(242,236,221,0.08)]">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#9C9FBE] block">
                Override Mood State
              </span>
              <button
                onClick={() => setIsQuestionnaireOpen(true)}
                className="font-mono text-[9.5px] text-[#CCA166] hover:underline flex items-center gap-1"
              >
                <span>Take questionnaire</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => {
                const isSelected = wearable.mood === m;
                return (
                  <button
                    key={m}
                    onClick={() => onSelectMood(m)}
                    className={`px-2.5 py-1 rounded-full font-mono text-[10px] transition-all flex items-center gap-1 ${
                      isSelected
                        ? 'bg-[#CCA166] text-[#181A31] font-semibold shadow-sm'
                        : 'bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] border border-[rgba(242,236,221,0.1)]'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ManualMoodModal
        isOpen={isQuestionnaireOpen}
        onClose={() => setIsQuestionnaireOpen(false)}
        onComplete={handleManualComplete}
      />
    </>
  );
};
