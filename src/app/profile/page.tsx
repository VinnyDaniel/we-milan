'use client';

import React, { useState, useEffect } from 'react';
import { StorageService } from '@/services/storageService';
import { WearableService } from '@/services/wearableService';
import { WardrobeItem, WearableMoodSignal, UserProfile, UserMeasurements } from '@/types/wardrobe';
import { WearableCard } from '@/components/WearableCard';
import { BottomNav } from '@/components/BottomNav';
import ProfileCard from '@/components/reactbits/ProfileCard';
import StarBorder from '@/components/reactbits/StarBorder';
import WeMilanLogo from '@/components/WeMilanLogo';
import ProfilePhotoModal from '@/components/ProfilePhotoModal';
import MeasurementsModal from '@/components/MeasurementsModal';
import EditProfileModal from '@/components/EditProfileModal';
import ThemeToggle from '@/components/ThemeToggle';
import SoundToggle from '@/components/SoundToggle';
import { 
  Bluetooth, 
  Droplets, 
  Sparkles, 
  RefreshCcw, 
  ExternalLink, 
  CheckCircle2, 
  Share2,
  Copy,
  Check,
  Instagram,
  Globe,
  MessageCircle,
  X,
  Camera,
  Ruler,
  Sliders,
  UserCheck,
  Edit3,
  Lock,
  Calendar,
  ShieldCheck,
  User as UserIcon
} from 'lucide-react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getUserProfile());
  const [wearable, setWearable] = useState<WearableMoodSignal | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [isPairing, setIsPairing] = useState(false);
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isMeasurementsModalOpen, setIsMeasurementsModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    setProfile(StorageService.getUserProfile());
    setWardrobe(StorageService.getWardrobe());
    setWearable(WearableService.getSignal());
  }, []);

  const cleanCount = wardrobe.filter(i => i.laundryStatus === 'CLEAN').length;
  const inLaundryCount = wardrobe.filter(i => i.laundryStatus === 'IN_LAUNDRY').length;
  const readyCount = wardrobe.filter(i => i.laundryStatus === 'READY_TO_WEAR').length;

  const handleSimulatePair = async () => {
    setIsPairing(true);
    const updated = await WearableService.simulatePairing();
    setWearable(updated);
    setIsPairing(false);
  };

  const handleToggleLaundry = (id: string) => {
    StorageService.toggleLaundryStatus(id);
    setWardrobe(StorageService.getWardrobe());
  };

  const handleResetDemo = () => {
    if (confirm('Reset wardrobe to original 12 curated pieces?')) {
      const demo = StorageService.resetToDemo();
      setWardrobe(demo);
    }
  };

  const handleSavePhoto = (newPhotoUrl: string) => {
    const updated = StorageService.saveUserProfile({ avatarUrl: newPhotoUrl });
    setProfile(updated);
    triggerToast('Profile portrait updated!');
  };

  const handleSaveMeasurements = (updatedMeasurements: UserMeasurements) => {
    const updated = StorageService.saveUserProfile({ measurements: updatedMeasurements });
    setProfile(updated);
    triggerToast('Sizing & fit specifications saved!');
  };

  const handleSaveProfile = (updates: Partial<UserProfile>) => {
    const updated = StorageService.saveUserProfile(updates);
    setProfile(updated);
    triggerToast('Profile updated successfully!');
  };

  const triggerToast = (msg: string) => {
    setShareToast(msg);
    setTimeout(() => setShareToast(null), 3000);
  };

  const userHandle = profile.handle || (profile.email ? profile.email.split('@')[0] : 'milanista');
  const measurements = profile.measurements || {
    topSize: 'M (EU 48)',
    bottomSize: '30W / 32L',
    shoeSize: 'EU 42.5 / US 9.5',
    height: '178 cm (5\'10")',
    fitPreference: 'Tailored',
    chest: '38 in (96 cm)',
    waist: '31 in (79 cm)',
    hips: '36 in (91 cm)',
    inseam: '32 in (81 cm)',
    shoulder: '18 in (46 cm)',
    weight: '68 kg (150 lbs)'
  };

  const buildShareDossierText = () => {
    return `✦ WE MILAN — Style Profile ✦
Member: ${profile.name} (@${userHandle})
Identity: ${profile.gender || 'Non-binary'} • Age: ${profile.age || 24} • ${profile.location || 'Milan, Italy'}
Aesthetic: ${profile.aesthetic || 'Milano Minimalist & Tactile Tailoring'}
Bio: ${profile.bio || 'Tactile tailoring, archival palettes & climate-adaptive layering.'}

📐 Sizing & Fit Specs:
• Top / Jacket: ${measurements.topSize}
• Bottom / Trousers: ${measurements.bottomSize}
• Footwear: ${measurements.shoeSize}
• Height / Weight: ${measurements.height} / ${measurements.weight || '68 kg'}
• Silhouette: ${measurements.fitPreference}
• Chest/Waist: ${measurements.chest || '38 in'} / ${measurements.waist || '31 in'}
• Shoulders / Hips: ${measurements.shoulder || '18 in'} / ${measurements.hips || '36 in'}
• Inseam: ${measurements.inseam || '32 in'}

🌿 Wardrobe: ${cleanCount} Ready Pieces (${readyCount} Curated Fits)
Explore my digital wardrobe on We Milan: https://vinnydaniel.github.io/we-milan/#u=${userHandle}`;
  };

  const handleShareDossier = async () => {
    const shareText = buildShareDossierText();
    const shareData = {
      title: `${profile.name} — We Milan Style Profile`,
      text: shareText,
      url: `https://wemilan.app/u/${userHandle}`
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        triggerToast('Profile shared successfully!');
        return;
      } catch (err) {
        // Fall back to clipboard if user dismissed or unsupported
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      triggerToast('Dossier & measurements copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(`https://wemilan.app/u/${userHandle}`);
    }
    setCopiedLink(true);
    triggerToast('Public closet URL copied!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="flex-1 flex flex-col justify-between bg-[#181A31] text-[#F2ECDD] min-h-full relative">
      {/* Toast Notification */}
      {shareToast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#CCA166] text-[#181A31] font-sans font-bold text-xs px-4 py-2 rounded-full shadow-2xl flex items-center gap-1.5 animate-fadeIn">
          <Check className="w-3.5 h-3.5 stroke-[3]" />
          <span>{shareToast}</span>
        </div>
      )}

      {/* Top Brand & Curator Header */}
      <div className="px-5 pt-4 pb-3 border-b border-[rgba(242,236,221,0.08)] flex items-center justify-between">
        <WeMilanLogo variant="header" size="sm" />

        <div className="flex items-center gap-2">
          <SoundToggle />
          <ThemeToggle />
          <button
            onClick={handleShareDossier}
            className="w-8 h-8 rounded-full bg-[#272A4B] border border-[rgba(242,236,221,0.12)] flex items-center justify-center text-[#CCA166] hover:text-[#F2ECDD] transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-none">
        {/* Eyebrow & Title */}
        <div>
          <div className="eyebrow mb-1">
            Curator Dossier
          </div>
          <h1 className="font-serif text-2xl font-medium text-[#F2ECDD] flex items-center justify-between">
            <span>{profile.name}</span>
            <span className="font-mono text-[10px] text-[#CCA166] font-normal tracking-wide">
              @{userHandle}
            </span>
          </h1>
        </div>

        {/* REACT BITS: Interactive 3D Holographic ProfileCard with Subtle Restrained Glow */}
        <div className="py-1 relative">
          <ProfileCard
            name={profile.name || 'Milanista Curator'}
            title={profile.aesthetic || 'Milano Minimalist & Tactile Tailoring'}
            handle={userHandle}
            status={wearable?.mood ? `${wearable.mood} Flow` : 'Styling Active'}
            contactText="Connect with Friends"
            avatarUrl={profile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80'}
            showUserInfo={true}
            enableTilt={true}
            enableMobileTilt={true}
            behindGlowEnabled={true}
            innerGradient="linear-gradient(145deg, rgba(228, 76, 78, 0.22) 0%, rgba(204, 161, 102, 0.16) 50%, rgba(24, 26, 49, 0.95) 100%)"
            onContactClick={() => setIsConnectModalOpen(true)}
          />

          {/* Quick Photo Change Floating Badge */}
          <button
            onClick={() => setIsPhotoModalOpen(true)}
            className="absolute bottom-4 right-4 z-20 bg-[#181A31]/90 backdrop-blur-md border border-[#CCA166]/50 text-[#CCA166] hover:text-[#F2ECDD] px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Update Photo</span>
          </button>
        </div>

        {/* Quick Profile Actions Bar */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => setIsEditProfileModalOpen(true)}
            className="py-2.5 px-2 rounded-2xl bg-[#272A4B]/80 hover:bg-[#333866] border border-[rgba(242,236,221,0.12)] text-[#F2ECDD] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
          >
            <Edit3 className="w-4 h-4 text-[#CCA166]" />
            <span className="font-serif text-[11px] font-medium leading-none">Edit Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setIsMeasurementsModalOpen(true)}
            className="py-2.5 px-2 rounded-2xl bg-[#272A4B]/80 hover:bg-[#333866] border border-[rgba(242,236,221,0.12)] text-[#F2ECDD] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
          >
            <Ruler className="w-4 h-4 text-[#E44C4E]" />
            <span className="font-serif text-[11px] font-medium leading-none">Edit Sizing</span>
          </button>

          <button
            type="button"
            onClick={() => setIsPhotoModalOpen(true)}
            className="py-2.5 px-2 rounded-2xl bg-[#272A4B]/80 hover:bg-[#333866] border border-[rgba(242,236,221,0.12)] text-[#F2ECDD] flex flex-col items-center justify-center gap-1 transition-all active:scale-95 group"
          >
            <Camera className="w-4 h-4 text-[#38BDF8]" />
            <span className="font-serif text-[11px] font-medium leading-none">Photo / Cam</span>
          </button>
        </div>

        {/* Identity, Age, Gender & Credentials Section */}
        <div className="bg-gradient-to-br from-[#272A4B]/80 to-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[rgba(242,236,221,0.08)] pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#CCA166]" />
              <h3 className="font-serif text-sm font-medium text-[#F2ECDD]">
                Persona, Age & Credentials
              </h3>
            </div>
            <button
              onClick={() => setIsEditProfileModalOpen(true)}
              className="font-mono text-[10px] text-[#CCA166] hover:underline flex items-center gap-1"
            >
              <span>Edit</span>
              <Edit3 className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-left">
            {/* Age */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Age
              </span>
              <span className="font-serif text-sm font-semibold text-[#F2ECDD] mt-0.5 block truncate">
                {profile.age ? `${profile.age} years` : '24 years'}
              </span>
            </div>

            {/* Gender Identity */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Gender Identity
              </span>
              <span className="font-serif text-sm font-semibold text-[#E44C4E] mt-0.5 block truncate">
                {profile.gender || 'Non-binary'}
              </span>
            </div>

            {/* Location */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Fashion Capital
              </span>
              <span className="font-mono text-xs text-[#F2ECDD] mt-0.5 block truncate">
                {profile.location || 'Milan, Italy'}
              </span>
            </div>

            {/* Password */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)] flex items-center justify-between">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                  Password
                </span>
                <span className="font-mono text-xs text-[#34D399] mt-0.5 block">
                  •••••••• (Active)
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsEditProfileModalOpen(true)}
                className="w-7 h-7 rounded-xl bg-[#272A4B] text-[#CCA166] flex items-center justify-center hover:text-[#F2ECDD] transition-all"
                title="Change Password"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Sizing & Measurements Dossier Section */}
        <div className="bg-gradient-to-br from-[#272A4B]/80 to-[#181A31] border border-[rgba(242,236,221,0.14)] rounded-3xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-[rgba(242,236,221,0.08)] pb-2.5">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#CCA166]" />
              <h3 className="font-serif text-sm font-medium text-[#F2ECDD]">
                Sizing & Fit Profile
              </h3>
            </div>
            <button
              onClick={() => setIsMeasurementsModalOpen(true)}
              className="font-mono text-[10px] text-[#CCA166] hover:underline flex items-center gap-1"
            >
              <span>Modify</span>
              <Sliders className="w-3 h-3" />
            </button>
          </div>

          {/* Measurements Grid */}
          <div className="grid grid-cols-2 gap-2 text-left">
            {/* Top Size */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Top / Jacket
              </span>
              <span className="font-serif text-sm font-semibold text-[#F2ECDD] mt-0.5 block truncate">
                {measurements.topSize}
              </span>
            </div>

            {/* Bottom Size */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Bottom / Trousers
              </span>
              <span className="font-serif text-sm font-semibold text-[#F2ECDD] mt-0.5 block truncate">
                {measurements.bottomSize}
              </span>
            </div>

            {/* Footwear */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Footwear
              </span>
              <span className="font-serif text-sm font-semibold text-[#CCA166] mt-0.5 block truncate">
                {measurements.shoeSize}
              </span>
            </div>

            {/* Silhouette Preference */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Silhouette Fit
              </span>
              <span className="font-serif text-sm font-semibold text-[#E44C4E] mt-0.5 block truncate">
                {measurements.fitPreference}
              </span>
            </div>

            {/* Height & Weight */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Height & Weight
              </span>
              <span className="font-mono text-xs text-[#F2ECDD] mt-0.5 block truncate">
                {measurements.height} • {measurements.weight || '68 kg'}
              </span>
            </div>

            {/* Chest & Waist */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Chest & Waist
              </span>
              <span className="font-mono text-xs text-[#F2ECDD] mt-0.5 block truncate">
                {measurements.chest?.split(' ')[0] || '38 in'} / {measurements.waist?.split(' ')[0] || '31 in'}
              </span>
            </div>

            {/* Shoulders & Inseam */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Shoulders & Inseam
              </span>
              <span className="font-mono text-xs text-[#F2ECDD] mt-0.5 block truncate">
                {measurements.shoulder || '18 in'} / {measurements.inseam || '32 in'}
              </span>
            </div>

            {/* Hips */}
            <div className="bg-[#181A31]/80 rounded-2xl p-2.5 border border-[rgba(242,236,221,0.08)]">
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] block">
                Hips
              </span>
              <span className="font-mono text-xs text-[#F2ECDD] mt-0.5 block truncate">
                {measurements.hips || '36 in'}
              </span>
            </div>
          </div>

          {/* Share Dossier Button */}
          <StarBorder
            as="button"
            onClick={handleShareDossier}
            color="#CCA166"
            speed="4s"
            backgroundColor="#CCA166"
            textColor="#181A31"
            className="w-full !py-2.5 cursor-pointer font-sans font-bold text-xs"
          >
            <div className="flex items-center justify-center gap-2">
              <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Share Style & Sizing Profile</span>
            </div>
          </StarBorder>
        </div>

        {/* Wearable Sensor Hub */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#CCA166] font-semibold">
              Smart Wearable & Mood Sync
            </span>
            <button
              onClick={handleSimulatePair}
              disabled={isPairing}
              className="font-mono text-[10px] text-[#CCA166] hover:underline flex items-center gap-1"
            >
              <Bluetooth className="w-3 h-3 text-[#38BDF8]" />
              <span>{isPairing ? 'Scanning...' : 'Pair BLE'}</span>
            </button>
          </div>

          {wearable && (
            <WearableCard
              wearable={wearable}
              allowMoodChange={true}
              onWearableUpdate={setWearable}
              onSelectMood={(m) => {
                WearableService.setMood(m);
                setWearable(WearableService.getSignal());
              }}
            />
          )}
        </div>

        {/* Digital Wardrobe Statistics */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#CCA166] font-semibold">
            Wardrobe Insights
          </span>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 text-center">
              <span className="font-serif text-2xl font-bold text-[#F2ECDD] block">
                {cleanCount}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#34D399]">
                Clean
              </span>
            </div>

            <div className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 text-center">
              <span className="font-serif text-2xl font-bold text-[#E44C4E] block">
                {inLaundryCount}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#E44C4E]">
                In Laundry
              </span>
            </div>

            <div className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.12)] rounded-2xl p-3 text-center">
              <span className="font-serif text-2xl font-bold text-[#CCA166] block">
                {readyCount}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166]">
                Ready to Wear
              </span>
            </div>
          </div>
        </div>

        {/* Active Laundry Basket List */}
        {inLaundryCount > 0 && (
          <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.12)] rounded-2xl p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#E44C4E]">
                <Droplets className="w-4 h-4" />
                <span className="font-serif text-sm font-medium text-[#F2ECDD]">
                  Currently in Laundry
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#9C9FBE]">
                Tap to mark clean
              </span>
            </div>

            <div className="space-y-1.5">
              {wardrobe
                .filter(i => i.laundryStatus === 'IN_LAUNDRY')
                .map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleToggleLaundry(item.id)}
                    className="flex items-center justify-between p-2 rounded-xl bg-[#181A31] border border-[rgba(242,236,221,0.08)] cursor-pointer hover:border-[#34D399] transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-10 rounded-lg overflow-hidden bg-[#272A4B]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-serif text-xs font-medium text-[#F2ECDD]">
                          {item.name}
                        </h5>
                        <p className="font-mono text-[9px] text-[#9C9FBE]">
                          {item.fabric}
                        </p>
                      </div>
                    </div>

                    <button className="text-[10px] font-mono text-[#34D399] hover:underline flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Wash Complete</span>
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Atelier Atmosphere & Theme Setting */}
        <div className="bg-[#272A4B]/70 border border-[rgba(242,236,221,0.12)] rounded-3xl p-4 flex items-center justify-between">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-wider text-[#CCA166] block">
              App Theme
            </span>
            <span className="font-serif text-sm font-medium text-[#F2ECDD] block mt-0.5">
              App Appearance
            </span>
            <span className="font-sans text-[11px] text-[#9C9FBE]">
              Switch between Notte (Dark) and Giorno (Light)
            </span>
          </div>

          <ThemeToggle variant="pill" />
        </div>

        {/* Demo Management & About We Milan */}
        <div className="pt-2 space-y-2.5">
          <StarBorder
            as="button"
            onClick={handleResetDemo}
            color="#CCA166"
            speed="5s"
            className="w-full cursor-pointer"
            backgroundColor="#272A4B"
            textColor="#F2ECDD"
          >
            <div className="flex items-center justify-center gap-2 py-3 px-4 font-sans font-medium text-xs">
              <RefreshCcw className="w-3.5 h-3.5 text-[#CCA166]" />
              <span>Reset Demo Wardrobe (12 Pieces)</span>
            </div>
          </StarBorder>

          <a
            href="https://vinnydaniel.github.io/webby/#join"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#181A31] hover:bg-[#272A4B]/80 border border-[rgba(242,236,221,0.12)] text-[#CCA166] font-sans text-xs py-3 rounded-2xl flex items-center justify-center gap-2 transition-all block text-center"
          >
            <div className="flex items-center justify-center gap-2">
              <span>Visit We Milan Showcase</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </a>
        </div>
      </div>

      {/* Profile Photo Modal (Live Camera or Upload) */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhoto={profile.avatarUrl || ''}
        onPhotoSaved={handleSavePhoto}
      />

      {/* Sizing & Measurements Modal */}
      <MeasurementsModal
        isOpen={isMeasurementsModalOpen}
        onClose={() => setIsMeasurementsModalOpen(false)}
        measurements={measurements}
        onSave={handleSaveMeasurements}
      />

      {/* Edit Profile, Age, Gender & Password Modal */}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Connect with Friends on Different Platforms Modal */}
      {isConnectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-[380px] bg-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl p-5 shadow-2xl relative text-[#F2ECDD]">
            <button
              onClick={() => setIsConnectModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center border border-[rgba(242,236,221,0.1)] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#CCA166] font-semibold block mb-1">
                WE MILAN SOCIAL SYNC
              </span>
              <h2 className="font-serif text-xl font-medium text-[#F2ECDD]">
                Connect with Friends
              </h2>
              <p className="font-sans text-xs text-[#9C9FBE] mt-1">
                Share your digital closet, sizing specs, trade outfit critiques, and discover what your friends are wearing.
              </p>
            </div>

            {/* Direct Dossier Share Button */}
            <div className="mb-3">
              <StarBorder
                as="button"
                onClick={handleShareDossier}
                color="#CCA166"
                speed="3.5s"
                backgroundColor="#CCA166"
                textColor="#181A31"
                className="w-full !py-2.5 font-sans font-bold text-xs"
              >
                <span className="flex items-center justify-center gap-2">
                  <Share2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Share Complete Sizing & Fit Dossier</span>
                </span>
              </StarBorder>
            </div>

            {/* Social Platform Links */}
            <div className="space-y-2 my-3">
              <a
                href={`https://instagram.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#272A4B] to-[#382D4B] border border-[rgba(242,236,221,0.12)] hover:border-[#E44C4E] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E44C4E]/20 text-[#E44C4E] flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-medium text-[#F2ECDD] group-hover:text-[#CCA166] transition-colors">
                      Instagram Stories
                    </div>
                    <div className="font-mono text-[9px] text-[#9C9FBE]">
                      Share fit check & outfit tags
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#9C9FBE] group-hover:text-[#F2ECDD]" />
              </a>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(buildShareDossierText())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#272A4B] to-[#1E3836] border border-[rgba(242,236,221,0.12)] hover:border-[#34D399] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#34D399]/20 text-[#34D399] flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-medium text-[#F2ECDD] group-hover:text-[#34D399] transition-colors">
                      WhatsApp / Chat
                    </div>
                    <div className="font-mono text-[9px] text-[#9C9FBE]">
                      Send closet link & measurements
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#9C9FBE] group-hover:text-[#F2ECDD]" />
              </a>

              <a
                href={`https://pinterest.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-[#272A4B] to-[#3B2529] border border-[rgba(242,236,221,0.12)] hover:border-[#E44C4E] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E44C4E]/20 text-[#E44C4E] flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-serif text-sm font-medium text-[#F2ECDD] group-hover:text-[#E44C4E] transition-colors">
                      Pinterest / Moodboards
                    </div>
                    <div className="font-mono text-[9px] text-[#9C9FBE]">
                      Sync curated aesthetic boards
                    </div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-[#9C9FBE] group-hover:text-[#F2ECDD]" />
              </a>
            </div>

            {/* Quick Share Link Box */}
            <div className="bg-[#272A4B]/80 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3 flex items-center justify-between mt-3">
              <div className="min-w-0 pr-2">
                <span className="font-mono text-[8.5px] uppercase tracking-wider text-[#CCA166] block">
                  Your Public Closet URL
                </span>
                <p className="font-mono text-xs text-[#F2ECDD] truncate mt-0.5">
                  wemilan.app/u/{userHandle}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCopyLink}
                className="bg-[#CCA166] hover:bg-[#E2C78C] text-[#181A31] font-sans font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shrink-0 transition-all active:scale-95"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
