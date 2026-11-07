import {
  AxleCalculations,
  CalculatedWheelToe,
  ChassisAlignmentTargets,
  SessionCalculations,
  SingleWheelMeasurement,
  StageMeasurements,
  StringSquaringResult,
  StringSquaringSetup,
  TargetRange,
  WheelPosition,
} from '../types/alignment';

/**
 * Calculates standard outer rim lip diameter from nominal wheel diameter in inches.
 * Automotive rims have a tire bead seat diameter equal to nominal size,
 * plus outer flanges (~12mm to 13mm per side, or ~25.4mm / 1 inch total).
 */
export function calculateDefaultRimLipDiameter(inches: number): number {
  return Math.round(inches * 25.4 + 25);
}

/**
 * Calculates toe for an individual wheel from string measurements.
 * @param stringFrontMm distance from string to front rim edge
 * @param stringRearMm distance from string to rear rim edge
 * @param rimLipDiameterMm effective diameter between measuring points on the rim
 */
export function calculateIndividualToe(
  wheel: WheelPosition,
  stringFrontMm: number,
  stringRearMm: number,
  rimLipDiameterMm: number,
  targetRange?: TargetRange
): CalculatedWheelToe {
  const deltaMm = stringRearMm - stringFrontMm;
  // Protect against math domain error if delta > rimLipDiameter
  const clampedRatio = Math.max(-0.999, Math.min(0.999, deltaMm / (rimLipDiameterMm || 480)));
  const angleRad = Math.asin(clampedRatio);
  const angleDeg = (angleRad * 180) / Math.PI;

  const totalMinutes = Math.round(angleDeg * 60);
  const degPortion = Math.trunc(totalMinutes / 60);
  const minPortion = Math.abs(totalMinutes % 60);

  const sign = angleDeg >= 0 ? '+' : '-';
  const formattedString = `${sign}${Math.abs(degPortion)}° ${minPortion.toString().padStart(2, '0')}'`;

  let status: 'in-spec' | 'warning' | 'out-of-spec' = 'in-spec';
  if (targetRange) {
    status = evaluateTolerance(angleDeg, targetRange.min, targetRange.max);
  }

  return {
    wheel,
    deltaMm: Number(deltaMm.toFixed(2)),
    angleDeg: Number(angleDeg.toFixed(3)),
    angleMinutes: totalMinutes,
    formattedString,
    isToeIn: deltaMm > 0,
    status,
  };
}

/**
 * Evaluates whether a value is in-spec, approaching limit (warning), or out-of-spec
 */
export function evaluateTolerance(val: number, min: number, max: number): 'in-spec' | 'warning' | 'out-of-spec' {
  if (val >= min && val <= max) {
    return 'in-spec';
  }
  const span = Math.max(0.1, Math.abs(max - min));
  const warningMargin = span * 0.35;
  if (val >= min - warningMargin && val <= max + warningMargin) {
    return 'warning';
  }
  return 'out-of-spec';
}

/**
 * Computes complete axle calculations for Front or Rear axle
 */
export function calculateAxle(
  leftPos: WheelPosition,
  rightPos: WheelPosition,
  leftMeas: SingleWheelMeasurement,
  rightMeas: SingleWheelMeasurement,
  rimLipDiameterMm: number,
  wheelToeTarget: TargetRange,
  totalToeTarget: TargetRange,
  camberTarget: TargetRange
): AxleCalculations {
  const leftToe = calculateIndividualToe(
    leftPos,
    leftMeas.stringFrontMm,
    leftMeas.stringRearMm,
    rimLipDiameterMm,
    wheelToeTarget
  );

  const rightToe = calculateIndividualToe(
    rightPos,
    rightMeas.stringFrontMm,
    rightMeas.stringRearMm,
    rimLipDiameterMm,
    wheelToeTarget
  );

  const totalToeMm = Number((leftToe.deltaMm + rightToe.deltaMm).toFixed(2));
  const totalToeDeg = Number((leftToe.angleDeg + rightToe.angleDeg).toFixed(3));

  const totalMinutes = Math.round(totalToeDeg * 60);
  const degPortion = Math.trunc(totalMinutes / 60);
  const minPortion = Math.abs(totalMinutes % 60);
  const sign = totalToeDeg >= 0 ? '+' : '-';
  const totalToeFormatted = `${sign}${Math.abs(degPortion)}° ${minPortion.toString().padStart(2, '0')}'`;

  const totalToeStatus = evaluateTolerance(totalToeDeg, totalToeTarget.min, totalToeTarget.max);
  const leftCamberStatus = evaluateTolerance(leftMeas.camberDeg, camberTarget.min, camberTarget.max);
  const rightCamberStatus = evaluateTolerance(rightMeas.camberDeg, camberTarget.min, camberTarget.max);
  const camberDelta = Number(Math.abs(leftMeas.camberDeg - rightMeas.camberDeg).toFixed(2));

  return {
    leftToe,
    rightToe,
    totalToeMm,
    totalToeDeg,
    totalToeFormatted,
    totalToeStatus,
    leftCamberStatus,
    rightCamberStatus,
    camberDelta,
  };
}

/**
 * Calculates complete geometry calculations for a session stage
 */
