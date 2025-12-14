import { Clock, Brain, Target, Globe, Shield, Route } from "lucide-react";

const features = [
  { icon: Clock, title: "24/7 Availability", description: "Round-the-clock AI triage support for patients anytime, anywhere." },
  { icon: Brain, title: "Intelligent Analysis", description: "Advanced AI algorithms assess symptoms with medical accuracy." },
  { icon: Target, title: "Risk Assessment", description: "Instant risk scoring to prioritize urgent cases effectively." },
  { icon: Globe, title: "Multi-Language", description: "Support for multiple languages to serve diverse populations." },
  { icon: Shield, title: "HIPAA Compliant", description: "Enterprise-grade security with full healthcare compliance." },
  { icon: Route, title: "Smart Routing", description: "Automatic direction to Self-care, Tele-consult, or ER." }
];

export default function Features() {
  return (
    <section className="py-24 px-6 lg:px-8 bg-gradient-to-b from-[#0A0A0F] to-gray-950" id="features">
      <div className="max-w-7xl mx-auto">

        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Comprehensive Triage Solution
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to provide intelligent, efficient patient care guidance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white/5 hover:bg-white/10 border border-gray-800 hover:border-gray-700 rounded-2xl p-8 transition-all"
            >
              <div className="w-12 h-12 bg-blue-600/10 border border-blue-600/30 rounded-xl flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-blue-500" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
