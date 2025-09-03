import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import PDFDocument from 'pdfkit';
import { BillType, ctnBllInt, TransactionType } from '@/types/myTypes';
import { getRevenueData } from '@/services/revenue-data';

export async function POST(request: NextRequest) {
  try {
    const { format, startRange, endRange, timeframe } = await request.json();

    // Use the shared utility function to get revenue data
    const { bills, canteen, transactions } = await getRevenueData(startRange, endRange);

    if (format === 'excel') {
      return generateExcelReport(bills, canteen, timeframe, startRange, endRange);
    } else if (format === 'pdf') {
      return generatePDFReport(bills, canteen, timeframe, startRange, endRange);
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}

interface BreakdownData {
  Period: string;
  'Total Bills': number;
  'Table Revenue': number;
  'Canteen Revenue': number;
  'Total Revenue': number;
}

function generateBreakdownData(bills: BillType[], timeframe: string, startDate: string): BreakdownData[] {
  const breakdownMap = new Map<string, BreakdownData>();
  
  bills.forEach(bill => {
    if (!bill.checkIn) return;
    
    const date = new Date(bill.checkIn);
    let periodKey: string;
    let periodDisplay: string;
    
    switch (timeframe) {
      case 'tm': // This Month - show daily breakdown
      case 'lm': // Last Month - show daily breakdown
      case 'c':  // Custom range - show daily breakdown
      case 'od': // One day - show hourly breakdown
        if (timeframe === 'od') {
          // Hourly breakdown
          const hour = date.getHours();
          periodKey = `${date.toDateString()}-${hour}`;
          periodDisplay = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
        } else {
          // Daily breakdown
          periodKey = date.toDateString();
          periodDisplay = date.toLocaleDateString('en-GB');
        }
        break;
        
      case 'ty': // This Year - show monthly breakdown
      case 'ly': // Last Year - show monthly breakdown
        const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
        periodKey = monthKey;
        periodDisplay = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        break;
        
      case 'td': // Today - show hourly breakdown
      default:
        const hour = date.getHours();
        periodKey = `${date.toDateString()}-${hour}`;
        periodDisplay = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 1).toString().padStart(2, '0')}:00`;
        break;
    }
    
    if (!breakdownMap.has(periodKey)) {
      breakdownMap.set(periodKey, {
        Period: periodDisplay,
        'Total Bills': 0,
        'Table Revenue': 0,
        'Canteen Revenue': 0,
        'Total Revenue': 0,
      });
    }
    
    const breakdown = breakdownMap.get(periodKey)!;
    breakdown['Total Bills']++;
    breakdown['Total Revenue'] += bill.totalAmount || 0;
    breakdown['Table Revenue'] += bill.tableMoney || 0;
    breakdown['Canteen Revenue'] += bill.canteenMoney || 0;
  });
  
  return Array.from(breakdownMap.values()).sort((a, b) => {
    // Sort by period - this is a simplified sort, could be enhanced
    return a.Period.localeCompare(b.Period);
  });
}

function generateExcelReport(
  bills: BillType[], 
  canteen: ctnBllInt[], 
  timeframe: string,
  startRange: string,
  endRange: string
) {
  const workbook = XLSX.utils.book_new();

  // Bills sheet
  const billsData = bills.map(bill => ({
    'Bill ID': bill.id,
    'Table': bill.table?.name || 'N/A',
    'Check In': bill.checkIn ? new Date(bill.checkIn).toLocaleString() : 'N/A',
    'Time Played': bill.timePlayed || 0,
    'Check Out': bill.checkIn ? new Date(bill.timePlayed ? bill.checkIn + bill.timePlayed : bill.checkIn).toLocaleString() : 'N/A',
    'Total Amount': bill.totalAmount,
    'Canteen Money': bill.canteenMoney || 0,
    'Payment Mode': bill.paymentMode,
  }));
  const billsSheet = XLSX.utils.json_to_sheet(billsData);
  XLSX.utils.book_append_sheet(workbook, billsSheet, 'Bills');

  // Canteen sheet
  const canteenData = canteen.map(item => ({
    'Date': item.bill.checkOut ? new Date(item.bill.checkOut).toLocaleString() : 'N/A',
    'Item': item.item?.name || 'N/A',
    'Price': item.item?.price || 0,
    'Quantity': item.quantity,
    'Amount': item.amount,
    'Bill ID': item.billId || 'N/A'
  }));
  const canteenSheet = XLSX.utils.json_to_sheet(canteenData);
  XLSX.utils.book_append_sheet(workbook, canteenSheet, 'Canteen');

  // Breakdown sheet - matches UI breakdown functionality
  const breakdownData = generateBreakdownData(bills, timeframe, startRange);
  const breakdownSheet = XLSX.utils.json_to_sheet(breakdownData);
  XLSX.utils.book_append_sheet(workbook, breakdownSheet, 'Breakdown');

  // Summary sheet
  const totalRevenue = bills.reduce((acc, bill) => acc + bill.totalAmount, 0);
  const canteenRevenue = bills.reduce((acc, bill) => acc + (bill.canteenMoney ?? 0), 0);
  const tableRevenue = bills.reduce((acc, bill) => acc + (bill.tableMoney ?? 0), 0);
  const summaryData = [
    { 'Metric': 'Total Revenue', 'Value': totalRevenue },
    { 'Metric': 'Table Revenue', 'Value': tableRevenue },
    { 'Metric': 'Canteen Revenue', 'Value': canteenRevenue },
    { 'Metric': 'Total Bills', 'Value': bills.length },
    { 'Metric': 'Total Canteen Items', 'Value': canteen.length },
    { 'Metric': 'Timeframe', 'Value': getTimeframeLabel(timeframe) },
    { 'Metric': 'Start Date', 'Value': startRange ? new Date(startRange).toLocaleDateString() : 'N/A' },
    { 'Metric': 'End Date', 'Value': endRange ? new Date(endRange).toLocaleDateString() : 'N/A' }
  ];
  const summarySheet = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename=revenue-report-${new Date().toISOString().split('T')[0]}.xlsx`
    }
  });
}

