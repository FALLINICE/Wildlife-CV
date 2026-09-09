import React, { useState, useRef } from 'react';
import { Camera, AlertCircle } from 'lucide-react';
import { formatBytes } from '../../utils/formatters';

interface DragDropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const DragDropZone: React.FC<DragDropZoneProps> = ({ onFileSelect, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileValidation = (file: File) => {
    setValidationError(null);

    if (!ALLOWED_TYPES.includes(file.type.toLowerCase())) {
      setValidationError('Invalid file format. Only JPG, JPEG, and PNG images are supported.');
      return;
    }

    if (file.size > MAX_SIZE_BYTES) {
      setValidationError(`File size (${formatBytes(file.size)}) exceeds the maximum 10 MB limit.`);
      return;
    }

    onFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileValidation(files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileValidation(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Viewfinder Dropzone Container */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && inputRef.current?.click()}
        className={`relative group rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
          isDragOver
            ? 'border-savanna-gold bg-nature-900/90 shadow-2xl scale-[1.01]'
            : 'border-nature-700 hover:border-nature-500 bg-nature-900/40 hover:bg-nature-900/70'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {/* Camera Trap Viewfinder Crosshairs in corners */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-savanna-gold/50"></div>
        <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-savanna-gold/50"></div>
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-savanna-gold/50"></div>
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-savanna-gold/50"></div>

        {/* Hidden File Input */}
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png"
          onChange={handleInputChange}
          disabled={disabled}
          className="hidden"
          id="camera-trap-file-input"
          aria-label="Upload camera trap wildlife image"
        />

        {/* Inner Content */}
        <div className="max-w-md mx-auto space-y-4">
          {/* Animated Icon Circle */}
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-nature-800 to-nature-900 border border-nature-700/80 flex items-center justify-center shadow-xl group-hover:border-savanna-gold/60 transition-colors">
            <Camera className="w-10 h-10 text-savanna-gold group-hover:scale-110 transition-transform duration-300" />
          </div>

          <div>
            <h3 className="text-xl font-serif font-semibold text-savanna-bone">
              Deploy Camera Trap Image
            </h3>
            <p className="text-sm text-nature-300 mt-1">
              Drag and drop camera trap footage here, or <span className="text-savanna-gold underline underline-offset-4 font-medium">browse files</span>
            </p>
          </div>

          {/* Specs / Format Pill */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs font-mono text-nature-400">
            <span className="px-2.5 py-1 bg-nature-950/80 rounded-md border border-nature-800">JPG, JPEG, PNG</span>
            <span>•</span>
            <span className="px-2.5 py-1 bg-nature-950/80 rounded-md border border-nature-800">Max File Size: 10 MB</span>
          </div>
        </div>
      </div>

      {/* Validation Error Banner */}
      {validationError && (
        <div className="p-3.5 bg-red-950/80 border border-red-800/80 rounded-xl text-red-200 text-xs flex items-center space-x-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
};
