export interface Crop {
  id: string;
  name: string;
  datePlanted: string;
  acreage: number;
  expenses: number;
  notes: string;
  confirmed: boolean;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'crop_tracker_data';

export const storage = {
  getCrops(): Crop[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading crops from localStorage:', error);
      return [];
    }
  },

  saveCrops(crops: Crop[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(crops));
    } catch (error) {
      console.error('Error saving crops to localStorage:', error);
    }
  },

  addCrop(crop: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>): Crop {
    const crops = this.getCrops();
    const newCrop: Crop = {
      ...crop,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    crops.push(newCrop);
    this.saveCrops(crops);
    return newCrop;
  },

  updateCrop(id: string, updates: Partial<Crop>): Crop | null {
    const crops = this.getCrops();
    const index = crops.findIndex(crop => crop.id === id);
    if (index === -1) return null;

    crops[index] = {
      ...crops[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveCrops(crops);
    return crops[index];
  },

  deleteCrop(id: string): boolean {
    const crops = this.getCrops();
    const filtered = crops.filter(crop => crop.id !== id);
    if (filtered.length === crops.length) return false;
    
    this.saveCrops(filtered);
    return true;
  },

  clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  },

  getTotalStats() {
    const crops = this.getCrops();
    return {
      totalCrops: crops.length,
      totalAcreage: crops.reduce((sum, crop) => sum + crop.acreage, 0),
      totalExpenses: crops.reduce((sum, crop) => sum + crop.expenses, 0),
      confirmedCrops: crops.filter(crop => crop.confirmed).length,
    };
  },
};