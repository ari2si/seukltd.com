import { useEffect, useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Project, Media } from '../lib/types';

const defaultProjects: Project[] = [
  {
    id: '1',
    title: 'Luxury Basement Conversion',
    description: 'A stunning basement conversion in central London featuring a cinema room, gym, and wine cellar with full waterproofing and natural light solutions.',
    category: 'Basement Construction',
    location: 'Kensington, London',
    featured: true,
    sort_order: 0,
    created_at: '',
  },
  {
    id: '2',
    title: 'Grade II Listed Building Refurbishment',
    description: 'Complete refurbishment of a heritage property for The Grosvenor Estate, preserving historical features while modernising interiors.',
    category: 'Listed Buildings',
    location: 'Mayfair, London',
    featured: true,
    sort_order: 1,
    created_at: '',
  },
  {
    id: '3',
    title: 'Vertical Extension - 4 Penthouses',
    description: 'Construction of 4 new penthouse flats above the roof level of a historic building in North London, with tenants remaining in situ throughout.',
    category: 'Extensions & Vertical Extensions',
    location: 'Hampstead, London',
    featured: true,
    sort_order: 2,
    created_at: '',
  },
  {
    id: '4',
    title: 'Mixed-Use Development',
    description: 'Construction of 2 flats and 1 commercial building in the busy Bow area of East London, managing logistics to ensure minimal disruption.',
    category: 'Mixed-Use Developments',
    location: 'Bow, London',
    featured: false,
    sort_order: 3,
    created_at: '',
  },
  {
    id: '5',
    title: 'Student Accommodation Conversion',
    description: 'Extensive refurbishment and conversion of Mercia Lodge, the ex-Travelodge Hotel into a student accommodation building in Coventry.',
    category: 'Student Accommodation',
    location: 'Coventry',
    featured: false,
    sort_order: 4,
    created_at: '',
  },
  {
    id: '6',
    title: 'Hammersmith Residential Extension',
    description: 'Construction of 4 new flats with rear, loft and side extensions plus a basement conversion to form the flats.',
    category: 'Residential Refurbishment',
    location: 'Hammersmith, London',
    featured: false,
    sort_order: 5,
    created_at: '',
  },
];

const projectImages: Record<string, string> = {
  '1': 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
  '2': 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
  '3': 'https://images.pexels.com/photos/1095814/pexels-photo-1095814.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
  '4': 'https://images.pexels.com/photos/1546168/pexels-photo-1546168.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
  '5': 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
  '6': 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&dpr=2',
};

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(defaultProjects);
  const [projectMedia, setProjectMedia] = useState<Record<string, Media[]>>({});
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) setProjects(data);
    };
    const fetchMedia = async () => {
      const { data } = await supabase
        .from('media')
        .select('*')
        .eq('section', 'gallery')
        .order('sort_order', { ascending: true });
      if (data && data.length > 0) {
        const grouped: Record<string, Media[]> = {};
        data.forEach((m) => {
          const key = m.project_id || 'unassigned';
          if (!grouped[key]) grouped[key] = [];
          grouped[key].push(m);
        });
        setProjectMedia(grouped);
      }
    };
    fetchProjects();
    fetchMedia();
  }, []);

  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category)))];
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  const getImage = (project: Project) => {
    const media = projectMedia[project.id];
    if (media && media.length > 0) return media[0].url;
    return projectImages[project.id] || projectImages['1'];
  };

  return (
    <section id="projects" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-50 border border-gold-200 rounded-full mb-6">
            <div className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
            <span className="text-gold-700 text-sm font-medium">Our Work</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight mb-4">
            Featured
            <span className="text-gold-500"> Projects</span>
          </h2>
          <p className="text-slate-600 text-lg">
            A selection of our recent construction and development projects across
            London and the South East.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                filter === cat
                  ? 'bg-gold-500 text-slate-900 shadow-lg shadow-gold-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:border-gold-200 hover:shadow-xl hover:shadow-gold-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={getImage(project)}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1.5 bg-gold-500 text-slate-900 text-xs font-bold rounded-full">
                    {project.category}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-gold-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  {project.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
