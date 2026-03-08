export type LocationCategory = 
  | 'university' | 'food' | 'cafe' | 'gym' | 'entertainment' 
  | 'shopping' | 'transport' | 'accommodation' | 'library' | 'discount'
  | 'bar' | 'restaurant' | 'fastfood' | 'studyspot';

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
  campusId?: number; // links POIs to nearest university
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
  bar: '#D946EF',
  restaurant: '#F59E0B',
  fastfood: '#FB923C',
  studyspot: '#6366F1',
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
  bar: 'Bars',
  restaurant: 'Restaurants',
  fastfood: 'Fast Food',
  studyspot: 'Study Spots',
};

// === UNIVERSITIES ===
const UNIVERSITIES: MapLocation[] = [
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
  { id: 11, name: 'Rhodes University', lat: -33.3120, lng: 26.5230, category: 'university', address: 'Makhanda (Grahamstown), EC', rating: 4.5, tags: ['eastern cape', 'grahamstown'] },
  { id: 12, name: 'Nelson Mandela University (NMU)', lat: -33.9860, lng: 25.6730, category: 'university', address: 'Summerstrand, Gqeberha', rating: 4.2, tags: ['port elizabeth', 'eastern cape'] },
  { id: 13, name: 'Cape Peninsula University of Technology (CPUT)', lat: -33.9292, lng: 18.6397, category: 'university', address: 'Bellville, Cape Town', rating: 4.0, tags: ['cape town', 'technology'] },
  { id: 14, name: 'University of the Western Cape (UWC)', lat: -33.9333, lng: 18.6280, category: 'university', address: 'Bellville, Cape Town', rating: 4.1, tags: ['cape town', 'bellville'] },
  { id: 15, name: 'University of Limpopo', lat: -23.8869, lng: 29.7382, category: 'university', address: 'Mankweng, Limpopo', rating: 4.0, tags: ['limpopo', 'polokwane'] },
  { id: 16, name: 'University of Venda', lat: -22.9761, lng: 30.4441, category: 'university', address: 'Thohoyandou, Limpopo', rating: 3.9, tags: ['limpopo', 'venda'] },
  { id: 17, name: 'Walter Sisulu University', lat: -31.5897, lng: 28.7833, category: 'university', address: 'Mthatha, Eastern Cape', rating: 3.8, tags: ['eastern cape', 'mthatha'] },
  { id: 18, name: 'Sol Plaatje University', lat: -28.7394, lng: 24.7710, category: 'university', address: 'Kimberley, Northern Cape', rating: 4.0, tags: ['northern cape', 'kimberley'] },
];

