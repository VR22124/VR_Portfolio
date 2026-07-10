import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import ShepherEdCaseStudy from './pages/ShepherEdCaseStudy';
import EngineeringPrinciples from './pages/EngineeringPrinciples';
import EngineeringNotes from './pages/EngineeringNotes';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait for React to render the DOM before finding the element
      setTimeout(() => {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'auto' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/case-studies/shephered" element={<ShepherEdCaseStudy />} />
        <Route path="/principles" element={<EngineeringPrinciples />} />
        <Route path="/notes" element={<EngineeringNotes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
