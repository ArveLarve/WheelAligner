import React, { useState } from 'react';
import { AlignmentSession, VehicleProfile, WheelPosition } from '../types/alignment';
import { calculateSessionStage, formatCamber, formatDegreesMinutes, formatMm } from '../utils/alignmentMath';
import { Printer, CheckCircle2, AlertTriangle, ArrowRight, FileText, Wrench, ShieldCheck, Gauge, LayoutList, Table } from 'lucide-react';

interface ComparisonReportProps {
  session: AlignmentSession;
  vehicle: VehicleProfile;
  onPrint?: () => void;
}

export const ComparisonReport: React.FC<ComparisonReportProps> = ({ session, vehicle }) => {
  const [mobileViewMode, setMobileViewMode] = useState<'cards' | 'table'>('cards');

  const beforeStage = session.stages.before;
  const intermediateStage = session.stages.intermediate;
  const finalStage = session.stages.final;

  const beforeCalc = calculateSessionStage(beforeStage, vehicle.rimLipDiameterMm, vehicle.targets);
  const intermediateCalc = intermediateStage
    ? calculateSessionStage(intermediateStage, vehicle.rimLipDiameterMm, vehicle.targets)
    : null;
  const finalCalc = finalStage
    ? calculateSessionStage(finalStage, vehicle.rimLipDiameterMm, vehicle.targets)
    : null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status: 'in-spec' | 'warning' | 'out-of-spec') => {
    switch (status) {
      case 'in-spec':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">IN SPEC</span>;
      case 'warning':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">WARN</span>;
      case 'out-of-spec':
        return <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30">OUT</span>;
    }
  };

  const compareStageCalc = finalCalc || intermediateCalc || beforeCalc;
  const compareStageData = finalStage || intermediateStage || beforeStage;

  const thrustDelta = (compareStageCalc.thrustAngleDeg - beforeCalc.thrustAngleDeg).toFixed(2);
  const frontTotalToeDelta = (compareStageCalc.front.totalToeMm - beforeCalc.front.totalToeMm).toFixed(2);
  const rearTotalToeDelta = (compareStageCalc.rear.totalToeMm - beforeCalc.rear.totalToeMm).toFixed(2);
  const flCamberDelta = (compareStageData.wheels.FL.camberDeg - beforeStage.wheels.FL.camberDeg).toFixed(2);
  const frCamberDelta = (compareStageData.wheels.FR.camberDeg - beforeStage.wheels.FR.camberDeg).toFixed(2);
  const rlCamberDelta = (compareStageData.wheels.RL.camberDeg - beforeStage.wheels.RL.camberDeg).toFixed(2);
  const rrCamberDelta = (compareStageData.wheels.RR.camberDeg - beforeStage.wheels.RR.camberDeg).toFixed(2);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Action Bar */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 sm:p-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
            <span>Alignment Comparison Report</span>
          </h2>
          <p className="text-xs text-neutral-400">
            Side-by-side progression analysis across Before, Intermediate, and Final setup stages.
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* View Toggle: Cards (Mobile/Tablet Friendly) vs Full Matrix Table */}
          <div className="flex items-center bg-neutral-950 p-0.5 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setMobileViewMode('cards')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                mobileViewMode === 'cards' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Cards View"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Cards</span>
            </button>
            <button
              onClick={() => setMobileViewMode('table')}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                mobileViewMode === 'table' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
              }`}
              title="Full Table View"
            >
              <Table className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Table</span>
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-semibold border border-neutral-700 transition-colors shadow-sm min-h-[36px] sm:min-h-0"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Sheet */}
      <div className="print-page bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-6 space-y-4 sm:space-y-6 text-neutral-100">
        {/* Report Header */}
        <div className="border-b border-neutral-800 pb-4 sm:pb-5 flex flex-col md:flex-row md:items-start justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-amber-500">
                APEXSTRING ALIGNMENT REPORT
              </span>
              <span className="text-neutral-500">·</span>
              <span className="text-xs text-neutral-400 font-mono">
                {new Date(session.updatedAt || session.createdAt).toLocaleDateString()}
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white">
              {session.title || `${vehicle.name} Wheel Alignment`}
            </h1>
            <div className="text-[11px] sm:text-xs text-neutral-400 mt-1 flex flex-wrap gap-x-3 gap-y-1 font-mono">
              <span>Chassis: <strong className="text-neutral-200">{vehicle.chassisCode} ({vehicle.yearModel})</strong></span>
              <span>Operator: <strong className="text-neutral-200">{session.operatorName || 'Self'}</strong></span>
              <span>Rims: <strong className="text-neutral-200">{vehicle.rimDiameterInches}" ({vehicle.rimLipDiameterMm}mm lip)</strong></span>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono shrink-0">
            <div className="text-neutral-400 text-[10px]">Ballast Setup:</div>
            <div className="text-amber-400 font-bold capitalize">
              {session.ballastCondition.replace(/_/g, ' ')}
            </div>
            <div className="text-[10px] text-neutral-500 max-w-xs truncate">
              {session.ballastNotes || 'No ballast notes'}
            </div>
          </div>
        </div>

        {/* Impact Highlights Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 text-xs font-mono">
          <div className="p-2.5 sm:p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Thrust Angle</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm sm:text-lg font-bold text-white truncate">
                {beforeCalc.thrustAngleDeg}° → {compareStageCalc.thrustAngleDeg}°
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-1">
              Δ {Number(thrustDelta) >= 0 ? `+${thrustDelta}` : thrustDelta}° ({compareStageCalc.thrustAngleStatus})
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Front Total Toe</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm sm:text-lg font-bold text-white truncate">
                {beforeCalc.front.totalToeMm}mm → {compareStageCalc.front.totalToeMm}mm
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-1">
              Δ {Number(frontTotalToeDelta) >= 0 ? `+${frontTotalToeDelta}` : frontTotalToeDelta} mm ({compareStageCalc.front.totalToeStatus})
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Rear Total Toe</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm sm:text-lg font-bold text-white truncate">
                {beforeCalc.rear.totalToeMm}mm → {compareStageCalc.rear.totalToeMm}mm
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-emerald-400 block mt-1">
              Δ {Number(rearTotalToeDelta) >= 0 ? `+${rearTotalToeDelta}` : rearTotalToeDelta} mm ({compareStageCalc.rear.totalToeStatus})
            </span>
          </div>

          <div className="p-2.5 sm:p-3 bg-neutral-950 rounded-lg border border-neutral-800">
            <span className="text-[10px] text-neutral-500 uppercase block">Camber Symmetry</span>
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm sm:text-lg font-bold text-white truncate">
                ΔF:{compareStageCalc.front.camberDelta}° | ΔR:{compareStageCalc.rear.camberDelta}°
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] text-neutral-400 block mt-1">
              Cross-Axle Delta
            </span>
          </div>
        </div>

        {/* MOBILE CARD-BASED PROGRESSION VIEW (Default on mobile, clean thumb scrolling) */}
        <div className={`${mobileViewMode === 'cards' ? 'block sm:hidden' : 'hidden'} space-y-3`}>
          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-white">Front Left (FL) Toe</span>
              {getStatusBadge(compareStageCalc.front.leftToe.status)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Target:</span>
              <span className="text-neutral-200">{vehicle.targets.frontToePerWheel.min}° to {vehicle.targets.frontToePerWheel.max}°</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-white font-bold">
                {beforeCalc.front.leftToe.deltaMm}mm → {compareStageCalc.front.leftToe.deltaMm}mm ({compareStageCalc.front.leftToe.formattedString})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-white">Front Right (FR) Toe</span>
              {getStatusBadge(compareStageCalc.front.rightToe.status)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Target:</span>
              <span className="text-neutral-200">{vehicle.targets.frontToePerWheel.min}° to {vehicle.targets.frontToePerWheel.max}°</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-white font-bold">
                {beforeCalc.front.rightToe.deltaMm}mm → {compareStageCalc.front.rightToe.deltaMm}mm ({compareStageCalc.front.rightToe.formattedString})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-amber-400">Front Total Toe</span>
              {getStatusBadge(compareStageCalc.front.totalToeStatus)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Target:</span>
              <span className="text-neutral-200">{vehicle.targets.frontTotalToe.min}° to {vehicle.targets.frontTotalToe.max}°</span>
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-emerald-400 font-bold">
                {beforeCalc.front.totalToeMm}mm → {compareStageCalc.front.totalToeMm}mm ({compareStageCalc.front.totalToeFormatted})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-white">Rear Left (RL) Toe</span>
              {getStatusBadge(compareStageCalc.rear.leftToe.status)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-white font-bold">
                {beforeCalc.rear.leftToe.deltaMm}mm → {compareStageCalc.rear.leftToe.deltaMm}mm ({compareStageCalc.rear.leftToe.formattedString})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-white">Rear Right (RR) Toe</span>
              {getStatusBadge(compareStageCalc.rear.rightToe.status)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-white font-bold">
                {beforeCalc.rear.rightToe.deltaMm}mm → {compareStageCalc.rear.rightToe.deltaMm}mm ({compareStageCalc.rear.rightToe.formattedString})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-amber-400">Rear Total Toe</span>
              {getStatusBadge(compareStageCalc.rear.totalToeStatus)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-emerald-400 font-bold">
                {beforeCalc.rear.totalToeMm}mm → {compareStageCalc.rear.totalToeMm}mm ({compareStageCalc.rear.totalToeFormatted})
              </span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-neutral-950 border border-amber-500/30 space-y-2">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-1.5">
              <span className="font-bold text-xs text-amber-400">Rear Thrust Angle</span>
              {getStatusBadge(compareStageCalc.thrustAngleStatus)}
            </div>
            <div className="flex justify-between text-xs font-mono">
              <span className="text-neutral-400">Before → Final:</span>
              <span className="text-emerald-400 font-bold">
                {beforeCalc.thrustAngleDeg}° → {compareStageCalc.thrustAngleDeg}° (Δ {thrustDelta}°)
              </span>
            </div>
          </div>
        </div>

        {/* Full Desktop / Print Side-by-Side Data Table */}
        <div className={`${mobileViewMode === 'table' ? 'block' : 'hidden sm:block'} overflow-x-auto border border-neutral-800 rounded-lg -mx-4 sm:mx-0`}>
          <table className="w-full text-left text-xs font-mono min-w-[580px]">
            <thead className="bg-neutral-950 text-neutral-400 text-[11px] uppercase border-b border-neutral-800">
              <tr>
                <th className="py-2.5 px-3">Geometry Parameter</th>
                <th className="py-2.5 px-3">Target Range</th>
                <th className="py-2.5 px-3">Before (Baseline)</th>
                {intermediateStage && <th className="py-2.5 px-3">Intermediate</th>}
                {finalStage && <th className="py-2.5 px-3">Final (Achieved)</th>}
                <th className="py-2.5 px-3 text-right">Net Impact (Δ)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 bg-neutral-900/40">
              {/* FRONT AXLE SECTION */}
              <tr className="bg-neutral-950/40 text-[11px] font-bold text-neutral-300">
                <td colSpan={intermediateStage && finalStage ? 6 : intermediateStage || finalStage ? 5 : 4} className="py-1.5 px-3">
                  FRONT AXLE (STEERING)
                </td>
              </tr>

              {/* Front Left Toe */}
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2 px-3 font-semibold text-neutral-200">Front Left Toe (FL)</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.frontToePerWheel.min}° to {vehicle.targets.frontToePerWheel.max}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{formatMm(beforeCalc.front.leftToe.deltaMm)}</span>
                    {getStatusBadge(beforeCalc.front.leftToe.status)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(intermediateCalc.front.leftToe.deltaMm)}</span>
                      {getStatusBadge(intermediateCalc.front.leftToe.status)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(finalCalc.front.leftToe.deltaMm)}</span>
                      {getStatusBadge(finalCalc.front.leftToe.status)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right font-bold text-neutral-300">
                  {formatMm(compareStageCalc.front.leftToe.deltaMm - beforeCalc.front.leftToe.deltaMm)}
                </td>
              </tr>

              {/* Front Right Toe */}
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2 px-3 font-semibold text-neutral-200">Front Right Toe (FR)</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.frontToePerWheel.min}° to {vehicle.targets.frontToePerWheel.max}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{formatMm(beforeCalc.front.rightToe.deltaMm)}</span>
                    {getStatusBadge(beforeCalc.front.rightToe.status)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(intermediateCalc.front.rightToe.deltaMm)}</span>
                      {getStatusBadge(intermediateCalc.front.rightToe.status)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(finalCalc.front.rightToe.deltaMm)}</span>
                      {getStatusBadge(finalCalc.front.rightToe.status)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right font-bold text-neutral-300">
                  {formatMm(compareStageCalc.front.rightToe.deltaMm - beforeCalc.front.rightToe.deltaMm)}
                </td>
              </tr>

              {/* Front Total Toe */}
              <tr className="bg-neutral-950/20 font-bold hover:bg-neutral-800/30">
                <td className="py-2 px-3 text-amber-400">Front Total Toe</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.frontTotalToe.min}° to {vehicle.targets.frontTotalToe.max}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{formatMm(beforeCalc.front.totalToeMm)}</span>
                    {getStatusBadge(beforeCalc.front.totalToeStatus)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(intermediateCalc.front.totalToeMm)}</span>
                      {getStatusBadge(intermediateCalc.front.totalToeStatus)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(finalCalc.front.totalToeMm)}</span>
                      {getStatusBadge(finalCalc.front.totalToeStatus)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right text-emerald-400">
                  {formatMm(compareStageCalc.front.totalToeMm - beforeCalc.front.totalToeMm)}
                </td>
              </tr>

              {/* Front Camber FL & FR */}
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2 px-3 font-semibold text-neutral-200">Front Camber (FL / FR)</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.frontCamber.min}° to {vehicle.targets.frontCamber.max}°</td>
                <td className="py-2 px-3">
                  <span>{formatCamber(beforeStage.wheels.FL.camberDeg)} / {formatCamber(beforeStage.wheels.FR.camberDeg)}</span>
                </td>
                {intermediateStage && (
                  <td className="py-2 px-3">
                    <span>{formatCamber(intermediateStage.wheels.FL.camberDeg)} / {formatCamber(intermediateStage.wheels.FR.camberDeg)}</span>
                  </td>
                )}
                {finalStage && (
                  <td className="py-2 px-3 font-bold text-white">
                    <span>{formatCamber(finalStage.wheels.FL.camberDeg)} / {formatCamber(finalStage.wheels.FR.camberDeg)}</span>
                  </td>
                )}
                <td className="py-2 px-3 text-right text-neutral-300">
                  Δ {flCamberDelta}° / {frCamberDelta}°
                </td>
              </tr>

              {/* REAR AXLE SECTION */}
              <tr className="bg-neutral-950/40 text-[11px] font-bold text-neutral-300">
                <td colSpan={intermediateStage && finalStage ? 6 : intermediateStage || finalStage ? 5 : 4} className="py-1.5 px-3">
                  REAR AXLE (THRUST & CAMBER)
                </td>
              </tr>

              {/* Rear Left Toe */}
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2 px-3 font-semibold text-neutral-200">Rear Left Toe (RL)</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.rearToePerWheel.min}° to {vehicle.targets.rearToePerWheel.max}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{formatMm(beforeCalc.rear.leftToe.deltaMm)}</span>
                    {getStatusBadge(beforeCalc.rear.leftToe.status)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(intermediateCalc.rear.leftToe.deltaMm)}</span>
                      {getStatusBadge(intermediateCalc.rear.leftToe.status)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(finalCalc.rear.leftToe.deltaMm)}</span>
                      {getStatusBadge(finalCalc.rear.leftToe.status)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right font-bold text-neutral-300">
                  {formatMm(compareStageCalc.rear.leftToe.deltaMm - beforeCalc.rear.leftToe.deltaMm)}
                </td>
              </tr>

              {/* Rear Right Toe */}
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2 px-3 font-semibold text-neutral-200">Rear Right Toe (RR)</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.rearToePerWheel.min}° to {vehicle.targets.rearToePerWheel.max}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{formatMm(beforeCalc.rear.rightToe.deltaMm)}</span>
                    {getStatusBadge(beforeCalc.rear.rightToe.status)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(intermediateCalc.rear.rightToe.deltaMm)}</span>
                      {getStatusBadge(intermediateCalc.rear.rightToe.status)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 font-bold text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(finalCalc.rear.rightToe.deltaMm)}</span>
                      {getStatusBadge(finalCalc.rear.rightToe.status)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right font-bold text-neutral-300">
                  {formatMm(compareStageCalc.rear.rightToe.deltaMm - beforeCalc.rear.rightToe.deltaMm)}
                </td>
              </tr>

              {/* Rear Total Toe */}
              <tr className="bg-neutral-950/20 font-bold hover:bg-neutral-800/30">
                <td className="py-2 px-3 text-amber-400">Rear Total Toe</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.rearTotalToe.min}° to {vehicle.targets.rearTotalToe.max}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{formatMm(beforeCalc.rear.totalToeMm)}</span>
                    {getStatusBadge(beforeCalc.rear.totalToeStatus)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(intermediateCalc.rear.totalToeMm)}</span>
                      {getStatusBadge(intermediateCalc.rear.totalToeStatus)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{formatMm(finalCalc.rear.totalToeMm)}</span>
                      {getStatusBadge(finalCalc.rear.totalToeStatus)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right text-emerald-400">
                  {formatMm(compareStageCalc.rear.totalToeMm - beforeCalc.rear.totalToeMm)}
                </td>
              </tr>

              {/* Rear Camber RL & RR */}
              <tr className="hover:bg-neutral-800/30">
                <td className="py-2 px-3 font-semibold text-neutral-200">Rear Camber (RL / RR)</td>
                <td className="py-2 px-3 text-neutral-400">{vehicle.targets.rearCamber.min}° to {vehicle.targets.rearCamber.max}°</td>
                <td className="py-2 px-3">
                  <span>{formatCamber(beforeStage.wheels.RL.camberDeg)} / {formatCamber(beforeStage.wheels.RR.camberDeg)}</span>
                </td>
                {intermediateStage && (
                  <td className="py-2 px-3">
                    <span>{formatCamber(intermediateStage.wheels.RL.camberDeg)} / {formatCamber(intermediateStage.wheels.RR.camberDeg)}</span>
                  </td>
                )}
                {finalStage && (
                  <td className="py-2 px-3 font-bold text-white">
                    <span>{formatCamber(finalStage.wheels.RL.camberDeg)} / {formatCamber(finalStage.wheels.RR.camberDeg)}</span>
                  </td>
                )}
                <td className="py-2 px-3 text-right text-neutral-300">
                  Δ {rlCamberDelta}° / {rrCamberDelta}°
                </td>
              </tr>

              {/* Thrust Angle */}
              <tr className="bg-amber-500/5 font-bold hover:bg-neutral-800/30">
                <td className="py-2 px-3 text-amber-400">Rear Thrust Angle</td>
                <td className="py-2 px-3 text-neutral-400">Max ±{vehicle.targets.maxThrustAngle}°</td>
                <td className="py-2 px-3">
                  <div className="flex items-center gap-1.5">
                    <span>{beforeCalc.thrustAngleDeg}°</span>
                    {getStatusBadge(beforeCalc.thrustAngleStatus)}
                  </div>
                </td>
                {intermediateCalc && (
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span>{intermediateCalc.thrustAngleDeg}°</span>
                      {getStatusBadge(intermediateCalc.thrustAngleStatus)}
                    </div>
                  </td>
                )}
                {finalCalc && (
                  <td className="py-2 px-3 text-emerald-400">
                    <div className="flex items-center gap-1.5">
                      <span>{finalCalc.thrustAngleDeg}°</span>
                      {getStatusBadge(finalCalc.thrustAngleStatus)}
                    </div>
                  </td>
                )}
                <td className="py-2 px-3 text-right text-emerald-400">
                  Δ {thrustDelta}°
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Session Technical Notes & Suspension Modifications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 text-xs font-mono">
          <div className="p-3.5 sm:p-4 rounded-lg bg-neutral-950 border border-neutral-800">
            <h4 className="font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5" />
              <span>Suspension Hardware & Modifications</span>
            </h4>
            <p className="text-neutral-300 whitespace-pre-line">
              {session.suspensionMods || 'Factory OEM suspension components.'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-neutral-800/80 text-neutral-400">
              <span>Tires: </span>
              <strong className="text-neutral-200">{session.tireSetup || 'Not specified'}</strong>
            </div>
          </div>

          <div className="p-3.5 sm:p-4 rounded-lg bg-neutral-950 border border-neutral-800">
            <h4 className="font-bold text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>Session Notes & Road Evaluation</span>
            </h4>
            <div className="space-y-1.5 text-neutral-300">
              {beforeStage.stageNotes && (
                <div>
                  <span className="text-neutral-500 text-[10px]">Before: </span>
                  <span>{beforeStage.stageNotes}</span>
                </div>
              )}
              {intermediateStage?.stageNotes && (
                <div>
                  <span className="text-neutral-500 text-[10px]">Intermediate: </span>
                  <span>{intermediateStage.stageNotes}</span>
                </div>
              )}
              {finalStage?.stageNotes && (
                <div>
                  <span className="text-neutral-500 text-[10px]">Final: </span>
                  <span>{finalStage.stageNotes}</span>
                </div>
              )}
              {session.summaryNotes && (
                <div className="pt-2 border-t border-neutral-800/80 text-white font-semibold">
                  <span className="text-amber-400 text-[10px] block">Summary Verdict: </span>
                  <span>{session.summaryNotes}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-[10px] sm:text-[11px] text-neutral-500 font-mono">
          <span>ApexString Precision Alignment</span>
          <span>Verified Floor Level & Slip Plates</span>
        </div>
      </div>
    </div>
  );
};
