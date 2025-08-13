import React from 'react';
import { Upload, Brain, FileText, ArrowRight } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Image',
      description: 'Take a clear photo of your leg and upload it to our secure platform',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Brain,
      title: 'AI Analysis',
      description: 'Our advanced AI analyzes the image for signs of varicose veins',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: FileText,
      title: 'Get Results',
      description: 'Receive detailed analysis with probability and stage classification',
      color: 'text-green-600 bg-green-100'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, fast, and accurate analysis in three steps
          </p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden md:flex absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 transform -translate-y-1/2 z-0">
            <div className="flex-1"></div>
            <div className="flex-1"></div>
          </div>

          <div className="relative z-10 grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${step.color} border-4 border-white shadow-lg`}>
                      <IconComponent className="h-10 w-10" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 max-w-xs mx-auto">{step.description}</p>
                  
                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-6">
                      <ArrowRight className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Why Choose Our AI Analysis?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Clinically Validated</h4>
                    <p className="text-gray-600 text-sm">Our AI model has been trained and validated using thousands of medical images reviewed by certified specialists.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Instant Results</h4>
                    <p className="text-gray-600 text-sm">Get comprehensive analysis in seconds, not days. No waiting for appointments or lab results.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                    <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Privacy Protected</h4>
                    <p className="text-gray-600 text-sm">Your images are processed securely and never stored on our servers. Complete privacy guaranteed.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-xl p-6 text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">95%</div>
              <div className="text-sm text-gray-600 mb-4">Diagnostic Accuracy</div>
              <div className="text-2xl font-bold text-teal-600 mb-2">&lt;2s</div>
              <div className="text-sm text-gray-600 mb-4">Analysis Time</div>
              <div className="text-2xl font-bold text-purple-600 mb-2">5</div>
              <div className="text-sm text-gray-600">Stages Detected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;