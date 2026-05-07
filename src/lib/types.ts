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

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string;
  seo?: {
    title: string;
    description: string;
  };
  subcategories?: {
    name: string;
    description?: string;
    items: string[];
  }[];
}