// === UCT AREA (Rondebosch / Cape Town) ===
const UCT_POIS: MapLocation[] = [
  { id: 1001, name: 'Foresters Arms', lat: -33.9610, lng: 18.4650, category: 'bar', address: 'Newlands, Cape Town', rating: 4.3, priceLevel: 2, tags: ['pub', 'student', 'cape town'], campusId: 1, description: 'Classic student pub near UCT' },
  { id: 1002, name: 'A&C Liquor Store & Bar', lat: -33.9555, lng: 18.4720, category: 'bar', address: 'Rondebosch, Cape Town', rating: 4.0, priceLevel: 1, tags: ['bar', 'cheap', 'cape town'], campusId: 1 },
  { id: 1003, name: 'Tin Roof', lat: -33.9520, lng: 18.4680, category: 'bar', address: 'Claremont, Cape Town', rating: 4.1, priceLevel: 2, tags: ['nightclub', 'student', 'cape town'], campusId: 1, description: 'Popular student nightlife venue' },
  { id: 1004, name: 'Tiger\'s Milk Claremont', lat: -33.9530, lng: 18.4690, category: 'restaurant', address: 'Claremont, Cape Town', rating: 4.4, priceLevel: 2, tags: ['restaurant', 'burgers', 'cape town'], campusId: 1 },
  { id: 1005, name: 'Sushi Box Rondebosch', lat: -33.9590, lng: 18.4710, category: 'restaurant', address: 'Rondebosch, Cape Town', rating: 4.2, priceLevel: 2, tags: ['sushi', 'asian', 'cape town'], campusId: 1 },
  { id: 1006, name: 'McDonald\'s Rondebosch', lat: -33.9600, lng: 18.4730, category: 'fastfood', address: 'Main Rd, Rondebosch', rating: 3.5, priceLevel: 1, tags: ['fast food', 'cheap', 'cape town'], campusId: 1 },
  { id: 1007, name: 'KFC Rondebosch', lat: -33.9595, lng: 18.4725, category: 'fastfood', address: 'Main Rd, Rondebosch', rating: 3.4, priceLevel: 1, tags: ['chicken', 'fast food', 'cape town'], campusId: 1 },
  { id: 1008, name: 'Banana Jam Café', lat: -33.9630, lng: 18.4740, category: 'restaurant', address: 'Kenilworth, Cape Town', rating: 4.4, priceLevel: 2, tags: ['burgers', 'student-friendly', 'cape town'], campusId: 1, description: 'Chill vibes with affordable burgers' },
  { id: 1009, name: 'Starlings Café', lat: -33.9570, lng: 18.4640, category: 'cafe', address: 'UCT Upper Campus', rating: 4.5, priceLevel: 1, tags: ['on-campus', 'coffee', 'study'], campusId: 1, description: 'Right on campus — best study spot' },
  { id: 1010, name: 'Obz Café', lat: -33.9440, lng: 18.4720, category: 'cafe', address: 'Observatory, Cape Town', rating: 4.3, priceLevel: 1, tags: ['bohemian', 'coffee', 'cape town'], campusId: 1 },
  { id: 1011, name: 'Truth Coffee Roasting', lat: -33.9253, lng: 18.4232, category: 'cafe', address: 'Buitenkant St, Cape Town', rating: 4.7, priceLevel: 2, tags: ['specialty coffee', 'cape town'], campusId: 1 },
  { id: 1012, name: 'Virgin Active Newlands', lat: -33.9560, lng: 18.4650, category: 'gym', address: 'Newlands, Cape Town', rating: 4.3, priceLevel: 2, tags: ['fitness', 'student discount'], campusId: 1 },
  { id: 1013, name: 'UCT Jammie Shuttle Stop', lat: -33.9575, lng: 18.4605, category: 'transport', address: 'UCT Main Campus', rating: 4.0, tags: ['shuttle', 'free', 'campus'], campusId: 1 },
  { id: 1014, name: 'Cavendish Square', lat: -33.9520, lng: 18.4680, category: 'shopping', address: 'Claremont, Cape Town', rating: 4.2, priceLevel: 2, tags: ['mall', 'cape town'], campusId: 1 },
  { id: 1015, name: 'UCT Oppenheimer Library', lat: -33.9572, lng: 18.4615, category: 'studyspot', address: 'Upper Campus, UCT', rating: 4.6, tags: ['study', 'quiet', 'campus'], campusId: 1 },
  { id: 1016, name: 'Vida e Caffè UCT', lat: -33.9580, lng: 18.4610, category: 'discount', address: 'Rondebosch', rating: 4.3, priceLevel: 1, tags: ['coffee', 'student deal'], campusId: 1, description: 'R5 off with student card' },
];

