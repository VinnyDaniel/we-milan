'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  RefreshCw, 
  Heart, 
  Flame, 
  Crown, 
  ArrowLeft,
  Layers,
  Sliders,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { GeminiService, TwinningRoom, CollaboratorProfile } from '@/services/geminiService';
import { BottomNav } from '@/components/BottomNav';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import StarBorder from '@/components/reactbits/StarBorder';
import sound from '@/services/soundService';
import confetti from 'canvas-confetti';

const PRESET_THEMES = [
  { id: 'riviera', name: 'Minimalist Riviera', occasion: 'Sunlit Seaside & Aperitivo', colors: ['#F2ECDD', '#CCA166', '#3E437A'] },
  { id: 'avant-garde', name: 'All-Black Avant-Garde', occasion: 'Gallery Vernissage & Night', colors: ['#181A31', '#272A4B', '#9C9FBE'] },
  { id: 'old-money', name: 'Old Money Tailored', occasion: 'Private Club & Dinner', colors: ['#CCA166', '#F2ECDD', '#E44C4E'] },
  { id: 'pastel-brunch', name: 'Pastel Silk Brunch', occasion: 'Weekend Rooftop Social', colors: ['#E44C4E', '#CCA166', '#F2ECDD'] },
  { id: 'street-denim', name: '90s Denim Atelier', occasion: 'City Stroll & Casual Meet', colors: ['#3E437A', '#F2ECDD', '#CCA166'] }
];

