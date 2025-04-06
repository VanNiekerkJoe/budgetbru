
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useBudget } from '@/contexts/BudgetContext';
import { ArrowLeft, Shield, AlertTriangle, BarChart3, PiggyBank, ArrowRight, Check, CircleDollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/formatters';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import EnhancedNavBar from '@/components/EnhancedNavBar';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

type SetupFormValues = {
  targetAmount: number;
  monthlyContribution: number;
};

type ContributeFormValues = {
  amount: number;
};

const EmergencyFund = () => {
  const { emergencyFund, setEmergencyFund, updateEmergencyFund, totalExpenses } = useBudget();
  
  const setupForm = useForm<SetupFormValues>({
    defaultValues: {
      targetAmount: totalExpenses * 3, // Default to 3 months of expenses
      monthlyContribution: Math.round(totalExpenses * 0.1), // Default to 10% of monthly expenses
    }
  });
  
  const contributeForm = useForm<ContributeFormValues>({
    defaultValues: {
      amount: 0,
    }
  });

  const onSetupSubmit = (data: SetupFormValues) => {
    setEmergencyFund({
      targetAmount: Number(data.targetAmount),
      currentAmount: 0,
      monthlyContribution: Number(data.monthlyContribution),
    });
    
    toast.success('Emergency fund set up!', {
      description: `Target: ${formatCurrency(data.targetAmount)}, Monthly contribution: ${formatCurrency(data.monthlyContribution)}`
    });
  };

  const onContributeSubmit = (data: ContributeFormValues) => {
    updateEmergencyFund(Number(data.amount));
    contributeForm.reset({ amount: 0 });
  };

  const calculateProgress = () => {
    if (!emergencyFund) return 0;
    return Math.min(100, Math.round((emergencyFund.currentAmount / emergencyFund.targetAmount) * 100));
  };

  const calculateRemainingMonths = () => {
    if (!emergencyFund) return 0;
    const remaining = emergencyFund.targetAmount - emergencyFund.currentAmount;
    return Math.ceil(remaining / emergencyFund.monthlyContribution);
  };

  const progress = calculateProgress();
  const remainingMonths = calculateRemainingMonths();

  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-amber-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-gradient-to-br from-amber-200/20 to-amber-300/20 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <div className="relative px-4 pt-6 pb-4 flex justify-between items-center">
        <Link to="/">
          <Button variant="ghost" className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
            <ArrowLeft size={18} />
            <span>Back</span>
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-white">Emergency Fund</h1>
        <div className="w-24"></div>
      </div>

      <div className="px-4 py-2 pb-24">
        {!emergencyFund ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto"
          >
            <Card className="border border-amber-200/50 dark:border-amber-700/30 shadow-sm mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <AlertTriangle size={18} className="text-amber-500" />
                  Why Have an Emergency Fund?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1 shrink-0" />
                    <span>Protection against unexpected expenses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1 shrink-0" />
                    <span>Reduces financial stress during emergencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1 shrink-0" />
                    <span>Prevents you from taking on debt for emergencies</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-1 shrink-0" />
                    <span>Provides peace of mind and security</span>
                  </li>
                </ul>
                
                <div className="mt-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 rounded-md p-3">
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                    Experts recommend saving 3-6 months of expenses in your emergency fund.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Shield size={18} className="text-blue-500" />
                  Set Up Your Emergency Fund
                </CardTitle>
                <CardDescription>
                  Your safety net for unexpected expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <Form {...setupForm}>
                  <form onSubmit={setupForm.handleSubmit(onSetupSubmit)} className="space-y-4">
                    <FormField
                      control={setupForm.control}
                      name="targetAmount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <PiggyBank size={14} className="text-amber-500" />
                            Target Amount
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
                          <FormDescription>
                            We recommend {formatCurrency(totalExpenses * 3)} (3 months of expenses)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={setupForm.control}
                      name="monthlyContribution"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <CircleDollarSign size={14} className="text-amber-500" />
                            Monthly Contribution
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
                          <FormDescription>
                            We recommend {formatCurrency(Math.round(totalExpenses * 0.1))} (10% of monthly expenses)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-2">
                      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                        Create Emergency Fund
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto space-y-6"
          >
            <Card className="border border-amber-200/50 dark:border-amber-700/30 shadow-sm overflow-hidden">
              <div className="bg-amber-50 dark:bg-amber-900/30 p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-200">Emergency Fund</h2>
                    <p className="text-sm text-amber-700 dark:text-amber-300">Your financial safety net</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center shadow-md">
                    <Shield size={28} className="text-amber-500" />
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-xs text-amber-700 dark:text-amber-300">
                      {progress}% Complete
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-amber-700 dark:text-amber-300">
                        {formatCurrency(emergencyFund.currentAmount)} / {formatCurrency(emergencyFund.targetAmount)}
                      </span>
                    </div>
                  </div>
                  <Progress value={progress} className="h-2 bg-amber-200 dark:bg-amber-900/50" indicatorClassName="bg-amber-500" />
                </div>
              </div>
              
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Monthly contribution</div>
                    <div className="text-lg font-medium">{formatCurrency(emergencyFund.monthlyContribution)}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Time remaining</div>
                    <div className="text-lg font-medium">{remainingMonths} months</div>
                  </div>
                </div>
                
                <Form {...contributeForm}>
                  <form onSubmit={contributeForm.handleSubmit(onContributeSubmit)} className="space-y-4">
                    <FormField
                      control={contributeForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contribute Now</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Amount" 
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))} 
                              />
                            </FormControl>
                            <Button type="submit" className="bg-amber-500 hover:bg-amber-600">
                              Add
                            </Button>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <h3 className="text-sm font-medium mb-2">Quick tips:</h3>
                <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                  <li className="flex items-start gap-1">
                    <ArrowRight size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>Keep your emergency fund in a separate, easily accessible account</span>
                  </li>
                  <li className="flex items-start gap-1">
                    <ArrowRight size={12} className="text-amber-500 mt-0.5 shrink-0" />
                    <span>Only use it for true emergencies, not for regular expenses</span>
                  </li>
                </ul>
              </div>
            </Card>
            
            <Card className="border border-gray-200/80 dark:border-gray-700/50 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 size={16} className="text-blue-500" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="space-y-4">
                  {progress < 25 && (
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Getting Started 🌱</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        You're at the beginning of your emergency fund journey. Keep contributing regularly!
                      </p>
                    </div>
                  )}
                  
                  {progress >= 25 && progress < 50 && (
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Building Momentum 🚀</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        You're making great progress! You now have some protection against small emergencies.
                      </p>
                    </div>
                  )}
                  
                  {progress >= 50 && progress < 75 && (
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Halfway There! ⚡</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        You have a solid foundation and are well on your way to a complete emergency fund!
                      </p>
                    </div>
                  )}
                  
                  {progress >= 75 && progress < 100 && (
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Almost Complete! 🌟</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        You're nearly there! Just a little more to reach your target.
                      </p>
                    </div>
                  )}
                  
                  {progress === 100 && (
                    <div className="text-sm space-y-2">
                      <p className="font-medium">Fully Funded! 🎉</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        Congratulations! Your emergency fund is complete. You're now prepared for financial surprises.
                      </p>
                    </div>
                  )}
                  
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      className="text-xs w-full"
                      onClick={() => {
                        setEmergencyFund({
                          targetAmount: emergencyFund.targetAmount,
                          currentAmount: emergencyFund.currentAmount,
                          monthlyContribution: emergencyFund.monthlyContribution,
                        });
                        toast.success("Emergency fund settings reset!");
                      }}
                    >
                      Reconfigure Emergency Fund
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Nav Bar */}
      <EnhancedNavBar />
    </div>
  );
};

export default EmergencyFund;
