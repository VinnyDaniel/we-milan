export type GarmentCategory = 
  | 'ALL'
  | 'TOPS'
  | 'BOTTOMS'
  | 'DRESSES'
  | 'OUTERWEAR'
  | 'SHOES'
  | 'ACCESSORIES';

export type LaundryStatus = 'CLEAN' | 'IN_LAUNDRY' | 'READY_TO_WEAR';

export type OccasionType = 
  | 'College' 
  | 'Work' 
  | 'Date' 
  | 'Party' 
  | 'Travel' 
  | 'Casual' 
  | 'Evening' 
  | 'Formal'
  | 'Custom';

export type VibeType = 
  | 'Minimal' 
  | 'Elegant' 
  | 'Street' 
  | 'Comfy' 
  | 'Bold' 
  | 'Effortless';

export type MoodType = 
  | 'Calm' 
  | 'Energetic' 
  | 'Low-key' 
  | 'Confident' 
  | 'Cozy';

export interface WardrobeItem {
  id: string;
  name: string;
  category: GarmentCategory;
  colour: string;
  fabric: string;
  style: string;
  occasions: string[];
  seasons: string[];
  imageUrl: string;
  laundryStatus: LaundryStatus;
  createdAt: string;
  notes?: string;
}

export interface WeatherInfo {
  temp: number;
  condition: string;
  rainChance: number;
  isRainSafe: boolean;
  location: string;
  humidity: number;
  windSpeed: string;
  summary: string;
  advice: string;
}

export interface WearableMoodSignal {
  status: 'connected' | 'syncing' | 'disconnected';
  mood: MoodType;
  confidence: number; // e.g. 72%
  heartRate: number; // e.g. 68 bpm
  deviceModel: string;
  lastSync: string;
}

export interface AffiliateItem {
  id: string;
  name: string;
  designer: string;
  category: GarmentCategory;
  price: string;
  imageUrl: string;
  productUrl: string;
  matchReason: string;
}

export interface OutfitRecommendation {
  id: string;
  title: string;
  top?: WardrobeItem;
  bottom?: WardrobeItem;
  dress?: WardrobeItem;
  shoes?: WardrobeItem;
  outerwear?: WardrobeItem;
  accessory?: WardrobeItem;
  whyReasons: string[];
  weatherAlert?: string;
  isRainSafe: boolean;
  missingItems?: {
    category: GarmentCategory;
    reason: string;
    affiliatePicks: AffiliateItem[];
  }[];
  weatherSnapshot?: {
    temp: number;
    rainChance: number;
    summary: string;
  };
  moodSnapshot?: {
    mood: MoodType;
    confidence: number;
    heartRate: number;
  };
  createdAt: string;
}

export interface StylingRequest {
  anchorItem?: WardrobeItem;
  occasion: OccasionType;
  vibe: VibeType;
  mood: MoodType;
  notes?: string;
}

export interface UserMeasurements {
  topSize: string;
  bottomSize: string;
  shoeSize: string;
  height: string;
  fitPreference: 'Tailored' | 'Relaxed' | 'Oversized' | 'Slim' | 'Fluid';
  chest?: string;
  waist?: string;
  hips?: string;
  inseam?: string;
  shoulder?: string;
  weight?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  password?: string;
  isGuest: boolean;
  avatarUrl?: string;
  handle?: string;
  bio?: string;
  aesthetic?: string;
  gender?: string;
  customGender?: string;
  age?: number | string;
  location?: string;
  measurements?: UserMeasurements;
}

