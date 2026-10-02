'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';

export function DownloadInvoiceButton({ orderId, discount, discountCode }: { orderId: string, discount?: number, discountCode?: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const { default: jsPDF } = await import('jspdf');
      const { default: autoTable } = await import('jspdf-autotable');
      
      const doc = new jsPDF();
      
      // Company Header
      doc.setFontSize(22);
      doc.text('DirectCrest', 14, 20);
      doc.setFontSize(10);
      doc.text('123 Commerce Avenue, Dhaka, Bangladesh', 14, 28);
      doc.text('Phone: +880 1700 000000 | Email: support@directcrest.com', 14, 34);
      
      // Invoice Details
      doc.setFontSize(16);
      doc.text('INVOICE', 14, 48);
      doc.setFontSize(10);
      doc.text(`Order ID: ${orderId}`, 14, 56);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 62);
      
      // Items placeholder (since we don't have full items array in this component, we'll list a summary)
      // If we had items, we'd use autoTable here. For now, just order summary:
      autoTable(doc, {
        startY: 70,
        head: [['Description', 'Amount']],
        body: [
          ['Order Subtotal (Estimated)', discount ? 'See totals' : 'Total Applied'],
        ],
      });
      
      let finalY = (doc as any).lastAutoTable.finalY || 70;
      
      if (discount && discount > 0) {
        doc.text(`Discount Applied: $${discount.toFixed(2)} (Code: ${discountCode || 'N/A'})`, 14, finalY + 10);
        finalY += 10;
      }
      
      // Policy
      doc.setFontSize(9);
      doc.text('Online PDF Invoice Policy:', 14, finalY + 20);
      doc.text('1. Returns are accepted within 7 days of delivery.', 14, finalY + 26);
      doc.text('2. Please keep this invoice for warranty claims.', 14, finalY + 32);
      doc.text('3. This is a computer generated invoice and requires no signature.', 14, finalY + 38);
      
      doc.save(`Invoice-${orderId}.pdf`);
    } catch (error) {
      console.error("Failed to download invoice", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={isDownloading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-white hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
    >
      <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
      {isDownloading ? 'Downloading...' : 'Download PDF'}
    </button>
  );
}

import { Trash2 } from 'lucide-react';
import { hideOrderFromHistory, hideAllOrdersFromHistory } from '@/actions/order';
import { useRouter } from 'next/navigation';

export function DeleteOrderButton({ orderId }: { orderId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to hide this order from your history?')) return;
    setIsDeleting(true);
    await hideOrderFromHistory(orderId);
    setIsDeleting(false);
    window.location.reload();
  };

  return (
    <button 
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
      title="Delete from history"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}

export function DeleteAllOrdersButton({ userId }: { userId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAll = async () => {
    if (!confirm('Are you sure you want to clear your entire order history?')) return;
    setIsDeleting(true);
    await hideAllOrdersFromHistory(userId);
    setIsDeleting(false);
    window.location.reload();
  };

  return (
    <button 
      onClick={handleDeleteAll}
      disabled={isDeleting}
      className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white font-semibold rounded-lg transition-colors disabled:opacity-50 border border-red-500/50 text-sm"
    >
      <Trash2 className="w-4 h-4" />
      {isDeleting ? 'Clearing...' : 'Clear History'}
    </button>
  );
}

