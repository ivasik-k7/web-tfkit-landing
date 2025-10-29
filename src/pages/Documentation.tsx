
import { DocSidebar } from '../components/DocSidebar';
import { DocContent } from '../components/DocContent';
export function Documentation() {
  return <div className="w-full min-h-screen bg-black flex">
      {/* Static background grid - no animations */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pointer-events-none">
        <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />
      </div>
      <div className="relative z-10 flex w-full">
        <DocSidebar />
        <DocContent />
      </div>
    </div>;
}