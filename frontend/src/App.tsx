import { useRef } from 'react';
import { usePredict } from './hooks/usePredict';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ErrorCard } from './components/common/ErrorCard';
import { HeroSection } from './components/home/HeroSection';
import { PipelineSection } from './components/home/PipelineSection';
import { SpeciesGallery } from './components/home/SpeciesGallery';
import { DragDropZone } from './components/upload/DragDropZone';
import { FilePreview } from './components/upload/FilePreview';
import { SampleSelector } from './components/upload/SampleSelector';
import { LoadingOverlay } from './components/upload/LoadingOverlay';
import { ResultsDashboard } from './components/results/ResultsDashboard';
import { Camera } from 'lucide-react';

export function App() {
  const {
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
    runPrediction,
  } = usePredict();

  const uploadSectionRef = useRef<HTMLDivElement>(null);

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectSample = (sampleUrl: string, sampleName: string) => {
    selectSampleImage(sampleUrl, sampleName);
    scrollToUpload();
  };

  return (
    <div className="min-h-screen bg-nature-950 text-savanna-bone font-sans flex flex-col selection:bg-nature-700 selection:text-white">
      {/* Top Header Navbar */}
      <Navbar
        isMockMode={isMockMode}
        onToggleMockMode={toggleMockMode}
        onReset={clearFile}
      />

      <main className="flex-1">
        {/* State 1: Complete Response -> Display Field Report Results Dashboard */}
        {stage === 'complete' && response ? (
          <ResultsDashboard
            response={response}
            imagePreviewUrl={imagePreviewUrl}
            onReset={clearFile}
          />
        ) : isLoading ? (
          /* State 2: Processing Active -> Display Step Timeline Loading Overlay */
          <div className="py-16 px-4 sm:px-6 lg:px-8">
            <LoadingOverlay
              imagePreviewUrl={imagePreviewUrl}
              stage={stage}
              progress={progress}
            />
          </div>
        ) : error ? (
          /* State 3: Pipeline Error -> Display Friendly Error Card */
          <div className="py-16 px-4 sm:px-6 lg:px-8">
            <ErrorCard
              error={error}
              onRetry={() => runPrediction()}
              onEnableMockMode={() => {
                toggleMockMode(true);
                runPrediction();
              }}
              onClear={clearFile}
            />
          </div>
        ) : (
          /* State 4: Default Landing & Upload Experience */
          <div className="space-y-12">
            {/* Hero Section */}
            <HeroSection onScrollToUpload={scrollToUpload} />

            {/* System Pipeline Section */}
            <PipelineSection />

            {/* Camera Trap Upload Station */}
            <section
              ref={uploadSectionRef}
              id="upload-station"
              className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8"
            >
              <div className="text-center space-y-3">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-nature-900 border border-nature-700 rounded-full text-xs font-mono text-savanna-sand">
                  <Camera className="w-3.5 h-3.5 text-savanna-gold" />
                  <span>FIELD INSPECTION STATION</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-savanna-bone">
                  Upload Camera Trap Image
                </h2>
                <p className="text-sm text-nature-300 max-w-xl mx-auto">
                  Select a camera trap photo from your field study or choose a preset test image to execute classification, knowledge retrieval, and LLM reasoning.
                </p>
              </div>

              {/* Upload Dropzone or File Preview */}
              {imagePreviewUrl ? (
                <FilePreview
                  imagePreviewUrl={imagePreviewUrl}
                  file={file}
                  isLoading={isLoading}
                  onRunPrediction={() => runPrediction()}
                  onClearFile={clearFile}
                />
              ) : (
                <div className="space-y-6">
                  <DragDropZone
                    onFileSelect={(selectedFile) => selectFile(selectedFile)}
                    disabled={isLoading}
                  />

                  {/* Preset Field Image Selector */}
                  <SampleSelector
                    onSelectSample={(sampleUrl, sampleName) => handleSelectSample(sampleUrl, sampleName)}
                    disabled={isLoading}
                  />
                </div>
              )}
            </section>

            {/* Target Species Taxonomy Gallery */}
            <SpeciesGallery onSelectSpecies={handleSelectSample} />
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
