import React, { useState } from 'react';
import { VehicleProfile } from '../types/alignment';
import { calculateStringSquaring } from '../utils/alignmentMath';
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Ruler, RefreshCw } from 'lucide-react';

interface StringSquaringAssistantProps {
  vehicle: VehicleProfile;
  onApplyHubMeasurements?: (hubs: { FL: number; FR: number; RL: number; RR: number }) => void;
}

export const StringSquaringAssistant: React.FC<StringSquaringAssistantProps> = ({
  vehicle,
  onApplyHubMeasurements,
}) => {
  // Typical default string box width: ~1900mm
  const [boxWidthFront, setBoxWidthFront] = useState<number>(1900);
  const [boxWidthRear, setBoxWidthRear] = useState<number>(1900);

  // Expected hub-to-string given track width:
  // e.g. front track 1558mm, box 1900mm -> (1900 - 1558)/2 = 171mm to tire center or ~95mm to hub face
  const trackDiffPerSide = (vehicle.trackRearMm - vehicle.trackFrontMm) / 2;

  const [hubFL, setHubFL] = useState<number>(95.0);
  const [hubFR, setHubFR] = useState<number>(95.0);
  const [hubRL, setHubRL] = useState<number>(Number((95.0 - trackDiffPerSide).toFixed(1)));
  const [hubRR, setHubRR] = useState<number>(Number((95.0 - trackDiffPerSide).toFixed(1)));

  const result = calculateStringSquaring({
    boxWidthFrontMm: boxWidthFront,
    boxWidthRearMm: boxWidthRear,
    hubToStringFL: hubFL,
    hubToStringFR: hubFR,
    hubToStringRL: hubRL,
    hubToStringRR: hubRR,
  });

  const handleResetToIdeal = () => {
    setBoxWidthFront(1900);
    setBoxWidthRear(1900);
    const nominalFrontHub = 95.0;
    const nominalRearHub = Number((nominalFrontHub - trackDiffPerSide).toFixed(1));
    setHubFL(nominalFrontHub);
    setHubFR(nominalFrontHub);
    setHubRL(nominalRearHub);
    setHubRR(nominalRearHub);
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Ruler className="w-5 h-5 text-amber-500" />
              <span>String Box Squaring & Centering Assistant</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Validates that your strings are 100% parallel and perfectly centered to the {vehicle.name} chassis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetToIdeal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-mono text-neutral-300 border border-neutral-700 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Ideal Center Geometry</span>
            </button>
          </div>
        </div>

        {/* BMW Track Width Physics Callout */}
        <div className="mt-4 p-3 rounded-lg bg-neutral-950/80 border border-amber-500/30 text-xs text-neutral-300">
          <strong className="text-amber-400 font-semibold block mb-1">
            BMW Factory Geometry Notice ({vehicle.chassisCode}):
          </strong>
          <span>
            Front Track: <strong className="text-white font-mono">{vehicle.trackFrontMm} mm</strong> ·
            Rear Track: <strong className="text-white font-mono">{vehicle.trackRearMm} mm</strong>.
            The rear track is <strong className="text-amber-400 font-mono">+{vehicle.trackRearMm - vehicle.trackFrontMm} mm</strong> wider than the front ({trackDiffPerSide}mm per side).
            Therefore, in a perfectly square box, rear hub-to-string measurements must naturally be <strong className="text-white font-mono">{trackDiffPerSide} mm closer</strong> to the string than front hubs!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-7 space-y-4">
          {/* Step 1: String Widths */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
              <span>1. String Rig Widths (Front vs Rear Bar)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                result.isParallel
                  ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                  : 'text-rose-400 border-rose-500/40 bg-rose-500/10'
              }`}>
                {result.isParallel ? 'PARALLEL' : 'NOT PARALLEL'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">
                  Front String Bar Width (mm)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={boxWidthFront}
                  onChange={(e) => setBoxWidthFront(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-lg p-2.5 text-white font-bold text-base min-h-[44px]"
                />
                <span className="text-[10px] text-neutral-500">Distance between strings at front</span>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">
                  Rear String Bar Width (mm)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.5"
                  value={boxWidthRear}
                  onChange={(e) => setBoxWidthRear(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-950 border border-neutral-700 focus:border-amber-500 rounded-lg p-2.5 text-white font-bold text-base min-h-[44px]"
                />
                <span className="text-[10px] text-neutral-500">Distance between strings at rear</span>
              </div>
            </div>

            <div className="mt-3 text-xs font-mono text-neutral-400 flex items-center justify-between border-t border-neutral-800/80 pt-2">
              <span>Width Delta (Front - Rear):</span>
              <strong className={result.isParallel ? 'text-emerald-400' : 'text-rose-400'}>
                {result.widthDiffMm > 0 ? `+${result.widthDiffMm}` : result.widthDiffMm} mm
              </strong>
            </div>
          </div>

          {/* Step 2: Hub Center to String Measurements */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center justify-between">
              <span>2. Wheel Hub Center to String (Centering Check)</span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                result.isSquare
                  ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                  : 'text-amber-400 border-amber-500/40 bg-amber-500/10'
              }`}>
                {result.isSquare ? 'CENTERED' : 'OFFSET DETECTED'}
              </span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono mb-4">
              {/* Front Axle */}
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-xs font-bold text-white block mb-2">Front Axle Hubs</span>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">FL Hub to String (mm)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={hubFL}
                      onChange={(e) => setHubFL(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg p-2 text-white font-bold text-base min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">FR Hub to String (mm)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={hubFR}
                      onChange={(e) => setHubFR(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg p-2 text-white font-bold text-base min-h-[44px]"
                    />
                  </div>
                  <div className="text-[11px] text-neutral-400 pt-1.5 border-t border-neutral-800 flex justify-between">
                    <span>Front Delta:</span>
                    <strong className={Math.abs(hubFR - hubFL) <= 1 ? 'text-emerald-400' : 'text-amber-400'}>
                      {(hubFR - hubFL).toFixed(1)} mm
                    </strong>
                  </div>
                </div>
              </div>

              {/* Rear Axle */}
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                <span className="text-xs font-bold text-white block mb-2">Rear Axle Hubs</span>
                <div className="space-y-2.5">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">RL Hub to String (mm)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={hubRL}
                      onChange={(e) => setHubRL(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg p-2 text-white font-bold text-base min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">RR Hub to String (mm)</label>
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.5"
                      value={hubRR}
                      onChange={(e) => setHubRR(parseFloat(e.target.value) || 0)}
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg p-2 text-white font-bold text-base min-h-[44px]"
                    />
                  </div>
                  <div className="text-[11px] text-neutral-400 pt-1.5 border-t border-neutral-800 flex justify-between">
                    <span>Rear Delta:</span>
                    <strong className={Math.abs(hubRR - hubRL) <= 1 ? 'text-emerald-400' : 'text-amber-400'}>
                      {(hubRR - hubRL).toFixed(1)} mm
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Squaring Status & Exact Adjustment Action Checklist */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              {result.isSquare ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
              <span>String Rig Status</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Strings Parallel:</span>
                  <span className={result.isParallel ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                    {result.isParallel ? 'YES (Within 1mm)' : `NO (Diff: ${result.widthDiffMm}mm)`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Front Axle Centered:</span>
                  <span className={Math.abs(result.frontCenterOffsetMm) <= 1.5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {Math.abs(result.frontCenterOffsetMm) <= 1.5 ? 'YES' : `Offset by ${result.frontCenterOffsetMm}mm`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Rear Axle Centered:</span>
                  <span className={Math.abs(result.rearCenterOffsetMm) <= 1.5 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                    {Math.abs(result.rearCenterOffsetMm) <= 1.5 ? 'YES' : `Offset by ${result.rearCenterOffsetMm}mm`}
                  </span>
                </div>
              </div>

              {/* Exact Physical Adjustments to Make */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Action Steps for Stands & Bars:
                </h4>
                <div className="space-y-2">
                  {result.recommendedAdjustments.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-neutral-950/70 border border-neutral-800 text-xs text-neutral-300 flex items-start gap-2"
                    >
                      <ArrowRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {result.isSquare && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Square setup confirmed! You can now measure individual wheel toe on the Alignment Rig tab with sub-millimeter precision.
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
