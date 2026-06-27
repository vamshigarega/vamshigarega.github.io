import { ThemeProvider } from "./theme/ThemeContext";
import Background from "./components/Background";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Capabilities from "./components/Capabilities";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import Research from "./components/Research";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <Background />
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Capabilities />
        <Experience />
        <Skills />
        <Research />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
