
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Camera, Upload, Receipt, FileText, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBudget, ExpenseCategory } from '@/contexts/BudgetContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';

import { toast } from 'sonner';

const DigitalReceipt = () => {
  const { addExpense } = useBudget();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Read and display the image
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        simulateReceiptScanning();
      }
    };
    reader.readAsDataURL(file);
  };

  const simulateReceiptScanning = () => {
    setIsProcessing(true);
    // Simulate processing delay
    setTimeout(() => {
      // Mock receipt data
      const mockAmount = Math.floor(Math.random() * 500) / 10 + 10; // Random amount between 10 and 60
      const mockCategories: ExpenseCategory[] = ['groceries', 'transport', 'entertainment', 'food', 'clothing'];
      const mockCategory = mockCategories[Math.floor(Math.random() * mockCategories.length)];
      const mockDescriptions = [
        'Coffee shop purchase',
        'Grocery store',
        'Uber ride',
        'Campus bookstore',
        'Student cafeteria'
      ];
      const mockDescription = mockDescriptions[Math.floor(Math.random() * mockDescriptions.length)];
      
      setAmount(mockAmount);
      setCategory(mockCategory);
      setDescription(mockDescription);
      setIsProcessing(false);
      setIsSuccess(true);
      
      toast.success("Receipt scanned successfully!", {
        description: "We've detected the details from your receipt.",
      });
    }, 2000);
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleClear = () => {
    setCapturedImage(null);
    setIsSuccess(false);
    setAmount(0);
    setDescription('');
    setCategory('other');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSaveExpense = () => {
    addExpense({
      amount,
      category,
      description,
      date
    });
    
    toast.success(`Expense of ${amount.toFixed(2)} added!`, {
      description: "The expense from your receipt has been recorded.",
    });
    
    handleClear();
  };

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-purple-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-blue-300/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-6 pb-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Scan Receipt</h1>
        <div className="w-24"></div>
      </div>

      <div className="px-4 py-2">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <Card className="border border-gray-200/80 dark:border-gray-700/50 shadow-sm">
            <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="text-xl flex items-center gap-2">
                <Receipt size={18} className="text-purple-500" />
                Digital Receipt Scanner
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {!capturedImage ? (
                <div className="flex flex-col items-center py-8">
                  <div className="mb-6 text-center">
                    <div className="text-gray-500 dark:text-gray-400 mb-2">
                      Take a photo of your receipt to automatically track your expense
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      We'll extract the amount, date, and merchant information
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <Button 
                      onClick={triggerCamera} 
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600"
                    >
                      <Camera size={18} />
                      Take Photo
                    </Button>
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={triggerCamera}
                    >
                      <Upload size={18} />
                      Upload Image
                    </Button>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={capturedImage} 
                      alt="Receipt" 
                      className="w-full h-40 object-cover rounded-md border border-gray-200 dark:border-gray-700" 
                    />
                    <button 
                      className="absolute top-2 right-2 bg-gray-800/70 text-white p-1 rounded-full"
                      onClick={handleClear}
                    >
                      <X size={16} />
                    </button>
                    {isProcessing && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-md">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg flex items-center gap-2">
                          <Loader2 size={18} className="animate-spin text-purple-500" />
                          <span>Processing receipt...</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {isSuccess && (
                    <div className="border border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-900/20 rounded-md p-3 flex items-center gap-2">
                      <Check size={18} className="text-green-500" />
                      <span className="text-green-800 dark:text-green-300">Receipt scanned successfully!</span>
                    </div>
                  )}
                  
                  <div className="pt-2 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount</label>
                      <Input 
                        type="number" 
                        value={amount} 
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="text-lg"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <Select value={category} onValueChange={(value) => setCategory(value as ExpenseCategory)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="groceries">Groceries</SelectItem>
                          <SelectItem value="transport">Transport</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="clothing">Clothing</SelectItem>
                          <SelectItem value="health">Health</SelectItem>
                          <SelectItem value="food">Food</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <Input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      <Button 
                        variant="outline"
                        className="flex-1" 
                        onClick={handleClear}
                      >
                        Cancel
                      </Button>
                      <Button 
                        className="flex-1 bg-green-500 hover:bg-green-600"
                        onClick={handleSaveExpense}
                      >
                        Save Expense
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800 pt-3">
                <div className="flex items-start gap-2">
                  <AlertCircle size={14} className="mt-0.5 text-amber-500" />
                  <p>
                    In a real application, we would use OCR (Optical Character Recognition) to extract information from your receipt. This is a demo implementation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border border-gray-200/80 dark:border-gray-700/50 shadow-sm mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText size={16} className="text-blue-500" />
                Tips for Receipt Scanning
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2 text-sm">
              <ul className="space-y-2 list-disc list-inside text-gray-700 dark:text-gray-300">
                <li>Make sure the receipt is on a flat, well-lit surface</li>
                <li>Ensure all corners of the receipt are visible</li>
                <li>Double-check the scanned amount and details</li>
                <li>Keep the original receipt until the expense is verified</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DigitalReceipt;
