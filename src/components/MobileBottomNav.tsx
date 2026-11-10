import React from 'react';
import {
  Grid,
  Ruler,
  FileText,
  BookOpen,
  MoreHorizontal,
  Calculator,
  Download,
  Car,
  History,
  Sun,
  Moon,
  LayoutTemplate,
  Monitor,
  Smartphone,
} from 'lucide-react';
import { NavLayoutMode } from '../utils/storage';

interface MobileBottomNavProps {
  currentTab: 'measure' | 'squaring' | 'report' | 'guides' | 'converter';
  onSelectTab: (tab: 'measure' | 'squaring' | 'report' | 'guides' | 'converter') => void;
  onOpenVehicles: () => void;
  onOpenSessions: () => void;
  onOpenConverter: () => void;
  onExport: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  isVisible: boolean;
  navLayoutMode: NavLayoutMode;
  onToggleNavLayout: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenVehicles,
  onOpenSessions,
  onOpenConverter,
  onExport,
  isDark,
  onToggleTheme,
  isVisible,
  navLayoutMode,
  onToggleNavLayout,
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState<boolean>(false);

  if (!isVisible) return null;

  return (
    <>
      {/* "More Tools" Action Drawer */}
      {isMoreMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end">
          <div
            className="flex-1"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="bg-neutral-900 border-t border-neutral-800 rounded-t-2xl p-4 sm:p-5 space-y-4 shadow-2xl max-w-2xl mx-auto w-full pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-sm font-bold text-white">Workshop & Tablet Utilities</span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs font-mono">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenVehicles();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[46px]"
              >
                <Car className="w-4 h-4 text-amber-500" />
                <span>Chassis Profiles</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenSessions();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[46px]"
              >
                <History className="w-4 h-4 text-amber-500" />
                <span>Session Logs</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenConverter();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[46px]"
              >
                <Calculator className="w-4 h-4 text-amber-500" />
                <span>Toe & Camber Calc</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onExport();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[46px]"
              >
                <Download className="w-4 h-4 text-amber-500" />
                <span>Backup JSON</span>
              </button>

              {/* Navigation Bar Toggle */}
              <button
                onClick={() => {
                  onToggleNavLayout();
                }}
                className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-neutral-950 border border-amber-500/30 text-neutral-200 active:bg-neutral-800 min-h-[46px]"
              >
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-amber-400" />
                  <span>Nav Bar: {navLayoutMode === 'bottom' ? 'Bottom Bar (Active)' : navLayoutMode === 'top' ? 'Top Bar' : 'Auto (Tablet Optimized)'}</span>
                </div>
                <span className="text-[10px] text-amber-400 font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  Switch
                </span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onToggleTheme();
                }}
                className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[46px]"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-400" />}
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Navigation Bar */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 pb-[env(safe-area-inset-bottom,0px)] shadow-lg">
        <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-13 sm:h-14">
          {/* Tab 1: Alignment Rig */}
          <button
            onClick={() => onSelectTab('measure')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'measure' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Rig</span>
          </button>

          {/* Tab 2: String Squaring */}
          <button
            onClick={() => onSelectTab('squaring')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'squaring' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <Ruler className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Squaring</span>
          </button>

          {/* Tab 3: Comparison Report */}
          <button
            onClick={() => onSelectTab('report')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'report' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Report</span>
          </button>

          {/* Tab 4: BMW Guides */}
          <button
            onClick={() => onSelectTab('guides')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'guides' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Guides</span>
          </button>

          {/* Tab 5: More Tools Drawer */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center h-full min-h-[44px] text-neutral-400 active:text-white transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-[10px] sm:text-[11px] mt-0.5 tracking-tight">Tools</span>
          </button>
        </div>
      </div>
    </>
  );
};
