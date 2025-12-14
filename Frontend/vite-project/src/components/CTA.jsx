import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CTA() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          {/* Animated outer glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl blur-2xl opacity-20 animate-pulse-glow"></div>
          
          <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
            {/* Animated floating orbs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-orb-1"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-float-orb-2"></div>
            
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-300/10 to-blue-400/0 animate-shimmer"></div>

            <div className="relative z-10 space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight animate-fade-in-scale">
                Ready to transform patient care?
              </h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto animate-fade-in-scale animation-delay-200">
                Join leading healthcare providers using AI-powered triage to improve patient outcomes 
                and optimize care delivery. Get started today.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-scale animation-delay-400">
                <button className="group relative bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg transition-all font-semibold text-lg flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 duration-300">
                  <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-hover:opacity-100 blur-md transition-opacity"></span>
                  <span className="relative">Request Demo</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" />
                </button>

                <button className="group text-white hover:text-blue-100 px-8 py-4 rounded-lg transition-all font-medium text-lg border-2 border-white/30 hover:border-white/50 hover:bg-white/10 hover:scale-105 duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  Contact Sales
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        @keyframes float-orb-1 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -20px); }
        }
        @keyframes float-orb-2 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, 20px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 3s ease-in-out infinite;
        }
        .animate-float-orb-1 {
          animation: float-orb-1 8s ease-in-out infinite;
        }
        .animate-float-orb-2 {
          animation: float-orb-2 10s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s ease-in-out infinite;
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.8s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
          animation-fill-mode: forwards;
        }
      `}</style>
    </section>
  );
}
