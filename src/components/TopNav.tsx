import React from 'react';
import { ArrowRight } from 'lucide-react';
import homieLogo from '../homie text logo 2.png';

interface TopNavProps {
  currentView: 'overview' | 'tenant' | 'manager';
  onViewChange: (view: 'overview' | 'tenant' | 'manager') => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentView,
  onViewChange,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[hsl(51.4_15.6%_78%)] bg-[hsl(46.2_33.3%_92.4%)]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Full Homie Logo */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center cursor-pointer transition-opacity hover:opacity-85" 
            onClick={() => onViewChange('overview')}
            title="Homie — Home"
          >
            <img
              src={homieLogo || "/api/logo"}
              alt="homie"
              className="h-8 sm:h-9 w-auto object-contain select-none"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Center: Segmented view switcher (Overview | Tenant Intake | Manager Desk) */}
        <div className="flex items-center p-1 bg-[hsl(50_20.7%_88.6%)] border border-[hsl(51.4_15.6%_78%)] rounded-md">
          <button
            type="button"
            onClick={() => onViewChange('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-all duration-150 ${
              currentView === 'overview'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-700 hover:text-black hover:bg-[hsl(46.2_33.3%_92.4%)]'
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => onViewChange('tenant')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-all duration-150 ${
              currentView === 'tenant'
                ? 'bg-black text-white shadow-xs'
                : 'text-neutral-700 hover:text-black hover:bg-[hsl(46.2_33.3%_92.4%)]'
            }`}
          >
            Tenant Intake
          </button>
          <button
            type="button"
            onClick={() => onViewChange('manager')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xs transition-all duration-150 flex items-center gap-1.5 ${
              currentView === 'manager'
                ? 'bg-[#0000EE] text-white shadow-xs'
                : 'text-neutral-700 hover:text-black hover:bg-[hsl(46.2_33.3%_92.4%)]'
            }`}
          >
            Manager Desk
          </button>
        </div>

        {/* Right: Clean minimal CTA button */}
        <div className="flex items-center gap-2">
          {currentView !== 'tenant' ? (
            <button
              type="button"
              onClick={() => onViewChange('tenant')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-[#0000EE] hover:bg-blue-700 border border-blue-900 rounded-md transition-colors"
            >
              <span>Test Resident Flow</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onViewChange('manager')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-black hover:bg-neutral-800 border border-black rounded-md transition-colors"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};

export default TopNav;