// === WITS / UJ AREA (Braamfontein / Auckland Park) ===
const WITS_POIS: MapLocation[] = [
  { id: 2001, name: 'Great Dane', lat: -26.1950, lng: 28.0360, category: 'bar', address: 'Braamfontein, Johannesburg', rating: 4.4, priceLevel: 2, tags: ['craft beer', 'student', 'joburg'], campusId: 3, description: 'Top spot for Wits students' },
  { id: 2002, name: 'Kitchener\'s Carvery Bar', lat: -26.1960, lng: 28.0390, category: 'bar', address: 'Braamfontein, Johannesburg', rating: 4.2, priceLevel: 1, tags: ['bar', 'live music', 'joburg'], campusId: 3 },
  { id: 2003, name: 'Radium Beer Hall', lat: -26.1870, lng: 28.0530, category: 'bar', address: 'Orange Grove, Johannesburg', rating: 4.3, priceLevel: 1, tags: ['historic', 'bar', 'joburg'], campusId: 3 },
  { id: 2004, name: 'Nando\'s Braamfontein', lat: -26.1955, lng: 28.0370, category: 'restaurant', address: 'Braamfontein, Johannesburg', rating: 4.2, priceLevel: 1, tags: ['chicken', 'peri-peri', 'joburg'], campusId: 3 },
  { id: 2005, name: 'Neighbourgoods Market', lat: -26.1945, lng: 28.0355, category: 'food', address: 'Braamfontein, Johannesburg', rating: 4.5, priceLevel: 2, tags: ['market', 'saturday', 'joburg'], campusId: 3, description: 'Amazing Saturday food market' },
  { id: 2006, name: 'Lucky Bean', lat: -26.1800, lng: 28.0100, category: 'restaurant', address: 'Melville, Johannesburg', rating: 4.4, priceLevel: 2, tags: ['brunch', 'coffee', 'joburg'], campusId: 4 },
  { id: 2007, name: 'Father Coffee', lat: -26.1960, lng: 28.0340, category: 'cafe', address: 'Juta St, Braamfontein', rating: 4.5, priceLevel: 2, tags: ['specialty', 'study spot', 'joburg'], campusId: 3 },
  { id: 2008, name: 'Doubleshot Coffee', lat: -26.1940, lng: 28.0350, category: 'cafe', address: 'Braamfontein, Johannesburg', rating: 4.3, priceLevel: 2, tags: ['coffee', 'wifi', 'joburg'], campusId: 3 },
  { id: 2009, name: 'Bean There Melville', lat: -26.1770, lng: 28.0080, category: 'cafe', address: '7th St, Melville', rating: 4.4, priceLevel: 2, tags: ['fair trade', 'joburg'], campusId: 4 },
  { id: 2010, name: 'Steers Braamfontein', lat: -26.1948, lng: 28.0365, category: 'fastfood', address: 'Braamfontein, Johannesburg', rating: 3.8, priceLevel: 1, tags: ['burgers', 'fast food', 'joburg'], campusId: 3 },
  { id: 2011, name: 'Debonairs Braamfontein', lat: -26.1952, lng: 28.0375, category: 'fastfood', address: 'Braamfontein, Johannesburg', rating: 3.6, priceLevel: 1, tags: ['pizza', 'fast food', 'joburg'], campusId: 3 },
  { id: 2012, name: 'Planet Fitness Braamfontein', lat: -26.1940, lng: 28.0320, category: 'gym', address: 'Braamfontein, Johannesburg', rating: 4.0, priceLevel: 1, tags: ['budget', 'fitness', 'joburg'], campusId: 3 },
  { id: 2013, name: 'Wits Library', lat: -26.1928, lng: 28.0300, category: 'studyspot', address: 'East Campus, Wits', rating: 4.4, tags: ['study', 'quiet', 'joburg'], campusId: 3 },
  { id: 2014, name: 'The Sheds @ 1Fox', lat: -26.2060, lng: 28.0350, category: 'entertainment', address: 'Newtown, Johannesburg', rating: 4.3, tags: ['market', 'nightlife', 'joburg'], campusId: 3 },
  { id: 2015, name: 'Park Station Gautrain', lat: -26.1986, lng: 28.0425, category: 'transport', address: 'Braamfontein', rating: 3.5, tags: ['gautrain', 'transport'], campusId: 3 },
  { id: 2016, name: 'Student Monday @ Spur', lat: -26.1880, lng: 28.0040, category: 'discount', address: 'Auckland Park', rating: 4.0, priceLevel: 1, tags: ['20% off', 'student card'], campusId: 4, description: '20% off with student card on Mondays' },
  { id: 2017, name: '7th Street Melville', lat: -26.1775, lng: 28.0075, category: 'bar', address: 'Melville, Johannesburg', rating: 4.1, priceLevel: 1, tags: ['bars', 'nightlife', 'melville'], campusId: 4, description: 'Melville\'s famous bar strip' },
  { id: 2018, name: 'Eastgate Mall', lat: -26.1800, lng: 28.1150, category: 'shopping', address: 'Bedfordview', rating: 4.1, priceLevel: 2, tags: ['mall', 'joburg'], campusId: 3 },
];

