import { ThemeProvider } from "./theme/ThemeContext";
import TopBar from "./components/TopBar";
import Tour from "./components/Tour";
import Shift from "./components/Shift";
import Shipped from "./components/Shipped";
import About from "./components/About";
import Experience from "./components/Experience";
import Principles from "./components/Principles";
import Toolkit from "./components/Toolkit";
import Research from "./components/Research";
import Projects from "./components/Projects";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

export default function App() {
  return (
    <ThemeProvider>
      <a
        href="#main"
        className="btn btn-primary fixed left-4 top-4 z-[70] -translate-y-24 focus-visible:translate-y-0"
      >
        Skip to content
      </a>
      <TopBar />
      <main id="main">
        <Tour />
        <Shift />
        <Shipped />
        <About />
        <Experience />
        <Principles />
        <Toolkit />
        <Research />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </ThemeProvider>
  );
}
