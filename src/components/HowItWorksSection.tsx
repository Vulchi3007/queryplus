import React from 'react';
import { Upload, Scan, FileText, CheckCircle } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Photo',
      description: 'Take a clear photo of the affected area and upload it securely to our platform.',
      color: 'text-purple-600'
    },
    {
      icon: Scan,
      title: 'AI Analysis',
      description: 'Our advanced AI technology analyzes your image using medical-grade algorithms.',
      color: 'text-purple-600'
    },
    {
      icon: FileText,
      title: 'Get Your Report',
      description: 'Receive a detailed analysis report with severity assessment and recommendations.',
      color: 'text-purple-600'
    },
    {
      icon: CheckCircle,
      title: 'Take Action',
      description: 'Follow our personalized recommendations and consult with healthcare professionals.',
      color: 'text-purple-600'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Analyses Completed' },
    { number: '95%', label: 'Accuracy Rate' },
    { number: '24/7', label: 'Available' },
    { number: '< 2 min', label: 'Analysis Time' }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get professional varicose vein analysis in just a few simple steps. 
            Our AI-powered system provides accurate results in minutes.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                {/* Step Number */}
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold z-10">
                  {index + 1}
                </div>
                
                {/* Icon Container */}
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <step.icon className={`h-8 w-8 ${step.color}`} />
                </div>
                
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gray-200 -translate-y-0.5">
                    <div className="h-full bg-purple-600 w-0 group-hover:w-full transition-all duration-500"></div>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Trusted by Thousands
            </h3>
            <p className="text-purple-100 text-lg">
              Join the growing community of users who trust QurePlus for their health analysis
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-purple-200 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Take the first step towards better vein health. Our AI analysis is quick, 
            accurate, and completely confidential.
          </p>
          <button 
            onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Your Analysis Now
          </button>
        </div>
      </div>
    </section>
  );
}