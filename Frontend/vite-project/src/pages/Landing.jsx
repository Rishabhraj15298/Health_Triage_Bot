import "../App.css";

import Navbar from "../components/Navbar.jsx";
import CTA from "../components/CTA.jsx";
import Footer from "../components/Footer.jsx";
import Hero from "../components/Hero.jsx";
import Features from "../components/Features.jsx";

function Landing() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}

export default Landing;
