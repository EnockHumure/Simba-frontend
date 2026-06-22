"use client";

import { Printer } from "lucide-react";
import { formatPrice, formatDateTime } from "@/lib/utils";

interface OrderReceiptProps {
  order: {
    orderNumber: string;
    createdAt: string;
    user?: { name: string; email: string; phone?: string };
    branch?: { name: string; address?: string };
    fulfillmentType?: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    depositAmount?: number;
    total: number;
    paymentStatus: string;
    status: string;
  };
}

export function PrintableReceipt({ order }: OrderReceiptProps) {
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 40px; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px; }
          .header h1 { color: #fc7d00; margin-bottom: 5px; }
          .section { margin: 20px 0; }
          .section-title { font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px; }
          .info-item { padding: 5px 0; }
          .info-label { font-weight: bold; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #f8f8f8; font-weight: bold; }
          .text-right { text-align: right; }
          .totals { margin-top: 20px; }
          .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
          .totals-row.total { font-weight: bold; font-size: 1.2em; border-top: 2px solid #333; padding-top: 10px; margin-top: 10px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 0.9em; border-top: 1px solid #ddd; padding-top: 20px; }
          @media print {
            body { padding: 20px; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>SIMBA SUPERMARKET</h1>
          <p>Kigali, Rwanda</p>
          <p>Email: info@simbasupermarket.rw</p>
        </div>

        <div class="section">
          <h2 class="section-title">INVOICE</h2>
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Order Number:</div>
              <div>${order.orderNumber}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Date:</div>
              <div>${formatDateTime(order.createdAt)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Customer:</div>
              <div>${order.user?.name || "Guest"}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Phone:</div>
              <div>${order.user?.phone || "N/A"}</div>
            </div>
            ${order.branch ? `
            <div class="info-item">
              <div class="info-label">Branch:</div>
              <div>${order.branch.name}</div>
            </div>
            ` : ""}
            <div class="info-item">
              <div class="info-label">Type:</div>
              <div>${order.fulfillmentType === "pickup" ? "Pickup" : "Delivery"}</div>
            </div>
          </div>
        </div>

        <div class="section">
          <h3 class="section-title">Items</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th class="text-right">Quantity</th>
                <th class="text-right">Price</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td class="text-right">${item.quantity}</td>
                  <td class="text-right">${formatPrice(item.price)}</td>
                  <td class="text-right">${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>${formatPrice(order.subtotal)}</span>
          </div>
          ${order.depositAmount ? `
          <div class="totals-row">
            <span>Deposit:</span>
            <span>${formatPrice(order.depositAmount)}</span>
          </div>
          ` : ""}
          <div class="totals-row total">
            <span>TOTAL:</span>
            <span>${formatPrice(order.total)}</span>
          </div>
        </div>

        <div class="section">
          <div class="info-item">
            <div class="info-label">Payment Status:</div>
            <div style="text-transform: capitalize;">${order.paymentStatus}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Order Status:</div>
            <div style="text-transform: capitalize;">${order.status.replace("_", " ")}</div>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for shopping with Simba Supermarket!</p>
          <p>For support: info@simbasupermarket.rw</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
    >
      <Printer className="h-4 w-4" />
      Print Invoice
    </button>
  );
}
