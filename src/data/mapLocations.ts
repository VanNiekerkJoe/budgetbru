export type LocationCategory = 
  | 'university' | 'food' | 'cafe' | 'gym' | 'entertainment' 
  | 'shopping' | 'transport' | 'accommodation' | 'library' | 'discount';

export interface MapLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  category: LocationCategory;
  address: string;
  rating?: number;
  priceLevel?: 1 | 2 | 3;
  tags: string[];
  description?: string;
}

export const CATEGORY_COLORS: Record<LocationCategory, string> = {
  university: '#9b87f5',
  food: '#FF9F40',
  cafe: '#F97316',
  gym: '#4BC0C0',
  entertainment: '#EC4899',
  shopping: '#8B5CF6',
  transport: '#06B6D4',
  accommodation: '#10B981',
  library: '#3B82F6',
  discount: '#EF4444',
};

export const CATEGORY_LABELS: Record<LocationCategory, string> = {
  university: 'Universities',
  food: 'Food',
  cafe: 'Cafés',
  gym: 'Gyms',
  entertainment: 'Entertainment',
  shopping: 'Shopping',
  transport: 'Transport',
  accommodation: 'Stay',
  library: 'Libraries',
  discount: 'Deals',
};

export const SA_LOCATIONS: MapLocation[] = [
  // === UNIVERSITIES ===
  { id: 1, name: 'University of Cape Town (UCT)', lat: -33.9577, lng: 18.4612, category: 'university', address: 'Rondebosch, Cape Town', rating: 4.8, tags: ['top-ranked', 'research', 'cape town'] },
  { id: 2, name: 'Stellenbosch University', lat: -33.9328, lng: 18.8642, category: 'university', address: 'Stellenbosch, Western Cape', rating: 4.7, tags: ['winelands', 'research', 'stellenbosch'] },
  { id: 3, name: 'University of the Witwatersrand (Wits)', lat: -26.1929, lng: 28.0305, category: 'university', address: 'Braamfontein, Johannesburg', rating: 4.7, tags: ['joburg', 'research', 'braamfontein'] },
  { id: 4, name: 'University of Johannesburg (UJ)', lat: -26.1834, lng: 28.0010, category: 'university', address: 'Auckland Park, Johannesburg', rating: 4.5, tags: ['joburg', 'auckland park'] },
  { id: 5, name: 'University of Pretoria (Tuks)', lat: -25.7545, lng: 28.2314, category: 'university', address: 'Hatfield, Pretoria', rating: 4.6, tags: ['pretoria', 'hatfield', 'tuks'] },
  { id: 6, name: 'Tshwane University of Technology (TUT)', lat: -25.7320, lng: 28.1600, category: 'university', address: 'Pretoria West, Pretoria', rating: 4.2, tags: ['pretoria', 'technology'] },
  { id: 7, name: 'University of KwaZulu-Natal (UKZN)', lat: -29.8674, lng: 30.9806, category: 'university', address: 'Westville, Durban', rating: 4.4, tags: ['durban', 'kwazulu-natal'] },
  { id: 8, name: 'Durban University of Technology (DUT)', lat: -29.8587, lng: 31.0218, category: 'university', address: 'Durban Central, KZN', rating: 4.1, tags: ['durban', 'technology'] },
  { id: 9, name: 'University of the Free State (UFS)', lat: -29.1117, lng: 26.1857, category: 'university', address: 'Bloemfontein, Free State', rating: 4.3, tags: ['bloemfontein', 'free state'] },
  { id: 10, name: 'North-West University (NWU)', lat: -26.6850, lng: 27.0926, category: 'university', address: 'Potchefstroom, North West', rating: 4.3, tags: ['potchefstroom', 'north west'] },
  { id: 11, name: 'Rhodes University', lat: -33.3120, lng: 26.5230, category: 'university', address: "Makhanda (Grahamstown), EC", rating: 4.5, tags: ['eastern cape', 'grahamstown'] },
  { id: 12, name: 'Nelson Mandela University (NMU)', lat: -33.9860, lng: 25.6730, category: 'university', address: 'Summerstrand, Gqeberha', rating: 4.2, tags: ['port elizabeth', 'eastern cape'] },
  { id: 13, name: 'Cape Peninsula University of Technology (CPUT)', lat: -33.9292, lng: 18.6397, category: 'university', address: 'Bellville, Cape Town', rating: 4.0, tags: ['cape town', 'technology'] },
  { id: 14, name: 'University of the Western Cape (UWC)', lat: -33.9333, lng: 18.6280, category: 'university', address: 'Bellville, Cape Town', rating: 4.1, tags: ['cape town', 'bellville'] },
  { id: 15, name: 'University of Limpopo', lat: -23.8869, lng: 29.7382, category: 'university', address: 'Mankweng, Limpopo', rating: 4.0, tags: ['limpopo', 'polokwane'] },
  { id: 16, name: 'University of Venda', lat: -22.9761, lng: 30.4441, category: 'university', address: 'Thohoyandou, Limpopo', rating: 3.9, tags: ['limpopo', 'venda'] },
  { id: 17, name: 'Walter Sisulu University', lat: -31.5897, lng: 28.7833, category: 'university', address: 'Mthatha, Eastern Cape', rating: 3.8, tags: ['eastern cape', 'mthatha'] },
  { id: 18, name: 'Sol Plaatje University', lat: -28.7394, lng: 24.7710, category: 'university', address: 'Kimberley, Northern Cape', rating: 4.0, tags: ['northern cape', 'kimberley'] },

  // === FOOD (near major campuses) ===
  { id: 100, name: 'Banana Jam Café', lat: -33.9630, lng: 18.4740, category: 'food', address: 'Kenilworth, Cape Town', rating: 4.4, priceLevel: 2, tags: ['burgers', 'student-friendly', 'cape town'], description: 'Chill student vibes with affordable burgers' },
  { id: 101, name: 'Nando\'s Braamfontein', lat: -26.1955, lng: 28.0370, category: 'food', address: 'Braamfontein, Johannesburg', rating: 4.2, priceLevel: 1, tags: ['chicken', 'fast food', 'joburg'] },
  { id: 102, name: 'Kream Mugg & Bean Hatfield', lat: -25.7480, lng: 28.2350, category: 'food', address: 'Hatfield, Pretoria', rating: 4.0, priceLevel: 2, tags: ['coffee', 'breakfast', 'pretoria'] },
  { id: 103, name: 'Steers Stellenbosch', lat: -33.9340, lng: 18.8600, category: 'food', address: 'Bird Street, Stellenbosch', rating: 3.9, priceLevel: 1, tags: ['burgers', 'fast food', 'stellenbosch'] },
  { id: 104, name: 'Durban Bunny Chow House', lat: -29.8550, lng: 31.0200, category: 'food', address: 'Florida Rd, Durban', rating: 4.6, priceLevel: 1, tags: ['bunny chow', 'local', 'durban'] },
  { id: 105, name: 'Cubana Bloemfontein', lat: -29.1150, lng: 26.2100, category: 'food', address: '2nd Ave, Bloemfontein', rating: 4.1, priceLevel: 2, tags: ['restaurant', 'social', 'bloemfontein'] },
  { id: 106, name: 'Ocean Basket Summerstrand', lat: -33.9800, lng: 25.6580, category: 'food', address: 'Summerstrand, Gqeberha', rating: 4.3, priceLevel: 2, tags: ['seafood', 'port elizabeth'] },

  // === CAFÉS ===
  { id: 200, name: 'Truth Coffee Roasting', lat: -33.9253, lng: 18.4232, category: 'cafe', address: 'Buitenkant St, Cape Town', rating: 4.7, priceLevel: 2, tags: ['specialty coffee', 'cape town'] },
  { id: 201, name: 'Father Coffee Braamfontein', lat: -26.1960, lng: 28.0340, category: 'cafe', address: 'Juta St, Braamfontein', rating: 4.5, priceLevel: 2, tags: ['specialty coffee', 'joburg', 'study spot'] },
  { id: 202, name: 'Deluxe Coffeeworks Stellenbosch', lat: -33.9345, lng: 18.8630, category: 'cafe', address: 'Church St, Stellenbosch', rating: 4.6, priceLevel: 2, tags: ['coffee', 'study spot', 'stellenbosch'] },
  { id: 203, name: 'Bean There Melville', lat: -26.1770, lng: 28.0080, category: 'cafe', address: '44 Stanley, Melville', rating: 4.4, priceLevel: 2, tags: ['fair trade', 'joburg'] },
  { id: 204, name: 'Terbodore Hatfield', lat: -25.7500, lng: 28.2380, category: 'cafe', address: 'Hatfield Square, Pretoria', rating: 4.3, priceLevel: 2, tags: ['coffee', 'pretoria', 'study spot'] },

  // === GYMS ===
  { id: 300, name: 'Virgin Active UCT', lat: -33.9560, lng: 18.4650, category: 'gym', address: 'Rondebosch, Cape Town', rating: 4.3, priceLevel: 2, tags: ['fitness', 'student discount', 'cape town'] },
  { id: 301, name: 'Planet Fitness Braamfontein', lat: -26.1940, lng: 28.0320, category: 'gym', address: 'Braamfontein, Johannesburg', rating: 4.0, priceLevel: 1, tags: ['budget', 'fitness', 'joburg'] },
  { id: 302, name: 'Zone Fitness Hatfield', lat: -25.7520, lng: 28.2300, category: 'gym', address: 'Hatfield, Pretoria', rating: 4.1, priceLevel: 1, tags: ['budget', 'fitness', 'pretoria'] },

  // === ENTERTAINMENT ===
  { id: 400, name: 'The Sheds @ 1Fox', lat: -26.2060, lng: 28.0350, category: 'entertainment', address: 'Newtown, Johannesburg', rating: 4.3, tags: ['market', 'nightlife', 'joburg'] },
  { id: 401, name: 'Long Street Vibes', lat: -33.9230, lng: 18.4190, category: 'entertainment', address: 'Long St, Cape Town', rating: 4.2, tags: ['nightlife', 'bars', 'cape town'] },
  { id: 402, name: 'Florida Road Strip', lat: -29.8480, lng: 31.0280, category: 'entertainment', address: 'Florida Rd, Durban', rating: 4.4, tags: ['nightlife', 'restaurants', 'durban'] },
  { id: 403, name: 'Aandklas Hatfield', lat: -25.7490, lng: 28.2370, category: 'entertainment', address: 'Hatfield, Pretoria', rating: 4.0, tags: ['student bar', 'pretoria', 'tuks'] },

  // === SHOPPING ===
  { id: 500, name: 'Cavendish Square', lat: -33.9520, lng: 18.4680, category: 'shopping', address: 'Claremont, Cape Town', rating: 4.2, priceLevel: 2, tags: ['mall', 'cape town'] },
  { id: 501, name: 'Eastgate Shopping Centre', lat: -26.1800, lng: 28.1150, category: 'shopping', address: 'Bedfordview, Johannesburg', rating: 4.1, priceLevel: 2, tags: ['mall', 'joburg'] },
  { id: 502, name: 'Menlyn Park', lat: -25.7830, lng: 28.2770, category: 'shopping', address: 'Menlyn, Pretoria', rating: 4.4, priceLevel: 2, tags: ['mall', 'pretoria'] },
  { id: 503, name: 'Gateway Theatre of Shopping', lat: -29.7340, lng: 31.0690, category: 'shopping', address: 'Umhlanga, Durban', rating: 4.5, priceLevel: 3, tags: ['mall', 'durban'] },

  // === TRANSPORT ===
  { id: 600, name: 'Cape Town Station', lat: -33.9229, lng: 18.4233, category: 'transport', address: 'Adderley St, Cape Town', rating: 3.5, tags: ['train', 'myciti', 'cape town'] },
  { id: 601, name: 'Park Station Johannesburg', lat: -26.1986, lng: 28.0425, category: 'transport', address: 'Braamfontein, Johannesburg', rating: 3.2, tags: ['gautrain', 'train', 'joburg'] },
  { id: 602, name: 'Hatfield Gautrain Station', lat: -25.7490, lng: 28.2380, category: 'transport', address: 'Hatfield, Pretoria', rating: 4.3, tags: ['gautrain', 'pretoria'] },

  // === LIBRARIES ===
  { id: 700, name: 'UCT Chancellor Oppenheimer Library', lat: -33.9572, lng: 18.4615, category: 'library', address: 'Upper Campus, UCT', rating: 4.6, tags: ['study', 'quiet', 'cape town'] },
  { id: 701, name: 'Wits Wartenweiler Library', lat: -26.1928, lng: 28.0300, category: 'library', address: 'East Campus, Wits', rating: 4.4, tags: ['study', 'joburg'] },
  { id: 702, name: 'Merensky Library UP', lat: -25.7535, lng: 28.2290, category: 'library', address: 'UP Main Campus, Pretoria', rating: 4.5, tags: ['study', 'pretoria'] },

  // === DISCOUNTS ===
  { id: 800, name: 'Student Monday @ Spur', lat: -26.1880, lng: 28.0040, category: 'discount', address: 'Auckland Park, Johannesburg', rating: 4.0, priceLevel: 1, tags: ['20% off', 'student card', 'joburg'], description: '20% off with valid student card on Mondays' },
  { id: 801, name: 'Vida e Caffè Student Deal', lat: -33.9580, lng: 18.4610, category: 'discount', address: 'Rondebosch, Cape Town', rating: 4.3, priceLevel: 1, tags: ['coffee', 'student deal', 'cape town'], description: 'R5 off any coffee with student card' },
  { id: 802, name: 'Takealot Student Store', lat: -25.7545, lng: 28.2320, category: 'discount', address: 'Online / Hatfield Pickup', rating: 4.5, priceLevel: 1, tags: ['online', 'electronics', 'pretoria'], description: 'Student discounts on laptops & tech' },
  { id: 803, name: 'Exclusive Books 10% Student', lat: -29.8570, lng: 31.0210, category: 'discount', address: 'Gateway, Durban', rating: 4.2, priceLevel: 1, tags: ['books', 'student card', 'durban'], description: '10% off with valid student card' },
];

export const toGeoJSON = (locations: MapLocation[]) => ({
  type: 'FeatureCollection' as const,
  features: locations.map(loc => ({
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [loc.lng, loc.lat],
    },
    properties: {
      id: loc.id,
      name: loc.name,
      category: loc.category,
      address: loc.address,
      rating: loc.rating ?? null,
      priceLevel: loc.priceLevel ?? null,
      tags: loc.tags,
      description: loc.description ?? '',
    },
  })),
});
