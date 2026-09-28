'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/services/storageService';
import { WardrobeItem, GarmentCategory, LaundryStatus } from '@/types/wardrobe';
import { Carousel3D } from '@/components/Carousel3D';
import { EditGarmentModal } from '@/components/EditGarmentModal';
import { BottomNav } from '@/components/BottomNav';
import InfiniteSpiral, { SpiralItem } from '@/components/reactbits/InfiniteSpiral';
import StarBorder from '@/components/reactbits/StarBorder';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import { 
  Sparkles, 
  Droplets, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  Plus, 
  RefreshCcw, 
  ArrowRight,
  Disc,
  Layers
} from 'lucide-react';

const CATEGORIES: GarmentCategory[] = [
  'ALL',
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

export default function WardrobePage() {
  const router = useRouter();

  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<GarmentCategory>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [editingItem, setEditingItem] = useState<WardrobeItem | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'carousel' | 'spiral'>('carousel');

  // Load wardrobe on mount
  useEffect(() => {
    const items = StorageService.getWardrobe();
    setWardrobe(items);
  }, []);

  // Filter items by selected category
  const filteredItems = wardrobe.filter((item) => {
    if (selectedCategory === 'ALL') return true;
    return item.category === selectedCategory;
  });

  // Prepare items for InfiniteSpiral
  const spiralItems: SpiralItem[] = filteredItems.map((item) => ({
    id: item.id,
    src: item.imageUrl,
    alt: item.name,
    label: item.name,
  }));

  // Ensure selectedIndex is within bounds when filtering
  useEffect(() => {
    setSelectedIndex(0);
  }, [selectedCategory]);

  const currentItem: WardrobeItem | undefined = filteredItems[selectedIndex];

  // Feature 6: Toggle Laundry Status
  const handleToggleLaundry = (id: string) => {
    const updated = StorageService.toggleLaundryStatus(id);
    if (updated) {
      setWardrobe(StorageService.getWardrobe());
    }
  };

  // Feature 10: "STYLE THIS"
  const handleStyleThis = (item: WardrobeItem) => {
    router.push(`/style?anchorId=${item.id}`);
  };

  // Update item from modal
  const handleSaveItemUpdates = (id: string, updates: Partial<WardrobeItem>) => {
    StorageService.updateItem(id, updates);
    setWardrobe(StorageService.getWardrobe());
  };

  // Delete item from modal
  const handleDeleteItem = (id: string) => {
    StorageService.deleteItem(id);
    const updated = StorageService.getWardrobe();
    setWardrobe(updated);
    setSelectedIndex(0);
  };

  const getLaundryBadge = (status: LaundryStatus) => {
    switch (status) {
      case 'CLEAN':
        return (
          <span className="inline-flex items-center gap-1 text-[#34D399] bg-[#34D399]/15 border border-[#34D399]/30 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>✓ Clean</span>
          </span>
        );
      case 'IN_LAUNDRY':
        return (
          <span className="inline-flex items-center gap-1 text-[#E44C4E] bg-[#E44C4E]/15 border border-[#E44C4E]/30 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold">
            <Droplets className="w-3 h-3" />
            <span>In Laundry</span>
          </span>
        );
      case 'READY_TO_WEAR':
        return (
          <span className="inline-flex items-center gap-1 text-[#CCA166] bg-[#CCA166]/15 border border-[#CCA166]/30 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold">
            <Clock className="w-3 h-3" />
            <span>Ready to Wear</span>
          </span>
        );
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[#181A31] text-[#F2ECDD]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 border-b border-[rgba(242,236,221,0.08)] space-y-2 shrink-0 z-20">
        <div className="flex items-center justify-between">
          <WeMilanLogo variant="header" size="sm" />

          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />

            {/* View switcher: 3D Carousel vs Infinite Spiral */}
            <div className="flex items-center bg-[#272A4B] p-0.5 rounded-full border border-[rgba(242,236,221,0.12)]">
              <button
                onClick={() => setViewMode('carousel')}
                title="3D Carousel View"
                className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 ${
                  viewMode === 'carousel'
                    ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                    : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>Carousel</span>
              </button>

              <button
                onClick={() => setViewMode('spiral')}
                title="Infinite Spiral View"
                className={`px-2.5 py-1 rounded-full font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 ${
                  viewMode === 'spiral'
                    ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                    : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
                }`}
              >
                <Disc className="w-2.5 h-2.5" />
                <span>Spiral</span>
              </button>
            </div>

            <Link
              href="/scan"
              className="h-7 px-2.5 rounded-full bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold text-[11px] flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-3 h-3 stroke-[3]" />
              <span>Add</span>
            </Link>
          </div>
        </div>

        <div>
          <div className="eyebrow">
            Digital Archive
          </div>
          <h1 className="font-serif text-xl font-medium text-[#F2ECDD] tracking-tight">
            Curated <em>Wardrobe</em> ({filteredItems.length})
          </h1>
        </div>
      </div>

      {/* FEATURE 4 — CLOTHING CATEGORIES STRIP */}
      <div className="px-4 py-3 overflow-x-auto scrollbar-none border-b border-[rgba(242,236,221,0.06)] bg-[#181A31]/50 shrink-0 z-10">
        <div className="flex items-center gap-1.5 min-w-max">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-mono text-[10px] tracking-wider transition-all uppercase ${
                  isSelected
                    ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                    : 'bg-[#272A4B]/60 text-[#9C9FBE] hover:text-[#F2ECDD] border border-[rgba(242,236,221,0.08)]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Wardrobe Stage Area */}
      <div className="flex-1 min-h-0 flex flex-col justify-between overflow-y-auto px-4 py-2 pb-28 scrollbar-none">
        {filteredItems.length > 0 ? (
          <>
            {/* View Mode Switching: 3D Horizontal Carousel or Infinite Helix Spiral */}
            {viewMode === 'carousel' ? (
              <div className="flex-1 flex items-center justify-center">
                <Carousel3D
                  items={filteredItems}
                  selectedIndex={selectedIndex}
                  onSelect={(idx) => setSelectedIndex(idx)}
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center relative min-h-[320px] my-1">
                <div style={{ height: '310px', width: '100%', position: 'relative', overflow: 'hidden' }}>
                  <InfiniteSpiral
                    items={spiralItems}
                    animationMode="all"
                    speed={0.4}
                    radius={155}
                    cardWidth={105}
                    cardHeight={135}
                    verticalSpacing={52}
                    perspective={950}
                    cardRadius={16}
                    centerScale={1.22}
                    edgeBlur={4}
                    cardsPerTurn={6}
                    pauseOnHover
                    onItemSelect={(spItem) => {
                      const idx = filteredItems.findIndex((i) => i.id === spItem.id);
                      if (idx !== -1) setSelectedIndex(idx);
                    }}
                  />
                </div>
                <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#CCA166] mt-0.5 text-center tracking-wider">
                  <Disc className="w-2.5 h-2.5 text-[#E44C4E] animate-spin" />
                  <span>DRAG VERTICALLY TO EXPLORE HELIX · TAP ITEM TO SELECT</span>
                </div>
              </div>
            )}

            {/* FEATURE 5 — SELECTED ITEM DETAILS CARD */}
            {currentItem && (
              <div className="bg-gradient-to-b from-[#272A4B]/95 to-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-3xl p-4 shadow-xl mb-3 animate-fadeIn">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166] px-2 py-0.5 rounded-full bg-[#181A31] border border-[rgba(242,236,221,0.1)]">
                        {currentItem.category}
                      </span>
                      {currentItem.pattern && (
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#34D399] px-2 py-0.5 rounded-full bg-[#34D399]/10 border border-[#34D399]/30">
                          {currentItem.pattern}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-xl font-medium text-[#F2ECDD] tracking-tight">
                      {currentItem.name}
                    </h3>
                    <div className="flex items-center gap-2 font-mono text-xs text-[#9C9FBE] mt-0.5">
                      {currentItem.colorMetrics && (
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-white/20 inline-block shrink-0"
                          style={{ backgroundColor: currentItem.colorMetrics.hex }}
                        />
                      )}
                      <span>{currentItem.colour} · {currentItem.fabric}</span>
                    </div>
                  </div>

                  {/* Clean / Laundry Badge */}
                  <div>{getLaundryBadge(currentItem.laundryStatus)}</div>
                </div>

                {/* Occasion Tags */}
                <div className="flex flex-wrap gap-1.5 my-3">
                  {currentItem.occasions.map((occ) => (
                    <span
                      key={occ}
                      className="px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-[#3E437A]/50 border border-[rgba(242,236,221,0.12)] text-[#CCA166]"
                    >
                      {occ}
                    </span>
                  ))}
                  {currentItem.seasons.map((season) => (
                    <span
                      key={season}
                      className="px-2 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-wider bg-[#181A31] border border-[rgba(242,236,221,0.08)] text-[#9C9FBE]"
                    >
                      {season}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: STYLE THIS, EDIT, LAUNDRY */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-[rgba(242,236,221,0.1)]">
                  {/* STYLE THIS */}
                  <div className="col-span-1">
                    <StarBorder
                      as="button"
                      onClick={() => handleStyleThis(currentItem)}
                      color="#E44C4E"
                      speed="4s"
                      className="w-full cursor-pointer"
                      backgroundColor="#E44C4E"
                      textColor="#181A31"
                    >
                      <div className="flex items-center justify-center gap-1 py-2 px-1 font-sans font-bold text-xs">
                        <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>STYLE THIS</span>
                      </div>
                    </StarBorder>
                  </div>

                  {/* EDIT */}
                  <button
                    onClick={() => {
                      setEditingItem(currentItem);
                      setIsEditModalOpen(true);
                    }}
                    className="bg-[#272A4B] hover:bg-[#3E437A] text-[#F2ECDD] border border-[rgba(242,236,221,0.14)] font-sans font-medium py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>EDIT</span>
                  </button>

                  {/* LAUNDRY TOGGLE */}
                  <button
                    onClick={() => handleToggleLaundry(currentItem.id)}
                    className="bg-[#272A4B] hover:bg-[#3E437A] text-[#CCA166] border border-[rgba(242,236,221,0.14)] font-sans font-medium py-2.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all active:scale-95"
                    title="Toggle Clean / In Laundry / Ready to Wear"
                  >
                    <Droplets className="w-3.5 h-3.5" />
                    <span>LAUNDRY</span>
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          /* FEATURE 7 — EMPTY STATE */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 my-auto">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#CCA166] mb-4 shadow-lg">
              <Sparkles className="w-10 h-10 stroke-[1.5]" />
            </div>

            <h3 className="font-serif text-2xl font-medium text-[#F2ECDD]">
              Your wardrobe is waiting.
            </h3>
            <p className="font-sans text-xs text-[#9C9FBE] max-w-[260px] mt-2 mb-6 leading-relaxed">
              Scan your first piece and let We Milan organize and classify it for you.
            </p>

            <StarBorder
              as="div"
              color="#CCA166"
              speed="5s"
              backgroundColor="#E44C4E"
              textColor="#181A31"
              className="cursor-pointer rounded-full overflow-hidden shadow-lg"
            >
              <Link
                href="/scan"
                className="py-3 px-7 text-xs font-sans font-bold flex items-center gap-2"
              >
                <span>SCAN CLOTHING</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </StarBorder>

            <button
              onClick={() => {
                const demoItems = StorageService.resetToDemo();
                setWardrobe(demoItems);
              }}
              className="mt-4 font-mono text-[10px] text-[#CCA166] hover:underline flex items-center gap-1"
            >
              <RefreshCcw className="w-3 h-3" />
              <span>Restore 12 Demo Garments</span>
            </button>
          </div>
        )}
      </div>

      {/* Inline Edit Modal */}
      <EditGarmentModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveItemUpdates}
        onDelete={handleDeleteItem}
      />

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
