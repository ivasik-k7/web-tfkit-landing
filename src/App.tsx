
import { Hero } from './components/Hero';
import { Features } from './components/Features';

import { Scrollbar } from './components/Scrollbar';
import { Footer } from './components/Footer';
import { Visualization } from './components/Visualization';
import ResponsiveDock from './components/Dock';

export function App() {
  return (
    <Scrollbar showProgress={false} variant="default">
      <div className="app-content">
        <ResponsiveDock />

        <Hero />
        <Features />

        <Visualization />
        <Footer />
      </div>
    </Scrollbar>
  );
}