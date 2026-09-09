export interface AlternativeCandidate {
  species: string;
  confidence: number;
}

export interface PredictionResponse {
  species: string;
  confidence: number;
  review_needed: boolean;
  description: string | null;
  explanation: string | null;
  alternative_candidates?: AlternativeCandidate[];
}

export interface SpeciesMetadata {
  id: string;
  scientificName: string;
  commonName: string;
  category: string;
  conservationStatus: 'Critically Endangered' | 'Vulnerable' | 'Near Threatened' | 'Least Concern';
  statusColor: string;
  habitat: string;
  description: string;
  sampleImageUrl: string;
}

export type ProcessingStage = 
  | 'idle'
  | 'uploading'
  | 'classifying'
  | 'retrieving'
  | 'generating'
  | 'complete'
  | 'error';

export interface ApiError {
  statusCode?: number;
  message: string;
  detail?: string;
  type: 'NETWORK_ERROR' | 'FILE_TOO_LARGE' | 'INVALID_TYPE' | 'CORRUPTED_FILE' | 'SERVER_ERROR' | 'TIMEOUT' | 'UNKNOWN';
}

export interface PredictionState {
  isLoading: boolean;
  stage: ProcessingStage;
  progress: number;
  response: PredictionResponse | null;
  error: ApiError | null;
  imagePreviewUrl: string | null;
  imageFileName: string | null;
  imageFileSize: number | null;
  isMockMode: boolean;
}
