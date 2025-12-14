import { Zap, Github, Twitter, Linkedin, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const footerLinks = {
  Product: ["Features", "Pricing", "Security", "Changelog", "Roadmap"],
  Resources: ["Documentation", "API Reference", "Guides", "Blog", "Community"],
  Company: ["About", "Careers", "Contact", "Partners", "Press Kit"],
  Legal: ["Privacy", "Terms", "Cookie Policy", "Licenses", "Settings"]
};

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <footer ref={footerRef} className="bg-[#0A0A0F] border-t border-gray-800 pt-16 pb-8 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        <div className={`grid grid-cols-2 md:grid-cols-6 gap-8 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4 group cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">YourProduct</span>
            </div>

            <p className="text-gray-400 mb-6 max-w-sm">
              Building the future of modern web applications.
            </p>

            <div className="flex items-center gap-4">
              {[Twitter, Github, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-10 h-10 bg-white/5 hover:bg-blue-600/20 border border-gray-800 hover:border-blue-600/50 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <div 
              key={category}
              className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${(categoryIndex + 1) * 100}ms` }}
            >
              <h3 className="text-white font-semibold mb-4">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors hover:translate-x-1 inline-block">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} YourProduct. All rights reserved.
          </p>

          <span className="flex items-center gap-2 text-sm text-gray-500">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            All systems operational
          </span>
        </div>

      </div>
    </footer>
  );
}
