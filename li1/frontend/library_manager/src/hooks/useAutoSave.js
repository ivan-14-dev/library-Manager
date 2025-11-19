// src/hooks/useAutoSave.js
import { useState, useEffect, useCallback } from 'react';

export const useAutoSave = (documentId, content, options = {}) => {
  const [lastSaved, setLastSaved] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [versions, setVersions] = useState([]);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  const {
    interval = 30000, // 30 secondes
    maxVersions = 50,
    onVersionCreate
  } = options;

  // Sauvegarde automatique
  useEffect(() => {
    if (!autoSaveEnabled || !content) return;

    const saveDocument = async () => {
      setIsSaving(true);
      try {
        // API CALL: Sauvegarde automatique
        // await documentsAPI.autoSave(documentId, content);
        
        // Créer une version si le contenu a significativement changé
        if (shouldCreateVersion(content)) {
          await createVersion(content);
        }
        
        setLastSaved(new Date());
      } catch (error) {
        console.error('Erreur sauvegarde automatique:', error);
      } finally {
        setIsSaving(false);
      }
    };

    const timer = setTimeout(saveDocument, interval);
    return () => clearTimeout(timer);
  }, [content, documentId, interval, autoSaveEnabled]);

  const createVersion = useCallback(async (versionContent) => {
    const version = {
      id: `v${Date.now()}`,
      content: versionContent,
      createdAt: new Date().toISOString(),
      label: `Version ${versions.length + 1}`,
      wordCount: versionContent.replace(/<[^>]*>/g, '').split(/\s+/).length,
      autoSaved: true
    };

    setVersions(prev => {
      const newVersions = [version, ...prev].slice(0, maxVersions);
      return newVersions;
    });

    onVersionCreate?.(version);
  }, [versions.length, maxVersions, onVersionCreate]);

  const manualSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // API CALL: Sauvegarde manuelle
      // await documentsAPI.save(documentId, content);
      
      await createVersion(content);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Erreur sauvegarde manuelle:', error);
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [documentId, content, createVersion]);

  const restoreVersion = useCallback((versionId) => {
    const version = versions.find(v => v.id === versionId);
    if (version) {
      return version.content;
    }
    return null;
  }, [versions]);

  const shouldCreateVersion = useCallback((newContent) => {
    if (versions.length === 0) return true;
    
    const lastVersion = versions[0];
    const significantChange = calculateContentChange(lastVersion.content, newContent) > 0.1;
    
    return significantChange;
  }, [versions]);

  return {
    lastSaved,
    isSaving,
    versions,
    autoSaveEnabled,
    setAutoSaveEnabled,
    manualSave,
    restoreVersion,
    createVersion
  };
};

const calculateContentChange = (oldContent, newContent) => {
  // Calcul simple du pourcentage de changement
  const oldText = oldContent.replace(/<[^>]*>/g, '');
  const newText = newContent.replace(/<[^>]*>/g, '');
  
  const maxLength = Math.max(oldText.length, newText.length);
  if (maxLength === 0) return 0;
  
  // Utiliser une distance de Levenshtein simplifiée
  let distance = 0;
  const minLength = Math.min(oldText.length, newText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (oldText[i] !== newText[i]) distance++;
  }
  
  distance += Math.abs(oldText.length - newText.length);
  
  return distance / maxLength;
};