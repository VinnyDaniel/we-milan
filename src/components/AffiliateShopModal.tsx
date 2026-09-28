'use client';

import React from 'react';
import { AffiliateItem } from '@/types/wardrobe';
import { X, ExternalLink, Sparkles, Tag } from 'lucide-react';

interface AffiliateShopModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: AffiliateItem[];
  reason?: string;
  categoryTitle?: string;
}

export const AffiliateShopModal: React.FC<AffiliateShopModalProps> = ({
  isOpen,
  onClose,
  items,
  reason = 'Complete your look with curated pieces from emerging fashion designers.',
  categoryTitle = 'Recommended Pieces'
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181A31]/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-[390px] bg-gradient-to-b from-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl p-5 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col modal-enter">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,236,221,0.1)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E44C4E]/20 text-[#E44C4E] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#F2ECDD]">
                Missing Something?
              </h3>
              <p className="font-mono text-[10px] text-[#CCA166] uppercase tracking-wider">
                {categoryTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[rgba(242,236,221,0.06)] hover:bg-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#9C9FBE] hover:text-[#F2ECDD] transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Reason note */}
        <div className="py-2.5">
          <p className="font-sans text-xs text-[#9C9FBE] leading-relaxed">
            {reason}
          </p>
        </div>

        {/* Catalog list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 scrollbar-none my-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-[#181A31]/90 border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 flex gap-3 items-center group hover:border-[#CCA166]/40 transition-all shadow-sm"
            >
              {/* Product Thumbnail */}
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-[#272A4B] shrink-0 border border-[rgba(242,236,221,0.1)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#CCA166]">
                  {item.designer}
                </span>
                <h4 className="font-serif text-sm font-medium text-[#F2ECDD] truncate mt-0.5">
                  {item.name}
                </h4>
                <p className="font-sans text-[11px] text-[#9C9FBE] line-clamp-1 mt-0.5">
                  {item.matchReason}
                </p>

                <div className="flex items-center justify-between mt-2 pt-1 border-t border-[rgba(242,236,221,0.08)]">
                  <div className="flex items-center gap-1 font-mono text-xs font-semibold text-[#F2ECDD]">
                    <Tag className="w-3 h-3 text-[#E44C4E]" />
                    <span>{item.price}</span>
                  </div>

                  <a
                    href={item.productUrl}
                    onClick={(e) => {
                      e.preventDefault();
                      alert(`Redirecting to partner boutique: ${item.designer} (${item.name})`);
                    }}
                    className="inline-flex items-center gap-1 bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans text-xs font-bold px-3 py-1 rounded-full transition-all active:scale-95 shadow-sm"
                  >
                    <span>Shop</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="pt-3 border-t border-[rgba(242,236,221,0.1)] text-center">
          <p className="font-mono text-[9.5px] text-[#9C9FBE]/70">
            Empowering emerging independent designers · We Milan affiliate network
          </p>
        </div>
      </div>
    </div>
  );
};
