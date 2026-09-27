'use client';

import React, { useState } from 'react';
import { X, Check, Ruler, Sparkles } from 'lucide-react';
import { UserMeasurements } from '@/types/wardrobe';
import StarBorder from '@/components/reactbits/StarBorder';

interface MeasurementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  measurements: UserMeasurements;
  onSave: (updated: UserMeasurements) => void;
}

const TOP_SIZES = ['XS', 'S', 'M (EU 48)', 'L (EU 50)', 'XL (EU 52)', 'XXL'];
const BOTTOM_SIZES = ['28W / 30L', '30W / 32L', '32W / 32L', '34W / 32L', '36W / 34L', 'Custom'];
const SHOE_SIZES = ['EU 40 / US 7.5', 'EU 41 / US 8.5', 'EU 42 / US 9', 'EU 42.5 / US 9.5', 'EU 43 / US 10', 'EU 44 / US 10.5', 'EU 45 / US 11.5'];
const FIT_PREFERENCES: Array<UserMeasurements['fitPreference']> = ['Tailored', 'Relaxed', 'Oversized', 'Slim'];

export const MeasurementsModal: React.FC<MeasurementsModalProps> = ({
  isOpen,
  onClose,
  measurements,
  onSave
}) => {
  const [topSize, setTopSize] = useState(measurements.topSize || 'M (EU 48)');
  const [bottomSize, setBottomSize] = useState(measurements.bottomSize || '30W / 32L');
  const [shoeSize, setShoSize] = useState(measurements.shoeSize || 'EU 42.5 / US 9.5');
  const [height, setHeight] = useState(measurements.height || '178 cm (5\'10")');
  const [fitPreference, setFitPreference] = useState<UserMeasurements['fitPreference']>(
    measurements.fitPreference || 'Tailored'
  );
  const [chest, setChest] = useState(measurements.chest || '38 in (96 cm)');
  const [waist, setWaist] = useState(measurements.waist || '31 in (79 cm)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      topSize,
      bottomSize,
      shoeSize,
      height,
      fitPreference,
      chest,
      waist,
      inseam: measurements.inseam || '32 in (81 cm)'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl max-w-sm w-full p-5 text-[#F2ECDD] relative shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-none flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,236,221,0.1)] shrink-0">
          <div className="flex items-center gap-2">
            <Ruler className="w-4 h-4 text-[#CCA166]" />
            <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
              Sizing & Fit Specifications
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 py-3 flex-1">
          {/* Top / Jacket Size */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1.5 font-semibold">
              Top / Jacket Size
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {TOP_SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setTopSize(size)}
                  className={`py-1.5 px-2 rounded-xl font-mono text-[10px] text-center border transition-all truncate ${
                    topSize === size
                      ? 'bg-[#CCA166] text-[#181A31] font-bold border-[#CCA166]'
                      : 'bg-[#272A4B]/60 text-[#F2ECDD] border-[rgba(242,236,221,0.12)] hover:border-[#CCA166]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom / Trousers Size */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1.5 font-semibold">
              Bottom / Trousers (Waist x Inseam)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {BOTTOM_SIZES.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setBottomSize(size)}
                  className={`py-1.5 px-2 rounded-xl font-mono text-[10px] text-center border transition-all truncate ${
                    bottomSize === size
                      ? 'bg-[#CCA166] text-[#181A31] font-bold border-[#CCA166]'
                      : 'bg-[#272A4B]/60 text-[#F2ECDD] border-[rgba(242,236,221,0.12)] hover:border-[#CCA166]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Footwear / Shoe Size */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1.5 font-semibold">
              Footwear Size
            </label>
            <select
              value={shoeSize}
              onChange={(e) => setShoSize(e.target.value)}
              className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
            >
              {SHOE_SIZES.map((s) => (
                <option key={s} value={s} className="bg-[#181A31]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Fit Preference */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1.5 font-semibold">
              Preferred Silhouette & Fit
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {FIT_PREFERENCES.map((pref) => (
                <button
                  type="button"
                  key={pref}
                  onClick={() => setFitPreference(pref)}
                  className={`py-1.5 px-1 rounded-xl font-sans text-xs text-center border transition-all ${
                    fitPreference === pref
                      ? 'bg-[#E44C4E] text-[#181A31] font-bold border-[#E44C4E]'
                      : 'bg-[#272A4B]/60 text-[#F2ECDD] border-[rgba(242,236,221,0.12)] hover:border-[#E44C4E]'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          {/* Height & Torso measurements */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                Height
              </label>
              <input
                type="text"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="178 cm / 5'10&quot;"
                className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-1.5 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                Chest / Bust
              </label>
              <input
                type="text"
                value={chest}
                onChange={(e) => setChest(e.target.value)}
                placeholder="38 in (96 cm)"
                className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-1.5 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-[rgba(242,236,221,0.1)] flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] font-sans font-medium text-xs transition-colors"
            >
              Cancel
            </button>

            <StarBorder
              as="button"
              color="#CCA166"
              speed="3.5s"
              backgroundColor="#CCA166"
              textColor="#181A31"
              className="flex-1 !py-2.5 font-sans font-bold text-xs"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Save Specs</span>
              </span>
            </StarBorder>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeasurementsModal;