export default function TwinningPage() {
  const router = useRouter();

  // State
  const [room, setRoom] = useState<TwinningRoom>(GeminiService.getInitialTwinningRoom());
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [newFriendHandle, setNewFriendHandle] = useState('');
  const [suggestModalMember, setSuggestModalMember] = useState<CollaboratorProfile | null>(null);

  // Copy Room Invite Link
  const handleCopyInvite = () => {
    sound.playClick();
    navigator.clipboard?.writeText?.(`https://wemilan.app/join/${room.code}`);
    setCopiedCode(true);
    showToast(`✨ Copied invite link for ${room.code}!`);
    setTimeout(() => setCopiedCode(false), 2400);
  };

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3200);
  };

  // Switch Mode (Duo vs Group)
  const handleModeChange = (mode: 'duo' | 'group') => {
    sound.playTransition();
    const updated: TwinningRoom = {
      ...room,
      mode,
      members: mode === 'duo' ? room.members.slice(0, 2) : GeminiService.getInitialTwinningRoom().members
    };
    const { score, critique } = GeminiService.calculateTwinningHarmony(updated);
    setRoom({ ...updated, harmonyScore: score, editorialCritique: critique });
    showToast(mode === 'duo' ? '👯 Switched to 1-on-1 Duo Twinning' : '👥 Switched to Squad Group Coordination');
  };

  // Switch Twinning Intensity
  const handleIntensityChange = (intensity: 'identical' | 'complementary' | 'accent') => {
    sound.playClick();
    const updated: TwinningRoom = {
      ...room,
      twinningIntensity: intensity
    };
    const { score, critique } = GeminiService.calculateTwinningHarmony(updated);
    setRoom({ ...updated, harmonyScore: score, editorialCritique: critique });
  };

  // Switch Aesthetic Theme
  const handleThemeChange = (themeObj: typeof PRESET_THEMES[0]) => {
    sound.playClick();
    const updated: TwinningRoom = {
      ...room,
      theme: themeObj.name,
      targetOccasion: themeObj.occasion
    };
    const { score, critique } = GeminiService.calculateTwinningHarmony(updated);
    setRoom({ ...updated, harmonyScore: score, editorialCritique: critique });
    showToast(`🎨 Theme updated to ${themeObj.name}`);
  };

  // Handle Reactions for a Member
  const handleReact = (memberId: string, emoji: string) => {
    sound.playPop();
    try {
      confetti({
        particleCount: 25,
        spread: 45,
        origin: { y: 0.6 }
      });
    } catch {}

    setRoom(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id !== memberId) return m;
        const currentReactions = m.reactions || {};
        return {
          ...m,
          reactions: {
            ...currentReactions,
            [emoji]: (currentReactions[emoji] || 0) + 1
          }
        };
      })
    }));
  };

  // AI Synchronize Squad Outfits
  const handleAutoTwinSync = () => {
    setIsSyncing(true);
    sound.playDissolve();

    setTimeout(() => {
      setIsSyncing(false);
      const syncedScore = 98;
      const syncedCritique = `Perfected Haute Harmony! We Milan Atelier synchronized all ${room.members.length} members with balanced neutral tones, complementary silhouettes, and matching warm amber accents for ${room.targetOccasion}.`;
      setRoom(prev => ({
        ...prev,
        harmonyScore: syncedScore,
        editorialCritique: syncedCritique
      }));
      sound.playSuccess();
      try {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#CCA166', '#E44C4E', '#F2ECDD']
        });
      } catch {}
      showToast('✨ Squad outfits synchronized to 98% Haute Harmony!');
    }, 1200);
  };

  // Add Collaborator to Squad
  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendHandle.trim()) return;

    sound.playSuccess();
    const handleClean = newFriendHandle.startsWith('@') ? newFriendHandle : `@${newFriendHandle}`;
    const nameClean = handleClean.replace('@', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

    const newMember: CollaboratorProfile = {
      id: `friend-${Date.now()}`,
      name: nameClean,
      handle: handleClean,
      avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
      status: 'ready',
      role: 'member',
      currentOutfit: {
        title: 'Minimalist Riviera Linen',
        items: [
          { category: 'TOPS', name: 'Oversized Silk Poplin', colour: 'Chalk White', pattern: 'Solid', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
          { category: 'BOTTOMS', name: 'Pleated Raw Linen Trousers', colour: 'Sandstone', pattern: 'Solid', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
          { category: 'ACCESSORIES', name: 'Leather Cestino Bag', colour: 'Amber Cognac', pattern: 'Woven', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      reactions: { '✨': 3, '🔥': 2 }
    };

    setRoom(prev => {
      const updatedMembers = [...prev.members, newMember];
      const updatedRoom: TwinningRoom = { ...prev, members: updatedMembers };
      const { score, critique } = GeminiService.calculateTwinningHarmony(updatedRoom);
      return { ...updatedRoom, harmonyScore: score, editorialCritique: critique };
    });

    setNewFriendHandle('');
    setInviteModalOpen(false);
    showToast(`🎉 ${nameClean} joined the Twinning Studio!`);
  };

  // Suggest Piece to Friend
  const handleSuggestPiece = (member: CollaboratorProfile) => {
    sound.playClick();
    // Swap friend's accessory or top to align closer
    setRoom(prev => ({
      ...prev,
      members: prev.members.map(m => {
        if (m.id !== member.id || !m.currentOutfit) return m;
        return {
          ...m,
          currentOutfit: {
            ...m.currentOutfit,
            title: 'Atelier Synced Twin Look',
            items: [
              ...m.currentOutfit.items.slice(0, 2),
              {
                category: 'ACCESSORIES',
                name: 'Haute Amber Sunglasses',
                colour: 'Warm Amber',
                pattern: 'Tortoiseshell',
                imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'
              }
            ]
          }
        };
      })
    }));
    setSuggestModalMember(null);
    showToast(`✨ Suggested Tortoiseshell Amber Accent to ${member.name}`);
  };

  // Export Squad Lookbook
  const handleExportLookbook = () => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
    showToast('📸 Squad Lookbook snapshot saved to your Fashion Archive!');
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
            <button
              onClick={() => setInviteModalOpen(true)}
              className="text-xs font-mono text-[#181A31] bg-[#CCA166] hover:bg-[#E5B87E] px-2.5 py-1 rounded-md font-bold flex items-center gap-1 shadow-sm transition-all"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Invite</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => router.back()}
              className="w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-[#9C9FBE] hover:text-[#F2ECDD]"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="eyebrow">
                Collaborative Styling &bull; Duo & Squad
              </div>
              <h1 className="font-serif text-xl font-medium text-[#F2ECDD] tracking-tight flex items-center gap-2">
                <span>Twinning</span>
                <span className="italic text-[#CCA166]">Studio</span>
              </h1>
            </div>
          </div>

          {/* Live Room Code Chip */}
          <button
            onClick={handleCopyInvite}
            title="Click to copy invite code"
            className="flex items-center gap-1.5 bg-[#272A4B] hover:bg-[#3E437A] border border-[rgba(242,236,221,0.16)] px-2.5 py-1 rounded-full font-mono text-[10px] text-[#CCA166] transition-all"
          >
            {copiedCode ? <Check className="w-3 h-3 text-[#34D399]" /> : <Copy className="w-3 h-3" />}
            <span>{room.code}</span>
          </button>
        </div>
      </div>

      {/* Main Scrollable Canvas */}
      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-none space-y-4">
        {/* Floating Chic Notification Toast */}
        {activeToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#272A4B]/95 border border-[#CCA166]/40 text-[#F2ECDD] font-mono text-xs px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-[#CCA166]" />
            <span>{activeToast}</span>
          </div>
        )}

        {/* 1. Collaboration Mode & Live Sync Banner */}
        <div className="bg-gradient-to-r from-[#272A4B]/80 via-[#272A4B] to-[#181A31] border border-[rgba(242,236,221,0.12)] rounded-3xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE]">
                Live Atelier Session ({room.members.length} Connected)
              </span>
            </div>

            {/* Mode Switcher: Duo vs Group */}
            <div className="flex items-center bg-[#181A31] p-0.5 rounded-full border border-[rgba(242,236,221,0.1)]">
              <button
                onClick={() => handleModeChange('duo')}
                className={`px-3 py-1 rounded-full font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                  room.mode === 'duo'
                    ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                    : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
                }`}
              >
                👯 Duo (1-on-1)
              </button>
              <button
                onClick={() => handleModeChange('group')}
                className={`px-3 py-1 rounded-full font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                  room.mode === 'group'
                    ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                    : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
                }`}
              >
                👥 Squad Group
              </button>
            </div>
          </div>

          {/* Room Title & Occasion */}
          <div>
            <h2 className="font-serif text-base font-medium text-[#F2ECDD]">
              {room.title}
            </h2>
            <p className="font-sans text-xs text-[#9C9FBE]">
              Theme: <span className="text-[#CCA166] font-medium">{room.theme}</span> &bull; Occasion: {room.targetOccasion}
            </p>
          </div>

          {/* Twinning Intensity Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#9C9FBE] flex items-center gap-1">
                <Sliders className="w-3 h-3 text-[#CCA166]" />
                <span>Twinning Intensity</span>
              </span>
              <span className="font-mono text-[9px] text-[#CCA166]">
                {room.twinningIntensity === 'identical' && '💎 100% Mirror Match'}
                {room.twinningIntensity === 'complementary' && '🎨 75% Harmonic Balance'}
                {room.twinningIntensity === 'accent' && '✨ 35% Subtle Accent Sync'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'identical' as const, label: 'Identical' },
                { id: 'complementary' as const, label: 'Harmonic' },
                { id: 'accent' as const, label: 'Accents' }
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => handleIntensityChange(tier.id)}
                  className={`py-1.5 px-2 rounded-xl font-mono text-[9.5px] uppercase tracking-wider text-center border transition-all ${
                    room.twinningIntensity === tier.id
                      ? 'bg-[#E44C4E]/20 border-[#E44C4E] text-[#E44C4E] font-bold'
                      : 'bg-[#181A31]/60 border-[rgba(242,236,221,0.08)] text-[#9C9FBE] hover:text-[#F2ECDD]'
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Theme & Dress Code Synchronizer Pills */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE]">
              Synchronize Dress Code & Palette
            </span>
            <span className="font-mono text-[9px] text-[#CCA166]">
              1-Tap Vibe Sync
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_THEMES.map((theme) => {
              const isSelected = room.theme === theme.name;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme)}
                  className={`shrink-0 px-3 py-1.5 rounded-full border text-xs font-sans transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#CCA166] text-[#181A31] font-bold border-[#CCA166] shadow-md'
                      : 'bg-[#272A4B]/60 text-[#F2ECDD] border-[rgba(242,236,221,0.12)] hover:border-[#CCA166]/50'
                  }`}
                >
                  <div className="flex items-center -space-x-1">
                    {theme.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 rounded-full border border-black/30"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Collaborator Ensembles: Side-by-Side Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE]">
              Coordinated Ensembles ({room.members.length})
            </span>
            <span className="font-mono text-[9px] text-[#CCA166] flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-[#34D399]" />
              <span>Palette Synchronized</span>
            </span>
          </div>

          <div className="space-y-3">
            {room.members.map((member) => {
              const isHost = member.role === 'host';
              return (
                <div
                  key={member.id}
                  className={`rounded-3xl p-4 border transition-all ${
                    isHost
                      ? 'bg-gradient-to-b from-[#272A4B] to-[#181A31] border-[#CCA166]/40 shadow-xl'
                      : 'bg-[#272A4B]/70 border-[rgba(242,236,221,0.12)] shadow-md'
                  }`}
                >
                  {/* Member Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(242,236,221,0.08)]">
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-[#CCA166]"
                        />
                        {isHost && (
                          <span className="absolute -bottom-1 -right-1 bg-[#E44C4E] text-[#181A31] rounded-full p-0.5" title="Curator / Host">
                            <Crown className="w-2.5 h-2.5 stroke-[3]" />
                          </span>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="font-serif text-sm font-medium text-[#F2ECDD]">
                            {member.name}
                          </h3>
                          {isHost && (
                            <span className="bg-[#CCA166]/20 text-[#CCA166] font-mono text-[8px] uppercase px-1.5 py-0.2 rounded-full font-bold">
                              You
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-[#9C9FBE]">
                          {member.handle}
                        </span>
                      </div>
                    </div>

                    {/* Member Outfit Title */}
                    <div className="text-right">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166] block">
                        {member.currentOutfit?.title || 'Ensemble'}
                      </span>
                      <span className="font-mono text-[9px] text-[#34D399] flex items-center gap-1 justify-end">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                        <span>Ready</span>
                      </span>
                    </div>
                  </div>

                  {/* Member Outfit Pieces Grid */}
                  <div className="grid grid-cols-3 gap-2 py-3">
                    {member.currentOutfit?.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="bg-[#181A31]/90 rounded-2xl p-2 border border-[rgba(242,236,221,0.08)] flex flex-col items-center text-center group"
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-black/40 mb-1.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="font-sans text-[10.5px] text-[#F2ECDD] font-medium truncate w-full">
                          {item.name}
                        </span>
                        <span className="font-mono text-[8.5px] text-[#CCA166] uppercase truncate w-full">
                          {item.colour} &bull; {item.category}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Reaction Buttons & Suggestions */}
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(242,236,221,0.08)]">
                    {/* Emoji Reaction Bar */}
                    <div className="flex items-center gap-1.5">
                      {[
                        { emoji: '🔥', key: 'fire' },
                        { emoji: '✨', key: 'sparkle' },
                        { emoji: '👯', key: 'twin' },
                        { emoji: '👑', key: 'crown' }
                      ].map((r) => {
                        const count = member.reactions?.[r.emoji] || 0;
                        return (
                          <button
                            key={r.emoji}
                            onClick={() => handleReact(member.id, r.emoji)}
                            className="px-2 py-1 rounded-full bg-[#181A31] hover:bg-[#3E437A] border border-[rgba(242,236,221,0.12)] font-mono text-xs flex items-center gap-1 transition-transform active:scale-90"
                          >
                            <span>{r.emoji}</span>
                            {count > 0 && <span className="text-[10px] text-[#CCA166] font-bold">{count}</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Suggest Piece for Friend (if not user) */}
                    {!isHost ? (
                      <button
                        onClick={() => handleSuggestPiece(member)}
                        className="text-[10px] font-mono text-[#CCA166] hover:text-[#F2ECDD] border border-[#CCA166]/30 px-2 py-1 rounded-full hover:bg-[#CCA166]/10 transition-all flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3 text-[#E44C4E]" />
                        <span>Twin Closer</span>
                      </button>
                    ) : (
                      <Link
                        href="/style"
                        className="text-[10px] font-mono text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center gap-1"
                      >
                        <Layers className="w-3 h-3 text-[#CCA166]" />
                        <span>Edit My Look</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. AI Twinning Advisor & Group Harmony Scorecard */}
        <div className="bg-gradient-to-b from-[#272A4B] to-[#181A31] border border-[#CCA166]/40 rounded-3xl p-5 shadow-xl space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.1)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#CCA166]/20 text-[#CCA166] flex items-center justify-center font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                  Atelier Social Engine
                </span>
                <h3 className="font-serif text-sm font-medium text-[#F2ECDD]">
                  Twinning Harmony Analysis
                </h3>
              </div>
            </div>

            {/* Harmony Score Pill */}
            <div className="text-right">
              <span className="font-mono text-2xl font-bold text-[#CCA166] tracking-tight">
                {room.harmonyScore}%
              </span>
              <span className="font-mono text-[8px] uppercase tracking-wider text-[#9C9FBE] block">
                Haute Harmony
              </span>
            </div>
          </div>

          {/* Harmony Progress Bar */}
          <div className="w-full bg-[#181A31] h-2 rounded-full overflow-hidden border border-[rgba(242,236,221,0.1)]">
            <div
              className="bg-gradient-to-r from-[#E44C4E] via-[#CCA166] to-[#34D399] h-full rounded-full transition-all duration-700"
              style={{ width: `${room.harmonyScore}%` }}
            />
          </div>

          {/* Editorial Critique */}
          <div className="bg-[#181A31]/80 rounded-2xl p-3 border border-[rgba(242,236,221,0.08)]">
            <p className="font-sans text-xs text-[#9C9FBE] leading-relaxed italic">
              &ldquo;{room.editorialCritique}&rdquo;
            </p>
          </div>

          {/* Action: AI Synchronize Squad */}
          <div className="pt-1">
            <StarBorder
              as="button"
              onClick={handleAutoTwinSync}
              disabled={isSyncing}
              color="#CCA166"
              speed="4s"
              className="w-full cursor-pointer"
              backgroundColor="#E44C4E"
              textColor="#181A31"
            >
              <div className="flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold font-sans">
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'SYNCHRONIZING SQUAD LOOKS...' : 'AI AUTO-TWIN SQUAD PALETTES'}</span>
              </div>
            </StarBorder>
          </div>

          {/* Secondary Action: Export Lookbook */}
          <button
            onClick={handleExportLookbook}
            className="w-full bg-[#272A4B] hover:bg-[#3E437A] text-[#F2ECDD] border border-[rgba(242,236,221,0.15)] font-sans font-medium py-2.5 px-4 rounded-full text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5 text-[#CCA166]" />
            <span>EXPORT SQUAD LOOKBOOK</span>
          </button>
        </div>
      </div>

      {/* Invite Collaborator Modal */}
      {inviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#181A31] border border-[#CCA166]/40 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.1)]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#CCA166]" />
                <h3 className="font-serif text-base font-medium text-[#F2ECDD]">
                  Connect &amp; Twin
                </h3>
              </div>
              <button
                onClick={() => setInviteModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center text-xs"
              >
                &times;
              </button>
            </div>

            <p className="font-sans text-xs text-[#9C9FBE]">
              Invite a friend to synchronize your looks for {room.targetOccasion}.
            </p>

            <form onSubmit={handleAddCollaborator} className="space-y-3">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1">
                  Friend Handle / Username
                </label>
                <input
                  type="text"
                  required
                  placeholder="@fashionista_milan"
                  value={newFriendHandle}
                  onChange={(e) => setNewFriendHandle(e.target.value)}
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.14)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                />
              </div>

              {/* Shareable Room Code Chip */}
              <div className="bg-[#272A4B]/60 rounded-xl p-3 border border-[rgba(242,236,221,0.08)] flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                    Room Invite Code
                  </span>
                  <span className="font-mono text-xs font-bold text-[#CCA166]">
                    {room.code}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="bg-[#181A31] px-2.5 py-1 rounded-full border border-[rgba(242,236,221,0.12)] font-mono text-[10px] text-[#F2ECDD] hover:text-[#CCA166]"
                >
                  {copiedCode ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold py-2.5 rounded-full text-xs transition-all"
                >
                  Connect &amp; Add to Squad
                </button>
                <button
                  type="button"
                  onClick={() => setInviteModalOpen(false)}
                  className="bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] font-sans text-xs px-4 py-2.5 rounded-full border border-[rgba(242,236,221,0.12)]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
