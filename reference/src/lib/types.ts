export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
}

export interface Media {
  id: string;
  project_id: string | null;
  url: string;
  type: 'image' | 'video';
  caption: string;
  section: string;
  sort_order: number;
  created_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
}
