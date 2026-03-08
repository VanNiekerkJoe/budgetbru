
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Bell, CircleDollarSign, FileText, HelpCircle, LogOut, Settings, 
  User, Shield, Moon, Palette, Share2, Star, BookOpen, Gift
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BadgeGlow } from '@/components/ui/badge-glow';
import { motion, AnimatePresence } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';
import { toast } from 'sonner';

const AchievementCard: React.FC<{
  title: string;
  description: string;
  progress: number;
  icon: React.ReactNode;
  completed?: boolean;
}> = ({ title, description, progress, icon, completed }) => {
  return (
    <motion.div 
      className={`border ${completed ? 'bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20 border-amber-200 dark:border-amber-800/30' : 'bg-white dark:bg-gray-800/80 border-gray-200 dark:border-gray-700'} rounded-lg p-4 relative overflow-hidden`}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {completed && (
        <div className="absolute -top-1 -right-1">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="bg-amber-500 text-white p-1 rounded-full"
          >
            <Star size={14} className="text-white" />
          </motion.div>
        </div>
      )}
      
      <div className="flex items-start">
        <div className={`p-2 rounded-lg mr-3 ${completed ? 'bg-amber-200 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
          
          <div className="mt-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
              <div 
                className={`h-1.5 rounded-full ${completed ? 'bg-amber-500 dark:bg-amber-500' : 'bg-blue-500 dark:bg-blue-600'}`} 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-right mt-0.5 text-gray-500 dark:text-gray-400">
              {completed ? 'Completed!' : `${progress}% complete`}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [showAppearanceDialog, setShowAppearanceDialog] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });
  
  const THEMES = [
    { name: "Default", color: "from-blue-50 to-purple-50" },
    { name: "Ocean", color: "from-blue-50 to-cyan-50" },
    { name: "Sunset", color: "from-orange-50 to-red-50" },
    { name: "Mint", color: "from-green-50 to-teal-50" },
    { name: "Lavender", color: "from-purple-50 to-pink-50" }
  ];
  
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0].name);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
  };

  const handleSaveAppearance = () => {
    setShowAppearanceDialog(false);
    toast.success("Appearance settings saved!");
  };
  
  const handleExportData = () => {
    toast.success("Data export prepared", { 
      description: "Your data export is ready to download"
    });
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const buttonVariants = {
    hover: { 
      scale: 1.02,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-theme-navy pb-28">
      <ParticleBackground count={20} className="opacity-20" />
      
      <header className="bg-white dark:bg-gray-900/95 backdrop-blur-md shadow-lg py-6 px-4 relative overflow-hidden">
        <motion.div 
          className="absolute -top-10 left-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container mx-auto max-w-md relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mb-3"
          >
            <BadgeGlow glowColor="rgba(109, 40, 217, 0.5)">
              <div className="flex items-center bg-indigo-600 text-white px-3 py-1.5 rounded-full">
                <User className="mr-2" size={18} />
                <span className="font-semibold">My Profile</span>
              </div>
            </BadgeGlow>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center mt-4"
          >
            <Avatar className="h-20 w-20 border-4 border-white dark:border-gray-800 shadow-lg">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-500 text-white text-xl">
                BP
              </AvatarFallback>
            </Avatar>
          </motion.div>
          
          <div className="text-center mt-3">
            <h2 className="text-xl font-bold">Budget Pro</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">student@university.ac.za</p>
            <div className="mt-2 flex justify-center items-center gap-2">
              <Badge variant="secondary" className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 hover:bg-purple-200">
                Budget Master
              </Badge>
              <Badge variant="secondary" className="bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 hover:bg-amber-200">
                <Star className="w-3 h-3 mr-1" fill="currentColor" /> Level 4
              </Badge>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-4 max-w-md">
        <Tabs defaultValue="account" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <AnimatePresence mode="wait">
            <TabsContent value="account" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Bell size={18} className="text-gray-500" />
                            <span>Push Notifications</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <CircleDollarSign size={18} className="text-gray-500" />
                            <span>Budget Alerts</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <Shield size={18} className="text-gray-500" />
                            <span>Privacy Mode</span>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-gray-500"
                        onClick={() => toast.info("Sign out from all other devices")}
                      >
                        Sign out elsewhere
                      </Button>
                      <Button 
                        variant="default"
                        size="sm"
                      >
                        Save Changes
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="space-y-3">
                  <h3 className="text-lg font-medium ml-1">Quick Actions</h3>
                  <motion.div 
                    className="grid grid-cols-2 gap-3"
                    variants={containerVariants}
                  >
                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-white dark:bg-gray-800/80 rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer"
                        onClick={() => setActiveTab("settings")}
                      >
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-purple-600 dark:text-purple-300">
                          <Settings size={20} />
                        </div>
                        <h3 className="font-medium text-sm mt-2">Account Settings</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Manage your profile</p>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-white dark:bg-gray-800/80 rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer"
                        onClick={() => setShowAppearanceDialog(true)}
                      >
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-full text-cyan-600 dark:text-cyan-300">
                          <Palette size={20} />
                        </div>
                        <h3 className="font-medium text-sm mt-2">Appearance</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Customize the app</p>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-white dark:bg-gray-800/80 rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer"
                        onClick={handleExportData}
                      >
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-300">
                          <Share2 size={20} />
                        </div>
                        <h3 className="font-medium text-sm mt-2">Export Data</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Download your data</p>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div variants={itemVariants}>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="bg-white dark:bg-gray-800/80 rounded-xl p-4 shadow-sm flex flex-col items-center text-center cursor-pointer"
                        onClick={() => setActiveTab("achievements")}
                      >
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-full text-amber-600 dark:text-amber-300">
                          <Star size={20} />
                        </div>
                        <h3 className="font-medium text-sm mt-2">Achievements</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View your progress</p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Support</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left font-normal h-12"
                          onClick={() => toast.info("Help center", { description: "Opening support resources" })}
                        >
                          <HelpCircle size={18} className="mr-3 text-gray-500" />
                          Help & Support
                        </Button>
                        
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-left font-normal h-12"
                          onClick={() => toast.info("Opening documentation", { description: "Loading resources" })}
                        >
                          <BookOpen size={18} className="mr-3 text-gray-500" />
                          Documentation
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants} className="pt-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => toast.info("You've been logged out", { description: "Come back soon!" })}
                  >
                    <LogOut size={16} className="mr-2" />
                    Log Out
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="achievements" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <Card className="border-0 bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">My Achievements</CardTitle>
                          <CardDescription>Track your financial journey</CardDescription>
                        </div>
                        <Badge className="bg-amber-500">4 Unlocked</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between mb-1 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="h-2 rounded-full bg-amber-500" style={{ width: '40%' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  variants={containerVariants}
                  className="space-y-3"
                >
                  <motion.div variants={itemVariants}>
                    <AchievementCard
                      title="Budget Master"
                      description="Create and stick to a budget for 30 days"
                      progress={100}
                      icon={<CircleDollarSign size={18} />}
                      completed
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <AchievementCard
                      title="Savings Superstar"
                      description="Reach your first savings goal"
                      progress={100}
                      icon={<Star size={18} />}
                      completed
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <AchievementCard
                      title="Expense Tracker"
                      description="Track all expenses for 14 days straight"
                      progress={100}
                      icon={<FileText size={18} />}
                      completed
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <AchievementCard
                      title="Financial Scholar"
                      description="Complete 5 financial literacy tutorials"
                      progress={100}
                      icon={<BookOpen size={18} />}
                      completed
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <AchievementCard
                      title="Money Milestone"
                      description="Save R10,000 in total"
                      progress={68}
                      icon={<Gift size={18} />}
                    />
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <AchievementCard
                      title="Frugal Foodie"
                      description="Keep food expenses under budget for 2 months"
                      progress={45}
                      icon={<Bell size={18} />}
                    />
                  </motion.div>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="settings" asChild>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">App Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Moon size={18} className="text-gray-500" />
                          <span>Dark Mode</span>
                        </div>
                        <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
                      </div>
                      
                      <div>
                        <Button 
                          variant="outline" 
                          className="w-full justify-between"
                          onClick={() => setShowAppearanceDialog(true)}
                        >
                          <div className="flex items-center gap-3">
                            <Palette size={18} className="text-gray-500" />
                            <span>Theme & Appearance</span>
                          </div>
                          <span className="text-xs text-gray-500">{selectedTheme}</span>
                        </Button>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Privacy</h3>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Shield size={18} className="text-gray-500" />
                            <span>Hide Balance</span>
                          </div>
                          <Switch />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Share2 size={18} className="text-gray-500" />
                            <span>Share Usage Data</span>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Advanced</h3>
                        <div>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={handleExportData}
                          >
                            <Share2 size={18} className="mr-3 text-gray-500" />
                            Export Data
                          </Button>
                        </div>
                        
                        <div>
                          <Button 
                            variant="outline" 
                            className="w-full justify-start"
                            onClick={() => toast.info("Checking for updates...")}
                          >
                            <CircleDollarSign size={18} className="mr-3 text-gray-500" />
                            Check for Updates
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">About</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/80 rounded-lg p-4 text-center">
                        <h3 className="font-semibold mb-2 text-theme-pink">BudgetBru</h3>
                        <p className="text-xs text-gray-500">Version 1.0.0 (Beta)</p>
                        <p className="text-xs text-gray-500 mt-1">Made with 💜 in South Africa</p>
                      </div>
                      
                      <div className="flex gap-2 justify-center">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.info("Opening privacy policy")}
                        >
                          Privacy Policy
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => toast.info("Opening terms of service")}
                        >
                          Terms of Service
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </main>
      
      <Dialog open={showAppearanceDialog} onOpenChange={setShowAppearanceDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Theme & Appearance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Color Theme</h3>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map(theme => (
                  <div 
                    key={theme.name}
                    className={`border rounded-lg p-2 cursor-pointer ${selectedTheme === theme.name ? 'border-blue-600 dark:border-blue-500' : 'border-gray-200 dark:border-gray-700'}`}
                    onClick={() => setSelectedTheme(theme.name)}
                  >
                    <div className={`h-10 w-full rounded-md bg-gradient-to-br ${theme.color} mb-1`}></div>
                    <p className="text-xs text-center">{theme.name}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Dark Mode</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm">Enable dark mode</span>
                <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
              </div>
            </div>
            
            <div className="pt-4 flex justify-end">
              <Button onClick={handleSaveAppearance}>Save Changes</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