function generatePDFReport(
  bills: BillType[], 
  canteen: ctnBllInt[], 
  timeframe: string,
  startRange: string,
  endRange: string
) {
  return new Promise<NextResponse>((resolve) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      resolve(new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=revenue-report-${new Date().toISOString().split('T')[0]}.pdf`
        }
      }));
    });

    // Header
    doc.fontSize(20).text('Revenue Report', { align: 'center' });
    doc.moveDown();

    // Summary section
    doc.fontSize(16).text('Summary', { underline: true });
    doc.moveDown(0.5);

    const totalRevenue = bills.reduce((acc, bill) => acc + bill.totalAmount, 0);
    const canteenRevenue = bills.reduce((acc, bill) => acc + (bill.canteenMoney ?? 0), 0);
    const tableRevenue = bills.reduce((acc, bill) => acc + (bill.tableMoney ?? 0), 0);

    doc.fontSize(12);
    doc.text(`Report Period: ${getTimeframeLabel(timeframe)}`);
    if (startRange) doc.text(`Start Date: ${new Date(startRange).toLocaleDateString()}`);
    if (endRange) doc.text(`End Date: ${new Date(endRange).toLocaleDateString()}`);
    doc.text(`Total Revenue: ₹${totalRevenue.toFixed(2)}`);
    doc.text(`Table Revenue: ₹${tableRevenue.toFixed(2)}`);
    doc.text(`Canteen Revenue: ₹${canteenRevenue.toFixed(2)}`);
    doc.text(`Total Bills: ${bills.length}`);
    doc.text(`Total Canteen Items: ${canteen.length}`);
    
    doc.moveDown();

    // Bills section
    if (bills.length > 0) {
      doc.fontSize(16).text('Recent Bills', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);

      bills.slice(0, 10).forEach((bill, index) => {
        doc.text(`${index + 1}. Table: ${bill.table?.name || 'N/A'} | Amount: ₹${bill.totalAmount} | Payment: ${bill.paymentMode}`);
      });

      if (bills.length > 10) {
        doc.text(`... and ${bills.length - 10} more bills`);
      }
      doc.moveDown();
    }

    // Canteen section
    if (canteen.length > 0) {
      doc.fontSize(16).text('Top Canteen Items', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);

      canteen.slice(0, 10).forEach((item, index) => {
        doc.text(`${index + 1}. ${item.item?.name || 'N/A'} | Qty: ${item.quantity} | Amount: ₹${item.amount}`);
      });

      if (canteen.length > 10) {
        doc.text(`... and ${canteen.length - 10} more items`);
      }
      doc.moveDown();
    }

    // Breakdown section
    const breakdownData = generateBreakdownData(bills, timeframe, startRange);
    if (breakdownData.length > 0) {
      doc.fontSize(16).text('Revenue Breakdown', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10);

      breakdownData.slice(0, 15).forEach((item, index) => {
        doc.text(`${index + 1}. ${item.Period} | Bills: ${item['Total Bills']} | Table: ₹${item['Table Revenue']} | Canteen: ₹${item['Canteen Revenue']} | Total: ₹${item['Total Revenue']}`);
      });

      if (breakdownData.length > 15) {
        doc.text(`... and ${breakdownData.length - 15} more periods`);
      }
    }

    doc.end();
  });
}

function getTimeframeLabel(timeframe: string): string {
  const labels: { [key: string]: string } = {
    'td': 'Today',
    'tm': 'This Month',
    'lm': 'Last Month',
    'ty': 'This Year',
    'ly': 'Last Year',
    'c': 'Custom Range',
    'od': 'One Day'
  };
  return labels[timeframe] || 'Unknown';
}
