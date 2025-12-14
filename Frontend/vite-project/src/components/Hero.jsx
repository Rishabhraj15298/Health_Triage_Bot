import { ArrowRight, Activity, Sparkles, MessageSquare, Stethoscope, Phone, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-6 lg:px-8 overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e3a8a15_1px,transparent_1px),linear-gradient(to_bottom,#1e3a8a15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-grid-flow"></div>
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-float-slow"></div>
      <div className="absolute top-40 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-float-slower"></div>

      <div className="max-w-6xl mx-auto relative z-10">

        <div className={`text-center space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>

          {/* Beta badge with enhanced animation */}
          <div className="inline-flex items-center gap-2 bg-blue-950/30 border border-blue-900/50 rounded-full px-4 py-2 backdrop-blur-sm hover:scale-105 transition-transform duration-300 animate-fade-in-down">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm text-blue-400 font-medium">AI-Powered Healthcare</span>
            <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />
          </div>

          {/* Main heading with staggered animation */}
          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight animate-fade-in-up animation-delay-200">
            Smart Symptom Assessment <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Instant Care Guidance
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl text-gray-400 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
            AI-powered conversational triage that assesses patient symptoms, assigns risk scores, 
            and directs them to the appropriate level of care—Self-care, Tele-consult, or ER.
          </p>

          {/* CTA buttons with enhanced hover effects */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up animation-delay-600">
            <button className="group relative bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
              <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition-opacity blur"></span>
              Start Assessment
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button className="group bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-lg border border-gray-800 hover:border-blue-600/50 flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
              See How It Works
            </button>
          </div>

        </div>

        {/* Triage Flow Visualization */}
        <div className={`mt-20 relative transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          {/* Animated glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-blue-500/20 to-blue-600/30 blur-3xl animate-pulse-slow"></div>

          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-2 shadow-2xl hover:shadow-blue-900/20 transition-all duration-500 hover:scale-[1.02] group">
            {/* Shine effect on hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            <div className="bg-[#0A0A0F] rounded-xl border border-gray-800 p-8 md:p-12">
              {/* Triage Flow */}
              <div className="flex flex-col items-center space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center gap-2 text-blue-400 mb-2">
                    <Activity className="w-5 h-5" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Intelligent Triage System</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Patient Journey</h3>
                  <p className="text-gray-400 text-sm">AI analyzes symptoms and directs to appropriate care</p>
                </div>

                {/* Flow Steps */}
                <div className="grid md:grid-cols-3 gap-6 w-full max-w-4xl">
                  
                  {/* Self-Care */}
                  <div className="relative group/card">
                    <div className="bg-gradient-to-br from-green-600/10 to-green-800/10 border border-green-600/30 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 bg-green-600/20 border border-green-500/40 rounded-full flex items-center justify-center">
                          <Activity className="w-7 h-7 text-green-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">Self-Care</h4>
                        <p className="text-sm text-gray-400">Low risk symptoms</p>
                        <div className="text-xs text-green-400 font-medium">Risk: Low</div>
                      </div>
                    </div>
                  </div>

                  {/* Tele-Consult */}
                  <div className="relative group/card">
                    <div className="bg-gradient-to-br from-blue-600/10 to-blue-800/10 border border-blue-600/30 rounded-xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 bg-blue-600/20 border border-blue-500/40 rounded-full flex items-center justify-center">
                          <Phone className="w-7 h-7 text-blue-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">Tele-Consult</h4>
                        <p className="text-sm text-gray-400">Moderate symptoms</p>
                        <div className="text-xs text-blue-400 font-medium">Risk: Medium</div>
                      </div>
                    </div>
                  </div>

                  {/* Emergency Room */}
                  <div className="relative group/card">
                    <div className="bg-gradient-to-br from-red-600/10 to-red-800/10 border border-red-600/30 rounded-xl p-6 hover:border-red-500/50 transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="w-14 h-14 bg-red-600/20 border border-red-500/40 rounded-full flex items-center justify-center">
                          <AlertCircle className="w-7 h-7 text-red-400" />
                        </div>
                        <h4 className="text-lg font-semibold text-white">Emergency</h4>
                        <p className="text-sm text-gray-400">Severe symptoms</p>
                        <div className="text-xs text-red-400 font-medium">Risk: High</div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* AI Badge */}
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                  <Stethoscope className="w-4 h-4 text-blue-500" />
                  <span>Powered by advanced AI algorithms</span>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>


    </section>
  );
}
