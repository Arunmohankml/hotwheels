import { createClient } from '@supabase/supabase-js';

// Since the remote Supabase project is no longer available (DNS resolution fails),
// we use a high-fidelity local mock client that stores data in localStorage.
// This enables full offline/local development, allowing orders, products,
// reports, wishlists, settings, and profile features to work beautifully.

const defaultProducts = [
  {
    id: "prod-v8-gold",
    name: "Concept V8 Gold",
    series: "Signature Series",
    description: "Ultra-rare gold plated edition with custom aero kit and hand-polished alloy details.",
    price: 19999,
    image_url: "/images/car9.png",
    stock: 5,
    is_featured: true,
    is_limited: true,
    category: "Signature",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString()
  },
  {
    id: "prod-neon-speedster",
    name: "Neon Speedster X",
    series: "Elite Series",
    description: "Cyberpunk inspired design with glowing neon translucent wheels and custom carbon spoiler.",
    price: 2499,
    image_url: "/images/car11.png",
    stock: 15,
    is_featured: true,
    is_limited: false,
    category: "Elite",
    created_at: new Date(Date.now() - 86400000 * 4).toISOString()
  },
  {
    id: "prod-viper-concept",
    name: "Viper R/T Concept",
    series: "Street Tuners",
    description: "Aggressive widebody kit, carbon diffuser, and custom performance exhaust notes.",
    price: 3499,
    image_url: "/images/car12.png",
    stock: 12,
    is_featured: false,
    is_limited: false,
    category: "Signature",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString()
  },
  {
    id: "prod-drift-king",
    name: "Drift King Z",
    series: "Track Day",
    description: "Tuned for precision drifting. Authentic high-end sponsors and track-proven tuning.",
    price: 1999,
    image_url: "/images/car13.png",
    stock: 20,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: "prod-classic-cruiser",
    name: "Classic Cruiser 69",
    series: "Heritage Collection",
    description: "Vintage classic muscle car recreation with mirror-like premium chrome finishes.",
    price: 2999,
    image_url: "/images/car15.png",
    stock: 8,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString()
  },
  {
    id: "prod-apex-predator",
    name: "Apex Predator",
    series: "Speed Demons",
    description: "High-downforce active rear wing with custom racing decals and lightweight frame.",
    price: 4999,
    image_url: "/images/car1.webp",
    stock: 4,
    is_featured: true,
    is_limited: true,
    category: "Elite",
    created_at: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "prod-quantum-charger",
    name: "Quantum Charger",
    series: "Speed Demons",
    description: "Futuristic hypercar with active battery cooling vents and sleek monocoque shell.",
    price: 2299,
    image_url: "/images/car2.png",
    stock: 18,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-volt-renegade",
    name: "Volt Renegade",
    series: "Street Tuners",
    description: "Striking electric blue paint with dual sport stripes and detailed brake calipers.",
    price: 3100,
    image_url: "/images/car3.png",
    stock: 10,
    is_featured: true,
    is_limited: false,
    category: "Signature",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-carbon-phantom",
    name: "Carbon Phantom",
    series: "Elite Series",
    description: "Stealthy matte black hypercar with full exposed carbon fiber weave aesthetic.",
    price: 5999,
    image_url: "/images/car4.png",
    stock: 3,
    is_featured: true,
    is_limited: true,
    category: "Elite",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-specter-gt",
    name: "Specter GT",
    series: "Track Day",
    description: "Track-optimized suspension and aerodynamic design built for setting fast laps.",
    price: 1890,
    image_url: "/images/car5.png",
    stock: 25,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-hyperion-aero",
    name: "Hyperion Aero",
    series: "Night Burnerz",
    description: "Sleek low-profile tuner featuring triple-stage turbo detailing and underglow.",
    price: 4500,
    image_url: "/images/car6.png",
    stock: 7,
    is_featured: true,
    is_limited: false,
    category: "Elite",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-cyclone-nitro",
    name: "Cyclone Nitro",
    series: "Muscle Mania",
    description: "Heavy-duty custom muscle chassis with high-rise supercharger intake scoop.",
    price: 2750,
    image_url: "/images/car7.png",
    stock: 14,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-tsunami-drift",
    name: "Tsunami Drift",
    series: "Street Tuners",
    description: "Japanese-inspired drift build with staggered fitment deep-dish chrome wheels.",
    price: 3899,
    image_url: "/images/car8.png",
    stock: 6,
    is_featured: false,
    is_limited: true,
    category: "Signature",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-midnight-rider",
    name: "Midnight Rider",
    series: "Night Burnerz",
    description: "Aggressive street racer with custom wide fenders and dark tinted canopy.",
    price: 1650,
    image_url: "/images/car10.png",
    stock: 30,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-overlord-v12",
    name: "Overlord V12",
    series: "Signature Series",
    description: "Massive V12 concept engine visible through custom clear engine bay cover.",
    price: 8500,
    image_url: "/images/car14.png",
    stock: 2,
    is_featured: true,
    is_limited: true,
    category: "Signature",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-redline-special",
    name: "Redline Special",
    series: "Muscle Mania",
    description: "Retro dragster with huge rear drag slicks and wheelie bar attachment.",
    price: 1200,
    image_url: "/images/car16.png",
    stock: 40,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-track-terror",
    name: "Track Terror",
    series: "Track Day",
    description: "Bare-bones lightweight racer built exclusively for time attack setups.",
    price: 2150,
    image_url: "/images/car17.png",
    stock: 15,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-chrono-warp",
    name: "Chrono Warp",
    series: "Speed Demons",
    description: "Timeless concept vehicle with electro-luminescent body stripes.",
    price: 3600,
    image_url: "/images/car18.png",
    stock: 9,
    is_featured: false,
    is_limited: false,
    category: "Signature",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-rune-raider",
    name: "Rune Raider",
    series: "Street Tuners",
    description: "Tribal street graphics over polished brushed aluminum body panels.",
    price: 2400,
    image_url: "/images/car19.png",
    stock: 22,
    is_featured: false,
    is_limited: false,
    category: "Mainline",
    created_at: new Date().toISOString()
  },
  {
    id: "prod-valkyrie-prime",
    name: "Valkyrie Prime",
    series: "Elite Series",
    description: "Ultimate aerodynamic prototype with carbon-composite monocoque construction.",
    price: 7200,
    image_url: "/images/car20.png",
    stock: 5,
    is_featured: true,
    is_limited: true,
    category: "Elite",
    created_at: new Date().toISOString()
  }
];

