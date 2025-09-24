import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import ConfirmModal from '@/components/ConfirmModal';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { seedCrops } from '@/data/seedData';
import { Moon, Sun, Trash2, Database, Download } from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  const [showLoadSeedModal, setShowLoadSeedModal] = useState(false);

  const handleClearData = () => {
    try {
      storage.clearAll();
      toast.success('All data has been cleared successfully!');
      setShowClearDataModal(false);
    } catch (error) {
      toast.error('Failed to clear data. Please try again.');
      console.error('Error clearing data:', error);
    }
  };

  const handleLoadSeedData = () => {
    try {
      // Clear existing data first
      storage.clearAll();
      
      // Add seed data
      seedCrops.forEach(crop => {
        storage.addCrop(crop);
      });
      
      toast.success(`${seedCrops.length} sample crop records have been loaded!`);
      setShowLoadSeedModal(false);
    } catch (error) {
      toast.error('Failed to load sample data. Please try again.');
      console.error('Error loading seed data:', error);
    }
  };

  const currentCropCount = storage.getCrops().length;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Customize your experience and manage your data.
        </p>
      </div>

      {/* Theme Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            {theme === 'light' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>Appearance</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark themes
              </p>
            </div>
            <Switch 
              checked={theme === 'dark'} 
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5" />
            <span>Data Management</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Data Status */}
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Current Data</h4>
            <p className="text-sm text-muted-foreground">
              You have <strong>{currentCropCount}</strong> crop records stored locally.
            </p>
          </div>

          {/* Load Sample Data */}
          <div className="space-y-3">
            <div>
              <h4 className="font-medium">Sample Data</h4>
              <p className="text-sm text-muted-foreground">
                Load example crop records to test the application features.
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowLoadSeedModal(true)}
              className="w-full sm:w-auto"
            >
              <Download className="w-4 h-4 mr-2" />
              Load Sample Data ({seedCrops.length} records)
            </Button>
          </div>

          {/* Clear All Data */}
          <div className="space-y-3 pt-4 border-t">
            <div>
              <h4 className="font-medium text-destructive">Danger Zone</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete all crop records. This action cannot be undone.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setShowClearDataModal(true)}
              disabled={currentCropCount === 0}
              className="w-full sm:w-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong>Crop Yield & Expense Tracker</strong> helps Nigerian farmers manage their 
              agricultural operations by tracking crop plantings, monitoring expenses, and 
              organizing farming data.
            </p>
            <p>
              All data is stored locally in your browser. No personal information is sent 
              to external servers.
            </p>
            <p>
              Version 1.0.0 • Built with React, TypeScript, and Tailwind CSS
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Clear Data Confirmation */}
      <ConfirmModal
        open={showClearDataModal}
        onOpenChange={setShowClearDataModal}
        title="Clear All Data"
        description={`Are you sure you want to delete all ${currentCropCount} crop records? This action cannot be undone and all your data will be permanently lost.`}
        confirmText="Clear All Data"
        cancelText="Cancel"
        onConfirm={handleClearData}
        variant="destructive"
      />

      {/* Load Sample Data Confirmation */}
      <ConfirmModal
        open={showLoadSeedModal}
        onOpenChange={setShowLoadSeedModal}
        title="Load Sample Data"
        description={`This will replace your current data with ${seedCrops.length} sample crop records. ${currentCropCount > 0 ? `Your existing ${currentCropCount} records will be deleted.` : ''} Do you want to continue?`}
        confirmText="Load Sample Data"
        cancelText="Cancel"
        onConfirm={handleLoadSeedData}
        variant={currentCropCount > 0 ? "destructive" : "default"}
      />
    </div>
  );
};

export default Settings;