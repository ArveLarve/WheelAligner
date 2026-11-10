import React, { useState } from 'react';
import {
  CalculatedWheelToe,
  SessionCalculations,
  SingleWheelMeasurement,
  VehicleProfile,
  WheelPosition,
} from '../types/alignment';
import { Compass, Eye, ShieldCheck, AlertTriangle } from 'lucide-react';

interface StringBoxVisualizerProps {
  vehicle: VehicleProfile;
  measurements: Record<WheelPosition, SingleWheelMeasurement>;
  calculations: SessionCalculations;
  onSelectWheel?: (wheel: WheelPosition) => void;
  selectedWheel?: WheelPosition;
}

export const StringBoxVisualizer: React.FC<StringBoxVisualizerProps> = ({
  vehicle,
  measurements,
  calculations,
  onSelectWheel,
  selectedWheel,
}) => {
  const [exaggerationFactor, setExaggerationFactor] = useState<number>(8); // 8x for clear visual toe angle
  const [showMeasurements, setShowMeasurements] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'schematic' | 'front' | 'rear'>('schematic');

  // Helper to determine rotation angle for SVG wheel
  const getWheelRotationDeg = (toe: CalculatedWheelToe, isLeft: boolean): number => {
    const dir = isLeft ? 1 : -1;
    return toe.angleDeg * dir * exaggerationFactor;
  };

  const getStatusColor = (status: 'in-spec' | 'warning' | 'out-of-spec') => {
    switch (status) {
      case 'in-spec':
        return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
      case 'warning':
        return 'text-amber-400 border-amber-500/40 bg-amber-500/10';
      case 'out-of-spec':
        return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
    }
  };

  const renderWheelCard = (
    pos: WheelPosition,
    label: string,
    meas: SingleWheelMeasurement,
    toe: CalculatedWheelToe,
    camberStatus: 'in-spec' | 'warning' | 'out-of-spec'
  ) => {
    const isSelected = selectedWheel === pos;
    return (
      <div
        onClick={() => onSelectWheel?.(pos)}
        className={`cursor-pointer rounded-xl p-2.5 sm:p-3 transition-all border active:scale-[0.99] touch-manipulation ${
          isSelected
            ? 'ring-2 ring-amber-500 border-amber-500 bg-neutral-800/95 shadow-md'
            : 'bg-neutral-900/90 hover:bg-neutral-800/70 border-neutral-800'
        }`}
      >
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white tracking-wide text-xs">{label}</span>
            <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded border font-mono ${getStatusColor(toe.status)}`}>
              {toe.status === 'in-spec' ? 'IN SPEC' : toe.status === 'warning' ? 'WARN' : 'OUT'}
            </span>
          </div>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 font-mono">
            {meas.rideHeightMm ? `${meas.rideHeightMm}mm HT` : ''}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-xs font-mono">
          <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/60">
            <span className="text-[9px] uppercase text-neutral-500 block">Toe ({vehicle.rimDiameterInches}")</span>
            <span className="text-sm font-bold text-neutral-100 block">
              {toe.deltaMm >= 0 ? `+${toe.deltaMm}` : toe.deltaMm} mm
            </span>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 block truncate">
              {toe.formattedString}
            </span>
            <span className="text-[9px] text-neutral-500">
              {toe.isToeIn ? 'Toe-In' : 'Toe-Out'}
            </span>
          </div>

          <div className="bg-neutral-950/70 p-2 rounded-lg border border-neutral-800/60">
            <span className="text-[9px] uppercase text-neutral-500 block">Camber</span>
            <span className={`text-sm font-bold block ${
              camberStatus === 'in-spec' ? 'text-emerald-400' : camberStatus === 'warning' ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {meas.camberDeg > 0 ? `+${meas.camberDeg}°` : `${meas.camberDeg}°`}
            </span>
            <span className="text-[10px] text-neutral-400 block truncate">
              {meas.casterDeg ? `Caster: ${meas.casterDeg}°` : `${meas.tirePressurePsi || 35} psi`}
            </span>
            <span className="text-[9px] text-neutral-500">
              {meas.camberDeg < 0 ? 'Negative' : 'Positive'}
            </span>
          </div>
        </div>

        {showMeasurements && (
          <div className="mt-1.5 pt-1 border-t border-neutral-800/80 flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-neutral-400">
            <span>dFront: <strong className="text-neutral-200">{meas.stringFrontMm}</strong>mm</span>
            <span>dRear: <strong className="text-neutral-200">{meas.stringRearMm}</strong>mm</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-lg">
      {/* Visualizer Header Toolbar */}
      <div className="px-3 py-2 sm:px-4 sm:py-2.5 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-2 bg-neutral-900/90">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Compass className="w-4 h-4 text-amber-500 shrink-0" />
          <span className="text-xs sm:text-sm font-bold text-white">Parallel String Box Rig</span>
          <span className="text-xs text-neutral-400 font-mono hidden md:inline-block">
            {vehicle.name} ({vehicle.wheelbaseMm}mm WB)
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          {/* Exaggeration Factor Toggle */}
          <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800 text-[10px] sm:text-[11px] font-mono">
            <span className="text-neutral-500 hidden xs:inline">Angle:</span>
            <button
              onClick={() => setExaggerationFactor(1)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                exaggerationFactor === 1 ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              1x
            </button>
            <button
              onClick={() => setExaggerationFactor(8)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                exaggerationFactor === 8 ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              8x View
            </button>
          </div>

          <label className="flex items-center gap-1 cursor-pointer text-neutral-300 text-[10px] sm:text-[11px] select-none">
            <input
              type="checkbox"
              checked={showMeasurements}
              onChange={(e) => setShowMeasurements(e.target.checked)}
              className="rounded border-neutral-700 text-amber-500 focus:ring-0 bg-neutral-950"
            />
            <span>Dims</span>
          </label>
        </div>
      </div>

      {/* View Switcher Tabs (For mobile and 1024x640 tablet viewports) */}
      <div className="px-3 py-1.5 bg-neutral-950 border-b border-neutral-800 flex items-center gap-1 text-xs">
        <button
          onClick={() => setViewMode('schematic')}
          className={`flex-1 py-1 sm:py-1.5 rounded-lg text-center font-medium text-xs transition-colors ${
            viewMode === 'schematic'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          Full Rig Schematic
        </button>
        <button
          onClick={() => setViewMode('front')}
          className={`flex-1 py-1 sm:py-1.5 rounded-lg text-center font-medium text-xs transition-colors ${
            viewMode === 'front'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          Front Axle (FL & FR)
        </button>
        <button
          onClick={() => setViewMode('rear')}
          className={`flex-1 py-1 sm:py-1.5 rounded-lg text-center font-medium text-xs transition-colors ${
            viewMode === 'rear'
              ? 'bg-amber-500 text-neutral-950 font-bold'
              : 'text-neutral-400 hover:text-white bg-neutral-900'
          }`}
        >
          Rear Axle (RL & RR)
        </button>
      </div>

      <div className="p-2.5 sm:p-3.5">
        {/* VIEW 1: FULL SCHEMATIC (Optimized for 640px height with 3-column split on tablets & desktop) */}
        {viewMode === 'schematic' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Left Cards (FL, RL) */}
            <div className="hidden md:block md:col-span-3 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between border-b border-neutral-800 pb-1">
                <span>Left Side (Driver)</span>
                <span className="text-neutral-500">FL & RL</span>
              </div>
              {renderWheelCard(
                'FL',
                'Front Left (FL)',
                measurements.FL,
                calculations.front.leftToe,
                calculations.front.leftCamberStatus
              )}
              {renderWheelCard(
                'RL',
                'Rear Left (RL)',
                measurements.RL,
                calculations.rear.leftToe,
                calculations.rear.leftCamberStatus
              )}
            </div>

            {/* Center: Interactive SVG Schematic (Height capped to 310px for 640px height displays) */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              {/* Front Axle Total Toe Banner */}
              <div className="mb-1.5 w-full max-w-sm flex items-center justify-between px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 text-[11px]">Front Total:</span>
                  <span className="font-bold text-white text-xs">
                    {calculations.front.totalToeMm >= 0 ? `+${calculations.front.totalToeMm}` : calculations.front.totalToeMm} mm
                  </span>
                  <span className="text-neutral-400 text-[10px]">({calculations.front.totalToeFormatted})</span>
                </div>
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${getStatusColor(calculations.front.totalToeStatus)}`}>
                  {calculations.front.totalToeStatus === 'in-spec' ? 'IN SPEC' : 'OUT'}
                </span>
              </div>

              {/* SVG Canvas (Max height constrained so it fits on 640px high screens) */}
              <div className="relative w-full max-w-[270px] sm:max-w-[310px] aspect-[4/5] max-h-[300px] sm:max-h-[330px] bg-neutral-950/90 rounded-xl p-1.5 border border-neutral-800/80 shadow-inner flex items-center justify-center">
                <svg
                  viewBox="0 0 400 520"
                  className="w-full h-full select-none"
                  style={{ overflow: 'visible' }}
                >
                  <defs>
                    <filter id="string-glow-tab" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="1.5" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <pattern id="tire-tread-tab" width="4" height="6" patternUnits="userSpaceOnUse">
                      <rect width="4" height="2" fill="#171717" />
                      <rect y="2" width="4" height="4" fill="#262626" />
                    </pattern>
                  </defs>

                  {/* Left String */}
                  <line
                    x1="42"
                    y1="10"
                    x2="42"
                    y2="510"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    filter="url(#string-glow-tab)"
                  />
                  <circle cx="42" cy="10" r="4" fill="#0891b2" />
                  <circle cx="42" cy="510" r="4" fill="#0891b2" />
                  <text x="46" y="24" fill="#06b6d4" fontSize="9" fontFamily="monospace">
                    STRING L
                  </text>

                  {/* Right String */}
                  <line
                    x1="358"
                    y1="10"
                    x2="358"
                    y2="510"
                    stroke="#06b6d4"
                    strokeWidth="1.5"
                    filter="url(#string-glow-tab)"
                  />
                  <circle cx="358" cy="10" r="4" fill="#0891b2" />
                  <circle cx="358" cy="510" r="4" fill="#0891b2" />
                  <text x="310" y="24" fill="#06b6d4" fontSize="9" fontFamily="monospace">
                    STRING R
                  </text>

                  {/* Vehicle Centerline */}
                  <line
                    x1="200"
                    y1="25"
                    x2="200"
                    y2="495"
                    stroke="#525252"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />

                  {/* Vehicle Body Chassis Top-Down Silhouette */}
                  <g className="transition-all">
                    <path
                      d="M 130 55 C 150 48, 250 48, 270 55 C 285 65, 290 100, 290 140 C 295 180, 295 320, 295 390 C 295 440, 285 465, 270 472 C 250 478, 150 478, 130 472 C 115 465, 105 440, 105 390 C 105 320, 105 180, 110 140 C 110 100, 115 65, 130 55 Z"
                      fill="#1c1917"
                      stroke="#44403c"
                      strokeWidth="2"
                    />

                    {/* BMW Kidney Grilles */}
                    <rect x="175" y="48" width="20" height="7" rx="3" fill="#3b82f6" />
                    <rect x="205" y="48" width="20" height="7" rx="3" fill="#3b82f6" />

                    {/* Windscreen Front */}
                    <path
                      d="M 135 150 L 265 150 L 255 195 L 145 195 Z"
                      fill="#292524"
                      stroke="#57534e"
                      strokeWidth="1"
                    />

                    {/* Rear Window */}
                    <path
                      d="M 148 350 L 252 350 L 260 380 L 140 380 Z"
                      fill="#292524"
                      stroke="#57534e"
                      strokeWidth="1"
                    />

                    {/* Roof Outline */}
                    <rect x="145" y="200" width="110" height="145" rx="8" fill="#292524" opacity="0.4" />
                    <text x="200" y="275" textAnchor="middle" fill="#78716c" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                      {vehicle.chassisCode}
                    </text>
                    <text x="200" y="292" textAnchor="middle" fill="#57534e" fontSize="9" fontFamily="monospace">
                      FRONT ↑
                    </text>
                  </g>

                  {/* FRONT LEFT WHEEL (FL) */}
                  <g
                    transform={`translate(88, 130) rotate(${getWheelRotationDeg(calculations.front.leftToe, true)})`}
                    className="cursor-pointer"
                    onClick={() => onSelectWheel?.('FL')}
                  >
                    <rect
                      x="-12"
                      y="-34"
                      width="24"
                      height="68"
                      rx="5"
                      fill="url(#tire-tread-tab)"
                      stroke={selectedWheel === 'FL' ? '#f59e0b' : '#737373'}
                      strokeWidth={selectedWheel === 'FL' ? '2.5' : '1.5'}
                    />
                    <line x1="0" y1="-28" x2="0" y2="28" stroke="#a3a3a3" strokeWidth="2" />
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                  </g>
                  {showMeasurements && (
                    <g>
                      <line x1="42" y1="100" x2="80" y2="100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="60" y="96" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.FL.stringFrontMm}
                      </text>
                      <line x1="42" y1="160" x2="80" y2="160" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="60" y="170" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.FL.stringRearMm}
                      </text>
                    </g>
                  )}

                  {/* FRONT RIGHT WHEEL (FR) */}
                  <g
                    transform={`translate(312, 130) rotate(${getWheelRotationDeg(calculations.front.rightToe, false)})`}
                    className="cursor-pointer"
                    onClick={() => onSelectWheel?.('FR')}
                  >
                    <rect
                      x="-12"
                      y="-34"
                      width="24"
                      height="68"
                      rx="5"
                      fill="url(#tire-tread-tab)"
                      stroke={selectedWheel === 'FR' ? '#f59e0b' : '#737373'}
                      strokeWidth={selectedWheel === 'FR' ? '2.5' : '1.5'}
                    />
                    <line x1="0" y1="-28" x2="0" y2="28" stroke="#a3a3a3" strokeWidth="2" />
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                  </g>
                  {showMeasurements && (
                    <g>
                      <line x1="320" y1="100" x2="358" y2="100" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="340" y="96" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.FR.stringFrontMm}
                      </text>
                      <line x1="320" y1="160" x2="358" y2="160" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="340" y="170" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.FR.stringRearMm}
                      </text>
                    </g>
                  )}

                  {/* REAR LEFT WHEEL (RL) */}
                  <g
                    transform={`translate(86, 400) rotate(${getWheelRotationDeg(calculations.rear.leftToe, true)})`}
                    className="cursor-pointer"
                    onClick={() => onSelectWheel?.('RL')}
                  >
                    <rect
                      x="-13"
                      y="-36"
                      width="26"
                      height="72"
                      rx="5"
                      fill="url(#tire-tread-tab)"
                      stroke={selectedWheel === 'RL' ? '#f59e0b' : '#737373'}
                      strokeWidth={selectedWheel === 'RL' ? '2.5' : '1.5'}
                    />
                    <line x1="0" y1="-30" x2="0" y2="30" stroke="#a3a3a3" strokeWidth="2" />
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                  </g>
                  {showMeasurements && (
                    <g>
                      <line x1="42" y1="368" x2="76" y2="368" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="58" y="364" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.RL.stringFrontMm}
                      </text>
                      <line x1="42" y1="432" x2="76" y2="432" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="58" y="442" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.RL.stringRearMm}
                      </text>
                    </g>
                  )}

                  {/* REAR RIGHT WHEEL (RR) */}
                  <g
                    transform={`translate(314, 400) rotate(${getWheelRotationDeg(calculations.rear.rightToe, false)})`}
                    className="cursor-pointer"
                    onClick={() => onSelectWheel?.('RR')}
                  >
                    <rect
                      x="-13"
                      y="-36"
                      width="26"
                      height="72"
                      rx="5"
                      fill="url(#tire-tread-tab)"
                      stroke={selectedWheel === 'RR' ? '#f59e0b' : '#737373'}
                      strokeWidth={selectedWheel === 'RR' ? '2.5' : '1.5'}
                    />
                    <line x1="0" y1="-30" x2="0" y2="30" stroke="#a3a3a3" strokeWidth="2" />
                    <circle cx="0" cy="0" r="3" fill="#3b82f6" />
                  </g>
                  {showMeasurements && (
                    <g>
                      <line x1="324" y1="368" x2="358" y2="368" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="342" y="364" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.RR.stringFrontMm}
                      </text>
                      <line x1="324" y1="432" x2="358" y2="432" stroke="#06b6d4" strokeWidth="1" strokeDasharray="2 2" />
                      <text x="342" y="442" textAnchor="middle" fill="#67e8f9" fontSize="8" fontFamily="monospace">
                        {measurements.RR.stringRearMm}
                      </text>
                    </g>
                  )}

                  {/* Thrust line */}
                  {calculations.thrustAngleDeg !== 0 && (
                    <g>
                      <line
                        x1="200"
                        y1="400"
                        x2={200 - calculations.thrustAngleDeg * 180}
                        y2="220"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <polygon
                        points={`${200 - calculations.thrustAngleDeg * 180},215 ${200 - calculations.thrustAngleDeg * 180 - 4},225 ${200 - calculations.thrustAngleDeg * 180 + 4},225`}
                        fill="#f59e0b"
                      />
                    </g>
                  )}
                </svg>
              </div>

              {/* Rear Axle Total Toe & Thrust Banner */}
              <div className="mt-1.5 w-full max-w-sm flex items-center justify-between px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="text-neutral-400 text-[11px]">Rear Total:</span>
                  <span className="font-bold text-white text-xs">
                    {calculations.rear.totalToeMm >= 0 ? `+${calculations.rear.totalToeMm}` : calculations.rear.totalToeMm} mm
                  </span>
                  <span className="text-neutral-400 text-[10px]">({calculations.rear.totalToeFormatted})</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-neutral-400 text-[10px]">Thrust:</span>
                  <span className={`font-bold text-xs ${
                    calculations.thrustAngleStatus === 'in-spec' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {calculations.thrustAngleDeg > 0 ? `+${calculations.thrustAngleDeg}°` : `${calculations.thrustAngleDeg}°`}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Cards (FR, RR) */}
            <div className="hidden md:block md:col-span-3 space-y-2.5">
              <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between border-b border-neutral-800 pb-1">
                <span>Right Side (Passenger)</span>
                <span className="text-neutral-500">FR & RR</span>
              </div>
              {renderWheelCard(
                'FR',
                'Front Right (FR)',
                measurements.FR,
                calculations.front.rightToe,
                calculations.front.rightCamberStatus
              )}
              {renderWheelCard(
                'RR',
                'Rear Right (RR)',
                measurements.RR,
                calculations.rear.rightToe,
                calculations.rear.rightCamberStatus
              )}
            </div>

            {/* Mobile stacked fallback when in schematic on small phone */}
            <div className="md:hidden grid grid-cols-2 gap-2 mt-2">
              {renderWheelCard('FL', 'FL', measurements.FL, calculations.front.leftToe, calculations.front.leftCamberStatus)}
              {renderWheelCard('FR', 'FR', measurements.FR, calculations.front.rightToe, calculations.front.rightCamberStatus)}
              {renderWheelCard('RL', 'RL', measurements.RL, calculations.rear.leftToe, calculations.rear.leftCamberStatus)}
              {renderWheelCard('RR', 'RR', measurements.RR, calculations.rear.rightToe, calculations.rear.rightCamberStatus)}
            </div>
          </div>
        )}

        {/* VIEW 2: FRONT AXLE FOCUS */}
        {viewMode === 'front' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono">
              <span className="text-neutral-300 font-bold">Front Axle Total Toe: {calculations.front.totalToeMm}mm ({calculations.front.totalToeFormatted})</span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(calculations.front.totalToeStatus)}`}>
                {calculations.front.totalToeStatus === 'in-spec' ? 'IN SPEC' : 'OUT OF SPEC'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderWheelCard('FL', 'Front Left (FL)', measurements.FL, calculations.front.leftToe, calculations.front.leftCamberStatus)}
              {renderWheelCard('FR', 'Front Right (FR)', measurements.FR, calculations.front.rightToe, calculations.front.rightCamberStatus)}
            </div>
          </div>
        )}

        {/* VIEW 3: REAR AXLE FOCUS */}
        {viewMode === 'rear' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono">
              <span className="text-neutral-300 font-bold">Rear Axle Total: {calculations.rear.totalToeMm}mm · Thrust: {calculations.thrustAngleDeg}°</span>
              <span className={`text-[10px] px-2 py-0.5 rounded border ${getStatusColor(calculations.rear.totalToeStatus)}`}>
                {calculations.rear.totalToeStatus === 'in-spec' ? 'IN SPEC' : 'OUT OF SPEC'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {renderWheelCard('RL', 'Rear Left (RL)', measurements.RL, calculations.rear.leftToe, calculations.rear.leftCamberStatus)}
              {renderWheelCard('RR', 'Rear Right (RR)', measurements.RR, calculations.rear.rightToe, calculations.rear.rightCamberStatus)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
