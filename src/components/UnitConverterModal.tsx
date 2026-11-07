import React, { useState } from 'react';
import { Calculator, X, ArrowRight, Gauge, Check } from 'lucide-react';
import { calculateDefaultRimLipDiameter } from '../utils/alignmentMath';

interface UnitConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRimInches?: number;
}

export const UnitConverterModal: React.FC<UnitConverterModalProps> = ({
  isOpen,
  onClose,
  defaultRimInches = 18,
}) => {
  const [rimInches, setRimInches] = useState<number>(defaultRimInches);
  const [customRimLipMm, setCustomRimLipMm] = useState<number>(calculateDefaultRimLipDiameter(defaultRimInches));

  // Mode: convert from mm to deg, or deg to mm
  const [inputMm, setInputMm] = useState<number>(1.2);
  const [inputDeg, setInputDeg] = useState<number>(0.14);

  // Garage Floor slope compensation
  const [floorSlopeDeg, setFloorSlopeDeg] = useState<number>(0.0);
  const [rawCamberDeg, setRawCamberDeg] = useState<number>(-1.5);
  const [wheelSide, setWheelSide] = useState<'left' | 'right'>('left');

  if (!isOpen) return null;

  // Calculation from mm to deg
  const effectiveRimLip = customRimLipMm || 482;
  const convertedDegFromMm = (Math.asin(Math.min(0.99, Math.max(-0.99, inputMm / effectiveRimLip))) * 180) / Math.PI;
  const totalMinutesFromMm = Math.round(convertedDegFromMm * 60);
  const degPortion = Math.trunc(totalMinutesFromMm / 60);
  const minPortion = Math.abs(totalMinutesFromMm % 60);

  // Calculation from deg to mm
  const convertedMmFromDeg = Math.sin((inputDeg * Math.PI) / 180) * effectiveRimLip;

  // Compensated Camber
  // If floor slopes down to left by slope (positive), left wheel is tilted positive relative to gravity
  const trueCamber = wheelSide === 'left' ? rawCamberDeg - floorSlopeDeg : rawCamberDeg + floorSlopeDeg;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl pb-[env(safe-area-inset-bottom,0px)]">
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-5 sm:py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm sm:text-base font-bold text-white">Toe & Camber Converter</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 text-xs font-mono">
          {/* Rim Size Reference */}
          <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <span className="text-neutral-400 font-sans">Reference Wheel Lip Diameter:</span>
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={rimInches}
                onChange={(e) => {
                  const inches = parseInt(e.target.value);
                  setRimInches(inches);
                  setCustomRimLipMm(calculateDefaultRimLipDiameter(inches));
                }}
                className="bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-white font-bold min-h-[40px]"
              >
                <option value={16}>16 Inch (~431mm lip)</option>
                <option value={17}>17 Inch (~457mm lip)</option>
                <option value={18}>18 Inch (~482mm lip)</option>
                <option value={19}>19 Inch (~508mm lip)</option>
                <option value={20}>20 Inch (~533mm lip)</option>
              </select>
              <div className="flex items-center gap-1 text-neutral-300">
                <span>Exact Lip:</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={customRimLipMm}
                  onChange={(e) => setCustomRimLipMm(parseFloat(e.target.value) || 480)}
                  className="w-16 bg-neutral-900 border border-neutral-700 rounded px-1.5 py-1 text-white text-right font-bold min-h-[40px]"
                />
                <span>mm</span>
              </div>
            </div>
          </div>

          {/* Section 1: MM to Degrees Conversion */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="text-neutral-400 block font-bold uppercase tracking-wider text-[11px] font-sans">
                Millimeters (mm) → Degrees & Minutes
              </span>
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">Enter Toe in mm:</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  value={inputMm}
                  onChange={(e) => setInputMm(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg p-2.5 text-white font-bold text-base min-h-[44px]"
                />
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/80 border border-neutral-800 text-neutral-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Decimal Angle:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {convertedDegFromMm >= 0 ? `+${convertedDegFromMm.toFixed(3)}°` : `${convertedDegFromMm.toFixed(3)}°`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Deg & Minutes:</span>
                  <span className="text-white font-bold">
                    {convertedDegFromMm >= 0 ? '+' : '-'}{Math.abs(degPortion)}° {minPortion.toString().padStart(2, '0')}'
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2: Degrees to MM Conversion */}
            <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
              <span className="text-neutral-400 block font-bold uppercase tracking-wider text-[11px] font-sans">
                Degrees (°) → Millimeters (mm)
              </span>
              <div>
                <label className="text-[10px] text-neutral-500 block mb-1">Enter Toe Angle in Degrees:</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  value={inputDeg}
                  onChange={(e) => setInputDeg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-500 rounded-lg p-2.5 text-white font-bold text-base min-h-[44px]"
                />
              </div>

              <div className="p-3 rounded bg-neutral-900/80 border border-neutral-800 text-neutral-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Rim Lip Toe Delta:</span>
                  <span className="text-amber-400 font-bold text-sm">
                    {convertedMmFromDeg >= 0 ? `+${convertedMmFromDeg.toFixed(2)}` : convertedMmFromDeg.toFixed(2)} mm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Orientation:</span>
                  <span className="text-white font-bold">
                    {inputDeg >= 0 ? 'Toe-In' : 'Toe-Out'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Camber Gauge Garage Floor Slope Calibrator */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-500" />
              <span className="text-neutral-200 font-bold uppercase tracking-wider text-[11px] font-sans">
                Floor Slope Camber Zeroing Tool
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-sans">
              Most garage floors slope 0.2° to 0.5° toward a floor drain or door. Calibrate your digital camber gauge against the floor to get true chassis-relative camber.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Floor Slope Across Track (°):</label>
                <input
                  type="number"
                  step="0.05"
                  value={floorSlopeDeg}
                  onChange={(e) => setFloorSlopeDeg(parseFloat(e.target.value) || 0)}
                  placeholder="e.g. 0.25"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Raw Digital Gauge Reading (°):</label>
                <input
                  type="number"
                  step="0.05"
                  value={rawCamberDeg}
                  onChange={(e) => setRawCamberDeg(parseFloat(e.target.value) || 0)}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-neutral-400 block mb-1">Wheel Side:</label>
                <select
                  value={wheelSide}
                  onChange={(e) => setWheelSide(e.target.value as 'left' | 'right')}
                  className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                >
                  <option value="left">Left Side (Driver)</option>
                  <option value="right">Right Side (Passenger)</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 flex justify-between items-center">
              <span className="text-neutral-400">Corrected True Camber:</span>
              <span className="text-emerald-400 font-bold text-sm">
                {trueCamber.toFixed(2)}°
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Converter
          </button>
        </div>
      </div>
    </div>
  );
};
