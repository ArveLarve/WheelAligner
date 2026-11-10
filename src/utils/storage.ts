import { AlignmentSession, VehicleProfile } from '../types/alignment';
import { PRESET_VEHICLES } from '../data/presetVehicles';

const STORAGE_KEYS = {
  VEHICLES: 'apex_string_vehicles_v1',
  SESSIONS: 'apex_string_sessions_v1',
  ACTIVE_VEHICLE_ID: 'apex_string_active_vehicle_id_v1',
  ACTIVE_SESSION_ID: 'apex_string_active_session_id_v1',
  THEME_MODE: 'apex_string_theme_mode_v1',
  NAV_LAYOUT_MODE: 'apex_string_nav_layout_mode_v1',
};

export type NavLayoutMode = 'auto' | 'bottom' | 'top';

export function loadStoredNavLayout(): NavLayoutMode {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NAV_LAYOUT_MODE);
    if (raw === 'bottom' || raw === 'top') return raw;
    return 'auto';
  } catch {
    return 'auto';
  }
}

export function saveStoredNavLayout(mode: NavLayoutMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.NAV_LAYOUT_MODE, mode);
  } catch (err) {
    console.error('Error saving nav layout mode:', err);
  }
}

export const INITIAL_DEMO_SESSION: AlignmentSession = {
  id: 'session-demo-e60-01',
  vehicleId: 'bmw-e60-msport',
  createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  updatedAt: new Date().toISOString(),
  title: 'Post-Coilover & Control Arm Refresh Alignment',
  operatorName: 'Arve L.',
  ballastCondition: 'bmw_din_ballast',
  ballastNotes: '68kg in both front seats, 68kg in rear center, 21kg in trunk, full fuel tank (70L).',
  suspensionMods: 'Bilstein B12 Pro-Kit springs (-30mm), Lemförder front tension struts, removed front strut top locator pins.',
  tireSetup: 'Michelin Pilot Sport 4 (245/40R18 Front, 275/35R18 Rear) on Style 135 rims',
  garageFloorLevelVerified: true,
  summaryNotes: 'Significant improvement in high-speed straight-line stability. Removed front strut locator pin to dial in -0.9° front camber for reduced understeer on track turn-in.',
  stages: {
    before: {
      timestamp: '2026-11-05T09:15:00Z',
      stageNotes: 'Initial baseline after suspension install. Car had severe pull to right and wandering steering.',
      wheels: {
        FL: {
          wheel: 'FL',
          stringFrontMm: 48.0,
          stringRearMm: 46.2, // Toe-out: -1.8mm (-0.21°)
          hubToStringMm: 95.0,
          camberDeg: -0.45,
          casterDeg: 7.4,
          rideHeightMm: 582,
          tirePressurePsi: 35.0,
        },
        FR: {
          wheel: 'FR',
          stringFrontMm: 45.5,
          stringRearMm: 47.8, // Toe-in: +2.3mm (+0.27°)
          hubToStringMm: 95.0,
          camberDeg: -0.50,
          casterDeg: 7.3,
          rideHeightMm: 583,
          tirePressurePsi: 35.0,
        },
        RL: {
          wheel: 'RL',
          stringFrontMm: 38.0,
          stringRearMm: 37.5, // Toe-out: -0.5mm
          hubToStringMm: 83.0,
          camberDeg: -1.25,
          rideHeightMm: 570,
          tirePressurePsi: 39.0,
        },
        RR: {
          wheel: 'RR',
          stringFrontMm: 35.0,
          stringRearMm: 38.5, // Toe-in: +3.5mm
          hubToStringMm: 83.0,
          camberDeg: -2.10,
          rideHeightMm: 571,
          tirePressurePsi: 39.0,
        },
      },
    },
    intermediate: {
      timestamp: '2026-11-05T11:30:00Z',
      stageNotes: 'Knocked out front strut pins and maxed camber inward. Adjusted rear lower swing arm camber eccentric bolts to equalize -1.65°.',
      wheels: {
        FL: {
          wheel: 'FL',
          stringFrontMm: 47.0,
          stringRearMm: 46.5,
          hubToStringMm: 95.0,
          camberDeg: -0.90,
          casterDeg: 7.5,
          rideHeightMm: 582,
          tirePressurePsi: 35.0,
        },
        FR: {
          wheel: 'FR',
          stringFrontMm: 46.0,
          stringRearMm: 47.2,
          hubToStringMm: 95.0,
          camberDeg: -0.88,
          casterDeg: 7.4,
          rideHeightMm: 583,
          tirePressurePsi: 35.0,
        },
        RL: {
          wheel: 'RL',
          stringFrontMm: 37.0,
          stringRearMm: 38.8,
          hubToStringMm: 83.0,
          camberDeg: -1.65,
          rideHeightMm: 570,
          tirePressurePsi: 39.0,
        },
        RR: {
          wheel: 'RR',
          stringFrontMm: 36.5,
          stringRearMm: 38.5,
          hubToStringMm: 83.0,
          camberDeg: -1.62,
          rideHeightMm: 571,
          tirePressurePsi: 39.0,
        },
      },
    },
    final: {
      timestamp: '2026-11-05T14:45:00Z',
      stageNotes: 'Fine-tuned front tie-rod sleeves and rear toe cams. Steering wheel centered with bubble level lock. Thrust angle dialed to 0.00°!',
      wheels: {
        FL: {
          wheel: 'FL',
          stringFrontMm: 46.5,
          stringRearMm: 47.4, // +0.9mm toe-in (+0.11°)
          hubToStringMm: 95.0,
          camberDeg: -0.88,
          casterDeg: 7.5,
          rideHeightMm: 582,
          tirePressurePsi: 35.0,
        },
        FR: {
          wheel: 'FR',
          stringFrontMm: 46.5,
          stringRearMm: 47.4, // +0.9mm toe-in (+0.11°)
          hubToStringMm: 95.0,
          camberDeg: -0.86,
          casterDeg: 7.5,
          rideHeightMm: 583,
          tirePressurePsi: 35.0,
        },
        RL: {
          wheel: 'RL',
          stringFrontMm: 37.0,
          stringRearMm: 38.1, // +1.1mm toe-in (+0.13°)
          hubToStringMm: 83.0,
          camberDeg: -1.62,
          rideHeightMm: 570,
          tirePressurePsi: 39.0,
        },
        RR: {
          wheel: 'RR',
          stringFrontMm: 37.0,
          stringRearMm: 38.1, // +1.1mm toe-in (+0.13°)
          hubToStringMm: 83.0,
          camberDeg: -1.60,
          rideHeightMm: 571,
          tirePressurePsi: 39.0,
        },
      },
    },
  },
};

export function loadStoredVehicles(): VehicleProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VEHICLES);
    if (!raw) {
      saveStoredVehicles(PRESET_VEHICLES);
      return PRESET_VEHICLES;
    }
    const parsed: VehicleProfile[] = JSON.parse(raw);
    // Merge preset vehicles if user hasn't added them yet
    const existingIds = new Set(parsed.map((p) => p.id));
    const missingPresets = PRESET_VEHICLES.filter((p) => !existingIds.has(p.id));
    if (missingPresets.length > 0) {
      const merged = [...parsed, ...missingPresets];
      saveStoredVehicles(merged);
      return merged;
    }
    return parsed;
  } catch (err) {
    console.error('Error loading stored vehicles:', err);
    return PRESET_VEHICLES;
  }
}

export function saveStoredVehicles(vehicles: VehicleProfile[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
  } catch (err) {
    console.error('Error saving vehicles to localStorage:', err);
  }
}

export function loadStoredSessions(): AlignmentSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) {
      saveStoredSessions([INITIAL_DEMO_SESSION]);
      return [INITIAL_DEMO_SESSION];
    }
    const parsed: AlignmentSession[] = JSON.parse(raw);
    if (parsed.length === 0) {
      saveStoredSessions([INITIAL_DEMO_SESSION]);
      return [INITIAL_DEMO_SESSION];
    }
    return parsed;
  } catch (err) {
    console.error('Error loading stored sessions:', err);
    return [INITIAL_DEMO_SESSION];
  }
}

export function saveStoredSessions(sessions: AlignmentSession[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
  } catch (err) {
    console.error('Error saving sessions to localStorage:', err);
  }
}

export function exportBackupJson(vehicles: VehicleProfile[], sessions: AlignmentSession[]): void {
  const data = {
    app: 'ApexString BMW Wheel Alignment',
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    vehicles,
    sessions,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `apexstring_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
