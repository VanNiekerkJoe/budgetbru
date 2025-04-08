
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import type { Income as IncomeType } from '@/contexts/BudgetContext';
import { ArrowLeft, Plus, Calendar, DollarSign, Landmark, Clock, Repeat, Coins, CalendarClock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import EnhancedNavBar from '@/components/EnhancedNavBar';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import MascotHelper from '@/components/MascotHelper';

type FormValues = {
  amount: number;
  source: string;
  date: string;
  recurring: boolean;
  frequency?: 'weekly' | 'monthly' | 'once';
};

const Income = () => {
  const { addIncome, incomes, totalIncome } = useBudget();
  const [showRecurring, setShowRecurring] = useState(false);
  const [selectedFrequency, setSelectedFrequency] = useState<'weekly' | 'monthly' | 'once'>('monthly');

  const form = useForm<FormValues>({
    defaultValues: {
      amount: 0,
      source: '',
      date: new Date().toISOString().split('T')[0],
      recurring: false,
      frequency: 'monthly',
    }
  });

  const onSubmit = (data: FormValues) => {
    try {
      addIncome({
        amount: Number(data.amount),
        source: data.source,
        date: data.date,
        description: data.source, // Add description field using source as the value
        recurring: showRecurring,
        frequency: showRecurring ? selectedFrequency : undefined,
      });

      form.reset({
        amount: 0,
        source: '',
        date: new Date().toISOString().split('T')[0],
        recurring: false,
        frequency: 'monthly',
      });

      toast.success(`Income of ${formatCurrency(data.amount)} added!`, {
        description: showRecurring ? `Recurring ${selectedFrequency}` : 'One-time income',
      });
    } catch (error) {
      toast.error('Failed to add income');
    }
  };

  const toggleRecurring = () => {
    setShowRecurring(!showRecurring);
    form.setValue('recurring', !showRecurring);
  };

  const handleFrequencyChange = (value: 'weekly' | 'monthly' | 'once') => {
    setSelectedFrequency(value);
    form.setValue('frequency', value);
  };

  const sourceOptions = ['Allowance', 'Scholarship', 'Part-time Job', 'Bursary', 'Tutoring', 'Side Hustle', 'Gift', 'Other'];

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-200/20 to-green-300/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-blue-200/20 to-blue-300/30 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-6 pb-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Income</h1>
        <div className="w-24"></div> {/* Spacer for balance */}
      </div>

      <div className="px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-center mb-8"
        >
          <Card className="w-full border-green-500/20 bg-green-50/50 dark:bg-green-950/20 dark:border-green-800/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-green-700 dark:text-green-400">
                <Coins size={20} />
                Total Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 dark:text-green-300">{formatCurrency(totalIncome)}</div>
              <div className="text-xs mt-1 text-green-600/70 dark:text-green-400/70">From {incomes.length} source{incomes.length !== 1 ? 's' : ''}</div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Add Income Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full md:w-1/2"
          >
            <Card className="border border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Plus size={18} className="text-green-500" />
                  Add New Income
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <DollarSign size={14} className="text-gray-500" />
                            Amount
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="0.00" 
                              className="text-lg" 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="source"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Landmark size={14} className="text-gray-500" />
                            Source
                          </FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select income source" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sourceOptions.map((source) => (
                                <SelectItem key={source} value={source}>
                                  {source}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Calendar size={14} className="text-gray-500" />
                            Date Received
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        className={`w-full flex items-center gap-2 ${showRecurring ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}
                        onClick={toggleRecurring}
                      >
                        <Repeat size={14} className={showRecurring ? "text-green-500" : "text-gray-500"} />
                        {showRecurring ? 'Recurring Income' : 'Is this a recurring income?'}
                      </Button>
                    </div>

                    {showRecurring && (
                      <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1">
                              <CalendarClock size={14} className="text-green-500" />
                              Frequency
                            </FormLabel>
                            <Select 
                              onValueChange={(value: string) => handleFrequencyChange(value as 'weekly' | 'monthly' | 'once')} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="once">One-time</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-xs text-green-600 dark:text-green-400">
                              {selectedFrequency === 'weekly' && "We'll add this to your income every week"}
                              {selectedFrequency === 'monthly' && "We'll add this to your income every month"}
                              {selectedFrequency === 'once' && "We'll only record this income once"}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    <div className="pt-2">
                      <Button type="submit" className="w-full bg-green-500 hover:bg-green-600 text-white">
                        Add Income
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Income List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-full md:w-1/2"
          >
            <Card className="border border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardHeader className="pb-2 border-b border-gray-100 dark:border-gray-800">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  Recent Income
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 max-h-[400px] overflow-y-auto">
                {incomes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No income entries yet</p>
                    <p className="text-sm mt-2">Add your first income to get started</p>
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {[...incomes].reverse().map((income) => (
                      <motion.li
                        key={income.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-800"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{income.source}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(income.date).toLocaleDateString()}
                              {income.recurring && (
                                <span className="ml-2 text-xs bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 py-0.5 px-1.5 rounded-full">
                                  {income.frequency}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                            {formatCurrency(income.amount)}
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <div className="mt-6">
              <MascotHelper
                type="finance"
                message="Regular income streams are key to financial stability. Consider tracking all your income sources here, even small ones!"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Nav Bar */}
      <EnhancedNavBar />
    </div>
  );
};

export default Income;
