import { WardrobeItem, GarmentCategory, LaundryStatus, UserProfile, UserMeasurements } from '@/types/wardrobe';

const STORAGE_KEY = 'we_milan_wardrobe_v1';
const USER_KEY = 'we_milan_user_v2';


export const INITIAL_DEMO_WARDROBE: WardrobeItem[] = [
  {
    id: 'wm-01',
    name: 'White Linen Shirt',
    category: 'TOPS',
    colour: 'White',
    fabric: 'Linen',
    style: 'Minimal / Casual',
    occasions: ['College', 'Travel', 'Casual', 'Work'],
    seasons: ['Summer', 'Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-20T10:00:00Z',
    notes: 'Breathable European linen with relaxed collar.'
  },
  {
    id: 'wm-02',
    name: 'Black Crop Top',
    category: 'TOPS',
    colour: 'Black',
    fabric: 'Ribbed Cotton',
    style: 'Modern / Street',
    occasions: ['Party', 'Casual', 'Date'],
    seasons: ['Summer', 'All season'],
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'READY_TO_WEAR',
    createdAt: '2026-09-21T11:00:00Z',
    notes: 'Sleek crew neckline with slight stretch.'
  },
  {
    id: 'wm-03',
    name: 'Blue Straight Jeans',
    category: 'BOTTOMS',
    colour: 'Classic Blue',
    fabric: 'Rigid Denim',
    style: 'Effortless / Casual',
    occasions: ['College', 'Casual', 'Travel', 'Date'],
    seasons: ['All season'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-21T12:00:00Z',
    notes: 'High-rise silhouette with straight-leg crop.'
  },
  {
    id: 'wm-04',
    name: 'Black Pleated Skirt',
    category: 'BOTTOMS',
    colour: 'Black',
    fabric: 'Polyester Blend',
    style: 'Elegant / Minimal',
    occasions: ['Party', 'Date', 'Evening', 'Work'],
    seasons: ['All season'],
    imageUrl: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-22T09:30:00Z',
    notes: 'Accordion pleats with subtle sheen.'
  },
  {
    id: 'wm-05',
    name: 'Beige Trousers',
    category: 'BOTTOMS',
    colour: 'Beige',
    fabric: 'Cotton Twill',
    style: 'Tailored / Minimal',
    occasions: ['Work', 'College', 'Casual', 'Travel'],
    seasons: ['Spring', 'Summer', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-22T14:15:00Z',
    notes: 'Pleated front relaxed fit tailored trousers.'
  },
  {
    id: 'wm-06',
    name: 'White Sneakers',
    category: 'SHOES',
    colour: 'Chalk White',
    fabric: 'Leather',
    style: 'Minimal / Street',
    occasions: ['College', 'Travel', 'Casual', 'Work'],
    seasons: ['All season'],
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'READY_TO_WEAR',
    createdAt: '2026-09-22T15:00:00Z',
    notes: 'Clean low-top tennis silhouette with cushioned insole.'
  },
  {
    id: 'wm-07',
    name: 'Black Blazer',
    category: 'OUTERWEAR',
    colour: 'Matte Black',
    fabric: 'Wool Blend',
    style: 'Tailored / Elegant',
    occasions: ['Work', 'Evening', 'Formal', 'Date'],
    seasons: ['Autumn', 'Winter', 'Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-23T08:00:00Z',
    notes: 'Structured shoulder line with notched lapels.'
  },
  {
    id: 'wm-08',
    name: 'Denim Jacket',
    category: 'OUTERWEAR',
    colour: 'Washed Indigo',
    fabric: 'Cotton Denim',
    style: 'Street / Casual',
    occasions: ['College', 'Travel', 'Casual', 'Party'],
    seasons: ['Spring', 'Autumn'],
    imageUrl: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-23T11:20:00Z',
    notes: 'Oversized boxy cut with brass hardware.'
  },
  {
    id: 'wm-09',
    name: 'Floral Dress',
    category: 'DRESSES',
    colour: 'Ivory / Floral',
    fabric: 'Chiffon',
    style: 'Romantic / Effortless',
    occasions: ['Date', 'Party', 'Travel', 'Casual'],
    seasons: ['Spring', 'Summer'],
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-24T10:00:00Z',
    notes: 'A-line midi dress with delicate vintage print.'
  },
  {
    id: 'wm-10',
    name: 'Beige Cardigan',
    category: 'OUTERWEAR',
    colour: 'Oatmeal Beige',
    fabric: 'Cashmere Knit',
    style: 'Cozy / Minimal',
    occasions: ['College', 'Work', 'Travel', 'Casual'],
    seasons: ['Autumn', 'Winter', 'Spring'],
    imageUrl: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'IN_LAUNDRY',
    createdAt: '2026-09-24T16:45:00Z',
    notes: 'Soft ribbed knit cardigan with tortoiseshell buttons.'
  },
  {
    id: 'wm-11',
    name: 'Black Heels',
    category: 'SHOES',
    colour: 'Patent Black',
    fabric: 'Leather',
    style: 'Elegant / Formal',
    occasions: ['Party', 'Evening', 'Date', 'Formal'],
    seasons: ['All season'],
    imageUrl: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-25T09:10:00Z',
    notes: 'Pointed toe 75mm architectural stiletto pump.'
  },
  {
    id: 'wm-12',
    name: 'White T-Shirt',
    category: 'TOPS',
    colour: 'Optic White',
    fabric: 'Organic Cotton',
    style: 'Essential / Minimal',
    occasions: ['College', 'Casual', 'Travel', 'Work'],
    seasons: ['All season'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    laundryStatus: 'CLEAN',
    createdAt: '2026-09-25T13:30:00Z',
    notes: 'Heavyweight organic jersey crewneck tee.'
  }
];

export class StorageService {
  private static isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  public static getWardrobe(): WardrobeItem[] {
    if (!this.isBrowser()) return INITIAL_DEMO_WARDROBE;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_WARDROBE));
        return INITIAL_DEMO_WARDROBE;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_WARDROBE));
        return INITIAL_DEMO_WARDROBE;
      }
      return parsed;
    } catch (e) {
      console.warn('Failed to parse wardrobe from localStorage, fallback to demo data', e);
      return INITIAL_DEMO_WARDROBE;
    }
  }

  public static saveWardrobe(items: WardrobeItem[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving wardrobe items to localStorage', e);
    }
  }

  public static addItem(item: Omit<WardrobeItem, 'id' | 'createdAt'>): WardrobeItem {
    const current = this.getWardrobe();
    const newItem: WardrobeItem = {
      ...item,
      id: `wm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    const updated = [newItem, ...current];
    this.saveWardrobe(updated);
    return newItem;
  }

  public static updateItem(id: string, updates: Partial<WardrobeItem>): WardrobeItem | null {
    const current = this.getWardrobe();
    const index = current.findIndex(i => i.id === id);
    if (index === -1) return null;

    current[index] = { ...current[index], ...updates };
    this.saveWardrobe(current);
    return current[index];
  }

  public static toggleLaundryStatus(id: string): WardrobeItem | null {
    const current = this.getWardrobe();
    const item = current.find(i => i.id === id);
    if (!item) return null;

    const nextStatus: Record<LaundryStatus, LaundryStatus> = {
      CLEAN: 'IN_LAUNDRY',
      IN_LAUNDRY: 'READY_TO_WEAR',
      READY_TO_WEAR: 'CLEAN'
    };

    return this.updateItem(id, { laundryStatus: nextStatus[item.laundryStatus] });
  }

  public static deleteItem(id: string): boolean {
    const current = this.getWardrobe();
    const filtered = current.filter(i => i.id !== id);
    if (filtered.length === current.length) return false;
    this.saveWardrobe(filtered);
    return true;
  }

  public static resetToDemo(): WardrobeItem[] {
    if (!this.isBrowser()) return INITIAL_DEMO_WARDROBE;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_WARDROBE));
    return INITIAL_DEMO_WARDROBE;
  }

  public static getUserProfile(): UserProfile {
    const defaultProfile: UserProfile = {
      name: 'Milanista Curator',
      email: 'curator@wemilan.fashion',
      password: 'milan2026',
      handle: 'milanista',
      isGuest: false,
      bio: 'Tactile tailoring, archival palettes & climate-adaptive layering.',
      aesthetic: 'Milano Minimalist',
      gender: 'Non-binary',
      customGender: '',
      age: 24,
      location: 'Milan, Italy',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80',
      measurements: {
        topSize: 'M (EU 48 / US 38)',
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
      }
    };

    if (!this.isBrowser()) return defaultProfile;

    try {
      const stored = localStorage.getItem(USER_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultProfile,
          ...parsed,
          measurements: {
            ...defaultProfile.measurements,
            ...(parsed.measurements || {})
          }
        };
      }
    } catch {}

    localStorage.setItem(USER_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  public static saveUserProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getUserProfile();
    const updated: UserProfile = {
      ...current,
      ...updates,
      measurements: updates.measurements
        ? { ...(current.measurements || {}), ...updates.measurements } as UserMeasurements
        : current.measurements
    };

    if (this.isBrowser()) {
      localStorage.setItem(USER_KEY, JSON.stringify(updated));
    }
    return updated;
  }

  public static getSessionUser(): UserProfile {
    return this.getUserProfile();
  }

  public static setSessionUser(user: Partial<UserProfile>): void {
    this.saveUserProfile(user);
  }
}

