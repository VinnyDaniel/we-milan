'use client';

import React, { useState } from 'react';
import { WardrobeItem, GarmentCategory, LaundryStatus } from '@/types/wardrobe';
import { X, Check, Trash2, Droplets } from 'lucide-react';

interface EditGarmentModalProps {
  item: WardrobeItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<WardrobeItem>) => void;
  onDelete?: (id: string) => void;
}

export const EditGarmentModal: React.FC<EditGarmentModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const [name, setName] = useState(item?.name || '');
  const [category, setCategory] = useState<GarmentCategory>(item?.category || 'TOPS');
  const [colour, setColour] = useState(item?.colour || '');
  const [pattern, setPattern] = useState(item?.pattern || '');
  const [fabric, setFabric] = useState(item?.fabric || '');
  const [style, setStyle] = useState(item?.style || '');
  const [laundryStatus, setLaundryStatus] = useState<LaundryStatus>(item?.laundryStatus || 'CLEAN');
  const [occasions, setOccasions] = useState(item?.occasions.join(', ') || '');
  const [seasons, setSeasons] = useState(item?.seasons.join(', ') || '');

  // Sync state when item changes
  React.useEffect(() => {
    if (item) {
      setName(item.name);
      setCategory(item.category);
      setColour(item.colour);
      setPattern(item.pattern || '');
      setFabric(item.fabric);
      setStyle(item.style);
      setLaundryStatus(item.laundryStatus);
      setOccasions(item.occasions.join(', '));
      setSeasons(item.seasons.join(', '));
    }
  }, [item]);

  if (!isOpen || !item) return null;

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(item.id, {
      name,
      category,
      colour,
      pattern,
      fabric,
      style,
      laundryStatus,
      occasions: occasions.split(',').map((s) => s.trim()).filter(Boolean),
      seasons: seasons.split(',').map((s) => s.trim()).filter(Boolean)
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181A31]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-[390px] bg-gradient-to-b from-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,236,221,0.1)]">
          <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
            Edit Garment Details
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[rgba(242,236,221,0.06)] hover:bg-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#9C9FBE] hover:text-[#F2ECDD] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-3 scrollbar-none text-xs">
          {/* Garment Image Preview */}
          <div className="flex items-center gap-3 bg-[#181A31]/60 p-2.5 rounded-2xl border border-[rgba(242,236,221,0.08)]">
            <div className="w-14 h-16 rounded-xl overflow-hidden bg-[#272A4B] shrink-0 border border-[rgba(242,236,221,0.1)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166]">
                {item.id}
              </p>
              <h4 className="font-serif text-sm text-[#F2ECDD] font-medium mt-0.5">
                {name || item.name}
              </h4>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
              Garment Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GarmentCategory)}
              className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Colour and Fabric row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                Colour
              </label>
              <input
                type="text"
                value={colour}
                onChange={(e) => setColour(e.target.value)}
                required
                className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                Fabric / Material
              </label>
              <input
                type="text"
                value={fabric}
                onChange={(e) => setFabric(e.target.value)}
                required
                className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
              />
            </div>
          </div>

          {/* Pattern */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
              Pattern / Weave
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Solid Minimalist, Pinstripe, Floral..."
              className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
            />
          </div>

          {/* Style */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
              Style Aesthetic
            </label>
            <input
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              placeholder="e.g. Minimal / Casual"
              className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
            />
          </div>

          {/* Laundry Status (FEATURE 6) */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1 flex items-center gap-1">
              <Droplets className="w-3 h-3 text-[#CCA166]" />
              <span>Laundry Status</span>
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['CLEAN', 'IN_LAUNDRY', 'READY_TO_WEAR'] as LaundryStatus[]).map((status) => {
                const isSelected = laundryStatus === status;
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setLaundryStatus(status)}
                    className={`py-1.5 px-1 rounded-xl font-mono text-[9px] tracking-tight transition-all border ${
                      isSelected
                        ? status === 'IN_LAUNDRY'
                          ? 'bg-[#E44C4E] text-[#181A31] border-[#E44C4E] font-bold'
                          : 'bg-[#CCA166] text-[#181A31] border-[#CCA166] font-bold'
                        : 'bg-[#181A31] text-[#9C9FBE] border-[rgba(242,236,221,0.12)]'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Occasions */}
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
              Occasions (comma-separated)
            </label>
            <input
              type="text"
              value={occasions}
              onChange={(e) => setOccasions(e.target.value)}
              placeholder="Party, Date, Work"
              className="w-full bg-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
            />
          </div>

          {/* Footer actions */}
          <div className="pt-2 flex items-center justify-between gap-2">
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Remove "${item.name}" from your wardrobe?`)) {
                    onDelete(item.id);
                    onClose();
                  }
                }}
                className="w-10 h-10 rounded-xl bg-[rgba(228,76,78,0.15)] hover:bg-[#E44C4E] text-[#E44C4E] hover:text-[#181A31] flex items-center justify-center transition-all"
                title="Delete piece"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#CCA166] to-[#E2C78C] text-[#181A31] font-sans font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-md"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
