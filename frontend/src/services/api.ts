import axios, { AxiosError } from 'axios';
import { PredictionResponse, ApiError } from '../types/api';
import { getMockPrediction } from './mockData';

const API_URL =
  import.meta.env.VITE_API_URL || "https://wildlife-cv.onrender.com";

console.log("API URL:", API_URL);

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 150000, // 150 second timeout: covers cold-start Gemini latency on Render (~90s observed)
  headers: {
    'Accept': 'application/json',
  },
});

export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    // Attempt quick ping or options request to root or /predict
    await apiClient.get('/', { timeout: 3000 });
    return true;
  } catch (error) {
    // If it returns 404 or OpenAPI response, server is running
    const err = error as AxiosError;
    if (err.response) {
      return true;
    }
    return false;
  }
};

export const predictSpecies = async (
  file: File,
  useMockMode: boolean = false
): Promise<PredictionResponse> => {
  if (useMockMode) {
    // Simulate realistic network delay (1.8s) for progress state display
    await new Promise((resolve) => setTimeout(resolve, 1800));
    return getMockPrediction(file.name);
  }

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await apiClient.post<PredictionResponse>('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<{ detail?: string }>;
    
    let structuredError: ApiError = {
      message: 'Failed to complete classification request.',
      type: 'UNKNOWN'
    };

    if (!err.response) {
      if (err.code === 'ECONNABORTED') {
        structuredError = {
          message: 'Connection timed out while analyzing image.',
          detail: 'The inference request exceeded 150 seconds. Render cold-start or Gemini API may be slow — please retry.',
          type: 'TIMEOUT'
        };
      } else {
        structuredError = {
          message: 'Unable to connect to Wildlife AI backend server.',
          detail: `Cannot reach API at ${API_URL || 'http://localhost:8000'}. Ensure FastAPI backend server is running.`,
          type: 'NETWORK_ERROR'
        };
      }
    } else {
      const status = err.response.status;
      const detail = err.response.data?.detail || err.message;
      structuredError.statusCode = status;

      if (status === 400) {
        if (detail.includes('File too large') || detail.includes('Max size')) {
          structuredError = {
            statusCode: status,
            message: 'Image size exceeds maximum limit (10 MB).',
            detail,
            type: 'FILE_TOO_LARGE'
          };
        } else if (detail.includes('Invalid file type')) {
          structuredError = {
            statusCode: status,
            message: 'Unsupported image format.',
            detail,
            type: 'INVALID_TYPE'
          };
        } else {
          structuredError = {
            statusCode: status,
            message: 'Invalid upload request.',
            detail,
            type: 'UNKNOWN'
          };
        }
      } else if (status === 422) {
        structuredError = {
          statusCode: status,
          message: 'Image unprocessable or corrupted.',
          detail: 'The uploaded file could not be parsed by the YOLO vision pipeline.',
          type: 'CORRUPTED_FILE'
        };
      } else if (status >= 500) {
        structuredError = {
          statusCode: status,
          message: 'Backend server pipeline error.',
          detail: 'An unexpected exception occurred during RAG document retrieval or Gemini LLM reasoning.',
          type: 'SERVER_ERROR'
        };
      }
    }

    throw structuredError;
  }
};
