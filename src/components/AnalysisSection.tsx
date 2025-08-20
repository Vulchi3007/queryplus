import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { aiAnalysisService } from '../services/aiAnalysis';
import UserInfoForm from './UserInfoForm';
import { insertUserData, insertAnalysisRecord, UserData } from '../lib/supabase';

interface AnalysisResult {
  probability: number;
  stage: string;
  reasoning: string;
  timestamp: string;
}

const AnalysisSection: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'upload' | 'results'>('form');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUserFormSubmit = async (formData: Omit<UserData, 'id' | 'created_at'>) => {
    setIsSubmittingForm(true);
    
    try {
      console.log('Submitting user form data:', formData);
      const savedUser = await insertUserData(formData);
      console.log('User saved successfully:', savedUser);
      setUserData(savedUser);
      setCurrentStep('upload');
    } catch (error) {
      console.error('Error saving user data:', error);
      alert(`Failed to save user information: ${error.message}. Please check your internet connection and try again.`);
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysisResult(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageSelect(files[0]);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    try {
      const result = await aiAnalysisService.analyzeImage(selectedImage);
      setAnalysisResult(result);
      setCurrentStep('results');
      
      // Save analysis record to Supabase
      if (userData) {
        try {
          console.log('Saving analysis record for user:', userData.id);
          await insertAnalysisRecord({
            user_id: userData.id!,
            probability: result.probability,
            stage: result.stage,
            reasoning: result.reasoning
          }, selectedImage);
          console.log('Analysis record saved successfully');
        } catch (error) {
          console.error('Error saving analysis record:', error);
          // Show warning but don't fail the analysis
          console.warn('Analysis completed but failed to save to database');
        }
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Show error message to user
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetForm = () => {
    setCurrentStep('form');
    setUserData(null);
    setSelectedImage(null);
    setImagePreview(null);
    setAnalysisResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getStageColor = (stage: string) => {
    if (stage.includes('No Visible')) return 'bg-green-100 text-green-800 border-green-200';
    if (stage.includes('Stage 1')) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (stage.includes('Stage 2')) return 'bg-orange-100 text-orange-800 border-orange-200';
    if (stage.includes('Stage 3')) return 'bg-red-100 text-red-800 border-red-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <section id="analysis" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {currentStep === 'form' ? 'Personal Information' : 
             currentStep === 'upload' ? 'Upload & Analyze' : 'Analysis Results'}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {currentStep === 'form' ? 'Please provide your information before proceeding with the analysis' :
             currentStep === 'upload' ? 'Upload your leg image for AI-powered analysis' :
             'Your analysis results are ready'}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'form' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
            }`}>
              1
            </div>
            <div className={`w-16 h-1 ${
              currentStep === 'form' ? 'bg-gray-300' : 'bg-green-600'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'form' ? 'bg-gray-300 text-gray-600' :
              currentStep === 'upload' ? 'bg-purple-600 text-white' : 'bg-green-600 text-white'
            }`}>
              2
            </div>
            <div className={`w-16 h-1 ${
              currentStep === 'results' ? 'bg-green-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep === 'results' ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: User Information Form */}
        {currentStep === 'form' && (
          <div className="max-w-2xl mx-auto">
            <UserInfoForm onSubmit={handleUserFormSubmit} isSubmitting={isSubmittingForm} />
          </div>
        )}

        {/* Step 2: Image Upload */}
        {currentStep === 'upload' && (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* User Info Summary */}
            <div className="lg:order-2">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{userData?.full_name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{userData?.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">City:</span>
                    <span className="font-medium">{userData?.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mobile:</span>
                    <span className="font-medium">{userData?.mobile}</span>
                  </div>
                  {userData?.email && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Email:</span>
                      <span className="font-medium">{userData.email}</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={resetForm}
                  className="mt-4 text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Edit Information
                </button>
              </div>
            </div>
            {/* Upload Area */}
            <div className="lg:order-1 space-y-6">
              {!imagePreview ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors duration-300 cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your image here</h3>
                  <p className="text-gray-600 mb-4">or click to browse files</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP (Max 10MB)</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full max-w-full h-auto object-contain rounded-xl shadow-lg"
                    style={{ maxHeight: 'none' }}
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                onClick={analyzeImage}
                disabled={!selectedImage || isAnalyzing}
                className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  selectedImage && !isAnalyzing
                    ? 'bg-gradient-to-r from-purple-600 to-purple-800 text-white hover:from-purple-700 hover:to-purple-900 transform hover:scale-105 shadow-lg hover:shadow-xl'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isAnalyzing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Analyzing...</span>
                  </div>
                ) : (
                  'Analyze Image'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 'results' && analysisResult && (
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* User Info & Image */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{userData?.full_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{userData?.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">City:</span>
                      <span className="font-medium">{userData?.city}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Analysis Date:</span>
                      <span className="font-medium">{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {imagePreview && (
                  <div className="bg-gray-50 rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Analyzed Image"
                      className="w-full h-auto object-contain"
                    />
                  </div>
                )}
              </div>

              {/* Analysis Results */}
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
                    <div className="text-sm text-gray-500">
                      Confidence: {analysisResult.probability}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisResult.probability / 100)}`}
                            className="text-purple-600 transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">{analysisResult.probability}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Probability</p>
                    </div>

                    <div className="text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStageColor(analysisResult.stage)}`}>
                        {analysisResult.stage}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Classification</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Medical Reasoning</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{analysisResult.reasoning}</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-800">Medical Disclaimer</p>
                        <p className="text-yellow-700">
                          This analysis is for informational purposes only and should not replace professional medical consultation. 
                          Please consult with a healthcare provider for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={resetForm}
                    className="flex-1 py-3 px-6 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    New Analysis
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 px-6 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 font-medium"
                  >
                    Print Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Legacy content - keeping for reference but hidden */}
        <div className="hidden">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Upload Area */}
            <div className="space-y-6">
            {!imagePreview ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-300 cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Drop your image here</h3>
                <p className="text-gray-600 mb-4">or click to browse files</p>
                <p className="text-sm text-gray-500">JPG, PNG, WebP (Max 10MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-full h-auto object-contain rounded-xl shadow-lg"
                  style={{ maxHeight: 'none' }}
                />
                <button
                  onClick={removeImage}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200 shadow-lg"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            <button
              onClick={analyzeImage}
              disabled={!selectedImage || isAnalyzing}
              className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                selectedImage && !isAnalyzing
                  ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAnalyzing ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Analyzing...</span>
                </div>
              ) : (
                'Analyze Image'
              )}
            </button>
          </div>

          {/* Results Area */}
          <div className="space-y-6">
            {!analysisResult && !isAnalyzing ? (
              <div className="bg-gray-50 rounded-xl p-8 text-center h-full flex items-center justify-center">
                <div>
                  <CheckCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready for Analysis</h3>
                  <p className="text-gray-600">Upload an image to get AI-powered varicose vein analysis</p>
                </div>
              </div>
            ) : isAnalyzing ? (
              <div className="bg-purple-50 rounded-xl p-8 text-center">
                <Loader2 className="h-16 w-16 text-purple-600 mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-purple-900 mb-2">Analyzing Image</h3>
                <p className="text-purple-700">Our AI is processing your image...</p>
              </div>
            ) : analysisResult ? (
              <div className="space-y-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-900">Analysis Results</h3>
                    <div className="text-sm text-gray-500">
                      Confidence: {analysisResult.probability}%
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            className="text-gray-200"
                          />
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            stroke="currentColor"
                            strokeWidth="8"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={`${2 * Math.PI * 40 * (1 - analysisResult.probability / 100)}`}
                            className="text-purple-600 transition-all duration-1000 ease-out"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold text-gray-900">{analysisResult.probability}%</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">Probability</p>
                    </div>

                    <div className="text-center">
                      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStageColor(analysisResult.stage)}`}>
                        {analysisResult.stage}
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Classification</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Medical Reasoning</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">{analysisResult.reasoning}</p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                    <div className="flex items-start space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm">
                        <p className="font-semibold text-yellow-800">Medical Disclaimer</p>
                        <p className="text-yellow-700">
                          This analysis is for informational purposes only and should not replace professional medical consultation. 
                          Please consult with a healthcare provider for proper diagnosis and treatment.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisSection;