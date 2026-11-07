import React, { useState } from 'react';
import { ChassisCode, VehicleProfile } from '../types/alignment';
import { calculateDefaultRimLipDiameter } from '../utils/alignmentMath';
import { Plus, X, Edit, Trash2, Check, Copy, Car } from 'lucide-react';

interface VehicleManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: VehicleProfile[];
  activeVehicleId: string;
  onSelectVehicle: (id: string) => void;
  onSaveVehicle: (vehicle: VehicleProfile) => void;
  onDeleteVehicle: (id: string) => void;
}

export const VehicleManagerModal: React.FC<VehicleManagerModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  activeVehicleId,
  onSelectVehicle,
  onSaveVehicle,
  onDeleteVehicle,
}) => {
  const [editingVehicle, setEditingVehicle] = useState<VehicleProfile | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCreateNew = () => {
    const newVehicle: VehicleProfile = {
      id: `custom-chassis-${Date.now()}`,
      name: 'Custom BMW Chassis Setup',
      chassisCode: 'CUSTOM',
      yearModel: '2010',
      bodyType: 'Sedan',
      wheelbaseMm: 2888,
      trackFrontMm: 1558,
      trackRearMm: 1582,
      rimDiameterInches: 18,
      rimLipDiameterMm: calculateDefaultRimLipDiameter(18),
      presetCategory: 'custom',
      notes: 'Custom alignment geometry settings.',
      targets: {
        frontCamber: { min: -1.2, target: -0.9, max: -0.6, unit: 'deg' },
        frontToePerWheel: { min: 0.05, target: 0.1, max: 0.15, unit: 'deg' },
        frontTotalToe: { min: 0.12, target: 0.2, max: 0.28, unit: 'deg' },
        rearCamber: { min: -1.8, target: -1.5, max: -1.2, unit: 'deg' },
        rearToePerWheel: { min: 0.08, target: 0.13, max: 0.18, unit: 'deg' },
        rearTotalToe: { min: 0.18, target: 0.26, max: 0.35, unit: 'deg' },
        maxThrustAngle: 0.05,
      },
    };
    setEditingVehicle(newVehicle);
    setIsCreating(true);
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    onSaveVehicle(editingVehicle);
    setIsCreating(false);
    setEditingVehicle(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-neutral-900 border border-neutral-800 rounded-t-2xl sm:rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl pb-[env(safe-area-inset-bottom,0px)]">
        {/* Modal Header */}
        <div className="px-4 py-3 sm:px-6 sm:py-4 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <Car className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">Chassis Profiles</h3>
              <p className="text-[11px] sm:text-xs text-neutral-400">
                BMW E60, E87, F11 presets and custom vehicle targets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!editingVehicle && (
              <button
                onClick={handleCreateNew}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-semibold transition-colors min-h-[36px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {editingVehicle ? (
            /* Edit / Create Form */
            <form onSubmit={handleSaveForm} className="space-y-6 text-xs font-mono">
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4">
                <span className="text-xs font-bold uppercase text-amber-400 block font-sans">
                  Vehicle Identity & Chassis
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Profile Name:</label>
                    <input
                      type="text"
                      required
                      value={editingVehicle.name}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Chassis Architecture:</label>
                    <select
                      value={editingVehicle.chassisCode}
                      onChange={(e) =>
                        setEditingVehicle({ ...editingVehicle, chassisCode: e.target.value as ChassisCode })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white font-bold"
                    >
                      <option value="E60">BMW E60 (5-Series)</option>
                      <option value="E87">BMW E87 (1-Series)</option>
                      <option value="F11">BMW F11 (5-Series Touring)</option>
                      <option value="CUSTOM">Custom / Other Chassis</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Model Year / Engine:</label>
                    <input
                      type="text"
                      value={editingVehicle.yearModel}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, yearModel: e.target.value })}
                      placeholder="e.g. 2008 (535d M-Sport)"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-white"
                    />
                  </div>
                </div>

                {/* Geometry Dimensions */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Wheelbase (mm):</label>
                    <input
                      type="number"
                      value={editingVehicle.wheelbaseMm}
                      onChange={(e) =>
                        setEditingVehicle({ ...editingVehicle, wheelbaseMm: parseFloat(e.target.value) || 2800 })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Front Track (mm):</label>
                    <input
                      type="number"
                      value={editingVehicle.trackFrontMm}
                      onChange={(e) =>
                        setEditingVehicle({ ...editingVehicle, trackFrontMm: parseFloat(e.target.value) || 1550 })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Rear Track (mm):</label>
                    <input
                      type="number"
                      value={editingVehicle.trackRearMm}
                      onChange={(e) =>
                        setEditingVehicle({ ...editingVehicle, trackRearMm: parseFloat(e.target.value) || 1580 })
                      }
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Rim Diameter (in):</label>
                    <input
                      type="number"
                      value={editingVehicle.rimDiameterInches}
                      onChange={(e) => {
                        const inVal = parseInt(e.target.value) || 18;
                        setEditingVehicle({
                          ...editingVehicle,
                          rimDiameterInches: inVal,
                          rimLipDiameterMm: calculateDefaultRimLipDiameter(inVal),
                        });
                      }}
                      className="w-full bg-neutral-900 border border-neutral-700 rounded p-1.5 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Target Specs Editor */}
              <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-4">
                <span className="text-xs font-bold uppercase text-amber-400 block font-sans">
                  Target Alignment Specifications
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Front Targets */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                    <span className="font-bold text-white block text-xs">Front Axle Targets</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 block">Camber Target (°):</label>
                        <input
                          type="number"
                          step="0.05"
                          value={editingVehicle.targets.frontCamber.target}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              targets: {
                                ...editingVehicle.targets,
                                frontCamber: {
                                  ...editingVehicle.targets.frontCamber,
                                  target: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 block">Toe / Wheel (°):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingVehicle.targets.frontToePerWheel.target}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              targets: {
                                ...editingVehicle.targets,
                                frontToePerWheel: {
                                  ...editingVehicle.targets.frontToePerWheel,
                                  target: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 block">Total Toe (°):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingVehicle.targets.frontTotalToe.target}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              targets: {
                                ...editingVehicle.targets,
                                frontTotalToe: {
                                  ...editingVehicle.targets.frontTotalToe,
                                  target: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rear Targets */}
                  <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2">
                    <span className="font-bold text-white block text-xs">Rear Axle Targets</span>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-[9px] text-neutral-400 block">Camber Target (°):</label>
                        <input
                          type="number"
                          step="0.05"
                          value={editingVehicle.targets.rearCamber.target}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              targets: {
                                ...editingVehicle.targets,
                                rearCamber: {
                                  ...editingVehicle.targets.rearCamber,
                                  target: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 block">Toe / Wheel (°):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingVehicle.targets.rearToePerWheel.target}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              targets: {
                                ...editingVehicle.targets,
                                rearToePerWheel: {
                                  ...editingVehicle.targets.rearToePerWheel,
                                  target: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-neutral-400 block">Total Toe (°):</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingVehicle.targets.rearTotalToe.target}
                          onChange={(e) =>
                            setEditingVehicle({
                              ...editingVehicle,
                              targets: {
                                ...editingVehicle.targets,
                                rearTotalToe: {
                                  ...editingVehicle.targets.rearTotalToe,
                                  target: parseFloat(e.target.value) || 0,
                                },
                              },
                            })
                          }
                          className="w-full bg-neutral-950 border border-neutral-700 rounded p-1 text-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVehicle(null);
                    setIsCreating(false);
                  }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-lg text-xs font-semibold transition-colors shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          ) : (
            /* Vehicle List */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vehicles.map((v) => {
                const isActive = v.id === activeVehicleId;
                return (
                  <div
                    key={v.id}
                    className={`rounded-xl p-4 border transition-all flex flex-col justify-between ${
                      isActive
                        ? 'border-amber-500 bg-neutral-800/90 shadow-md ring-1 ring-amber-500/50'
                        : 'border-neutral-800 bg-neutral-950/80 hover:border-neutral-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-400 font-bold">
                              {v.chassisCode}
                            </span>
                            <span className="text-xs text-neutral-400 font-mono">{v.yearModel}</span>
                          </div>
                          <h4 className="font-bold text-sm text-white mt-1">{v.name}</h4>
                        </div>

                        {isActive && (
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shrink-0">
                            ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-300 mb-3 bg-neutral-900/60 p-2.5 rounded-lg border border-neutral-800">
                        <div>
                          <span className="text-neutral-500 text-[10px] block">Front Track / Rear:</span>
                          <span>{v.trackFrontMm}mm / {v.trackRearMm}mm</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block">Wheel / Lip:</span>
                          <span>{v.rimDiameterInches}" ({v.rimLipDiameterMm}mm)</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block">Front Camber Target:</span>
                          <span>{v.targets.frontCamber.target}°</span>
                        </div>
                        <div>
                          <span className="text-neutral-500 text-[10px] block">Rear Camber Target:</span>
                          <span>{v.targets.rearCamber.target}°</span>
                        </div>
                      </div>

                      {v.notes && (
                        <p className="text-[11px] text-neutral-400 line-clamp-2 mb-3">
                          {v.notes}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditingVehicle({ ...v })}
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
                          title="Edit target specs"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {v.presetCategory === 'custom' && (
                          <button
                            onClick={() => onDeleteVehicle(v.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded transition-colors"
                            title="Delete custom profile"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {!isActive && (
                        <button
                          onClick={() => onSelectVehicle(v.id)}
                          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Select for Rig
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