// === UP / TUT AREA (Hatfield / Pretoria) ===
const PRETORIA_POIS: MapLocation[] = [
  { id: 3001, name: 'Aandklas', lat: -25.7490, lng: 28.2370, category: 'bar', address: 'Hatfield, Pretoria', rating: 4.2, priceLevel: 1, tags: ['student bar', 'legendary', 'pretoria'], campusId: 5, description: 'THE Tuks student bar — legendary' },
  { id: 3002, name: 'Coco\'s', lat: -25.7488, lng: 28.2365, category: 'bar', address: 'Hatfield, Pretoria', rating: 4.0, priceLevel: 1, tags: ['bar', 'student', 'pretoria'], campusId: 5 },
  { id: 3003, name: 'News Café Hatfield', lat: -25.7485, lng: 28.2360, category: 'bar', address: 'Hatfield Square, Pretoria', rating: 4.1, priceLevel: 2, tags: ['cocktails', 'bar', 'pretoria'], campusId: 5 },
  { id: 3004, name: 'Tings \'n Times', lat: -25.7483, lng: 28.2358, category: 'restaurant', address: 'Hatfield, Pretoria', rating: 4.3, priceLevel: 2, tags: ['brunch', 'restaurant', 'pretoria'], campusId: 5 },
  { id: 3005, name: 'Kream Restaurant', lat: -25.7480, lng: 28.2350, category: 'restaurant', address: 'Hatfield, Pretoria', rating: 4.0, priceLevel: 2, tags: ['coffee', 'breakfast', 'pretoria'], campusId: 5 },
  { id: 3006, name: 'Panarottis Hatfield', lat: -25.7478, lng: 28.2345, category: 'restaurant', address: 'Hatfield, Pretoria', rating: 3.8, priceLevel: 1, tags: ['pizza', 'pasta', 'pretoria'], campusId: 5 },
  { id: 3007, name: 'Steers Hatfield', lat: -25.7475, lng: 28.2340, category: 'fastfood', address: 'Hatfield, Pretoria', rating: 3.7, priceLevel: 1, tags: ['burgers', 'cheap', 'pretoria'], campusId: 5 },
  { id: 3008, name: 'KFC Hatfield', lat: -25.7470, lng: 28.2335, category: 'fastfood', address: 'Hatfield, Pretoria', rating: 3.5, priceLevel: 1, tags: ['chicken', 'fast food', 'pretoria'], campusId: 5 },
  { id: 3009, name: 'Terbodore Coffee', lat: -25.7500, lng: 28.2380, category: 'cafe', address: 'Hatfield Square', rating: 4.3, priceLevel: 2, tags: ['coffee', 'study spot', 'pretoria'], campusId: 5 },
  { id: 3010, name: 'Seattle Coffee Hatfield', lat: -25.7495, lng: 28.2375, category: 'cafe', address: 'Hatfield, Pretoria', rating: 4.1, priceLevel: 2, tags: ['coffee', 'wifi', 'pretoria'], campusId: 5 },
  { id: 3011, name: 'Zone Fitness Hatfield', lat: -25.7520, lng: 28.2300, category: 'gym', address: 'Hatfield, Pretoria', rating: 4.1, priceLevel: 1, tags: ['budget', 'fitness', 'pretoria'], campusId: 5 },
  { id: 3012, name: 'Hatfield Gautrain', lat: -25.7490, lng: 28.2380, category: 'transport', address: 'Hatfield', rating: 4.3, tags: ['gautrain', 'pretoria'], campusId: 5 },
  { id: 3013, name: 'Merensky Library', lat: -25.7535, lng: 28.2290, category: 'studyspot', address: 'UP Main Campus', rating: 4.5, tags: ['study', 'quiet', 'pretoria'], campusId: 5 },
  { id: 3014, name: 'Menlyn Park Mall', lat: -25.7830, lng: 28.2770, category: 'shopping', address: 'Menlyn, Pretoria', rating: 4.4, priceLevel: 2, tags: ['mall', 'pretoria'], campusId: 5 },
  { id: 3015, name: 'Takealot Student Store', lat: -25.7545, lng: 28.2320, category: 'discount', address: 'Online / Hatfield Pickup', rating: 4.5, priceLevel: 1, tags: ['tech', 'student discount'], campusId: 5, description: 'Student discounts on laptops' },
  { id: 3016, name: 'Mystic Boer', lat: -25.7486, lng: 28.2362, category: 'bar', address: 'Hatfield, Pretoria', rating: 3.9, priceLevel: 1, tags: ['bar', 'cheap', 'student'], campusId: 5 },
];

