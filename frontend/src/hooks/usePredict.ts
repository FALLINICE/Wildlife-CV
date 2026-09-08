import { useState, useCallback } from 'react';
import { PredictionResponse, ApiError, ProcessingStage } from '../types/api';
import { predictSpecies } from '../services/api';

export function usePredict() {
  const [file, setFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stage, setStage] = useState<ProcessingStage>('idle');
  const [progress, setProgress] = useState<number>(0);
  const [response, setResponse] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<ApiError | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);

  const selectFile = useCallback((selectedFile: File) => {
    // Revoke previous URL to prevent memory leaks
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    
    setFile(selectedFile);
    const objectUrl = URL.createObjectURL(selectedFile);
    setImagePreviewUrl(objectUrl);
    setError(null);
    setResponse(null);
    setStage('idle');
    setProgress(0);
  }, [imagePreviewUrl]);

  const selectSampleImage = useCallback(async (sampleUrl: string, sampleName: string) => {
    try {
      // Fetch sample image blob
      const res = await fetch(sampleUrl);
      const blob = await res.blob();
      const sampleFile = new File([blob], `${sampleName.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' });
      
      setFile(sampleFile);
      setImagePreviewUrl(sampleUrl);
      setError(null);
      setResponse(null);
      setStage('idle');
      setProgress(0);
    } catch (err) {
      console.error('Failed to load sample image blob:', err);
      // Fallback object URL
      setImagePreviewUrl(sampleUrl);
      setFile(new File([], `${sampleName.toLowerCase().replace(/\s+/g, '_')}.jpg`, { type: 'image/jpeg' }));
    }
  }, []);

  const clearFile = useCallback(() => {
    if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setFile(null);
    setImagePreviewUrl(null);
    setResponse(null);
    setError(null);
    setStage('idle');
    setProgress(0);
  }, [imagePreviewUrl]);

  const toggleMockMode = useCallback((enabled?: boolean) => {
    setIsMockMode((prev) => (enabled !== undefined ? enabled : !prev));
  }, []);

  const runPrediction = useCallback(async (overrideFile?: File) => {
    const targetFile = overrideFile || file;
    if (!targetFile) {
      setError({
        message: 'No file selected for classification.',
        type: 'UNKNOWN'
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setResponse(null);

    // Dynamic processing stages animation
    setStage('uploading');
    setProgress(20);

    const stageTimer1 = setTimeout(() => {
      setStage('classifying');
      setProgress(45);
    }, 400);

    const stageTimer2 = setTimeout(() => {
      setStage('retrieving');
      setProgress(75);
    }, 900);

    const stageTimer3 = setTimeout(() => {
      setStage('generating');
      setProgress(90);
    }, 1400);

    try {
      const result = await predictSpecies(targetFile, isMockMode);
      
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      setResponse(result);
      setStage('complete');
      setProgress(100);
    } catch (err) {
      clearTimeout(stageTimer1);
      clearTimeout(stageTimer2);
      clearTimeout(stageTimer3);

      const apiErr = err as ApiError;
      
      setError(apiErr);
      setStage('error');
    } finally {
      setIsLoading(false);
    }
  }, [file, isMockMode]);

  return {
    file,
    imagePreviewUrl,
    isLoading,
    stage,
    progress,
    response,
    error,
    isMockMode,
    selectFile,
    selectSampleImage,
    clearFile,
    toggleMockMode,
    runPrediction
  };
}
