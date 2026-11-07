export type WheelPosition = 'FL' | 'FR' | 'RL' | 'RR';
export type ChassisCode = 'E60' | 'E87' | 'F11' | 'CUSTOM';
export type SessionStage = 'before' | 'intermediate' | 'final';

export interface TargetRange {
  min: number;
  target: number;
  max: number;
  unit: 'deg' | 'mm' | 'deg_min';
}

export interface ChassisAlignmentTargets {
  frontCamber: TargetRange; // negative degrees, e.g. -1.0 to -0.4
  frontToePerWheel: TargetRange; // e.g. 0.05° to 0.15° toe-in
  frontTotalToe: TargetRange; // e.g. 0.10° to 0.30°
  frontCaster?: TargetRange; // degrees, e.g. 6.5° to 7.5°
  rearCamber: TargetRange; // negative degrees, e.g. -1.8 to -1.3
  rearToePerWheel: TargetRange; // e.g. 0.10° to 0.20°
  rearTotalToe: TargetRange; // e.g. 0.20° to 0.40°
  maxThrustAngle: number; // max allowable thrust angle (e.g. 0.08°)
}

export interface VehicleProfile {
  id: string;
  name: string;
  chassisCode: ChassisCode;
  yearModel: string;
  bodyType: string;
  wheelbaseMm: number; // e.g. 2888 for E60, 2660 for E87, 2968 for F11
  trackFrontMm: number; // e.g. 1558
  trackRearMm: number; // e.g. 1582
  rimDiameterInches: number; // 17, 18, 19
  rimLipDiameterMm: number; // measured rim lip outer diameter
  imageKey?: string; // key to local asset
  notes?: string;
  presetCategory?: 'oem_standard' | 'm_sport' | 'fast_road' | 'track_day' | 'custom';
  targets: ChassisAlignmentTargets;
}

export interface SingleWheelMeasurement {
  wheel: WheelPosition;
  stringFrontMm: number; // distance from string to front lip of rim
  stringRearMm: number; // distance from string to rear lip of rim
  hubToStringMm?: number; // distance from wheel hub center cap to string (used for squaring)
  camberDeg: number; // negative for top tilted inwards
  camberMeasuredTopMm?: number; // optional caliper delta top
  camberMeasuredBottomMm?: number; // optional caliper delta bottom
  casterDeg?: number; // optional front caster
  rideHeightMm?: number; // BMW spec: bottom rim lip to center of fender arch
  tirePressurePsi?: number;
}

export interface StageMeasurements {
  timestamp: string;
  stageNotes?: string;
  wheels: Record<WheelPosition, SingleWheelMeasurement>;
}

export interface AlignmentSession {
  id: string;
  vehicleId: string;
  createdAt: string;
  updatedAt: string;
  title: string;
  operatorName: string;
  ballastCondition: 'bmw_din_ballast' | 'driver_only' | 'empty_half_tank' | 'custom';
  ballastNotes?: string;
  suspensionMods?: string; // e.g. "Bilstein B12 kit, M3 front lower control arms, eccentric rear bushings"
  tireSetup?: string; // e.g. "Michelin Pilot Sport 4S 245/40R18"
  garageFloorLevelVerified: boolean;
  stages: {
    before: StageMeasurements;
    intermediate?: StageMeasurements;
    final?: StageMeasurements;
  };
  summaryNotes?: string;
}

export interface CalculatedWheelToe {
  wheel: WheelPosition;
  deltaMm: number; // rear - front (positive = toe-in, negative = toe-out)
  angleDeg: number;
  angleMinutes: number;
  formattedString: string;
  isToeIn: boolean;
  status: 'in-spec' | 'warning' | 'out-of-spec';
}

export interface AxleCalculations {
  leftToe: CalculatedWheelToe;
  rightToe: CalculatedWheelToe;
  totalToeMm: number;
  totalToeDeg: number;
  totalToeFormatted: string;
  totalToeStatus: 'in-spec' | 'warning' | 'out-of-spec';
  leftCamberStatus: 'in-spec' | 'warning' | 'out-of-spec';
  rightCamberStatus: 'in-spec' | 'warning' | 'out-of-spec';
  camberDelta: number; // difference between left and right side
  thrustAngleDeg?: number; // only for rear axle
  steerAheadDeg?: number; // for front axle
}

export interface SessionCalculations {
  front: AxleCalculations;
  rear: AxleCalculations;
  thrustAngleDeg: number;
  thrustAngleStatus: 'in-spec' | 'warning' | 'out-of-spec';
}

export interface StringSquaringSetup {
  boxWidthFrontMm: number; // distance between left and right strings at front bar
  boxWidthRearMm: number; // distance between left and right strings at rear bar
  hubToStringFL: number;
  hubToStringFR: number;
  hubToStringRL: number;
  hubToStringRR: number;
}

export interface StringSquaringResult {
  isParallel: boolean;
  widthDiffMm: number;
  frontCenterOffsetMm: number;
  rearCenterOffsetMm: number;
  isSquare: boolean;
  recommendedAdjustments: string[];
}
