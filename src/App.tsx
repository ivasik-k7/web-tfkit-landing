import React from 'react';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { VisualizationShowcase } from './components/VisualizationShowcase';
import { CommandDemo } from './components/CommandDemo';
export function App() {
  return <div className="w-full min-h-screen bg-black text-white">
      <Hero />
      <Features />
      <VisualizationShowcase />
      <CommandDemo />
    </div>;
}