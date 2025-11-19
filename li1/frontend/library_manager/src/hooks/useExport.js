// src/hooks/useExport.js
import { useState, useCallback } from 'react';
import { exportAPI } from '../services/api';

/**
 * Hook personnalisé pour la gestion des exports de documents
 * avec suivi de progression et gestion des files d'attente
 */
export const useExport = () => {
  const [exportQueue, setExportQueue] = useState([]);
  const [currentExport, setCurrentExport] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Exporter un document
  const exportDocument = useCallback(async (documentId, format, options = {}) => {
    try {
      setIsExporting(true);
      setProgress(0);

      const job = await exportAPI.createExportJob(documentId, format, options);
      
      setCurrentExport({
        id: job.data.id,
        documentId,
        format,
        status: 'pending'
      });

      // Polling pour suivre la progression
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await exportAPI.getExportStatus(job.data.id);
          const status = statusResponse.data;
          
          setProgress(status.progress);

          if (status.status === 'completed') {
            clearInterval(pollInterval);
            setIsExporting(false);
            setProgress(100);
            
            // Télécharger le fichier
            await exportAPI.downloadExport(job.data.id);
            
            setCurrentExport(null);
          } else if (status.status === 'failed') {
            clearInterval(pollInterval);
            setIsExporting(false);
            setProgress(0);
            throw new Error(status.error_message || 'Échec de l\'export');
          }
        } catch (error) {
          console.error('Erreur polling export:', error);
          clearInterval(pollInterval);
          setIsExporting(false);
        }
      }, 1000);

      return job.data;

    } catch (error) {
      console.error('Erreur export document:', error);
      setIsExporting(false);
      setProgress(0);
      throw error;
    }
  }, []);

  // Exporter plusieurs documents
  const exportMultiple = useCallback(async (documents, format, options = {}) => {
    const jobs = [];
    
    for (const document of documents) {
      try {
        const job = await exportDocument(document.id, format, options);
        jobs.push(job);
      } catch (error) {
        console.error(`Erreur export document ${document.id}:`, error);
      }
    }
    
    return jobs;
  }, [exportDocument]);

  // Annuler un export
  const cancelExport = useCallback(async (jobId) => {
    try {
      await exportAPI.cancelExportJob(jobId);
      
      if (currentExport?.id === jobId) {
        setCurrentExport(null);
        setIsExporting(false);
        setProgress(0);
      }
    } catch (error) {
      console.error('Erreur annulation export:', error);
      throw error;
    }
  }, [currentExport]);

  // Obtenir l'historique des exports
  const getExportHistory = useCallback(async () => {
    try {
      const response = await exportAPI.getExportHistory();
      return response.data;
    } catch (error) {
      console.error('Erreur récupération historique exports:', error);
      throw error;
    }
  }, []);

  return {
    // État
    exportQueue,
    currentExport,
    isExporting,
    progress,
    
    // Actions
    exportDocument,
    exportMultiple,
    cancelExport,
    getExportHistory,
    
    // Utilitaires
    canExport: !isExporting,
    estimatedTimeRemaining: isExporting ? Math.round((100 - progress) / 10) : 0 // Estimation en secondes
  };
};