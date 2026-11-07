import React, { useState } from 'react';
import {
  AlignmentSession,
  SessionStage,
  SingleWheelMeasurement,
  VehicleProfile,
  WheelPosition,
} from '../types/alignment';
import { Copy, FileEdit, HelpCircle, Plus, Minus } from 'lucide-react';
import { calculateIndividualToe } from '../utils/alignmentMath';

interface StageMeasurementsEditorProps {
  session: AlignmentSession;
  activeStage: SessionStage;
  onChangeStage: (stage: SessionStage) => void;
  onUpdateWheel: (wheel: WheelPosition, data: Partial<SingleWheelMeasurement>) => void;
  onUpdateStageNotes: (notes: string) => void;
  onCopyFromStage: (sourceStage: SessionStage) => void;
  vehicle: VehicleProfile;
  selectedWheel?: WheelPosition;
  onSelectWheel?: (wheel: WheelPosition) => void;
  onOpenGuideForWheel?: (wheel: WheelPosition) => void;
}

export const StageMeasurementsEditor: React.FC<StageMeasurementsEditorProps> = ({
  session,
  activeStage,
  onChangeStage,
  onUpdateWheel,
  onUpdateStageNotes,
  onCopyFromStage,
  vehicle,
  selectedWheel,
  onSelectWheel,
  onOpenGuideForWheel,
}) => {
  const [mobileWheelFilter, setMobileWheelFilter] = useState<'ALL' | WheelPosition>('ALL');

  const currentStageData = session.stages[activeStage] || session.stages.before;

  const wheelsList: { pos: WheelPosition; name: string; isFront: boolean }[] = [
    { pos: 'FL', name: 'Front Left', isFront: true },
    { pos: 'FR', name: 'Front Right', isFront: true },
    { pos: 'RL', name: 'Rear Left', isFront: false },
    { pos: 'RR', name: 'Rear Right', isFront: false },
  ];

  const displayedWheels =
    mobileWheelFilter === 'ALL'
      ? wheelsList
      : wheelsList.filter((w) => w.pos === mobileWheelFilter);

  // Quick increment/decrement helper for oily hands under the car
  const adjustValue = (
    pos: WheelPosition,
    field: 'stringFrontMm' | 'stringRearMm' | 'camberDeg',
    delta: number
  ) => {
    const currentVal = currentStageData.wheels[pos][field] ?? 0;
    const newVal = Number((currentVal + delta).toFixed(2));
    onUpdateWheel(pos, { [field]: newVal });
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
      {/* Stage Selector Bar */}
      <div className="px-3 py-2.5 sm:px-4 sm:py-3 bg-neutral-950 border-b border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider hidden sm:inline">
            Stage:
          </span>
          <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800 w-full sm:w-auto">
            <button
              onClick={() => onChangeStage('before')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:py-1 text-xs font-semibold rounded-md min-h-[40px] sm:min-h-0 transition-colors ${
                activeStage === 'before'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              1. Before
            </button>
            <button
              onClick={() => onChangeStage('intermediate')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:py-1 text-xs font-semibold rounded-md min-h-[40px] sm:min-h-0 transition-colors ${
                activeStage === 'intermediate'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              2. Inter
            </button>
            <button
              onClick={() => onChangeStage('final')}
              className={`flex-1 sm:flex-none px-3 py-2 sm:py-1 text-xs font-semibold rounded-md min-h-[40px] sm:min-h-0 transition-colors ${
                activeStage === 'final'
                  ? 'bg-amber-500 text-neutral-950 shadow-sm font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              3. Final
            </button>
          </div>
        </div>

        {/* Copy / Pre-fill from previous stage */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {activeStage === 'intermediate' && (
            <button
              onClick={() => onCopyFromStage('before')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors min-h-[38px] sm:min-h-0"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Clone Before</span>
            </button>
          )}

          {activeStage === 'final' && (
            <button
              onClick={() => onCopyFromStage(session.stages.intermediate ? 'intermediate' : 'before')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-neutral-300 hover:text-white bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors min-h-[38px] sm:min-h-0"
            >
              <Copy className="w-3.5 h-3.5 text-amber-400" />
              <span>Clone {session.stages.intermediate ? 'Inter' : 'Before'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobile Wheel Selector Filter (Single-wheel focus under the car) */}
      <div className="sm:hidden px-3 py-2 bg-neutral-900 border-b border-neutral-800/80 flex items-center gap-1 text-xs font-mono">
        <span className="text-[10px] text-neutral-500 uppercase mr-1">Wheel:</span>
        {(['ALL', 'FL', 'FR', 'RL', 'RR'] as const).map((w) => (
          <button
            key={w}
            onClick={() => setMobileWheelFilter(w)}
            className={`flex-1 py-1 rounded text-center font-bold text-xs transition-colors min-h-[36px] ${
              mobileWheelFilter === w
                ? 'bg-amber-500 text-neutral-950'
                : 'bg-neutral-950 text-neutral-400 border border-neutral-800'
            }`}
          >
            {w}
          </button>
        ))}
      </div>

      {/* Wheels Input Matrix */}
      <div className="p-3 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {displayedWheels.map(({ pos, name, isFront }) => {
          const meas = currentStageData.wheels[pos];
          const targetToe = isFront ? vehicle.targets.frontToePerWheel : vehicle.targets.rearToePerWheel;
          const targetCamber = isFront ? vehicle.targets.frontCamber : vehicle.targets.rearCamber;
          const calcToe = calculateIndividualToe(
            pos,
            meas.stringFrontMm,
            meas.stringRearMm,
            vehicle.rimLipDiameterMm,
            targetToe
          );

          const isSelected = selectedWheel === pos;

          return (
            <div
              key={pos}
              onClick={() => onSelectWheel?.(pos)}
              className={`rounded-xl p-3 sm:p-3.5 border transition-all ${
                isSelected
                  ? 'border-amber-500 bg-neutral-800/85 shadow-md ring-1 ring-amber-500/50'
                  : 'border-neutral-800 bg-neutral-900/60 hover:border-neutral-700'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{name} ({pos})</span>
                  <span className="text-[11px] text-neutral-400 font-mono hidden xs:inline">
                    Target: {targetToe.min}° to {targetToe.max}°
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenGuideForWheel?.(pos);
                  }}
                  className="flex items-center gap-1 text-[11px] font-mono text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-1 rounded-md border border-amber-500/30 transition-colors min-h-[36px] sm:min-h-0"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Guide</span>
                </button>
              </div>

              {/* Grid of Inputs */}
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 text-xs font-mono">
                {/* String Front Lip with quick steppers */}
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase text-neutral-400">Front Lip (mm)</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustValue(pos, 'stringFrontMm', -0.5);
                        }}
                        className="w-5 h-5 rounded bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
                        title="-0.5mm"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustValue(pos, 'stringFrontMm', 0.5);
                        }}
                        className="w-5 h-5 rounded bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
                        title="+0.5mm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={meas.stringFrontMm}
                    onChange={(e) =>
                      onUpdateWheel(pos, { stringFrontMm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded px-2.5 py-2 text-white font-bold text-base tabular-nums min-h-[44px]"
                  />
                  <span className="text-[9px] text-neutral-500 block mt-0.5">String to front rim</span>
                </div>

                {/* String Rear Lip with quick steppers */}
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase text-neutral-400">Rear Lip (mm)</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustValue(pos, 'stringRearMm', -0.5);
                        }}
                        className="w-5 h-5 rounded bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
                        title="-0.5mm"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustValue(pos, 'stringRearMm', 0.5);
                        }}
                        className="w-5 h-5 rounded bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
                        title="+0.5mm"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={meas.stringRearMm}
                    onChange={(e) =>
                      onUpdateWheel(pos, { stringRearMm: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded px-2.5 py-2 text-white font-bold text-base tabular-nums min-h-[44px]"
                  />
                  <span className="text-[9px] text-neutral-500 block mt-0.5">String to rear rim</span>
                </div>

                {/* Camber */}
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] uppercase text-neutral-400">Camber (°)</label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustValue(pos, 'camberDeg', -0.1);
                        }}
                        className="w-5 h-5 rounded bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
                      >
                        -
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          adjustValue(pos, 'camberDeg', 0.1);
                        }}
                        className="w-5 h-5 rounded bg-neutral-900 text-neutral-400 hover:text-white flex items-center justify-center border border-neutral-700"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.05"
                    value={meas.camberDeg}
                    onChange={(e) =>
                      onUpdateWheel(pos, { camberDeg: parseFloat(e.target.value) || 0 })
                    }
                    className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded px-2.5 py-2 text-white font-bold text-base tabular-nums min-h-[44px]"
                  />
                  <span className="text-[9px] text-neutral-500 block mt-0.5">Target: {targetCamber.target}°</span>
                </div>

                {/* Ride Height or Caster */}
                <div className="bg-neutral-950 p-2.5 rounded-lg border border-neutral-800">
                  <label className="text-[10px] uppercase text-neutral-400 block mb-1">
                    {isFront ? 'Caster (°)' : 'Ride Ht (mm)'}
                  </label>
                  {isFront ? (
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      value={meas.casterDeg || 7.5}
                      onChange={(e) =>
                        onUpdateWheel(pos, { casterDeg: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded px-2.5 py-2 text-white font-bold text-base tabular-nums min-h-[44px]"
                    />
                  ) : (
                    <input
                      type="number"
                      inputMode="numeric"
                      step="1"
                      value={meas.rideHeightMm || 570}
                      onChange={(e) =>
                        onUpdateWheel(pos, { rideHeightMm: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded px-2.5 py-2 text-white font-bold text-base tabular-nums min-h-[44px]"
                    />
                  )}
                  <span className="text-[9px] text-neutral-500 block mt-0.5">
                    {isFront ? 'OEM Caster' : 'Rim to arch'}
                  </span>
                </div>
              </div>

              {/* Calculated Output Strip for this wheel */}
              <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="text-neutral-400">Toe:</span>
                  <strong className="text-white">
                    {calcToe.deltaMm >= 0 ? `+${calcToe.deltaMm}` : calcToe.deltaMm} mm
                  </strong>
                  <span className="text-neutral-400">({calcToe.formattedString})</span>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                    calcToe.status === 'in-spec'
                      ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
                      : calcToe.status === 'warning'
                      ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
                      : 'text-rose-400 border-rose-500/40 bg-rose-500/10'
                  }`}
                >
                  {calcToe.status === 'in-spec' ? '✓ In Spec' : calcToe.status === 'warning' ? '⚠ Margin' : '✗ Out'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stage Notes */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 mb-1.5">
          <FileEdit className="w-3.5 h-3.5 text-amber-500" />
          <span>Stage Notes & Adjustments Made</span>
        </label>
        <textarea
          rows={2}
          value={currentStageData.stageNotes || ''}
          onChange={(e) => onUpdateStageNotes(e.target.value)}
          placeholder="E.g., Adjusted front left tie rod 1 flat in. Turned rear camber eccentric bolt clockwise..."
          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-200 placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
        />
      </div>
    </div>
  );
};
