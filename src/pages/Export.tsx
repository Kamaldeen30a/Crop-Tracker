import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Printer } from 'lucide-react';
import { storage } from '@/utils/storage';
import { exportToCSV, formatCurrency, formatDate, formatNumber } from '@/utils/export';

const Export: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const crops = storage.getCrops();
  const stats = storage.getTotalStats();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Crop Records - ${new Date().toLocaleDateString()}`,
    onAfterPrint: () => toast.success('Print preview opened successfully!'),
  });

  const handleCSVExport = () => {
    try {
      exportToCSV(crops, `crop_records_${new Date().toISOString().split('T')[0]}.csv`);
      toast.success('CSV file downloaded successfully!');
    } catch (error) {
      toast.error('Failed to export CSV. Please try again.');
      console.error('Export error:', error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Export Data</h1>
        <p className="text-muted-foreground">
          Export your crop records to CSV or print a detailed report.
        </p>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Download className="w-5 h-5" />
              <span>CSV Export</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Download all crop data as a CSV file for use in spreadsheet applications.
            </p>
            <Button onClick={handleCSVExport} className="w-full">
              <FileText className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Printer className="w-5 h-5" />
              <span>Print Report</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Generate a printable report with summary statistics and crop details.
            </p>
            <Button onClick={handlePrint} variant="outline" className="w-full">
              <Printer className="w-4 h-4 mr-2" />
              Print Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Printable Report */}
      <div ref={printRef} className="print:p-8">
        <Card className="print:shadow-none print:border-0">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-2xl mb-2">Crop Yield & Expense Report</CardTitle>
            <p className="text-muted-foreground">
              Generated on {new Date().toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </CardHeader>
          
          <CardContent className="pt-6">
            {/* Summary Statistics */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Summary Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4">
                <div className="bg-muted/50 p-4 rounded-lg print:border print:bg-gray-50">
                  <div className="text-2xl font-bold text-primary">{stats.totalCrops}</div>
                  <div className="text-sm text-muted-foreground">Total Crops</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg print:border print:bg-gray-50">
                  <div className="text-2xl font-bold text-primary">{formatNumber(stats.totalAcreage)}</div>
                  <div className="text-sm text-muted-foreground">Total Acres</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg print:border print:bg-gray-50">
                  <div className="text-2xl font-bold text-primary">{formatCurrency(stats.totalExpenses)}</div>
                  <div className="text-sm text-muted-foreground">Total Expenses</div>
                </div>
                <div className="bg-muted/50 p-4 rounded-lg print:border print:bg-gray-50">
                  <div className="text-2xl font-bold text-primary">{stats.confirmedCrops}</div>
                  <div className="text-sm text-muted-foreground">Confirmed Crops</div>
                </div>
              </div>
            </div>

            {/* Crop Details */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Crop Details</h3>
              {crops.length > 0 ? (
                <div className="rounded-md border print:border-black">
                  <Table>
                    <TableHeader>
                      <TableRow className="print:border-black">
                        <TableHead className="print:border print:border-black print:font-bold print:text-black">Crop</TableHead>
                        <TableHead className="print:border print:border-black print:font-bold print:text-black">Date Planted</TableHead>
                        <TableHead className="print:border print:border-black print:font-bold print:text-black">Acreage</TableHead>
                        <TableHead className="print:border print:border-black print:font-bold print:text-black">Expenses</TableHead>
                        <TableHead className="print:border print:border-black print:font-bold print:text-black">Status</TableHead>
                        <TableHead className="print:border print:border-black print:font-bold print:text-black">Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {crops.map((crop) => (
                        <TableRow key={crop.id} className="print:border-black">
                          <TableCell className="font-medium print:border print:border-black print:text-black">
                            {crop.name}
                          </TableCell>
                          <TableCell className="print:border print:border-black print:text-black">
                            {formatDate(crop.datePlanted)}
                          </TableCell>
                          <TableCell className="print:border print:border-black print:text-black">
                            {formatNumber(crop.acreage)} acres
                          </TableCell>
                          <TableCell className="print:border print:border-black print:text-black">
                            {formatCurrency(crop.expenses)}
                          </TableCell>
                          <TableCell className="print:border print:border-black print:text-black">
                            <Badge variant={crop.confirmed ? "default" : "secondary"} className="print:text-black print:border print:border-black">
                              {crop.confirmed ? 'Confirmed' : 'Pending'}
                            </Badge>
                          </TableCell>
                          <TableCell className="print:border print:border-black print:text-black max-w-[200px]">
                            <div className="truncate" title={crop.notes}>
                              {crop.notes || '-'}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No crop records found.
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground print:text-black">
              <p>Generated by Crop Yield & Expense Tracker</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;