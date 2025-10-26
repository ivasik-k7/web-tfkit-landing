import './App.css'
import {Hero} from "./components/Hero.tsx";
import {Features} from "./components/Features.tsx";
import {SearchSection} from "./components/SearchSection.tsx";
import {Footer} from "./components/Footer.tsx";

function App() {

  return (
      <div className="w-full min-h-screen bg-black text-white">
          <Hero />
          <Features />
          <SearchSection />
          <Footer />
      </div>
  )
}

export default App