export function calculateSessionStage(
  stage: StageMeasurements,
  rimLipDiameterMm: number,
  targets: ChassisAlignmentTargets
): SessionCalculations {
  const front = calculateAxle(
    'FL',
    'FR',
    stage.wheels.FL,
    stage.wheels.FR,
    rimLipDiameterMm,
    targets.frontToePerWheel,
    targets.frontTotalToe,
    targets.frontCamber
  );

  const rear = calculateAxle(
    'RL',
    'RR',
    stage.wheels.RL,
    stage.wheels.RR,
    rimLipDiameterMm,
    targets.rearToePerWheel,
    targets.rearTotalToe,
    targets.rearCamber
  );

  // Thrust angle = (Rear Right Toe - Rear Left Toe) / 2
  // Positive means thrust line points to the left of the car centerline
  const thrustAngleDeg = Number(((rear.rightToe.angleDeg - rear.leftToe.angleDeg) / 2).toFixed(3));
  rear.thrustAngleDeg = thrustAngleDeg;

  // Front Steer ahead = (Front Left Toe - Front Right Toe) / 2 - Thrust Angle
  front.steerAheadDeg = Number(((front.leftToe.angleDeg - front.rightToe.angleDeg) / 2 - thrustAngleDeg).toFixed(3));

  const maxAllowedThrust = targets.maxThrustAngle || 0.08;
  const thrustAngleStatus = evaluateTolerance(Math.abs(thrustAngleDeg), 0, maxAllowedThrust);

  return {
    front,
    rear,
    thrustAngleDeg,
    thrustAngleStatus,
  };
}

/**
 * Diagnoses and calculates adjustments to square and parallel the string alignment box.
 */
export function calculateStringSquaring(setup: StringSquaringSetup): StringSquaringResult {
  const widthDiffMm = Number((setup.boxWidthFrontMm - setup.boxWidthRearMm).toFixed(1));
  const isParallel = Math.abs(widthDiffMm) <= 1.0;

  // Front string centering offset relative to wheel hubs
  // Positive means right string is further from hub than left string (car sits shifted towards left string)
  const frontCenterOffsetMm = Number((setup.hubToStringFR - setup.hubToStringFL).toFixed(1));
  const rearCenterOffsetMm = Number((setup.hubToStringRR - setup.hubToStringRL).toFixed(1));

  // Strings are square if parallel AND vehicle centerline is aligned with string centerline
  // (front offset equals rear offset or both are within 1mm)
  const isSquare = isParallel && Math.abs(frontCenterOffsetMm - rearCenterOffsetMm) <= 1.5;

  const recommendedAdjustments: string[] = [];

  if (!isParallel) {
    if (widthDiffMm > 0) {
      recommendedAdjustments.push(
        `Front string bar is ${Math.abs(widthDiffMm)}mm wider than rear. Narrow front bar or widen rear bar by ${Math.abs(widthDiffMm)}mm so width is equal.`
      );
    } else {
      recommendedAdjustments.push(
        `Rear string bar is ${Math.abs(widthDiffMm)}mm wider than front. Narrow rear bar or widen front bar by ${Math.abs(widthDiffMm)}mm so width is equal.`
      );
    }
  }

  if (Math.abs(frontCenterOffsetMm) > 1.5) {
    const shift = (Math.abs(frontCenterOffsetMm) / 2).toFixed(1);
    if (frontCenterOffsetMm > 0) {
      recommendedAdjustments.push(`Front axle is shifted left by ${frontCenterOffsetMm}mm relative to strings. Shift front string bar RIGHT by ${shift}mm.`);
    } else {
      recommendedAdjustments.push(`Front axle is shifted right by ${Math.abs(frontCenterOffsetMm)}mm relative to strings. Shift front string bar LEFT by ${shift}mm.`);
    }
  }

  if (Math.abs(rearCenterOffsetMm) > 1.5) {
    const shift = (Math.abs(rearCenterOffsetMm) / 2).toFixed(1);
    if (rearCenterOffsetMm > 0) {
      recommendedAdjustments.push(`Rear axle is shifted left by ${rearCenterOffsetMm}mm relative to strings. Shift rear string bar RIGHT by ${shift}mm.`);
    } else {
      recommendedAdjustments.push(`Rear axle is shifted right by ${Math.abs(rearCenterOffsetMm)}mm relative to strings. Shift rear string bar LEFT by ${shift}mm.`);
    }
  }

  if (isSquare && recommendedAdjustments.length === 0) {
    recommendedAdjustments.push('String box is perfectly parallel and centered to vehicle hubs (within 1mm tolerance). Ready to measure wheel toe.');
  }

  return {
    isParallel,
    widthDiffMm,
    frontCenterOffsetMm,
    rearCenterOffsetMm,
    isSquare,
    recommendedAdjustments,
  };
}

/**
 * Format helpers for clean UI presentation
 */
export function formatDegreesMinutes(deg: number): string {
  const totalMinutes = Math.round(deg * 60);
  const degPortion = Math.trunc(totalMinutes / 60);
  const minPortion = Math.abs(totalMinutes % 60);
  const sign = deg >= 0 ? '+' : '-';
  return `${sign}${Math.abs(degPortion)}° ${minPortion.toString().padStart(2, '0')}'`;
}

export function formatCamber(deg: number): string {
  const sign = deg >= 0 ? '+' : '';
  return `${sign}${deg.toFixed(2)}°`;
}

export function formatMm(mm: number): string {
  const sign = mm > 0 ? '+' : '';
  return `${sign}${mm.toFixed(1)} mm`;
}
