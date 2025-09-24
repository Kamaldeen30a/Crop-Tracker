import Papa from 'papaparse';
import { Crop } from './storage';

export const exportToCSV = (crops: Crop[], filename = 'crop_data.csv') => {
  const csv = Papa.unparse(crops.map(crop => ({
    'Crop Name': crop.name,
    'Date Planted': crop.datePlanted,
    'Acreage': crop.acreage,
    'Expenses (₦)': crop.expenses,
    'Confirmed': crop.confirmed ? 'Yes' : 'No',
    'Notes': crop.notes,
    'Created': new Date(crop.createdAt).toLocaleDateString(),
    'Updated': new Date(crop.updatedAt).toLocaleDateString(),
  })));

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatNumber = (num: number, decimals = 1): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};