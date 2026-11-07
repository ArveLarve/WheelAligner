import React, { useState } from 'react';
import { AlignmentSession, VehicleProfile, WheelPosition } from '../types/alignment';
import { Plus, X, Wrench, Shield, Car } from 'lucide-react';

interface NewSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: VehicleProfile[];
  currentVehicleId: string;
  onSave: (session: AlignmentSession) => void;
}

export const NewSessionModal: React.FC<NewSessionModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  currentVehicleId,
  onSave,
}) => {
  const [vehicleId, setVehicleId] = useState<string>(currentVehicleId);
  const [title, setTitle] = useState<string>('Pre-Track Day Precision String Alignment');
  const [operatorName, setOperatorName] = useState<string>('Arve L.');
  const [ballastCondition, setBallastCondition] = useState<
    'bmw_din_ballast' | 'driver_only' | 'empty_half_tank' | 'custom'
  >('bmw_din_ballast');
  const [ballastNotes, setBallastNotes] = useState<string>(
    'BMW DIN ballast: 68kg driver seat, 68kg passenger, 68kg rear seat, 21kg trunk, full fuel tank.'
  );
  const [suspensionMods, setSuspensionMods] = useState<string>(
    'Refreshed front thrust arm bushings, pulled top strut locator pin for camber, new rear eccentric camber bolts.'
  );
  const [tireSetup, setTireSetup] = useState<string>('Michelin Pilot Sport 4S (35 psi F / 39 psi R)');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedVeh = vehicles.find((v) => v.id === vehicleId) || vehicles[0];

    // Blank or baseline template measurements
    const baselineWheels: Record<WheelPosition, any> = {
      FL: {
        wheel: 'FL',
        stringFrontMm: 47.0,
        stringRearMm: 47.0,
        hubToStringMm: 95.0,
        camberDeg: selectedVeh.targets.frontCamber.target,
        casterDeg: 7.5,
        rideHeightMm: 585,
        tirePressurePsi: 35.0,
      },
      FR: {
        wheel: 'FR',
        stringFrontMm: 47.0,
        stringRearMm: 47.0,
        hubToStringMm: 95.0,
        camberDeg: selectedVeh.targets.frontCamber.target,
        casterDeg: 7.5,
        rideHeightMm: 585,
        tirePressurePsi: 35.0,
      },
      RL: {
        wheel: 'RL',
        stringFrontMm: 37.0,
        stringRearMm: 37.0,
        hubToStringMm: 83.0,
        camberDeg: selectedVeh.targets.rearCamber.target,
        rideHeightMm: 570,
        tirePressurePsi: 39.0,
      },
      RR: {
        wheel: 'RR',
        stringFrontMm: 37.0,
        stringRearMm: 37.0,
        hubToStringMm: 83.0,
        camberDeg: selectedVeh.targets.rearCamber.target,
        rideHeightMm: 570,
        tirePressurePsi: 39.0,
      },
    };

    const newSession: AlignmentSession = {
      id: `session-${Date.now()}`,
      vehicleId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      title,
      operatorName,
      ballastCondition,
      ballastNotes,
      suspensionMods,
      tireSetup,
      garageFloorLevelVerified: true,
      stages: {
        before: {
          timestamp: new Date().toISOString(),
          stageNotes: 'Initial baseline setup prior to suspension adjustments.',
          wheels: baselineWheels,
        },
      },
    };

    onSave(newSession);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl pb-[env(safe-area-inset-bottom,0px)]">
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-amber-500" />
            <h3 className="text-sm sm:text-base font-bold text-white">Start New Alignment Session</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="p-6 space-y-4 text-xs font-mono">
          <div>
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Vehicle Profile:
            </label>
            <select
              value={vehicleId}
              onChange={(e) => setVehicleId(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold text-sm"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.chassisCode} - {v.yearModel})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Session Title:
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Post-Coilover Height & String Toe Alignment"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2.5 text-white font-bold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                Technician / Operator:
              </label>
              <input
                type="text"
                value={operatorName}
                onChange={(e) => setOperatorName(e.target.value)}
                placeholder="Your Name"
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
                Ballast Condition:
              </label>
              <select
                value={ballastCondition}
                onChange={(e) => setBallastCondition(e.target.value as any)}
                className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
              >
                <option value="bmw_din_ballast">BMW DIN Ballast (68kg x 3 + 21kg)</option>
                <option value="driver_only">Driver Only (80 kg seat weight)</option>
                <option value="empty_half_tank">Empty Car / Half Fuel Tank</option>
                <option value="custom">Custom Loading Condition</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Suspension Modifications / Recent Work:
            </label>
            <input
              type="text"
              value={suspensionMods}
              onChange={(e) => setSuspensionMods(e.target.value)}
              placeholder="e.g. Bilstein shocks, M3 control arms, eccentric rear bolts..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
            />
          </div>

          <div>
            <label className="text-[10px] text-neutral-400 uppercase tracking-wider block mb-1">
              Tire Setup & Pressures:
            </label>
            <input
              type="text"
              value={tireSetup}
              onChange={(e) => setTireSetup(e.target.value)}
              placeholder="e.g. Michelin PS4S (35 psi front / 39 psi rear)"
              className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-white"
            />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-semibold transition-colors shadow-sm"
            >
              Start Session & Initialize Rig
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
