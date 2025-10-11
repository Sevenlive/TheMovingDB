export interface Box {
  id?: number;
  label: string;
  number: number;
  room: string;
  location: 'old_home' | 'new_home' | 'storage';
  created_at?: string;
  updated_at?: string;
}

export interface Item {
  id?: number;
  name: string;
  description?: string;
  category?: string;
  condition?: string;
  box_id?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardStats {
  totalBoxes: number;
  totalItems: number;
  itemsByLocation: {
    old_home: number;
    new_home: number;
    storage: number;
    unassigned: number;
  };
  boxesByLocation: {
    old_home: number;
    new_home: number;
    storage: number;
  };
}