const defaultSettings = {
  id: 1,
  privacyPolicy: "<h3>Privacy Policy Framework</h3><p>We respect your privacy and protect your data. All transactions are local.</p>",
  contactEmail: "support@hotwheels.in",
  contactPhone: "+91 98765 43210",
  contactWhatsapp: "+91 98765 43210"
};

// Initialize localStorage databases if in client-side environment
const getStore = (key: string, fallback: any) => {
  if (typeof window === 'undefined') return fallback;
  const item = localStorage.getItem(`supabase_mock_${key}`);
  if (!item) {
    localStorage.setItem(`supabase_mock_${key}`, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(item);
  } catch (e) {
    return fallback;
  }
};

const setStore = (key: string, data: any) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`supabase_mock_${key}`, JSON.stringify(data));
  }
};

// Seed default tables
const initializeMockDB = () => {
  if (typeof window !== 'undefined') {
    getStore('products', defaultProducts);
    getStore('site_settings', defaultSettings);
    getStore('orders', []);
    getStore('profiles', [
      {
        id: "arun-mock-uid",
        email: "arunmohankml@gmail.com",
        full_name: "Arun Mohan",
        is_admin: true,
        joined_at: new Date().toISOString()
      }
    ]);
    getStore('reports', []);
    getStore('wishlist', []);
  }
};

initializeMockDB();

class MockBuilder {
  table: string;
  action: string;
  filterState: any;
  insertData: any;
  updateData: any;
  upsertData: any;
  countOption?: string;

  constructor(table: string, filterState = {}) {
    this.table = table;
    this.action = 'select';
    this.filterState = {
      eq: [],
      neq: [],
      in: [],
      ilike: [],
      order: null,
      range: null,
      single: false,
      limit: null,
      ...filterState
    };
  }

  select(fields = '*', options: any = {}) {
    this.action = 'select';
    this.countOption = options.count;
    return this;
  }

  insert(data: any) {
    this.action = 'insert';
    this.insertData = data;
    return this;
  }

  update(data: any) {
    this.action = 'update';
    this.updateData = data;
    return this;
  }

  upsert(data: any) {
    this.action = 'upsert';
    this.upsertData = data;
    return this;
  }

  delete() {
    this.action = 'delete';
    return this;
  }

  eq(col: string, val: any) {
    this.filterState.eq.push({ col, val });
    return this;
  }

  neq(col: string, val: any) {
    this.filterState.neq.push({ col, val });
    return this;
  }

  in(col: string, vals: any[]) {
    this.filterState.in.push({ col, vals });
    return this;
  }

  ilike(col: string, pattern: string) {
    this.filterState.ilike.push({ col, pattern });
    return this;
  }

