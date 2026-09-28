'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Users, 
  UserPlus, 
  Sparkles, 
  Check, 
  X, 
  Share2, 
  RefreshCw, 
  Heart, 
  Flame, 
  Crown, 
  ArrowLeft,
  Search,
  CheckCircle2,
  Smile,
  Sliders,
  Send
} from 'lucide-react';
import { BottomNav } from '@/components/BottomNav';
import WeMilanLogo from '@/components/WeMilanLogo';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import StarBorder from '@/components/reactbits/StarBorder';
import sound from '@/services/soundService';
import confetti from 'canvas-confetti';

interface Friend {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  status: 'online' | 'offline';
  outfit: {
    title: string;
    items: {
      category: string;
      name: string;
      colour: string;
      imageUrl: string;
    }[];
  };
  reactions: { [key: string]: number };
}

interface FriendRequest {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  mutualFriends: number;
}

const INITIAL_REQUESTS: FriendRequest[] = [
  {
    id: 'req-maya',
    name: 'Maya Sterling',
    handle: '@maya_style',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    mutualFriends: 4
  },
  {
    id: 'req-lucas',
    name: 'Lucas Chen',
    handle: '@lucas_c',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    mutualFriends: 2
  }
];

const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'friend-clara',
    name: 'Clara Delacroix',
    handle: '@clara_paris',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    outfit: {
      title: 'Romantic Silk Look',
      items: [
        { category: 'DRESS', name: 'Silk Midi Dress', colour: 'Peach Coral', imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' },
        { category: 'SHOES', name: 'Black Pumps', colour: 'Black', imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80' },
        { category: 'BAG', name: 'Leather Tote', colour: 'Cognac Brown', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' }
      ]
    },
    reactions: { '🔥': 8, '👯': 6 }
  },
  {
    id: 'friend-marco',
    name: 'Marco Bellini',
    handle: '@marco_milano',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    outfit: {
      title: 'Tailored Pinstripe Suit',
      items: [
        { category: 'SUIT', name: 'Wool Suit Jacket', colour: 'Charcoal Grey', imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80' },
        { category: 'TOP', name: 'White Tee', colour: 'Crisp White', imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' },
        { category: 'SUNGLASSES', name: 'Tortoiseshell Glasses', colour: 'Amber', imageUrl: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80' }
      ]
    },
    reactions: { '✨': 7, '👑': 4 }
  },
  {
    id: 'friend-sofia',
    name: 'Sofia Ricci',
    handle: '@sofia_r',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    status: 'offline',
    outfit: {
      title: 'Casual Linen & Denim',
      items: [
        { category: 'TOP', name: 'Oversized Linen Shirt', colour: 'Cream White', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
        { category: 'BOTTOM', name: 'Straight Denim Jeans', colour: 'Light Blue', imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
        { category: 'SHOES', name: 'Leather Sneakers', colour: 'Chalk White', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' }
      ]
    },
    reactions: { '🔥': 5, '✨': 4 }
  }
];

const STYLE_VIBES = [
  { id: 'casual', name: 'Casual Day', note: 'Relaxed shirts, denim & clean sneakers' },
  { id: 'clean', name: 'Clean Riviera', note: 'Linen, beige trousers & warm brown leather' },
  { id: 'night', name: 'Night Out', note: 'All-black tailoring & glossy shoes' },
  { id: 'brunch', name: 'Brunch Pastel', note: 'Light tones, silk dresses & sunglasses' },
  { id: 'street', name: 'Streetwear', note: 'Oversized cuts, sneakers & statement caps' }
];

export default function TwinningPage() {
  const router = useRouter();

  // Navigation tabs: 'twin' | 'friends' | 'requests'
  const [activeTab, setActiveTab] = useState<'twin' | 'friends' | 'requests'>('twin');

  // Friends & Requests data
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [requests, setRequests] = useState<FriendRequest[]>(INITIAL_REQUESTS);
  const [searchHandle, setSearchHandle] = useState('');

  // Selected friends for twinning: array of friend IDs (1 = duo, 2+ = squad)
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>(['friend-clara']);
  const [matchType, setMatchType] = useState<'colors' | 'vibe' | 'identical'>('colors');
  const [selectedVibe, setSelectedVibe] = useState(STYLE_VIBES[1]);
  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [isMatching, setIsMatching] = useState(false);
  const [twinScore, setTwinScore] = useState(96);

  // User's own outfit
  const userOutfit = {
    name: 'You',
    handle: '@you_milan',
    title: 'Linen & Neutral Tones',
    items: [
      { category: 'TOP', name: 'White Linen Shirt', colour: 'Crisp White', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
      { category: 'BOTTOM', name: 'Beige Trousers', colour: 'Camel Tan', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
      { category: 'SHOES', name: 'White Sneakers', colour: 'Chalk White', imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80' }
    ]
  };

  const showToast = (msg: string) => {
    setActiveToast(msg);
    setTimeout(() => setActiveToast(null), 3000);
  };

  // Toggle friend selection for twinning
  const toggleSelectFriend = (id: string) => {
    sound.playClick();
    setSelectedFriendIds(prev => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Keep at least one selected
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Accept a friend request (Snap-style)
  const handleAcceptRequest = (req: FriendRequest) => {
    sound.playSuccess();
    try {
      confetti({
        particleCount: 40,
        spread: 50,
        origin: { y: 0.6 }
      });
    } catch {}

    const newFriend: Friend = {
      id: req.id,
      name: req.name,
      handle: req.handle,
      avatarUrl: req.avatarUrl,
      status: 'online',
      outfit: {
        title: 'Minimalist Riviera',
        items: [
          { category: 'TOP', name: 'Silk Poplin Shirt', colour: 'White', imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' },
          { category: 'BOTTOM', name: 'Linen Trousers', colour: 'Sandstone', imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
          { category: 'ACCESSORY', name: 'Leather Bag', colour: 'Brown', imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      reactions: { '🔥': 2, '✨': 1 }
    };

    setFriends(prev => [newFriend, ...prev]);
    setRequests(prev => prev.filter(r => r.id !== req.id));
    showToast(`✨ Added ${req.name}! You can now twin outfits.`);
  };

  // Decline a friend request
  const handleDeclineRequest = (reqId: string) => {
    sound.playClick();
    setRequests(prev => prev.filter(r => r.id !== reqId));
    showToast('Request removed');
  };

  // Send a friend request by username (Snap-style)
  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchHandle.trim()) return;

    sound.playSuccess();
    const handleClean = searchHandle.startsWith('@') ? searchHandle : `@${searchHandle}`;
    showToast(`Friend request sent to ${handleClean}!`);
    setSearchHandle('');
  };

  // React to a friend's outfit with emoji
  const handleReact = (friendId: string, emoji: string) => {
    sound.playPop();
    try {
      confetti({
        particleCount: 20,
        spread: 40,
        origin: { y: 0.6 }
      });
    } catch {}

    setFriends(prev => prev.map(f => {
      if (f.id !== friendId) return f;
      return {
        ...f,
        reactions: {
          ...f.reactions,
          [emoji]: (f.reactions[emoji] || 0) + 1
        }
      };
    }));
  };

  // Twin Outfits (Match with selected friends)
  const handleTwinOutfits = () => {
    setIsMatching(true);
    sound.playDissolve();

    setTimeout(() => {
      setIsMatching(false);
      setTwinScore(98);
      sound.playSuccess();
      try {
        confetti({
          particleCount: 75,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#CCA166', '#E44C4E', '#F2ECDD']
        });
      } catch {}
      const targetName = selectedFriendIds.length === 1 
        ? friends.find(f => f.id === selectedFriendIds[0])?.name || 'your friend'
        : 'your squad';
      showToast(`👯 Matched looks with ${targetName}! (98% Twin Match)`);
    }, 900);
  };

  const selectedFriends = friends.filter(f => selectedFriendIds.includes(f.id));
  const isSquad = selectedFriends.length > 1;

  return (
    <div className="flex-1 min-h-0 flex flex-col relative overflow-hidden bg-[#181A31] text-[#F2ECDD]">
      {/* Top Header */}
      <div className="px-5 pt-4 pb-2 border-b border-[rgba(242,236,221,0.08)] space-y-2 shrink-0 z-20">
        <div className="flex items-center justify-between">
          <WeMilanLogo variant="header" size="sm" />

          <div className="flex items-center gap-2">
            <SoundToggle />
            <ThemeToggle />
            <button
              onClick={() => setActiveTab('requests')}
              className="relative text-xs font-mono text-[#F2ECDD] bg-[#272A4B] hover:bg-[#3E437A] px-2.5 py-1 rounded-md border border-[rgba(242,236,221,0.12)] flex items-center gap-1.5 transition-all"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#CCA166]" />
              <span>Requests</span>
              {requests.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#E44C4E] text-[#181A31] font-bold text-[9px] flex items-center justify-center">
                  {requests.length}
                </span>
              )}
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
                Social Matching &bull; Duo &amp; Squad
              </div>
              <h1 className="font-serif text-xl font-medium text-[#F2ECDD] tracking-tight">
                Twin with <em>Friends</em>
              </h1>
            </div>
          </div>

          {/* Tab Switcher: Twin / Friends / Requests */}
          <div className="flex items-center bg-[#272A4B]/80 p-0.5 rounded-full border border-[rgba(242,236,221,0.1)]">
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('twin');
              }}
              className={`px-3 py-1 rounded-full font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                activeTab === 'twin'
                  ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                  : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
              }`}
            >
              Twin
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setActiveTab('friends');
              }}
              className={`px-3 py-1 rounded-full font-mono text-[9.5px] uppercase tracking-wider transition-all ${
                activeTab === 'friends'
                  ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                  : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
              }`}
            >
              Friends ({friends.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-5 py-4 pb-28 scrollbar-none space-y-4">
        {/* Floating Toast Notification */}
        {activeToast && (
          <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#272A4B]/95 border border-[#CCA166]/40 text-[#F2ECDD] font-mono text-xs px-4 py-2 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-fadeIn">
            <Sparkles className="w-3.5 h-3.5 text-[#CCA166]" />
            <span>{activeToast}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: TWINNING STUDIO (Match looks with selected friends) */}
        {/* ========================================================= */}
        {activeTab === 'twin' && (
          <div className="space-y-4">
            {/* 1. SELECT WHICH FRIEND(S) TO TWIN WITH */}
            <div className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.12)] rounded-3xl p-4 shadow-md space-y-2.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#9C9FBE] block">
                    Step 1 &bull; Pick friends to match with
                  </span>
                  <h3 className="font-serif text-sm font-medium text-[#F2ECDD]">
                    {isSquad ? 'Squad Twinning (Group)' : 'Duo Twinning (1-on-1)'}
                  </h3>
                </div>
                <span className="font-mono text-[9px] bg-[#CCA166]/15 text-[#CCA166] border border-[#CCA166]/30 px-2 py-0.5 rounded-full font-bold">
                  {selectedFriends.length} selected
                </span>
              </div>

              {/* Friends Horizontal Selector Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {friends.map((friend) => {
                  const isSelected = selectedFriendIds.includes(friend.id);
                  return (
                    <button
                      key={friend.id}
                      onClick={() => toggleSelectFriend(friend.id)}
                      className={`shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all ${
                        isSelected
                          ? 'bg-[#CCA166] text-[#181A31] border-[#CCA166] font-bold shadow-md'
                          : 'bg-[#181A31] text-[#F2ECDD] border-[rgba(242,236,221,0.12)] hover:border-[#CCA166]/40'
                      }`}
                    >
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={friend.avatarUrl}
                          alt={friend.name}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        {isSelected && (
                          <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#E44C4E] border border-[#181A31]" />
                        )}
                      </div>
                      <span className="font-sans text-xs">{friend.name.split(' ')[0]}</span>
                    </button>
                  );
                })}

                <button
                  onClick={() => setActiveTab('requests')}
                  className="shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full border border-dashed border-[rgba(242,236,221,0.2)] text-[#CCA166] font-mono text-[10px] hover:bg-[#CCA166]/10 transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add More</span>
                </button>
              </div>
            </div>

            {/* 2. HOW YOU WANT TO MATCH (Basic, clean options) */}
            <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3 space-y-2">
              <span className="font-mono text-[9.5px] uppercase tracking-wider text-[#9C9FBE] block font-semibold">
                Step 2 &bull; How to match
              </span>

              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'colors' as const, label: 'Match Colors', desc: 'Matching palettes' },
                  { id: 'vibe' as const, label: 'Same Vibe', desc: 'Same dress code' },
                  { id: 'identical' as const, label: 'Twin Pieces', desc: 'Identical key pieces' }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => {
                      sound.playClick();
                      setMatchType(tier.id);
                    }}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      matchType === tier.id
                        ? 'bg-[#E44C4E]/20 border-[#E44C4E] text-[#F2ECDD] font-bold'
                        : 'bg-[#181A31] border-[rgba(242,236,221,0.08)] text-[#9C9FBE] hover:text-[#F2ECDD]'
                    }`}
                  >
                    <span className="block font-sans text-xs">{tier.label}</span>
                    <span className="block font-mono text-[8px] text-[#CCA166] mt-0.5">{tier.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. OUTFIT COMPARISON & TWINNING DISPLAY */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE]">
                  {isSquad ? `Squad Outfits (${selectedFriends.length + 1} People)` : 'Outfits Side by Side'}
                </span>
                <span className="font-mono text-[9px] text-[#34D399] flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Ready to match</span>
                </span>
              </div>

              {/* Your Outfit Card */}
              <div className="bg-gradient-to-b from-[#272A4B] to-[#181A31] border border-[#CCA166]/40 rounded-3xl p-4 shadow-xl space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.08)]">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#34D399]" />
                    <h4 className="font-serif text-sm font-medium text-[#F2ECDD]">
                      Your Outfit
                    </h4>
                    <span className="bg-[#CCA166]/20 text-[#CCA166] font-mono text-[8px] uppercase px-1.5 py-0.2 rounded-full font-bold">
                      You
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-[#CCA166]">
                    {userOutfit.title}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 py-1">
                  {userOutfit.items.map((item, idx) => (
                    <div key={idx} className="bg-[#181A31]/90 rounded-2xl p-2 border border-[rgba(242,236,221,0.08)] flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 mb-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-sans text-[10px] text-[#F2ECDD] font-medium truncate w-full">{item.name}</span>
                      <span className="font-mono text-[8px] text-[#CCA166] uppercase truncate w-full">{item.colour}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Friends Outfit Cards */}
              {selectedFriends.map((friend) => (
                <div
                  key={friend.id}
                  className="bg-[#272A4B]/80 border border-[rgba(242,236,221,0.12)] rounded-3xl p-4 shadow-md space-y-2"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.08)]">
                    <div className="flex items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={friend.avatarUrl}
                        alt={friend.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#CCA166]"
                      />
                      <div>
                        <h4 className="font-serif text-sm font-medium text-[#F2ECDD] leading-none">
                          {friend.name}
                        </h4>
                        <span className="font-mono text-[9px] text-[#9C9FBE]">
                          {friend.handle}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-[9px] text-[#CCA166]">
                      {friend.outfit.title}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 py-1">
                    {friend.outfit.items.map((item, idx) => (
                      <div key={idx} className="bg-[#181A31]/90 rounded-2xl p-2 border border-[rgba(242,236,221,0.08)] flex flex-col items-center text-center">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-black/40 mb-1">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <span className="font-sans text-[10px] text-[#F2ECDD] font-medium truncate w-full">{item.name}</span>
                        <span className="font-mono text-[8px] text-[#CCA166] uppercase truncate w-full">{item.colour}</span>
                      </div>
                    ))}
                  </div>

                  {/* Snap-Style Emoji Reactions Bar */}
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(242,236,221,0.08)]">
                    <span className="font-mono text-[9px] text-[#9C9FBE]">React:</span>
                    <div className="flex items-center gap-1.5">
                      {[
                        { emoji: '🔥', label: 'fire' },
                        { emoji: '👯', label: 'twin' },
                        { emoji: '❤️', label: 'love' },
                        { emoji: '👑', label: 'crown' }
                      ].map((r) => {
                        const count = friend.reactions[r.emoji] || 0;
                        return (
                          <button
                            key={r.emoji}
                            onClick={() => handleReact(friend.id, r.emoji)}
                            className="px-2 py-1 rounded-full bg-[#181A31] hover:bg-[#3E437A] border border-[rgba(242,236,221,0.12)] font-mono text-xs flex items-center gap-1 transition-transform active:scale-90"
                          >
                            <span>{r.emoji}</span>
                            {count > 0 && <span className="text-[10px] text-[#CCA166] font-bold">{count}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 4. TWIN SCORE & MATCH ACTION */}
            <div className="bg-[#272A4B] border border-[#CCA166]/40 rounded-3xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(242,236,221,0.1)]">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                    Outfit Harmony
                  </span>
                  <h3 className="font-serif text-sm font-medium text-[#F2ECDD]">
                    Twin Score
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-mono text-2xl font-bold text-[#CCA166]">
                    {twinScore}%
                  </span>
                  <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#34D399] block font-semibold">
                    Twin Match!
                  </span>
                </div>
              </div>

              {/* Simple Stylist Note (Plain English) */}
              <div className="bg-[#181A31]/90 rounded-2xl p-3 border border-[rgba(242,236,221,0.08)]">
                <p className="font-sans text-xs text-[#F2ECDD] leading-relaxed">
                  Your white linen shirt matches Clara&apos;s peach silk dress and Marco&apos;s pinstripe tailoring. Shared warm leather tones give everyone a clean, matching look.
                </p>
              </div>

              {/* Action Button: Twin Our Outfits */}
              <StarBorder
                as="button"
                onClick={handleTwinOutfits}
                disabled={isMatching}
                color="#CCA166"
                speed="4s"
                className="w-full cursor-pointer"
                backgroundColor="#E44C4E"
                textColor="#181A31"
              >
                <div className="flex items-center justify-center gap-2 py-3 px-6 text-xs font-bold font-sans">
                  <RefreshCw className={`w-4 h-4 ${isMatching ? 'animate-spin' : ''}`} />
                  <span>{isMatching ? 'MATCHING OUTFITS...' : isSquad ? '✨ TWIN SQUAD OUTFITS' : '✨ TWIN OUTFITS'}</span>
                </div>
              </StarBorder>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: FRIENDS LIST & ADD FRIEND (Just like Snapchat)     */}
        {/* ========================================================= */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            {/* Search / Add Friend by Handle */}
            <form onSubmit={handleSendRequest} className="bg-[#272A4B]/80 border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-[#9C9FBE]" />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Find or add by @username..."
                className="flex-1 bg-transparent text-xs text-[#F2ECDD] placeholder-[#9C9FBE] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#CCA166] hover:bg-[#E5B87E] text-[#181A31] font-sans font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
              >
                Add Friend
              </button>
            </form>

            {/* My Friends List */}
            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] block">
                My Friends ({friends.length})
              </span>

              <div className="space-y-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={friend.avatarUrl}
                          alt={friend.name}
                          className="w-10 h-10 rounded-full object-cover border border-[#CCA166]"
                        />
                        <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-[#181A31] ${
                          friend.status === 'online' ? 'bg-[#34D399]' : 'bg-[#9C9FBE]'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-serif text-sm font-medium text-[#F2ECDD]">
                          {friend.name}
                        </h4>
                        <span className="font-mono text-[10px] text-[#9C9FBE]">
                          {friend.handle} &bull; {friend.outfit.title}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedFriendIds([friend.id]);
                        setActiveTab('twin');
                        showToast(`👯 Selected ${friend.name} to twin!`);
                      }}
                      className="bg-[#181A31] hover:bg-[#3E437A] border border-[#CCA166]/30 text-[#CCA166] text-xs font-mono px-3 py-1.5 rounded-full transition-all"
                    >
                      Twin &rarr;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FRIEND REQUESTS (Snap-style Accept / Decline)       */}
        {/* ========================================================= */}
        {activeTab === 'requests' && (
          <div className="space-y-4">
            {/* Quick search input */}
            <form onSubmit={handleSendRequest} className="bg-[#272A4B]/80 border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[#CCA166]" />
              <input
                type="text"
                value={searchHandle}
                onChange={(e) => setSearchHandle(e.target.value)}
                placeholder="Enter @username to send request..."
                className="flex-1 bg-transparent text-xs text-[#F2ECDD] placeholder-[#9C9FBE] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#E44C4E] hover:bg-[#B93A3C] text-[#181A31] font-sans font-bold text-xs px-3 py-1.5 rounded-xl transition-all"
              >
                Send Request
              </button>
            </form>

            <div className="space-y-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] block">
                Friend Requests ({requests.length})
              </span>

              {requests.length === 0 ? (
                <div className="bg-[#272A4B]/40 rounded-2xl p-6 text-center border border-dashed border-[rgba(242,236,221,0.15)] space-y-1">
                  <Smile className="w-6 h-6 text-[#CCA166] mx-auto mb-2" />
                  <p className="font-serif text-sm text-[#F2ECDD]">No pending requests</p>
                  <p className="font-sans text-xs text-[#9C9FBE]">Add friends by handle above to twin together.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {requests.map((req) => (
                    <div
                      key={req.id}
                      className="bg-[#272A4B] border border-[#CCA166]/30 rounded-2xl p-3.5 flex items-center justify-between shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={req.avatarUrl}
                          alt={req.name}
                          className="w-11 h-11 rounded-full object-cover border border-[#CCA166]"
                        />
                        <div>
                          <h4 className="font-serif text-sm font-medium text-[#F2ECDD]">
                            {req.name}
                          </h4>
                          <span className="font-mono text-[10px] text-[#CCA166]">
                            {req.handle}
                          </span>
                          <span className="font-sans text-[10px] text-[#9C9FBE] block">
                            {req.mutualFriends} mutual friends
                          </span>
                        </div>
                      </div>

                      {/* Snap-style Accept & Decline buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          className="bg-[#34D399] hover:bg-[#2EB885] text-[#181A31] font-sans font-bold text-xs px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleDeclineRequest(req.id)}
                          className="w-8 h-8 rounded-full bg-[#181A31] text-[#9C9FBE] hover:text-[#F2ECDD] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-xs active:scale-95 transition-all"
                          title="Decline"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
