
import { Hero } from './components/Hero';
import { Features } from './components/Features';

import { Scrollbar } from './components/Scrollbar';
import { Footer } from './components/Footer';
import { InteractiveVizSelector } from './components/Visualization';
import ResponsiveDock from './components/Dock';

export function App() {
  return (
    <Scrollbar showProgress={false} variant="default">
      <div className="app-content">
        <ResponsiveDock />

        <Hero />
        <Features />

        <InteractiveVizSelector />
        <Footer />
      </div>
    </Scrollbar>
  );
}