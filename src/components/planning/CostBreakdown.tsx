
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Divide, Home, Map, Plus, Ticket } from 'lucide-react';
import { toast } from 'sonner';

type CostItem = {
  id: string;
  category: 'transport' | 'accommodation' | 'tickets' | 'food' | 'other';
  description: string;
  amount: number;
  paidBy?: string;
  splitAmong?: string[];
};

type CostBreakdownProps = {
  eventId: string;
  onCostUpdate?: (totalCost: number) => void;
};

const categoryIcons = {
  transport: <Map size={16} />,
  accommodation: <Home size={16} />,
  tickets: <Ticket size={16} />,
  food: <CreditCard size={16} />,
  other: <Divide size={16} />
};

const categoryLabels = {
  transport: 'Transport',
  accommodation: 'Accommodation',
  tickets: 'Tickets',
  food: 'Food',
  other: 'Other'
};

const categoryColors = {
  transport: 'from-blue-500 to-blue-600',
  accommodation: 'from-green-500 to-green-600',
  tickets: 'from-purple-500 to-purple-600',
  food: 'from-orange-500 to-orange-600',
  other: 'from-gray-500 to-gray-600'
};

const CostBreakdown: React.FC<CostBreakdownProps> = ({ eventId, onCostUpdate }) => {
  const [costs, setCosts] = useState<CostItem[]>([
    {
      id: '1',
      category: 'transport',
      description: 'Uber to event',
      amount: 120,
      paidBy: 'Me',
      splitAmong: ['Me', 'John', 'Sarah']
    },
    {
      id: '2',
      category: 'tickets',
      description: 'Event tickets',
      amount: 300,
      paidBy: 'Sarah',
      splitAmong: ['Me', 'John', 'Sarah']
    }
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCost, setNewCost] = useState<Omit<CostItem, 'id'>>({
    category: 'transport',
    description: '',
    amount: 0,
    paidBy: 'Me',
    splitAmong: ['Me']
  });
  
  const handleAddCost = () => {
    if (!newCost.description || newCost.amount <= 0) {
      toast.error('Please add a description and valid amount');
      return;
    }
    
    const cost: CostItem = {
      ...newCost,
      id: Date.now().toString()
    };
    
    const updatedCosts = [...costs, cost];
    setCosts(updatedCosts);
    
    // Calculate the total and notify parent
    const total = updatedCosts.reduce((sum, item) => sum + item.amount, 0);
    onCostUpdate?.(total);
    
    setNewCost({
      category: 'transport',
      description: '',
      amount: 0,
      paidBy: 'Me',
      splitAmong: ['Me']
    });
    setShowAddModal(false);
    toast.success('Cost added to breakdown');
  };
  
  const handleDeleteCost = (id: string) => {
    const updatedCosts = costs.filter(cost => cost.id !== id);
    setCosts(updatedCosts);
    
    // Recalculate the total and notify parent
    const total = updatedCosts.reduce((sum, item) => sum + item.amount, 0);
    onCostUpdate?.(total);
    
    toast.success('Item removed from cost breakdown');
  };

  const calculateSplitAmount = (amount: number, people: string[] = []) => {
    return people.length ? amount / people.length : amount;
  };
  
  const totalCost = costs.reduce((sum, item) => sum + item.amount, 0);
  const costsByCategory = costs.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount;
    return acc;
  }, {} as Record<string, number>);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">Cost Breakdown</h3>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs flex items-center gap-1 bg-theme-pink/10 text-theme-pink py-1 px-2 rounded-md"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={14} />
          Add Cost
        </motion.button>
      </div>
      
      {/* Cost summary */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-gray-500 dark:text-gray-400">Total Event Cost</span>
          <span className="text-lg font-semibold">R{totalCost}</span>
        </div>
        
        {/* Category breakdown */}
        <div className="space-y-2">
          {Object.entries(costsByCategory).map(([category, amount]) => (
            <div key={category} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1.5">
                <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${categoryColors[category as keyof typeof categoryColors]} flex items-center justify-center text-white`}>
                  {categoryIcons[category as keyof typeof categoryIcons]}
                </div>
                <span>{categoryLabels[category as keyof typeof categoryLabels]}</span>
              </div>
              <span>R{amount}</span>
            </div>
          ))}
        </div>
        
        {/* Progress chart */}
        <div className="mt-4">
          {Object.entries(costsByCategory).length > 0 && (
            <div className="h-4 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {Object.entries(costsByCategory).map(([category, amount], index, array) => {
                const percentage = (amount / totalCost) * 100;
                const prevPercentages = array.slice(0, index).reduce((acc, [_, val]) => acc + (val / totalCost) * 100, 0);
                
                return (
                  <div
                    key={category}
                    className={`h-full bg-gradient-to-r ${categoryColors[category as keyof typeof categoryColors]}`}
                    style={{ 
                      width: `${percentage}%`, 
                      marginLeft: index === 0 ? 0 : `${prevPercentages}%`,
                      position: index === 0 ? 'relative' : 'absolute',
                      top: 0
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Cost items list */}
      <div className="space-y-2">
        {costs.map((cost) => (
          <motion.div
            key={cost.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${categoryColors[cost.category]} flex items-center justify-center text-white`}>
                  {categoryIcons[cost.category]}
                </div>
                <div>
                  <div className="font-medium">{cost.description}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Paid by {cost.paidBy} • {cost.splitAmong?.length || 1} people
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">R{cost.amount}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  R{calculateSplitAmount(cost.amount, cost.splitAmong).toFixed(2)} each
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        {costs.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No costs added yet. Add your first expense!
          </div>
        )}
      </div>
      
      {/* Add cost modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md shadow-xl"
          >
            <div className="p-4 border-b dark:border-gray-700">
              <h3 className="text-xl font-semibold">Add Cost Item</h3>
            </div>
            
            <div className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newCost.category}
                  onChange={(e) => setNewCost({...newCost, category: e.target.value as CostItem['category']})}
                >
                  <option value="transport">Transport</option>
                  <option value="accommodation">Accommodation</option>
                  <option value="tickets">Tickets</option>
                  <option value="food">Food</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newCost.description}
                  onChange={(e) => setNewCost({...newCost, description: e.target.value})}
                  placeholder="e.g., Uber ride, Event tickets"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Amount (R)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newCost.amount || ''}
                  onChange={(e) => setNewCost({...newCost, amount: parseFloat(e.target.value) || 0})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Paid By</label>
                <select
                  className="w-full px-3 py-2 rounded-md border dark:bg-gray-700 dark:border-gray-600"
                  value={newCost.paidBy}
                  onChange={(e) => setNewCost({...newCost, paidBy: e.target.value})}
                >
                  <option value="Me">Me</option>
                  <option value="John">John</option>
                  <option value="Sarah">Sarah</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Split Among</label>
                <div className="flex flex-wrap gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-md">
                  {['Me', 'John', 'Sarah'].map(person => (
                    <div key={person} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`split-${person}`}
                        className="mr-1"
                        checked={newCost.splitAmong?.includes(person) || false}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNewCost({
                              ...newCost,
                              splitAmong: [...(newCost.splitAmong || []), person]
                            });
                          } else {
                            setNewCost({
                              ...newCost,
                              splitAmong: newCost.splitAmong?.filter(p => p !== person)
                            });
                          }
                        }}
                      />
                      <label htmlFor={`split-${person}`} className="text-sm">{person}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 flex space-x-2 justify-end border-t dark:border-gray-700">
              <button 
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1.5 bg-theme-pink text-white rounded-md"
                onClick={handleAddCost}
              >
                Add Cost
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default CostBreakdown;
