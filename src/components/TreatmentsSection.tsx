import React from 'react';
import { Heart, Zap, Droplets, Shield, Clock, Award } from 'lucide-react';

export default function TreatmentsSection() {
  const treatments = [
    {
      icon: Zap,
      title: 'Laser Therapy',
      description: 'Advanced laser treatment that closes affected veins with minimal discomfort and quick recovery.',
      benefits: ['Minimally invasive', 'Quick procedure', 'High success rate', 'Minimal scarring'],
      severity: 'Mild to Moderate',
      duration: '30-45 minutes',
      recovery: '1-2 days'
    },
    {
      icon: Droplets,
      title: 'Sclerotherapy',
      description: 'Injection of a solution that causes veins to collapse and fade away over time.',
      benefits: ['Non-surgical', 'Effective for spider veins', 'Outpatient procedure', 'Proven results'],
      severity: 'Mild to Moderate',
      duration: '15-30 minutes',
      recovery: '2-3 days'
    },
    {
      icon: Heart,
      title: 'Radiofrequency Ablation',
      description: 'Uses radiofrequency energy to heat and close problematic veins safely and effectively.',
      benefits: ['Less bruising', 'Faster healing', 'Local anesthesia', 'High precision'],
      severity: 'Moderate to Severe',
      duration: '45-60 minutes',
      recovery: '3-5 days'
    },
    {
      icon: Shield,
      title: 'Compression Therapy',
      description: 'Specialized stockings that improve circulation and reduce symptoms of varicose veins.',
      benefits: ['Non-invasive', 'Immediate relief', 'Prevents progression', 'Daily use'],
      severity: 'All levels',
      duration: 'Ongoing',
      recovery: 'None required'
    }
  ];

  const preventionTips = [
    {
      icon: Clock,
      title: 'Regular Exercise',
      description: 'Walking, swimming, and cycling improve circulation and strengthen leg muscles.'
    },
    {
      icon: Award,
      title: 'Healthy Weight',
      description: 'Maintaining optimal weight reduces pressure on leg veins and improves circulation.'
    },
    {
      icon: Heart,
      title: 'Leg Elevation',
      description: 'Elevating legs above heart level for 15 minutes daily helps blood flow back to the heart.'
    },
    {
      icon: Shield,
      title: 'Avoid Prolonged Standing',
      description: 'Take breaks to move around if your job requires long periods of standing or sitting.'
    }
  ];

  return (
    <section id="treatments" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Treatment Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover modern, effective treatments for varicose veins. From minimally invasive 
            procedures to conservative management options.
          </p>
        </div>

        {/* Treatment Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {treatments.map((treatment, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <treatment.icon className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{treatment.title}</h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {treatment.description}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Severity</div>
                  <div className="text-sm font-semibold text-gray-900">{treatment.severity}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Duration</div>
                  <div className="text-sm font-semibold text-gray-900">{treatment.duration}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-500">Recovery</div>
                  <div className="text-sm font-semibold text-gray-900">{treatment.recovery}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Benefits:</h4>
                <ul className="space-y-2">
                  {treatment.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mr-3"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Prevention Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Prevention & Lifestyle
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple lifestyle changes can help prevent varicose veins and improve your overall vein health.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {preventionTips.map((tip, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-200 transition-colors">
                  <tip.icon className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  {tip.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-2xl p-8 md:p-12">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Get Personalized Treatment Recommendations
            </h3>
            <p className="text-purple-100 text-lg mb-8 max-w-2xl mx-auto">
              Our AI analysis will help determine the most suitable treatment options based on 
              your specific condition and severity level.
            </p>
            <button 
              onClick={() => document.getElementById('analysis')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Analysis
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}