  order(col: string, options: any = {}) {
    this.filterState.order = { col, ascending: options.ascending !== false };
    return this;
  }

  range(from: number, to: number) {
    this.filterState.range = { from, to };
    return this;
  }

  single() {
    this.filterState.single = true;
    return this;
  }

  limit(n: number) {
    this.filterState.limit = n;
    return this;
  }

  async execute() {
    if (typeof window === 'undefined') {
      return { data: this.action === 'select' ? [] : null, error: null, count: 0 };
    }

    let items = [...getStore(this.table, [])];

    // Apply Filter Logic
    for (const filter of this.filterState.eq) {
      items = items.filter(item => item[filter.col] === filter.val);
    }
    for (const filter of this.filterState.neq) {
      items = items.filter(item => item[filter.col] !== filter.val);
    }
    for (const filter of this.filterState.in) {
      if (Array.isArray(filter.vals)) {
        items = items.filter(item => filter.vals.includes(item[filter.col]));
      }
    }
    for (const filter of this.filterState.ilike) {
      const regexStr = filter.pattern.replace(/%/g, '.*');
      const regex = new RegExp(`^${regexStr}$`, 'i');
      items = items.filter(item => {
        const val = item[filter.col];
        return val ? regex.test(String(val)) : false;
      });
    }

    // Apply Sorting
    if (this.filterState.order) {
      const { col, ascending } = this.filterState.order;
      items.sort((a, b) => {
        let valA = a[col];
        let valB = b[col];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return ascending ? -1 : 1;
        if (valA > valB) return ascending ? 1 : -1;
        return 0;
      });
    }

    const totalCount = items.length;

    // Actions
    if (this.action === 'select') {
      // Apply pagination range or limit
      if (this.filterState.range) {
        const { from, to } = this.filterState.range;
        items = items.slice(from, to + 1);
      } else if (this.filterState.limit) {
        items = items.slice(0, this.filterState.limit);
      }

      if (this.filterState.single) {
        return { data: items[0] || null, error: items[0] ? null : new Error("No items found"), count: totalCount };
      }
      return { data: items, error: null, count: totalCount };
    }

    if (this.action === 'insert') {
      const rawData = this.insertData;
      const dataToInsert = Array.isArray(rawData) ? rawData : [rawData];
      const inserted = dataToInsert.map(d => {
        const id = d.id || Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        return {
          id,
          created_at: new Date().toISOString(),
          ...d
        };
      });

      const allItems = [...getStore(this.table, []), ...inserted];
      setStore(this.table, allItems);

      return { data: Array.isArray(rawData) ? inserted : inserted[0], error: null };
    }

    if (this.action === 'update') {
      const rawItems = getStore(this.table, []);
      const toUpdateIds = items.map(i => i.id);
      
      const updatedItems = rawItems.map((item: any) => {
        if (toUpdateIds.includes(item.id)) {
          return { ...item, ...this.updateData };
        }
        return item;
      });

      setStore(this.table, updatedItems);
      const affected = updatedItems.filter((item: any) => toUpdateIds.includes(item.id));
      return { data: this.filterState.single ? affected[0] : affected, error: null };
    }

    if (this.action === 'upsert') {
      const rawItems = [...getStore(this.table, [])];
      const rawData = this.upsertData;
      const dataToUpsert = Array.isArray(rawData) ? rawData : [rawData];

      const upserted = dataToUpsert.map(d => {
        const id = d.id || Math.random().toString(36).substring(2, 15);
        const existingIdx = rawItems.findIndex((item: any) => item.id === id);
        const newObj = {
          id,
          created_at: new Date().toISOString(),
          ...d
        };
        if (existingIdx > -1) {
          rawItems[existingIdx] = { ...rawItems[existingIdx], ...d };
        } else {
          rawItems.push(newObj);
        }
        return newObj;
      });

      setStore(this.table, rawItems);
      return { data: Array.isArray(rawData) ? upserted : upserted[0], error: null };
    }

    if (this.action === 'delete') {
      const rawItems = getStore(this.table, []);
      const toDeleteIds = items.map(i => i.id);
      const remaining = rawItems.filter((item: any) => !toDeleteIds.includes(item.id));
      setStore(this.table, remaining);
      return { data: items, error: null };
    }

    return { data: null, error: new Error("Unsupported mock query action") };
  }

  then(onfulfilled: any, onrejected: any) {
    return this.execute().then(onfulfilled, onrejected);
  }
}

export const supabase: any = {
  from: (table: string) => {
    return new MockBuilder(table);
  }
};

