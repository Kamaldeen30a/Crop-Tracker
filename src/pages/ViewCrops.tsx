import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CropTable from '@/components/CropTable';
import CropForm from '@/components/CropForm';
import ConfirmModal from '@/components/ConfirmModal';
import { storage, Crop } from '@/utils/storage';

const ViewCrops: React.FC = () => {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [editingCrop, setEditingCrop] = useState<Crop | null>(null);
  const [deletingCropId, setDeletingCropId] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = () => {
    setCrops(storage.getCrops());
  };

  const handleEdit = (crop: Crop) => {
    setEditingCrop(crop);
    setShowEditDialog(true);
  };

  const handleEditSubmit = (cropData: Omit<Crop, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingCrop) return;

    try {
      const updatedCrop = storage.updateCrop(editingCrop.id, cropData);
      if (updatedCrop) {
        toast.success(`${updatedCrop.name} has been updated successfully!`);
        loadCrops();
        setShowEditDialog(false);
        setEditingCrop(null);
      } else {
        toast.error('Failed to update crop. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to update crop. Please try again.');
      console.error('Error updating crop:', error);
    }
  };

  const handleDelete = (id: string) => {
    setDeletingCropId(id);
  };

  const confirmDelete = () => {
    if (!deletingCropId) return;

    try {
      const success = storage.deleteCrop(deletingCropId);
      if (success) {
        toast.success('Crop has been deleted successfully!');
        loadCrops();
      } else {
        toast.error('Failed to delete crop. Please try again.');
      }
    } catch (error) {
      toast.error('Failed to delete crop. Please try again.');
      console.error('Error deleting crop:', error);
    } finally {
      setDeletingCropId(null);
    }
  };

  const deletingCrop = deletingCropId ? crops.find(c => c.id === deletingCropId) : null;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Crop Records</h1>
        <p className="text-muted-foreground">
          View, search, and manage all your crop plantings in one place.
        </p>
      </div>

      <CropTable 
        crops={crops} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Crop</DialogTitle>
            <DialogDescription>
              Update the details of your crop record.
            </DialogDescription>
          </DialogHeader>
          {editingCrop && (
            <CropForm
              crop={editingCrop}
              title="Edit Crop"
              onSubmit={handleEditSubmit}
              onCancel={() => {
                setShowEditDialog(false);
                setEditingCrop(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!deletingCropId}
        onOpenChange={(open) => !open && setDeletingCropId(null)}
        title="Delete Crop"
        description={`Are you sure you want to delete "${deletingCrop?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default ViewCrops;