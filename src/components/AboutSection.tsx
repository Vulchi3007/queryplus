import React from 'react';
import { Target, Zap, Shield, Users, Award, Clock } from 'lucide-react';

const AboutSection: React.FC = () => {
  const features = [
    {
      icon: Target,
      title: '95% Accuracy',
      description: 'Clinically validated AI model trained on thousands of medical images',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get comprehensive analysis in under 2 seconds',
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your images are processed securely and never stored',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Developed by leading medical professionals and AI researchers',
      color: 'text-purple-600 bg-purple-200'
    },
    {
      icon: Award,
      title: 'Medical Grade',
      description: 'Meets healthcare industry standards for diagnostic tools',
      color: 'text-red-600 bg-red-100'
    },
    {
      icon: Clock,
      title: '24/7 Available',
      description: 'Access professional-grade analysis anytime, anywhere',
      color: 'text-purple-600 bg-purple-300'
    }
  ];

  const stages = [
    {
      number: '1',
      title: 'Spider Veins',
      description: 'Thin, web-like veins on skin surface',
      severity: 'Mild'
    },
    {
      number: '2',
      title: 'Reticular Veins',
      description: 'Blue-green veins 1-3mm in diameter',
      severity: 'Mild-Moderate'
    },
    {
      number: '3',
      title: 'Varicose Veins',
      description: 'Bulging, rope-like veins ≥3mm',
      severity: 'Moderate'
    },
    {
      number: '4',
      title: 'Skin Changes',
      description: 'Pigmentation, eczema, inflammation',
      severity: 'Moderate-Severe'
    },
    {
      number: '5',
      title: 'Ulcers',
      description: 'Open, non-healing wounds',
      severity: 'Severe'
    }
  ];

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              About QurePlus
            </h2>
            <div className="space-y-4 text-gray-600">
              <p className="text-lg leading-relaxed">
                QurePlus is a leading healthcare platform specializing in varicose vein treatment. 
                Our mission is to make quality vein care accessible, affordable, and convenient for everyone.
              </p>
              <p>
                With our innovative AI-powered assessment system and network of experienced specialists, 
                we're revolutionizing how people access and receive treatment for varicose veins.
              </p>
              <p>
                Our team of dedicated healthcare professionals combines years of expertise with 
                cutting-edge technology to provide personalized care solutions that work for you.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-gray-600">Patients Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">500+</div>
                <div className="text-sm text-gray-600">Specialists</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">50+</div>
                <div className="text-sm text-gray-600">Locations</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Varicose Vein Stages</h3>
            <div className="space-y-3">
              {stages.map((stage) => (
                <div key={stage.number} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {stage.number}
                  </div>
                  <div className="flex-grow">
                    <div className="font-semibold text-gray-900">{stage.title}</div>
                    <div className="text-sm text-gray-600">{stage.description}</div>
                  </div>
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                    stage.severity === 'Mild' ? 'bg-green-100 text-green-800' :
                    stage.severity === 'Mild-Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    stage.severity === 'Moderate' ? 'bg-orange-100 text-orange-800' :
                    stage.severity === 'Moderate-Severe' ? 'bg-red-100 text-red-800' :
                    'bg-red-200 text-red-900'
                  }`}>
                    {stage.severity}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg mb-4 ${feature.color}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;