// === UKZN / DUT AREA (Durban) ===
const DURBAN_POIS: MapLocation[] = [
  { id: 4001, name: 'Joe Cool\'s', lat: -29.8580, lng: 31.0430, category: 'bar', address: 'North Beach, Durban', rating: 4.3, priceLevel: 2, tags: ['beachfront', 'bar', 'durban'], campusId: 8, description: 'Legendary Durban beachfront bar' },
  { id: 4002, name: 'The Chairman', lat: -29.8540, lng: 31.0250, category: 'bar', address: 'Florida Rd, Durban', rating: 4.4, priceLevel: 2, tags: ['cocktails', 'bar', 'durban'], campusId: 8 },
  { id: 4003, name: 'Unity Brasserie & Bar', lat: -29.8550, lng: 31.0240, category: 'bar', address: 'Florida Rd, Durban', rating: 4.2, priceLevel: 2, tags: ['bar', 'food', 'durban'], campusId: 8 },
  { id: 4004, name: 'Bunny Chow House', lat: -29.8555, lng: 31.0200, category: 'restaurant', address: 'Florida Rd, Durban', rating: 4.6, priceLevel: 1, tags: ['bunny chow', 'local', 'durban'], campusId: 7, description: 'Authentic Durban bunny chow' },
  { id: 4005, name: 'Cafe 1999', lat: -29.8490, lng: 31.0270, category: 'restaurant', address: 'Florida Rd, Durban', rating: 4.3, priceLevel: 2, tags: ['restaurant', 'pizza', 'durban'], campusId: 8 },
  { id: 4006, name: 'Spiga d\'Oro', lat: -29.8500, lng: 31.0260, category: 'restaurant', address: 'Florida Rd, Durban', rating: 4.5, priceLevel: 2, tags: ['italian', 'pasta', 'durban'], campusId: 8 },
  { id: 4007, name: 'McDonald\'s Musgrave', lat: -29.8510, lng: 31.0100, category: 'fastfood', address: 'Musgrave, Durban', rating: 3.5, priceLevel: 1, tags: ['fast food', 'cheap', 'durban'], campusId: 7 },
  { id: 4008, name: 'Bean Green Coffee', lat: -29.8560, lng: 31.0230, category: 'cafe', address: 'Florida Rd, Durban', rating: 4.4, priceLevel: 2, tags: ['coffee', 'artisan', 'durban'], campusId: 8 },
  { id: 4009, name: 'Florida Road Strip', lat: -29.8480, lng: 31.0280, category: 'entertainment', address: 'Florida Rd, Durban', rating: 4.4, tags: ['nightlife', 'restaurants', 'durban'], campusId: 8 },
  { id: 4010, name: 'Gateway Mall', lat: -29.7340, lng: 31.0690, category: 'shopping', address: 'Umhlanga, Durban', rating: 4.5, priceLevel: 3, tags: ['mall', 'durban'], campusId: 7 },
  { id: 4011, name: 'Exclusive Books Student Deal', lat: -29.8570, lng: 31.0210, category: 'discount', address: 'Gateway, Durban', rating: 4.2, priceLevel: 1, tags: ['books', 'student card'], campusId: 7, description: '10% off with student card' },
];

