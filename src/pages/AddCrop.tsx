import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import CropForm from '@/components/CropForm';
import { storage, Crop } from '@/utils/storage';

const AddCrop: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newCrop = storage.addCrop(cropData);
      toast.success(`${newCrop.name} has been added successfully!`);
      navigate('/');
    } catch (error) {
      toast.error('Failed to add crop. Please try again.');
      console.error('Error adding crop:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Add New Crop</h1>
        <p className="text-muted-foreground">
          Record details about a new crop planting to track your farming operations.
        </p>
      </div>
      
      <CropForm 
        title="Add New Crop"
        onSubmit={handleSubmit}
        onCancel={() => navigate('/')}
      />
    </div>
  );
};

export default AddCrop;