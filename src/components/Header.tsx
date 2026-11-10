import React from 'react';
import {
  Wrench,
  Grid,
  FileText,
  BookOpen,
  Plus,
  Download,
  Upload,
  Sun,
  Moon,
  Calculator,
  LayoutTemplate,
  Smartphone,
  Monitor,
} from 'lucide-react';
import { AlignmentSession, VehicleProfile } from '../types/alignment';
import { NavLayoutMode } from '../utils/storage';

interface HeaderProps {
  currentTab: 'measure' | 'squaring' | 'report' | 'guides' | 'converter';
  onSelectTab: (tab: 'measure' | 'squaring' | 'report' | 'guides' | 'converter') => void;
  activeVehicle: VehicleProfile;
  activeSession: AlignmentSession | null;
  onNewSession: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenVehicles: () => void;
  useBottomNav: boolean;
  navLayoutMode: NavLayoutMode;
  onToggleNavLayout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  activeVehicle,
  onNewSession,
  onExport,
  onImport,
  isDark,
  onToggleTheme,
  onOpenVehicles,
  useBottomNav,
  navLayoutMode,
  onToggleNavLayout,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <header className="border-b border-neutral-800 bg-neutral-900/95 backdrop-blur sticky top-0 z-40 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-4 md:px-6 h-13 sm:h-14 md:h-15 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Zone 1: Brand wordmark and Vehicle Quick-Tag */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-sm text-neutral-950 font-bold shrink-0">
              <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-sm sm:text-base font-bold tracking-tight text-white whitespace-nowrap block">
                ApexString
              </span>
            </div>
          </div>

          {/* Quick Chassis Chip */}
          <button
            onClick={onOpenVehicles}
            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700/80 border border-neutral-700/60 text-[11px] sm:text-xs font-mono text-amber-400 transition-colors shrink-0 max-w-[120px] sm:max-w-[160px]"
            title="Change chassis profile"
          >
            <span className="font-bold">{activeVehicle.chassisCode}</span>
            <span className="text-neutral-500 hidden sm:inline">·</span>
            <span className="text-neutral-300 truncate hidden sm:inline text-[11px]">
              {activeVehicle.name}
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Only shown when desktop top-bar mode is active) */}
        {!useBottomNav && (
          <nav className="flex items-center gap-1 text-xs font-medium text-neutral-300 shrink-0">
            <button
              onClick={() => onSelectTab('measure')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                currentTab === 'measure'
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Rig</span>
            </button>

            <button
              onClick={() => onSelectTab('squaring')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                currentTab === 'squaring'
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Squaring</span>
            </button>

            <button
              onClick={() => onSelectTab('report')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                currentTab === 'report'
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'hover:text-white hover:bg-neutral-800'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Report</span>
            </button>

            <button
              onClick={() => onSelectTab('guides')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                currentTab === 'guides'
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'hover:text-white hover:bg-neutral-800'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Guides</span>
            </button>

            <button
              onClick={() => onSelectTab('converter')}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md whitespace-nowrap shrink-0 transition-colors ${
                currentTab === 'converter'
                  ? 'bg-amber-500/15 text-amber-400 font-semibold border border-amber-500/30'
                  : 'hover:text-white hover:bg-neutral-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Calc</span>
            </button>
          </nav>
        )}

        {/* Zone 3: Primary Action & Garage Tools */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={onNewSession}
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-md transition-colors whitespace-nowrap shadow-sm min-h-[34px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Session</span>
            <span className="sm:hidden font-bold">New</span>
          </button>

          {/* Nav Mode Switcher (Tablet/Mobile Bottom Bar ↔ Desktop Top Bar) */}
          <button
            onClick={onToggleNavLayout}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors hidden sm:flex items-center gap-1 text-[11px] font-mono border border-neutral-800"
            title={`Current: ${useBottomNav ? 'Bottom Nav (Touch/Tablet)' : 'Top Nav (Desktop)'}. Click to switch.`}
          >
            {useBottomNav ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline text-neutral-300 text-[10px]">Tablet Bar</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden lg:inline text-neutral-300 text-[10px]">Top Bar</span>
              </>
            )}
          </button>

          <div className="hidden sm:flex items-center gap-0.5 border-l border-neutral-800 pl-1.5">
            <button
              onClick={onExport}
              title="Backup database to JSON"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              title="Import backup JSON"
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={onImport}
              className="hidden"
            />

            <button
              onClick={onToggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
