import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { nigerianCrops } from '@/data/seedData';
import { Crop } from '@/utils/storage';

interface CropFormProps {
  crop?: Crop;
  onSubmit: (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel?: () => void;
  title?: string;
}

const CropForm: React.FC<CropFormProps> = ({ crop, onSubmit, onCancel, title = "Add New Crop" }) => {
  const [formData, setFormData] = useState({
    name: '',
    datePlanted: new Date(),
    acreage: '',
    expenses: '',
    notes: '',
    confirmed: false,
    customCrop: '',
  });

  const [showCustomCrop, setShowCustomCrop] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (crop) {
      setFormData({
        name: crop.name,
        datePlanted: new Date(crop.datePlanted),
        acreage: crop.acreage.toString(),
        expenses: crop.expenses.toString(),
        notes: crop.notes,
        confirmed: crop.confirmed,
        customCrop: '',
      });
      setShowCustomCrop(!nigerianCrops.includes(crop.name));
    }
  }, [crop]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const cropName = showCustomCrop ? formData.customCrop : formData.name;
    if (!cropName.trim()) {
      newErrors.name = 'Crop name is required';
    }

    if (!formData.acreage || parseFloat(formData.acreage) <= 0) {
      newErrors.acreage = 'Valid acreage is required';
    }

    if (!formData.expenses || parseFloat(formData.expenses) < 0) {
      newErrors.expenses = 'Valid expenses amount is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const cropName = showCustomCrop ? formData.customCrop : formData.name;
    
    onSubmit({
      name: cropName,
      datePlanted: formData.datePlanted.toISOString().split('T')[0],
      acreage: parseFloat(formData.acreage),
      expenses: parseFloat(formData.expenses),
      notes: formData.notes,
      confirmed: formData.confirmed,
    });
  };

  const handleCropSelect = (value: string) => {
    if (value === 'custom') {
      setShowCustomCrop(true);
      setFormData(prev => ({ ...prev, name: '', customCrop: '' }));
    } else {
      setShowCustomCrop(false);
      setFormData(prev => ({ ...prev, name: value, customCrop: '' }));
    }
    setErrors(prev => ({ ...prev, name: '' }));
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
          )}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="crop-select">Crop Name *</Label>
            <Select value={showCustomCrop ? 'custom' : formData.name} onValueChange={handleCropSelect}>
              <SelectTrigger id="crop-select">
                <SelectValue placeholder="Select a crop" />
              </SelectTrigger>
              <SelectContent>
                {nigerianCrops.map((crop) => (
                  <SelectItem key={crop} value={crop}>
                    {crop}
                  </SelectItem>
                ))}
                <SelectItem value="custom">Other (specify below)</SelectItem>
              </SelectContent>
            </Select>
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          {showCustomCrop && (
            <div className="space-y-2">
              <Label htmlFor="custom-crop">Custom Crop Name *</Label>
              <Input
                id="custom-crop"
                value={formData.customCrop}
                onChange={(e) => setFormData(prev => ({ ...prev, customCrop: e.target.value }))}
                placeholder="Enter crop name"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label>Date Planted *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.datePlanted && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.datePlanted ? format(formData.datePlanted, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.datePlanted}
                  onSelect={(date) => date && setFormData(prev => ({ ...prev, datePlanted: date }))}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="acreage">Acreage of Land *</Label>
              <Input
                id="acreage"
                type="number"
                step="0.1"
                min="0"
                value={formData.acreage}
                onChange={(e) => setFormData(prev => ({ ...prev, acreage: e.target.value }))}
                placeholder="e.g., 2.5"
              />
              {errors.acreage && <p className="text-sm text-destructive">{errors.acreage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Expenses (₦) *</Label>
              <Input
                id="expenses"
                type="number"
                min="0"
                value={formData.expenses}
                onChange={(e) => setFormData(prev => ({ ...prev, expenses: e.target.value }))}
                placeholder="e.g., 150000"
              />
              {errors.expenses && <p className="text-sm text-destructive">{errors.expenses}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Additional Information</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional details about planting, variety, expected harvest, etc."
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmed"
              checked={formData.confirmed}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, confirmed: checked as boolean }))
              }
            />
            <Label 
              htmlFor="confirmed" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Planting Confirmed
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              {crop ? 'Update Crop' : 'Save Crop'}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default CropForm;