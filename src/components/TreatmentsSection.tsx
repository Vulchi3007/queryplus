import React from 'react';
import { Syringe, Zap, Heart, Wrench, Bot, CheckCircle } from 'lucide-react';

interface TreatmentsSectionProps {
  scrollToSection: (section: string) => void;
}

const TreatmentsSection: React.FC<TreatmentsSectionProps> = ({ scrollToSection }) => {
  const treatments = [
    {
      icon: Syringe,
      title: 'Sclerotherapy',
      description: 'A minimally invasive procedure that involves injecting a solution directly into the affected veins.',
      benefits: ['Quick procedure', 'Minimal downtime', 'High success rate'],
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Zap,
      title: 'Endovenous Laser Treatment',
      description: 'Uses laser energy to heat and close problematic veins, redirecting blood flow to healthy veins.',
      benefits: ['No surgical incisions', 'Local anesthesia only', 'Return to activities quickly'],
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Heart,
      title: 'Compression Therapy',
      description: 'Conservative treatment using specialized stockings to improve blood flow and reduce symptoms.',
      benefits: ['Non-invasive', 'Can be done at home', 'Preventive benefits'],
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Wrench,
      title: 'VenaSeal™',
      description: 'Advanced closure system using medical adhesive to seal affected veins permanently.',
      benefits: ['No heat or tumescence', 'Single treatment', 'Immediate results'],
      color: 'text-purple-600 bg-purple-200'
    }
  ];

  return (
    <section id="treatments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Treatments
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Advanced treatment options for all stages of varicose veins
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
          {treatments.map((treatment, index) => {
            const IconComponent = treatment.icon;
            return (
              <div key={index} className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:bg-white border border-gray-100">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 ${treatment.color}`}>
                  <IconComponent className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{treatment.title}</h3>
                <p className="text-gray-600 mb-6">{treatment.description}</p>
                <div className="space-y-2">
                  {treatment.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured AI Assessment Card */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 text-white text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
            <Bot className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold mb-4">QurePlus AI Assessment</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
          <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
            Get instant, professional-grade varicose vein analysis powered by advanced AI technology. 
            Our assessment tool provides accurate staging and treatment recommendations in seconds.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Instant analysis</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>95% accuracy</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free assessment</span>
            </div>
          </div>
          <button
            onClick={() => scrollToSection('analysis')}
            className="inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Try AI Assessment Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default TreatmentsSection;