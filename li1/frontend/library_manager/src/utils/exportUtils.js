// src/utils/exportUtils.js
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export class DocumentExporter {
  static async exportToPDF(content, options = {}) {
    const {
      title = 'Document',
      author = '',
      includeHeader = true,
      includeFooter = true,
      pageSize = 'a4',
      margins = { top: 20, right: 20, bottom: 20, left: 20 }
    } = options;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: pageSize
    });

    // Configuration du PDF
    pdf.setProperties({
      title,
      author,
      creator: 'Bibliothèque Numérique',
      subject: 'Document exporté'
    });

    // Styles CSS pour l'export
    const styles = `
      <style>
        .export-container {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .export-header {
          border-bottom: 2px solid #4299e1;
          padding-bottom: 10px;
          margin-bottom: 20px;
        }
        .export-title {
          font-size: 24px;
          font-weight: bold;
          color: #2d3748;
        }
        .export-meta {
          font-size: 12px;
          color: #718096;
        }
        .export-content {
          font-size: 14px;
        }
        .export-content h1 { font-size: 20px; margin: 20px 0 10px 0; }
        .export-content h2 { font-size: 18px; margin: 18px 0 9px 0; }
        .export-content h3 { font-size: 16px; margin: 16px 0 8px 0; }
        .export-content p { margin: 10px 0; }
        .export-content table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 10px 0;
        }
        .export-content table, .export-content th, .export-content td {
          border: 1px solid #e2e8f0;
        }
        .export-content th, .export-content td {
          padding: 8px;
          text-align: left;
        }
        .export-footer {
          border-top: 1px solid #e2e8f0;
          padding-top: 10px;
          margin-top: 20px;
          font-size: 10px;
          color: #a0aec0;
          text-align: center;
        }
      </style>
    `;

    const htmlContent = `
      <div class="export-container">
        ${includeHeader ? `
          <div class="export-header">
            <div class="export-title">${title}</div>
            <div class="export-meta">
              Exporté le ${new Date().toLocaleDateString()} • 
              ${author ? `Par ${author} • ` : ''}
              Bibliothèque Numérique
            </div>
          </div>
        ` : ''}
        
        <div class="export-content">
          ${content}
        </div>
        
        ${includeFooter ? `
          <div class="export-footer">
            Page {{page}} sur {{total}} • Document généré par Bibliothèque Numérique
          </div>
        ` : ''}
      </div>
    `;

    try {
      // Méthode 1: Conversion HTML directe (pour contenu simple)
      await pdf.html(htmlContent, {
        margin: [margins.top, margins.right, margins.bottom, margins.left],
        autoPaging: 'text',
        x: margins.left,
        y: margins.top,
        width: pdf.internal.pageSize.getWidth() - margins.left - margins.right
      });

      // Méthode alternative: Utiliser html2canvas pour un rendu plus fidèle
      // await this.exportWithCanvas(pdf, content, options);

      return pdf;
    } catch (error) {
      console.error('Erreur export PDF:', error);
      throw new Error('Échec de l\'export PDF');
    }
  }

  static async exportToDOCX(content, options = {}) {
    // Simulation d'export DOCX
    const blob = new Blob([content], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    return blob;
  }

  static async exportToHTML(content, options = {}) {
    const { title, includeStyles = true } = options;
    
    const html = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title || 'Document exporté'}</title>
        ${includeStyles ? `
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #2d3748;
              margin-top: 1.5em;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 1em 0;
            }
            table, th, td {
              border: 1px solid #e2e8f0;
            }
            th, td {
              padding: 0.75em;
              text-align: left;
            }
            img {
              max-width: 100%;
              height: auto;
            }
            .export-meta {
              color: #718096;
              font-size: 0.9em;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 1em;
              margin-bottom: 2em;
            }
          </style>
        ` : ''}
      </head>
      <body>
        <div class="export-meta">
          Document exporté de Bibliothèque Numérique • ${new Date().toLocaleDateString()}
        </div>
        ${content}
      </body>
      </html>
    `;

    return new Blob([html], { type: 'text/html' });
  }

  static async exportToMarkdown(content) {
    // Conversion simple HTML vers Markdown
    let markdown = content
      .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
      .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
      .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
      .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
      .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
      .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
      .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
      .replace(/<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
      .replace(/<ul[^>]*>(.*?)<\/ul>/gis, (match, p1) => {
        return p1.replace(/<li[^>]*>(.*?)<\/li>/gi, '- $1\n') + '\n';
      })
      .replace(/<[^>]*>/g, '') // Supprimer les balises restantes
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');

    return new Blob([markdown], { type: 'text/markdown' });
  }

  static createDownload(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}