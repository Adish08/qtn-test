// utils/pdf.ts

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generatePDF = async (elementId: string, filename: string = 'quotation.pdf'): Promise<boolean> => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Element not found');
    
    // Hide elements not needed in PDF
    const elementsToHide = document.querySelectorAll('.no-print');
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    });
    
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 295; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
    
    // Add more pages if content is longer than one page
    let heightLeft = imgHeight;
    let position = 0;
    
    while (heightLeft > pageHeight) {
      position = heightLeft - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, -position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    pdf.save(filename);
    
    // Restore hidden elements
    elementsToHide.forEach(el => {
      (el as HTMLElement).style.display = '';
    });
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};