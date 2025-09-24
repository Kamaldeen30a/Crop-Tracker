import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SummaryCard from '@/components/SummaryCard';
import { storage } from '@/utils/storage';
import { formatCurrency, formatNumber } from '@/utils/export';
import { Sprout, MapPin, DollarSign, CheckCircle, Plus, List, Download, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const stats = storage.getTotalStats();
  const recentCrops = storage.getCrops().slice(-5).reverse();

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-hero p-8 text-primary-foreground">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome to Crop Tracker
          </h1>
          <p className="text-lg opacity-90 mb-6">
            Manage your farming operations with ease. Track crops, monitor expenses, and grow your agricultural business.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/add-crop">
              <Button variant="secondary" size="lg">
                <Plus className="w-5 h-5 mr-2" />
                Add New Crop
              </Button>
            </Link>
            <Link to="/view-crops">
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <List className="w-5 h-5 mr-2" />
                View All Crops
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute right-0 top-0 w-64 h-64 opacity-10">
            <Sprout className="w-full h-full" />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Crops"
          value={stats.totalCrops}
          subtitle={`${stats.confirmedCrops} confirmed`}
          icon={Sprout}
          trend="neutral"
        />
        <SummaryCard
          title="Total Acreage"
          value={`${formatNumber(stats.totalAcreage)} acres`}
          subtitle="Land under cultivation"
          icon={MapPin}
          trend="up"
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          subtitle="Investment in crops"
          icon={DollarSign}
          trend="neutral"
        />
        <SummaryCard
          title="Confirmed Crops"
          value={`${stats.confirmedCrops}/${stats.totalCrops}`}
          subtitle={`${Math.round((stats.confirmedCrops / Math.max(stats.totalCrops, 1)) * 100)}% confirmed`}
          icon={CheckCircle}
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Crops */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Recent Crops</span>
              </CardTitle>
              <Link to="/view-crops">
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentCrops.length > 0 ? (
                <div className="space-y-4">
                  {recentCrops.map((crop) => (
                    <div key={crop.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{crop.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatNumber(crop.acreage)} acres • {formatCurrency(crop.expenses)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          crop.confirmed 
                            ? 'bg-success/10 text-success' 
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {crop.confirmed ? 'Confirmed' : 'Pending'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Sprout className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-4">No crops recorded yet</p>
                  <Link to="/add-crop">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Crop
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/add-crop" className="block">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Plus className="w-5 h-5 mr-3" />
                  Add New Crop
                </Button>
              </Link>
              
              <Link to="/view-crops" className="block">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <List className="w-5 h-5 mr-3" />
                  Manage Crops
                </Button>
              </Link>
              
              <Link to="/export" className="block">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Download className="w-5 h-5 mr-3" />
                  Export Data
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">💡 Pro Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Keep your crop records updated and confirm plantings as soon as they're done. 
                This helps with accurate expense tracking and better farming insights.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;