import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportBlueprintToPDF = (blueprint) => {
  try {
    const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let currentY = margin;

  // Helper function to add a new page if needed
  const checkPageBreak = (neededSpace) => {
    if (currentY + neededSpace > pageHeight - margin) {
      doc.addPage();
      currentY = margin;
      return true;
    }
    return false;
  };

  // Helper to add text with wrapping
  const addText = (text, fontSize = 12, isBold = false, color = '#000000', align = 'left') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.setTextColor(color);
    
    const safeText = text !== null && text !== undefined ? String(text) : '';
    const textLines = doc.splitTextToSize(safeText, pageWidth - margin * 2);
    const lineHeight = fontSize * 0.4;
    
    checkPageBreak(textLines.length * lineHeight);
    
    doc.text(textLines, align === 'center' ? pageWidth / 2 : margin, currentY, { align });
    currentY += textLines.length * lineHeight + 5;
  };

  // --- Title Section ---
  addText(blueprint.product_summary?.title || 'Project Blueprint', 24, true, '#4f46e5', 'center');
  currentY += 5;
  addText(blueprint.product_summary?.description || '', 12, false, '#4b5563', 'center');
  currentY += 15;

  // --- Core Features ---
  addText('1. Core Features', 16, true, '#111827');
  currentY += 5;
  
  const featureData = (blueprint.features || []).map(f => [
    f.name || '',
    f.description || '',
    f.priority?.toUpperCase() || ''
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Feature', 'Description', 'Priority']],
    body: featureData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 30 }
    }
  });
  
  currentY = doc.lastAutoTable.finalY + 15;

  // --- Technical Roadmap (Tasks) ---
  checkPageBreak(30);
  addText('2. Technical Roadmap', 16, true, '#111827');
  currentY += 5;

  const taskData = (blueprint.tasks || []).map(t => [
    t.title || '',
    t.description || '',
    t.priority?.toUpperCase() || '',
    t.estimated_time || ''
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Task', 'Description', 'Priority', 'Time']],
    body: taskData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25 },
      3: { cellWidth: 25 }
    }
  });

  currentY = doc.lastAutoTable.finalY + 15;

  // --- API Endpoints ---
  checkPageBreak(30);
  addText('3. API Endpoints', 16, true, '#111827');
  currentY += 5;

  const apiData = (blueprint.apis || []).map(api => [
    api.method?.toUpperCase() || 'GET',
    api.endpoint || '',
    api.description || ''
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Method', 'Endpoint', 'Description']],
    body: apiData,
    theme: 'grid',
    headStyles: { fillColor: [79, 70, 229] },
    margin: { left: margin, right: margin },
    columnStyles: {
      0: { cellWidth: 25, fontStyle: 'bold' },
      1: { cellWidth: 60, fontStyle: 'bold', textColor: [75, 85, 99] },
      2: { cellWidth: 'auto' }
    }
  });

  currentY = doc.lastAutoTable.finalY + 15;

  // --- Database Schema ---
  checkPageBreak(30);
  addText('4. Database Schema', 16, true, '#111827');
  currentY += 5;

  blueprint.database_schema?.collections?.forEach(coll => {
    checkPageBreak(20);
    addText(`Collection: ${coll.name}`, 14, true, '#374151');
    
    const fieldData = (coll.fields || []).map(f => [
      f.field_name,
      f.type,
      f.required ? 'Yes' : 'No'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Field', 'Type', 'Required']],
      body: fieldData,
      theme: 'plain',
      headStyles: { fillColor: [243, 244, 246], textColor: [17, 24, 39] },
      margin: { left: margin, right: margin },
      styles: { cellPadding: 2, fontSize: 10 }
    });
    
    currentY = doc.lastAutoTable.finalY + 10;
  });

  currentY += 5;

  // --- Project Structure ---
  checkPageBreak(30);
  addText('5. Project Structure & Setup', 16, true, '#111827');
  currentY += 5;

  addText('Tech Stack:', 12, true, '#374151');
  const ts = blueprint.project_structure?.techStack || {};
  addText(`Frontend: ${Array.isArray(ts.frontend) ? ts.frontend.join(', ') : ts.frontend || 'N/A'}`, 10);
  addText(`Backend: ${Array.isArray(ts.backend) ? ts.backend.join(', ') : ts.backend || 'N/A'}`, 10);
  addText(`Database: ${Array.isArray(ts.database) ? ts.database.join(', ') : ts.database || 'N/A'}`, 10);
  addText(`DevOps: ${Array.isArray(ts.devops) ? ts.devops.join(', ') : ts.devops || 'N/A'}`, 10);
  currentY += 5;

  addText('Setup Commands:', 12, true, '#374151');
  const commands = blueprint.project_structure?.setupCommands || [];
  if (Array.isArray(commands)) {
    commands.forEach(cmd => {
      addText(`$ ${cmd}`, 10, false, '#4b5563');
    });
  } else if (typeof commands === 'string') {
    addText(`$ ${commands}`, 10, false, '#4b5563');
  }
  currentY += 5;

  addText('Folder Structure:', 12, true, '#374151');
  doc.setFont('courier', 'normal');
  const safeStructure = blueprint.project_structure?.structure !== null && blueprint.project_structure?.structure !== undefined 
    ? String(blueprint.project_structure.structure) 
    : 'N/A';
  const structureLines = doc.splitTextToSize(safeStructure, pageWidth - margin * 2);
  
  // Render structure lines (checking page breaks)
  structureLines.forEach(line => {
    checkPageBreak(5);
    doc.text(line, margin, currentY);
    currentY += 4;
  });
  doc.setFont('helvetica', 'normal');
  currentY += 10;

  // --- Starter Code ---
  checkPageBreak(30);
  addText('6. Starter Code Boilerplate', 16, true, '#111827');
  currentY += 5;

  const codeBlocks = [
    { title: 'Backend Setup', code: blueprint.starter_code?.backend || '' },
    { title: 'Routes', code: blueprint.starter_code?.routes || '' },
    { title: 'Models', code: blueprint.starter_code?.models || '' }
  ];

  codeBlocks.forEach(block => {
    if (block.code && block.code.trim() !== '') {
      checkPageBreak(20);
      addText(block.title, 14, true, '#374151');
      
      doc.setFont('courier', 'normal');
      doc.setFontSize(8);
      doc.setTextColor('#111827');
      
      const safeCode = block.code !== null && block.code !== undefined ? String(block.code) : '';
      const lines = doc.splitTextToSize(safeCode, pageWidth - margin * 2);
      
      // Draw a light gray background rectangle
      const rectHeight = (lines.length * 3.5) + 10;
      if (checkPageBreak(rectHeight)) {
        // If we broke to a new page, re-draw the title
        currentY += 5;
      }
      
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.rect(margin, currentY, pageWidth - margin * 2, rectHeight, 'FD');
      
      currentY += 5;
      lines.forEach(line => {
        if (checkPageBreak(5)) {
            // Need to continue background rect if page breaks mid-code, but for simplicity we let it break.
        }
        doc.text(line, margin + 5, currentY);
        currentY += 3.5;
      });
      
      currentY += 15;
      doc.setFont('helvetica', 'normal'); // Reset
    }
  });

  // Footer for all pages
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor('#9ca3af');
    doc.text(
      `Generated by BLUEPRINTR AI - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
  }

  // Download the PDF
  const filename = `${(blueprint.product_summary?.title || 'project').replace(/\s+/g, '_').toLowerCase()}_blueprint.pdf`;
  doc.save(filename);
  } catch (err) {
    console.error('Failed to generate PDF:', err);
    alert('PDF Generation Error: ' + err.message + '\n\nPlease open browser console for full trace.');
  }
};
