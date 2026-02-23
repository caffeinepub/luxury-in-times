import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddWatchForm from '@/components/admin/AddWatchForm';
import WatchManagementList from '@/components/admin/WatchManagementList';
import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate({ to: '/' });
  };

  return (
    <div className="min-h-screen bg-luxury-charcoal py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold text-luxury-white">Admin Dashboard</h1>
          <Button
            onClick={handleLogout}
            className="bg-black font-serif text-luxury-gold hover:bg-luxury-gold hover:text-black"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="add" className="space-y-8">
          <TabsList className="bg-luxury-black/50">
            <TabsTrigger value="add" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
              Add Watch
            </TabsTrigger>
            <TabsTrigger value="manage" className="data-[state=active]:bg-luxury-gold data-[state=active]:text-luxury-black">
              Manage Watches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="add">
            <div className="rounded-lg bg-luxury-black/50 p-6">
              <h2 className="mb-6 font-serif text-2xl font-bold text-luxury-white">Add New Watch</h2>
              <AddWatchForm />
            </div>
          </TabsContent>

          <TabsContent value="manage">
            <div className="rounded-lg bg-luxury-black/50 p-6">
              <h2 className="mb-6 font-serif text-2xl font-bold text-luxury-white">Manage Watches</h2>
              <WatchManagementList />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
