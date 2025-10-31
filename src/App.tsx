
import { Hero } from './components/Hero';
import { Features } from './components/Features';

import { Scrollbar } from './components/Scrollbar';
import { Footer } from './components/Footer';
import { Visualization } from './components/Visualization';
import { BuyMeACoffee } from './components/BuyMeACoffee';

export function App() {
  return (
    <Scrollbar showProgress={false} variant="default">
      <div className="app-content">
        <Hero />
        <Features />

        <Visualization />
        <BuyMeACoffee />
        <Footer />
        {/* Add other components here */}
      </div>
    </Scrollbar>
  );
}