'use client';

import React, { useState } from 'react';
import { 
  X, 
  Check, 
  User, 
  Lock, 
  Calendar, 
  Sparkles, 
  MapPin, 
  Eye, 
  EyeOff, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { UserProfile } from '@/types/wardrobe';
import StarBorder from '@/components/reactbits/StarBorder';
import sound from '@/services/soundService';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
}

export const GENDER_OPTIONS = [
  'Woman',
  'Man',
  'Non-binary',
  'Genderqueer',
  'Genderfluid',
  'Agender',
  'Transgender Woman',
  'Transgender Man',
  'Two-Spirit',
  'Bigender',
  'Pangender',
  'Androgynous',
  'Self-described',
  'Prefer not to say'
];

export const AESTHETIC_PRESETS = [
  'Milano Minimalist',
  'Quiet Luxury',
  'Old Money Tailoring',
  'Avant-Garde Street',
  'Effortless Chic',
  'Dark Academia',
  'Y2K High-Fashion',
  'Normcore Archival'
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'identity' | 'security'>('profile');

  // Profile Identity state
  const [name, setName] = useState(profile.name || '');
  const [handle, setHandle] = useState(profile.handle || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [aesthetic, setAesthetic] = useState(profile.aesthetic || 'Milano Minimalist');
  const [location, setLocation] = useState(profile.location || 'Milan, Italy');

  // Age & Gender state
  const [age, setAge] = useState<string | number>(profile.age !== undefined ? profile.age : 24);
  const [gender, setGender] = useState<string>(profile.gender || 'Non-binary');
  const [customGender, setCustomGender] = useState<string>(profile.customGender || '');

  // Password state
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if password change was attempted
    if (newPwd || confirmPwd) {
      if (newPwd.length < 6) {
        setPwdError('New password must be at least 6 characters.');
        setActiveTab('security');
        return;
      }
      if (newPwd !== confirmPwd) {
        setPwdError('New passwords do not match.');
        setActiveTab('security');
        return;
      }
    }

    const resolvedGender = gender === 'Self-described' && customGender.trim() ? customGender.trim() : gender;

    const updates: Partial<UserProfile> = {
      name: name.trim() || 'Milanista Curator',
      handle: handle.trim().replace(/^@/, '') || 'milanista',
      bio: bio.trim(),
      aesthetic,
      location: location.trim(),
      age: age ? Number(age) : undefined,
      gender: resolvedGender,
      customGender: gender === 'Self-described' ? customGender.trim() : undefined,
    };

    if (newPwd && newPwd === confirmPwd) {
      updates.password = newPwd;
    }

    sound.playSuccess();
    onSave(updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#181A31] border border-[rgba(242,236,221,0.2)] rounded-3xl max-w-md w-full p-5 text-[#F2ECDD] relative shadow-2xl max-h-[92vh] overflow-y-auto scrollbar-none flex flex-col modal-enter">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(242,236,221,0.1)] shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#272A4B] border border-[rgba(242,236,221,0.15)] flex items-center justify-center text-[#CCA166]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-medium text-[#F2ECDD] leading-none">
                Edit Profile
              </h3>
              <p className="font-mono text-[9px] uppercase tracking-wider text-[#9C9FBE] mt-1">
                Profile, Identity & Password
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#272A4B] text-[#9C9FBE] hover:text-[#F2ECDD] flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-[#272A4B] p-1 rounded-2xl border border-[rgba(242,236,221,0.12)] mt-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
            }`}
          >
            <User className="w-3 h-3" />
            <span>Profile</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`flex-1 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'identity'
                ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>Age & Gender</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-1.5 rounded-xl font-mono text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'security'
                ? 'bg-[#CCA166] text-[#181A31] font-bold shadow-sm'
                : 'text-[#9C9FBE] hover:text-[#F2ECDD]'
            }`}
          >
            <Lock className="w-3 h-3" />
            <span>Password</span>
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="space-y-4 py-3 flex-1">
          {/* TAB 1: BASIC PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Milanista"
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-sans focus:outline-none focus:border-[#CCA166]"
                  required
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  Username Handle
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 font-mono text-xs text-[#9C9FBE]">@</span>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, ''))}
                    placeholder="handle"
                    className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl pl-7 pr-3 py-2 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  Location / City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 w-3.5 h-3.5 text-[#9C9FBE]" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Milan, Italy"
                    className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl pl-8 pr-3 py-2 text-xs text-[#F2ECDD] font-sans focus:outline-none focus:border-[#CCA166]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  Style Aesthetic
                </label>
                <select
                  value={aesthetic}
                  onChange={(e) => setAesthetic(e.target.value)}
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-sans focus:outline-none focus:border-[#CCA166]"
                >
                  {AESTHETIC_PRESETS.map((item) => (
                    <option key={item} value={item} className="bg-[#181A31]">
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={2}
                  placeholder="Tactile tailoring, archival palettes & climate-adaptive layering..."
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-sans focus:outline-none focus:border-[#CCA166] resize-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: AGE & INCLUSIVE GENDER SELECTOR */}
          {activeTab === 'identity' && (
            <div className="space-y-4 animate-fadeIn">
              {/* Age Section */}
              <div className="bg-[#272A4B]/60 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[#CCA166]">
                    <Calendar className="w-3.5 h-3.5" />
                    <label className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#CCA166]">
                      Curator Age
                    </label>
                  </div>
                  <span className="font-serif text-sm font-semibold text-[#F2ECDD]">
                    {age ? `${age} years` : 'Unspecified'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={12}
                    max={120}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 24"
                    className="w-28 bg-[#181A31] border border-[rgba(242,236,221,0.18)] rounded-xl px-3 py-2 text-center text-sm font-mono text-[#F2ECDD] focus:outline-none focus:border-[#CCA166]"
                  />
                  <div className="flex-1 flex flex-wrap gap-1.5">
                    {[20, 24, 28, 32, 40].map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => setAge(preset)}
                        className={`px-2.5 py-1 rounded-lg font-mono text-[10px] border transition-all ${
                          Number(age) === preset
                            ? 'bg-[#CCA166] text-[#181A31] font-bold border-[#CCA166]'
                            : 'bg-[#181A31] text-[#9C9FBE] border-[rgba(242,236,221,0.1)] hover:text-[#F2ECDD]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                <p className="font-sans text-[10px] text-[#9C9FBE]">
                  Helps our AI calibrate age-appropriate cut proportions and occasion styling.
                </p>
              </div>

              {/* Gender Section with Extensive Options */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] font-semibold">
                    Gender Identity
                  </label>
                  <span className="font-mono text-[10px] text-[#E44C4E] font-medium">
                    {gender}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 scrollbar-none">
                  {GENDER_OPTIONS.map((g) => {
                    const isSelected = gender === g;
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => setGender(g)}
                        className={`py-2 px-2.5 rounded-xl font-sans text-xs text-left border transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#E44C4E] text-[#181A31] font-bold border-[#E44C4E] shadow-sm'
                            : 'bg-[#272A4B]/70 text-[#F2ECDD] border-[rgba(242,236,221,0.12)] hover:border-[#E44C4E]'
                        }`}
                      >
                        <span className="truncate">{g}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Gender Input if Self-described selected */}
                {gender === 'Self-described' && (
                  <div className="pt-2 animate-fadeIn">
                    <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1">
                      Describe your gender identity
                    </label>
                    <input
                      type="text"
                      value={customGender}
                      onChange={(e) => setCustomGender(e.target.value)}
                      placeholder="e.g. Demigirl, Two-Spirit, Genderfluid..."
                      className="w-full bg-[#272A4B] border border-[#E44C4E]/60 rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-sans focus:outline-none focus:border-[#E44C4E]"
                      autoFocus
                    />
                  </div>
                )}

                <p className="font-sans text-[10px] text-[#9C9FBE] pt-1">
                  We Milan champions all gender expressions. This customizes tailoring recommendations and size translations.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PASSWORD MANAGEMENT */}
          {activeTab === 'security' && (
            <div className="space-y-3.5 animate-fadeIn">
              <div className="bg-[#272A4B]/40 border border-[rgba(242,236,221,0.1)] rounded-2xl p-3 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#34D399] shrink-0" />
                <div>
                  <h4 className="font-serif text-xs font-semibold text-[#F2ECDD]">
                    Account Security & Credentials
                  </h4>
                  <p className="font-sans text-[10px] text-[#9C9FBE]">
                    Update your password for synchronizing your wardrobe across devices.
                  </p>
                </div>
              </div>

              {pwdError && (
                <div className="bg-[#E44C4E]/15 border border-[#E44C4E]/50 rounded-xl p-2.5 flex items-center gap-2 text-[#E44C4E] text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pwdError}</span>
                </div>
              )}

              {pwdSuccess && (
                <div className="bg-[#34D399]/15 border border-[#34D399]/50 rounded-xl p-2.5 flex items-center gap-2 text-[#34D399] text-xs">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{pwdSuccess}</span>
                </div>
              )}

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9C9FBE] mb-1 font-semibold">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPwd ? 'text' : 'password'}
                    value={newPwd}
                    onChange={(e) => {
                      setNewPwd(e.target.value);
                      setPwdError(null);
                    }}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl pr-10 pl-3 py-2 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-2 text-[#9C9FBE] hover:text-[#F2ECDD]"
                  >
                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase tracking-wider text-[#CCA166] mb-1 font-semibold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPwd}
                  onChange={(e) => {
                    setConfirmPwd(e.target.value);
                    setPwdError(null);
                  }}
                  placeholder="Confirm new password"
                  className="w-full bg-[#272A4B] border border-[rgba(242,236,221,0.15)] rounded-xl px-3 py-2 text-xs text-[#F2ECDD] font-mono focus:outline-none focus:border-[#CCA166]"
                />
              </div>

              <div className="text-[10px] font-mono text-[#9C9FBE]">
                Current status: <span className="text-[#34D399]">Protected</span>
              </div>
            </div>
          )}

          {/* Action Footer Buttons */}
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
              type="submit"
              color="#CCA166"
              speed="3.5s"
              backgroundColor="#CCA166"
              textColor="#181A31"
              className="flex-1 !py-2.5 font-sans font-bold text-xs cursor-pointer"
            >
              <span className="flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Save Profile</span>
              </span>
            </StarBorder>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
