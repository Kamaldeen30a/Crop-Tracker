# Crop Yield & Expense Tracker

A comprehensive web application for Nigerian farmers to track crop plantings, monitor expenses, and manage agricultural operations efficiently.

## Features

### 🌱 **Dashboard**
- Summary cards showing total crops, acreage, expenses, and confirmation status
- Recent crops overview with quick navigation
- Beautiful agricultural-themed design with earth tones

### ➕ **Add Crop Form**
- Dropdown of popular Nigerian crops (maize, cassava, yam, rice, etc.) with custom entry option
- Date picker for planting dates
- Acreage and expense tracking
- Notes and confirmation status
- Form validation with helpful error messages

### 📊 **View & Manage Crops**
- Responsive table/card view for mobile and desktop
- Search and filter by crop name, date range, and status
- Pagination for large datasets (20+ records)
- Inline editing capabilities
- Delete with confirmation modals

### 📤 **Export Capabilities**
- CSV export for spreadsheet applications
- Printable PDF reports with summary statistics
- Toast notifications for success/failure feedback

### ⚙️ **Settings**
- Dark/Light mode toggle with system preference detection
- Load sample data for demonstration
- Clear all data with confirmation
- Local storage management

## Technical Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui with custom variants
- **Data Storage**: localStorage with structured utility functions
- **Export**: PapaParse (CSV), react-to-print (PDF)
- **Notifications**: react-hot-toast
- **Routing**: React Router 6

## Design System

The application features a beautiful agricultural theme with:
- **Primary Colors**: Agricultural greens (#10B981)
- **Earth Tones**: Warm browns and natural hues
- **Gradients**: Subtle green-to-emerald flows
- **Typography**: Clean, readable fonts optimized for farming data
- **Responsive**: Mobile-first design with tablet and desktop layouts

## Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Modern web browser

### Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd crop-yield-expense-tracker

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Data Structure

### Crop Record Schema
```typescript
interface Crop {
  id: string;
  name: string;           // Crop name
  datePlanted: string;    // ISO date string
  acreage: number;        // Land area in acres
  expenses: number;       // Expenses in Nigerian Naira
  notes: string;          // Additional information
  confirmed: boolean;     // Planting confirmation status
  createdAt: string;      // Record creation timestamp
  updatedAt: string;      // Last update timestamp
}
```

## Storage & Data Management

- **Local Storage**: All data persists in browser localStorage
- **No Backend Required**: Fully client-side application
- **Export Options**: CSV and PDF for external data usage
- **Sample Data**: Pre-loaded demonstration records available

## Future Backend Integration

The application is designed to easily integrate with backend services:

```typescript
// Example Supabase integration
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(url, key);

// Replace storage.ts functions with API calls
export const storage = {
  async getCrops() {
    const { data } = await supabase.from('crops').select('*');
    return data || [];
  },
  // ... other CRUD operations
};
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Agricultural Context

This application is specifically designed for Nigerian farmers with:
- **Local Crop Types**: Pre-populated with common Nigerian crops
- **Currency**: Nigerian Naira (₦) formatting
- **Date Formats**: DD/MM/YYYY format common in Nigeria
- **Mobile-First**: Optimized for mobile devices common in rural areas

## License

MIT License - feel free to use this project for your agricultural management needs.

## Support

For issues or questions:
- Open a GitHub issue
- Review the troubleshooting section
- Check the sample data for usage examples

---

**Built with ❤️ for Nigerian farmers and agricultural communities worldwide.**
