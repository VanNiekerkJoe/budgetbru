
import React from 'react';
import NavBar from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Bell, CircleDollarSign, FileText, HelpCircle, LogOut, Settings, User } from 'lucide-react';

const Profile: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-28">
      <header className="bg-budgetbru-dark text-white py-4 px-4 shadow-md">
        <h1 className="text-xl font-bold">Profile</h1>
        <p className="text-sm opacity-90">Manage your account</p>
      </header>
      
      <main className="container mx-auto px-4 py-4 space-y-6 max-w-md">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-budgetbru-purple text-white flex items-center justify-center text-xl font-bold">
                BP
              </div>
              <div>
                <CardTitle>Budget Pro</CardTitle>
                <CardDescription>student@university.ac.za</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-3">
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <Bell size={18} className="text-gray-500" />
                <span>Notifications</span>
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
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              <Settings size={16} className="mr-2" />
              Account Settings
            </Button>
          </CardFooter>
        </Card>
        
        <div className="space-y-3">
          <Button variant="ghost" className="w-full justify-start text-left font-normal h-12">
            <User size={18} className="mr-3 text-gray-500" />
            Personal Information
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-left font-normal h-12">
            <FileText size={18} className="mr-3 text-gray-500" />
            Budget Templates
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-left font-normal h-12">
            <HelpCircle size={18} className="mr-3 text-gray-500" />
            Help & Support
          </Button>
          
          <Button variant="ghost" className="w-full justify-start text-left font-normal h-12 text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut size={18} className="mr-3" />
            Log Out
          </Button>
        </div>
        
        <div className="bg-white rounded-xl p-4 shadow-md text-center">
          <h3 className="font-semibold mb-2 text-budgetbru-purple">BudgetBru</h3>
          <p className="text-xs text-gray-500">Version 1.0.0 (Beta)</p>
          <p className="text-xs text-gray-500">Made with 💜 in South Africa</p>
        </div>
      </main>
      
      <NavBar />
    </div>
  );
};

export default Profile;
