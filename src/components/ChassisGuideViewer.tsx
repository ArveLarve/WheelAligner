import React, { useState } from 'react';
import { BMW_CHASSIS_GUIDES, STRING_ALIGNMENT_MASTER_GUIDE } from '../data/chassisGuides';
import { BookOpen, Wrench, AlertTriangle, CheckCircle2, ChevronRight, Compass, ShieldAlert, Cpu } from 'lucide-react';
import { ChassisCode } from '../types/alignment';

interface ChassisGuideViewerProps {
  initialChassisCode?: ChassisCode;
  initialWheel?: string;
}

export const ChassisGuideViewer: React.FC<ChassisGuideViewerProps> = ({
  initialChassisCode = 'E60',
}) => {
  const [selectedGuide, setSelectedGuide] = useState<string>(
    initialChassisCode === 'CUSTOM' ? 'E60' : initialChassisCode
  );
  const [activeTab, setActiveTab] = useState<'master' | 'front' | 'rear' | 'gotchas'>('front');

  const currentChassis = BMW_CHASSIS_GUIDES[selectedGuide] || BMW_CHASSIS_GUIDES.E60;

  return (
    <div className="space-y-6">
      {/* Top Selector Navigation */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span>BMW Chassis Alignment Field Manual</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Wheel-by-wheel adjustment procedures, exact wrench sizes, torque specs, and string setup steps.
          </p>
        </div>

        {/* Chassis Selector Buttons */}
        <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 w-full md:w-auto">
          <button
            onClick={() => {
              setSelectedGuide('E60');
              setActiveTab('front');
            }}
            className={`flex-1 md:flex-none px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md min-h-[40px] sm:min-h-0 transition-colors ${
              selectedGuide === 'E60'
                ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            E60 (5-Series)
          </button>
          <button
            onClick={() => {
              setSelectedGuide('E87');
              setActiveTab('front');
            }}
            className={`flex-1 md:flex-none px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md min-h-[40px] sm:min-h-0 transition-colors ${
              selectedGuide === 'E87'
                ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            E87 (1-Series)
          </button>
          <button
            onClick={() => {
              setSelectedGuide('F11');
              setActiveTab('front');
            }}
            className={`flex-1 md:flex-none px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md min-h-[40px] sm:min-h-0 transition-colors ${
              selectedGuide === 'F11'
                ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            F11 (Touring)
          </button>
        </div>
      </div>

      {/* Guide Content Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
        {/* Chassis Header Banner */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-neutral-950 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-[10px] sm:text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
              {currentChassis.chassisCode} TECHNICAL SPECIFICATION
            </span>
            <h3 className="text-base sm:text-xl font-bold text-white">{currentChassis.chassisName}</h3>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">{currentChassis.overview}</p>
          </div>

          <div className="text-xs font-mono text-neutral-300 bg-neutral-900 px-3 py-1.5 sm:py-2 rounded-lg border border-neutral-800 w-full sm:w-auto flex sm:flex-col justify-between items-center sm:items-start">
            <div>Track F: <strong className="text-white">{currentChassis.factoryTrackFrontMm}mm</strong> · R: <strong className="text-white">{currentChassis.factoryTrackRearMm}mm</strong></div>
            <div className="text-amber-400 text-[11px]">
              +{currentChassis.factoryTrackRearMm - currentChassis.factoryTrackFrontMm}mm wider rear
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="px-3 sm:px-6 border-b border-neutral-800 bg-neutral-900/60 flex items-center gap-1.5 overflow-x-auto py-2 no-scrollbar">
          <button
            onClick={() => setActiveTab('front')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-0 transition-colors ${
              activeTab === 'front'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Front Wheels (FL & FR)
          </button>
          <button
            onClick={() => setActiveTab('rear')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-0 transition-colors ${
              activeTab === 'rear'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Rear Wheels (RL & RR)
          </button>
          <button
            onClick={() => setActiveTab('gotchas')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-0 transition-colors ${
              activeTab === 'gotchas'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Chassis Gotchas
          </button>
          <button
            onClick={() => setActiveTab('master')}
            className={`px-3 py-2 sm:py-1.5 text-xs font-semibold rounded-md whitespace-nowrap shrink-0 min-h-[40px] sm:min-h-0 transition-colors ${
              activeTab === 'master'
                ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            String Rig Masterclass (5 Steps)
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {/* FRONT WHEELS GUIDE */}
          {activeTab === 'front' && (
            <div className="space-y-6">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>Front Axle Rule:</strong> Always verify that the rear axle alignment and thrust angle are completed FIRST before locking in front steering tie-rod settings!
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentChassis.frontWheelGuide.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider block">
                          Adjustment: {item.adjustmentType}
                        </span>
                        <h4 className="text-base font-bold text-white">{item.mechanism}</h4>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono">
                        {item.toolSizes}
                      </span>
                    </div>

                    <div className="text-xs space-y-3 font-mono">
                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-1 font-sans">
                          HOW TO TURN / ADJUST:
                        </span>
                        <p className="text-neutral-200 bg-neutral-900/90 p-2.5 rounded border border-neutral-800">
                          {item.directionOfTurn}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                          <span className="text-neutral-400 block text-[10px]">Sensitivity:</span>
                          <span className="text-white font-bold">{item.approximateSensitivity}</span>
                        </div>
                        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                          <span className="text-neutral-400 block text-[10px]">Torque Spec:</span>
                          <span className="text-amber-400 font-bold">{item.torqueSpec}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-1 font-sans">
                          GARAGE TIPS:
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {item.proTips.map((tip, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-1.5 text-xs font-sans">
                              <span className="text-amber-500 font-bold">·</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* REAR WHEELS GUIDE */}
          {activeTab === 'rear' && (
            <div className="space-y-6">
              <div className="p-3 rounded-lg bg-neutral-950 border border-amber-500/30 text-xs text-neutral-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <span>
                  <strong>CRITICAL REAR DEPENDENCY:</strong> Adjust <strong className="text-white">Rear Camber FIRST</strong>, then adjust <strong className="text-white">Rear Toe & Thrust SECOND</strong>! On BMW multi-link suspension, rotating the lower control arm camber eccentric changes rear toe significantly.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentChassis.rearWheelGuide.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-500 uppercase tracking-wider block">
                          Adjustment: {item.adjustmentType}
                        </span>
                        <h4 className="text-base font-bold text-white">{item.mechanism}</h4>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono">
                        {item.toolSizes}
                      </span>
                    </div>

                    <div className="text-xs space-y-3 font-mono">
                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-1 font-sans">
                          HOW TO TURN / ADJUST:
                        </span>
                        <p className="text-neutral-200 bg-neutral-900/90 p-2.5 rounded border border-neutral-800">
                          {item.directionOfTurn}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                          <span className="text-neutral-400 block text-[10px]">Sensitivity:</span>
                          <span className="text-white font-bold">{item.approximateSensitivity}</span>
                        </div>
                        <div className="p-2 rounded bg-neutral-900/60 border border-neutral-800">
                          <span className="text-neutral-400 block text-[10px]">Torque Spec:</span>
                          <span className="text-amber-400 font-bold">{item.torqueSpec}</span>
                        </div>
                      </div>

                      <div>
                        <span className="text-neutral-400 block text-[11px] mb-1 font-sans">
                          GARAGE TIPS:
                        </span>
                        <ul className="space-y-1 text-neutral-300">
                          {item.proTips.map((tip, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-1.5 text-xs font-sans">
                              <span className="text-amber-500 font-bold">·</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CHASSIS GOTCHAS */}
          {activeTab === 'gotchas' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span>Known Suspension & Bushing Characteristics ({currentChassis.chassisCode})</span>
              </h4>

              <div className="space-y-3">
                {currentChassis.bmwSpecificGotchas.map((gotcha, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-3"
                  >
                    <div className="w-5 h-5 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center font-mono font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="leading-relaxed">{gotcha}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STRING RIG MASTERCLASS (5 STEPS) */}
          {activeTab === 'master' && (
            <div className="space-y-6">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  The parallel string box method is the gold standard used by IMSA, Le Mans, and Formula 1 race teams for sub-millimeter chassis setup.
                </span>
              </div>

              <div className="space-y-4">
                {STRING_ALIGNMENT_MASTER_GUIDE.map((step) => (
                  <div
                    key={step.stepNumber}
                    className="p-5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3"
                  >
                    <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-neutral-950 font-bold text-xs flex items-center justify-center font-mono">
                          {step.stepNumber}
                        </span>
                        <h4 className="text-base font-bold text-white">{step.title}</h4>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono hidden sm:inline-block">
                        {step.toolNeeded}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-300 font-medium">{step.summary}</p>

                    <ul className="space-y-1.5 text-xs text-neutral-400 pl-4 border-l border-neutral-800">
                      {step.details.map((detail, dIdx) => (
                        <li key={dIdx} className="leading-relaxed">
                          • {detail}
                        </li>
                      ))}
                    </ul>

                    {step.warningNote && (
                      <div className="p-2.5 rounded bg-rose-950/30 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span>{step.warningNote}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
