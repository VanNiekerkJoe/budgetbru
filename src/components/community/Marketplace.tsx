
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, Tag, Book, Laptop, Lamp, Package, MessageSquare, 
  Plus, ExternalLink, ThumbsUp, Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

const CATEGORIES = [
  { name: 'Textbooks', icon: Book, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  { name: 'Electronics', icon: Laptop, color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  { name: 'Furniture', icon: Lamp, color: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300' },
  { name: 'Other', icon: Package, color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' }
];

interface MarketplaceItem {
  id: string;
  title: string;
  price: number;
  seller: string;
  category: string;
  image: string;
  description: string;
  date: Date;
  location: string;
  likes: number;
  isLiked: boolean;
}

const MOCK_ITEMS: MarketplaceItem[] = [
  {
    id: '1',
    title: 'Calculus 101 Textbook',
    price: 180,
    seller: 'Sarah M.',
    category: 'Textbooks',
    image: 'https://placehold.co/300x200/e9f5ff/1e88e5?text=Textbook',
    description: 'Slightly used Calculus textbook. No highlights or annotations.',
    date: new Date(2023, 3, 15),
    location: 'Math Building',
    likes: 5,
    isLiked: false
  },
  {
    id: '2',
    title: 'Study Desk',
    price: 350,
    seller: 'Mike K.',
    category: 'Furniture',
    image: 'https://placehold.co/300x200/f5e9ff/7b1fa2?text=Desk',
    description: 'Sturdy wooden desk, perfect for dorm rooms. Must collect.',
    date: new Date(2023, 3, 14),
    location: 'North Campus',
    likes: 3,
    isLiked: false
  },
  {
    id: '3',
    title: 'Used Laptop - Good condition',
    price: 1800,
    seller: 'Thabo J.',
    category: 'Electronics',
    image: 'https://placehold.co/300x200/fff9e9/f57c00?text=Laptop',
    description: '2 year old Dell laptop, perfect for coursework and light gaming.',
    date: new Date(2023, 3, 10),
    location: 'Computer Science Dept',
    likes: 12,
    isLiked: true
  },
  {
    id: '4',
    title: 'Finance Textbook Bundle',
    price: 250,
    seller: 'Lesedi M.',
    category: 'Textbooks',
    image: 'https://placehold.co/300x200/e9f5ff/1e88e5?text=Finance',
    description: 'Set of 3 finance textbooks, perfect for Business Studies.',
    date: new Date(2023, 3, 8),
    location: 'Business School',
    likes: 7,
    isLiked: false
  }
];

const Marketplace: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [items, setItems] = useState<MarketplaceItem[]>(MOCK_ITEMS);
  
  const handleLike = (id: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: item.isLiked ? item.likes - 1 : item.likes + 1,
          isLiked: !item.isLiked
        };
      }
      return item;
    }));
  };
  
  const handleContactSeller = (item: MarketplaceItem) => {
    toast.success(`Contact request sent to ${item.seller}`, {
      description: `About: ${item.title}`,
      action: {
        label: 'Open Chat',
        onClick: () => console.log('Open chat with seller')
      }
    });
  };
  
  const handleShareListing = (item: MarketplaceItem) => {
    navigator.clipboard.writeText(`Check out this item on BudgetBru: ${item.title} - R${item.price}`);
    toast.success('Listing link copied to clipboard!');
  };
  
  const filteredItems = items.filter(item => {
    return (
      (activeCategory === null || item.category === activeCategory) &&
      (searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Student Marketplace</h2>
        <Button onClick={() => toast.info("Feature coming soon!")}>
          <Plus size={16} className="mr-1" /> New Listing
        </Button>
      </div>
      
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input 
            placeholder="Search for books, furniture, electronics..." 
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={activeCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(null)}
          >
            All
          </Button>
          {CATEGORIES.map((category) => (
            <Button
              key={category.name}
              variant={activeCategory === category.name ? "default" : "outline"}
              size="sm"
              className="flex items-center gap-1.5"
              onClick={() => setActiveCategory(category.name)}
            >
              <category.icon size={14} />
              {category.name}
            </Button>
          ))}
        </div>
      </div>
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No items found</h3>
          <p className="text-sm text-gray-500">Try changing your search or filters</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <div 
                  className="h-40 bg-gray-100 dark:bg-gray-800 bg-center bg-cover"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{item.title}</h3>
                    <Badge variant="outline" className={CATEGORIES.find(c => c.name === item.category)?.color}>
                      {item.category}
                    </Badge>
                  </div>
                  <div className="text-xl font-semibold text-theme-pink my-2">
                    R{item.price}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {item.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-auto mb-3">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">{item.seller}</span>
                      <span>•</span>
                      <span>{item.location}</span>
                    </div>
                    <div>
                      Listed {item.date.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex justify-between gap-2 mt-auto">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleContactSeller(item)}>
                      <MessageSquare size={14} className="mr-1" /> Contact
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={item.isLiked ? "text-theme-pink" : ""}
                      onClick={() => handleLike(item.id)}
                    >
                      <ThumbsUp size={14} className="mr-1" fill={item.isLiked ? "currentColor" : "none"} />
                      {item.likes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleShareListing(item)}>
                      <Share2 size={14} />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Marketplace;