// === STELLENBOSCH ===
const STELLENBOSCH_POIS: MapLocation[] = [
  { id: 5001, name: 'Bohemia', lat: -33.9335, lng: 18.8610, category: 'bar', address: 'Victoria St, Stellenbosch', rating: 4.3, priceLevel: 2, tags: ['bar', 'student', 'stellenbosch'], campusId: 2, description: 'Iconic Stellenbosch student bar' },
  { id: 5002, name: 'Aandklas Stellenbosch', lat: -33.9330, lng: 18.8605, category: 'bar', address: 'Bird St, Stellenbosch', rating: 4.1, priceLevel: 1, tags: ['bar', 'cheap', 'student'], campusId: 2 },
  { id: 5003, name: 'Mystic Boer Stellenbosch', lat: -33.9325, lng: 18.8600, category: 'bar', address: 'Bird St, Stellenbosch', rating: 4.0, priceLevel: 1, tags: ['bar', 'student'], campusId: 2 },
  { id: 5004, name: 'Schoon de Companje', lat: -33.9340, lng: 18.8635, category: 'restaurant', address: 'Church St, Stellenbosch', rating: 4.6, priceLevel: 2, tags: ['bakery', 'brunch', 'stellenbosch'], campusId: 2 },
  { id: 5005, name: 'Steers Stellenbosch', lat: -33.9340, lng: 18.8600, category: 'fastfood', address: 'Bird St, Stellenbosch', rating: 3.9, priceLevel: 1, tags: ['burgers', 'fast food'], campusId: 2 },
  { id: 5006, name: 'Deluxe Coffeeworks', lat: -33.9345, lng: 18.8630, category: 'cafe', address: 'Church St, Stellenbosch', rating: 4.6, priceLevel: 2, tags: ['coffee', 'study spot'], campusId: 2 },
  { id: 5007, name: 'Craft Wheat & Hops', lat: -33.9348, lng: 18.8625, category: 'restaurant', address: 'Church St, Stellenbosch', rating: 4.3, priceLevel: 2, tags: ['craft beer', 'food'], campusId: 2 },
  { id: 5008, name: 'Eikestad Mall', lat: -33.9350, lng: 18.8640, category: 'shopping', address: 'Andringa St, Stellenbosch', rating: 3.8, priceLevel: 1, tags: ['mall', 'stellenbosch'], campusId: 2 },
  { id: 5009, name: 'JS Gericke Library', lat: -33.9330, lng: 18.8645, category: 'studyspot', address: 'Stellenbosch University', rating: 4.5, tags: ['study', 'quiet'], campusId: 2 },
];

// === UFS AREA (Bloemfontein) ===
const BLOEM_POIS: MapLocation[] = [
  { id: 6001, name: 'Cubana Bloemfontein', lat: -29.1150, lng: 26.2100, category: 'bar', address: '2nd Ave, Bloemfontein', rating: 4.1, priceLevel: 2, tags: ['bar', 'restaurant', 'social'], campusId: 9 },
  { id: 6002, name: 'Barba\'s Bloemfontein', lat: -29.1155, lng: 26.2110, category: 'restaurant', address: '2nd Ave, Bloemfontein', rating: 4.2, priceLevel: 2, tags: ['restaurant', 'pizza'], campusId: 9 },
  { id: 6003, name: 'Mimosa Mall', lat: -29.1200, lng: 26.2150, category: 'shopping', address: 'Kellner St, Bloemfontein', rating: 4.0, priceLevel: 2, tags: ['mall', 'bloemfontein'], campusId: 9 },
  { id: 6004, name: 'Sasol Library UFS', lat: -29.1120, lng: 26.1860, category: 'studyspot', address: 'UFS Campus', rating: 4.3, tags: ['study', 'quiet'], campusId: 9 },
];

