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
} from 'lucide-react';

interface MobileBottomNavProps {
  currentTab: 'measure' | 'squaring' | 'report' | 'guides' | 'converter';
  onSelectTab: (tab: 'measure' | 'squaring' | 'report' | 'guides' | 'converter') => void;
  onOpenVehicles: () => void;
  onOpenSessions: () => void;
  onOpenConverter: () => void;
  onExport: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
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
}) => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = React.useState<boolean>(false);

  return (
    <>
      {/* "More" Action Drawer on Mobile */}
      {isMoreMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex flex-col justify-end">
          <div
            className="flex-1"
            onClick={() => setIsMoreMenuOpen(false)}
          />
          <div className="bg-neutral-900 border-t border-neutral-800 rounded-t-2xl p-5 space-y-4 shadow-2xl pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))]">
            <div className="w-10 h-1 bg-neutral-700 rounded-full mx-auto mb-2" />
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="text-sm font-bold text-white">Workshop Utilities</span>
              <button
                onClick={() => setIsMoreMenuOpen(false)}
                className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenVehicles();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[48px]"
              >
                <Car className="w-4 h-4 text-amber-500" />
                <span>Chassis Profiles</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenSessions();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[48px]"
              >
                <History className="w-4 h-4 text-amber-500" />
                <span>Session Logs</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onOpenConverter();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[48px]"
              >
                <Calculator className="w-4 h-4 text-amber-500" />
                <span>Toe & Camber Calc</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onExport();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[48px]"
              >
                <Download className="w-4 h-4 text-amber-500" />
                <span>Backup JSON</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  onToggleTheme();
                }}
                className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-200 active:bg-neutral-800 min-h-[48px]"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-400" />}
                <span>Switch to {isDark ? 'Light' : 'Dark'} Mode</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Tab Navigation Bar on Mobile */}
      <div className="no-print md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-900/95 backdrop-blur-md border-t border-neutral-800 pb-[env(safe-area-inset-bottom,0px)] shadow-lg">
        <div className="grid grid-cols-5 items-center h-14">
          {/* Tab 1: Alignment Rig */}
          <button
            onClick={() => onSelectTab('measure')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'measure' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Rig</span>
          </button>

          {/* Tab 2: String Squaring */}
          <button
            onClick={() => onSelectTab('squaring')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'squaring' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <Ruler className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Squaring</span>
          </button>

          {/* Tab 3: Comparison Report */}
          <button
            onClick={() => onSelectTab('report')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'report' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <FileText className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Report</span>
          </button>

          {/* Tab 4: BMW Guides */}
          <button
            onClick={() => onSelectTab('guides')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
              currentTab === 'guides' ? 'text-amber-400 font-bold' : 'text-neutral-400 active:text-white'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Guides</span>
          </button>

          {/* Tab 5: More Tools Drawer */}
          <button
            onClick={() => setIsMoreMenuOpen(true)}
            className="flex flex-col items-center justify-center h-full min-h-[44px] text-neutral-400 active:text-white transition-colors"
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Tools</span>
          </button>
        </div>
      </div>
    </>
  );
};
