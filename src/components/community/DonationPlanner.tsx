
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Search, Calendar, Landmark, User, Info, Plus, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Cause {
  id: string;
  name: string;
  organization: string;
  description: string;
  goal: number;
  raised: number;
  category: string;
  endDate: string;
  image?: string;
  campus?: boolean;
}

const MOCK_CAUSES: Cause[] = [
  {
    id: '1',
    name: 'Student Food Security Initiative',
    organization: 'Campus Outreach',
    description: 'Supporting students facing food insecurity with meal vouchers and food packages.',
    goal: 10000,
    raised: 7235,
    category: 'Food Security',
    endDate: '2023-12-15',
    campus: true
  },
  {
    id: '2',
    name: 'Textbooks for All',
    organization: 'Student Council',
    description: 'Help provide textbooks to financially disadvantaged students.',
    goal: 15000,
    raised: 5120,
    category: 'Education',
    endDate: '2023-11-30',
    campus: true
  },
  {
    id: '3',
    name: 'Clean Water Project',
    organization: 'Community Water Trust',
    description: 'Providing clean water solutions to rural communities near campus.',
    goal: 50000,
    raised: 12500,
    category: 'Environment',
    endDate: '2024-01-15'
  },
  {
    id: '4',
    name: 'Tech for Underprivileged Schools',
    organization: 'Digital Bridge',
    description: 'Donating computers and tech equipment to underprivileged schools.',
    goal: 75000,
    raised: 45200,
    category: 'Education',
    endDate: '2023-10-31'
  }
];

interface MicroDonation {
  causeId: string;
  amount: number;
  date: string;
}

const DonationPlanner: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [causes, setCauses] = useState<Cause[]>(MOCK_CAUSES);
  const [microDonations, setMicroDonations] = useState<MicroDonation[]>([]);
  const [donationAmount, setDonationAmount] = useState<Record<string, number>>({});
  
  const categories = Array.from(new Set(causes.map(cause => cause.category)));
  
  const filteredCauses = causes.filter(cause => {
    return (
      (selectedCategory === null || cause.category === selectedCategory) &&
      (searchTerm === '' || 
        cause.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        cause.organization.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
  
  const handleDonateClick = (causeId: string) => {
    const cause = causes.find(c => c.id === causeId);
    if (!cause) return;
    
    const amount = donationAmount[causeId] || 10;
    
    if (amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    // Create donation record
    const donation: MicroDonation = {
      causeId,
      amount,
      date: new Date().toISOString()
    };
    
    setMicroDonations([...microDonations, donation]);
    
    // Update raised amount
    setCauses(causes.map(c => 
      c.id === causeId 
        ? { ...c, raised: c.raised + amount } 
        : c
    ));
    
    // Reset donation amount
    setDonationAmount({
      ...donationAmount,
      [causeId]: 0
    });
    
    toast.success(`Thank you for your donation!`, {
      description: `R${amount} to ${cause.name}`,
      action: {
        label: 'View Receipt',
        onClick: () => toast.info('Donation receipt will be sent to your email')
      }
    });
  };
  
  const calculateProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };
  
  const getTotalDonated = () => {
    return microDonations.reduce((total, donation) => total + donation.amount, 0);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <Card className="border-pink-100 dark:border-pink-900/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-pink-500 fill-pink-500" />
            <span>Student Giving</span>
          </div>
          {microDonations.length > 0 && (
            <Badge className="bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300">
              Total Donated: R{getTotalDonated()}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-2">
        <div className="text-sm mb-3">
          Make small, budget-friendly donations to causes you care about.
        </div>
        
        <div className="flex flex-col gap-3 mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input 
              placeholder="Search causes..." 
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-1">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="text-xs h-7"
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-xs h-7 whitespace-nowrap"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        {filteredCauses.length === 0 ? (
          <div className="text-center py-6">
            <Heart className="mx-auto h-10 w-10 text-gray-400" />
            <h3 className="mt-2 text-base font-medium">No causes found</h3>
            <p className="text-xs text-gray-500">Try changing your search or filters</p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4 max-h-[400px] overflow-y-auto pr-1 pb-1"
          >
            {filteredCauses.map((cause) => (
              <motion.div 
                key={cause.id}
                variants={itemVariants}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {cause.image && (
                  <div 
                    className="h-32 bg-center bg-cover"
                    style={{ backgroundImage: `url(${cause.image})` }}
                  />
                )}
                <div className="p-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium">{cause.name}</h3>
                    {cause.campus && (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800/30 text-xs">
                        Campus
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {cause.description}
                  </p>
                  
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                    <Landmark size={12} className="mr-1" />
                    {cause.organization}
                    <span className="mx-2">•</span>
                    <Calendar size={12} className="mr-1" />
                    Ends {new Date(cause.endDate).toLocaleDateString()}
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">
                        {calculateProgress(cause.raised, cause.goal)}%
                      </span>
                    </div>
                    <Progress 
                      value={calculateProgress(cause.raised, cause.goal)} 
                      className="h-2"
                      indicatorClassName="bg-pink-500" 
                    />
                    <div className="flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400">
                      <span>R{cause.raised.toLocaleString()}</span>
                      <span>Goal: R{cause.goal.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R</span>
                      <Input
                        type="number"
                        placeholder="10"
                        className="pl-7"
                        value={donationAmount[cause.id] || ''}
                        onChange={(e) => setDonationAmount({
                          ...donationAmount,
                          [cause.id]: parseFloat(e.target.value) || 0
                        })}
                      />
                    </div>
                    <Button 
                      onClick={() => handleDonateClick(cause.id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      Donate
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="text-xs flex items-center text-gray-500 dark:text-gray-400">
            <Info size={12} className="mr-1" />
            Your donations are tax-deductible
          </div>
          <Button variant="link" size="sm" className="text-pink-500" onClick={() => toast.info('Coming soon!')}>
            View Impact <ArrowRight size={12} className="ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationPlanner;