// === NWU AREA (Potchefstroom) ===
const POTCH_POIS: MapLocation[] = [
  { id: 7001, name: 'O\'Hagan\'s Potch', lat: -26.6860, lng: 27.0940, category: 'bar', address: 'Potchefstroom', rating: 4.0, priceLevel: 1, tags: ['pub', 'student', 'potch'], campusId: 10 },
  { id: 7002, name: 'Spur Potchefstroom', lat: -26.6855, lng: 27.0935, category: 'restaurant', address: 'Potchefstroom', rating: 3.9, priceLevel: 1, tags: ['family', 'restaurant'], campusId: 10 },
  { id: 7003, name: 'MooiRivier Mall', lat: -26.6870, lng: 27.0950, category: 'shopping', address: 'Potchefstroom', rating: 4.0, priceLevel: 2, tags: ['mall', 'potch'], campusId: 10 },
  { id: 7004, name: 'NWU Ferdinand Postma Library', lat: -26.6845, lng: 27.0930, category: 'studyspot', address: 'NWU Campus', rating: 4.4, tags: ['study', 'quiet'], campusId: 10 },
];

// === RHODES AREA (Makhanda) ===
const MAKHANDA_POIS: MapLocation[] = [
  { id: 8001, name: 'The Rat & Parrot', lat: -33.3130, lng: 26.5240, category: 'bar', address: 'High St, Makhanda', rating: 4.2, priceLevel: 1, tags: ['pub', 'student', 'legendary'], campusId: 11, description: 'The most famous student pub in SA' },
  { id: 8002, name: 'Calabash Restaurant', lat: -33.3125, lng: 26.5235, category: 'restaurant', address: 'High St, Makhanda', rating: 4.0, priceLevel: 1, tags: ['african food', 'restaurant'], campusId: 11 },
  { id: 8003, name: 'Rhodes Library', lat: -33.3118, lng: 26.5228, category: 'studyspot', address: 'Rhodes University', rating: 4.5, tags: ['study', 'quiet'], campusId: 11 },
];

// === NMU AREA (Gqeberha / PE) ===
const PE_POIS: MapLocation[] = [
  { id: 9001, name: 'Barney\'s Tavern', lat: -33.9870, lng: 25.6740, category: 'bar', address: 'Summerstrand, PE', rating: 4.1, priceLevel: 1, tags: ['pub', 'student', 'pe'], campusId: 12 },
  { id: 9002, name: 'Ocean Basket Summerstrand', lat: -33.9800, lng: 25.6580, category: 'restaurant', address: 'Summerstrand, PE', rating: 4.3, priceLevel: 2, tags: ['seafood', 'pe'], campusId: 12 },
  { id: 9003, name: 'The Boardwalk Mall', lat: -33.9780, lng: 25.6590, category: 'shopping', address: 'Summerstrand, PE', rating: 4.2, priceLevel: 2, tags: ['mall', 'pe'], campusId: 12 },
  { id: 9004, name: 'NMU South Campus Library', lat: -33.9855, lng: 25.6725, category: 'studyspot', address: 'NMU Campus', rating: 4.2, tags: ['study', 'quiet'], campusId: 12 },
];

export const SA_LOCATIONS: MapLocation[] = [
  ...UNIVERSITIES,
  ...UCT_POIS,
  ...WITS_POIS,
  ...PRETORIA_POIS,
  ...DURBAN_POIS,
  ...STELLENBOSCH_POIS,
  ...BLOEM_POIS,
  ...POTCH_POIS,
  ...MAKHANDA_POIS,
  ...PE_POIS,
];

// Helper: get all POIs linked to a specific university
export const getPOIsForCampus = (campusId: number): MapLocation[] =>
  SA_LOCATIONS.filter(l => l.campusId === campusId);

// Helper: get the university by ID
export const getUniversity = (id: number): MapLocation | undefined =>
  UNIVERSITIES.find(u => u.id === id);

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
