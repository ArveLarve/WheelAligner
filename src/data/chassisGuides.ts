export interface GuideStep {
  stepNumber: number;
  title: string;
  summary: string;
  details: string[];
  toolNeeded?: string;
  torqueSpec?: string;
  warningNote?: string;
}

export interface WheelAdjustmentInstruction {
  wheel: 'Front Wheels (FL & FR)' | 'Rear Wheels (RL & RR)';
  adjustmentType: 'Toe' | 'Camber' | 'Caster';
  mechanism: string;
  toolSizes: string;
  directionOfTurn: string;
  approximateSensitivity: string;
  torqueSpec: string;
  proTips: string[];
}

export interface ChassisGuideContent {
  chassisCode: string;
  chassisName: string;
  overview: string;
  factoryTrackFrontMm: number;
  factoryTrackRearMm: number;
  trackDifferenceNote: string;
  keySuspensionArchitecture: string;
  frontWheelGuide: WheelAdjustmentInstruction[];
  rearWheelGuide: WheelAdjustmentInstruction[];
  bmwSpecificGotchas: string[];
}

export const STRING_ALIGNMENT_MASTER_GUIDE: GuideStep[] = [
  {
    stepNumber: 1,
    title: 'Vehicle Preparation, Weighting & Slip Plates',
    summary: 'Ensure tire pressures are set, vehicle is on a flat level floor, and suspension scrub is relieved.',
    details: [
      'Set all four tire pressures to your target warm/cold pressures (e.g. 2.4 bar front / 2.7 bar rear).',
      'Position DIY slip plates under all 4 tires (two heavy-duty plastic garbage bags or linoleum tiles with a dusting of table salt or lithium grease in between). This eliminates tire friction scrub so adjustments move freely without pre-loading the suspension bushings.',
      'BMW DIN ballast specification: 68 kg in both front seats, 68 kg in middle rear seat, 21 kg in trunk center, and full fuel tank. Alternatively, record real-world conditions (e.g. driver-only 80kg + half fuel tank).',
      'Roll the vehicle back and forth 1 meter or jounce each bumper 3 times to settle the suspension bushings.',
    ],
    toolNeeded: 'Tire inflator gauge, 4x DIY slip plates, steering wheel level/lock',
    warningNote: 'Never attempt string alignment without slip plates or rolling between adjustments; tire rubber grip will bind the chassis and give false readings.',
  },
  {
    stepNumber: 2,
    title: 'Rigging the String Box at Wheel Hub Height',
    summary: 'Set two bright monofilament strings (0.4–0.6mm) parallel on stands or bumper bars along each side.',
    details: [
      'Mount strings on stands or magnetic bumper bars so the string passes directly across the horizontal center of all four wheel hub center caps.',
      'Keep string tension taut using weights (e.g., 500g plumbing weight or water bottle) so there is zero droop.',
      'Measure height from floor to string at each wheel; verify string is level along the wheelbase.',
    ],
    toolNeeded: '0.5mm fluorescent monofilament line, 4 jack stands or string bars with plumb lines, steel rule',
  },
  {
    stepNumber: 3,
    title: 'Squaring the String Box (Equal Width & Centering)',
    summary: 'Match front and rear string widths and center to chassis hub faces.',
    details: [
      'Measure distance between Left String and Right String at front bar (e.g. 1900 mm).',
      'Measure distance between Left String and Right String at rear bar. Adjust until front and rear widths match within 0.5mm.',
      'Check front hub-to-string distance (FL vs FR). Shift both strings laterally until FL hub distance equals FR hub distance.',
      'Check rear hub-to-string distance (RL vs RR). Shift rear bar until RL equals RR.',
      'Account for factory track width differences: BMW rear track is naturally wider than front (E60: +24mm, E87: +13mm, F11: +27mm). Because rear track is wider, rear hub-to-string will naturally be smaller than front by half the track difference when perfectly centered!',
    ],
    toolNeeded: 'Long steel tape measure (3m or 5m), 150mm digital caliper / steel machinists rule',
    warningNote: 'Always re-check front bar width after moving the rear bar to ensure strings stayed parallel.',
  },
  {
    stepNumber: 4,
    title: 'Measuring Wheel Toe & Camber',
    summary: 'Take high-precision rim measurements without disturbing the strings.',
    details: [
      'Center the steering wheel exactly straight and lock it in place with a steering wheel holder clamp or bungee.',
      'At each wheel, use a 150mm steel machinists rule (with 0.5mm graduations) or digital caliper depth gauge. Rest the end against the front outer lip of the rim at hub height and read distance to the string (d_front).',
      'Repeat on the rear outer lip of the rim (d_rear). Never push the string; read the line just as the light breaks or contacts without deflecting.',
      'Delta = d_rear - d_front. If d_rear > d_front, the front of the wheel points inward (Toe-In). If d_front > d_rear, it points outward (Toe-Out).',
      'Place your digital angle gauge / smart level vertically against the top and bottom wheel lip (or using a 3-point camber adapter) to record Camber in degrees.',
    ],
    toolNeeded: '150mm steel ruler with 0.5mm resolution or digital depth caliper, digital inclinometer/camber gauge',
  },
  {
    stepNumber: 5,
    title: 'The Mandatory BMW Order of Adjustments',
    summary: 'Follow the mechanical dependency chain to avoid having to re-do work.',
    details: [
      '1. ALWAYS START AT THE REAR: Adjust Rear Camber first. On BMW multi-link suspension, rotating the rear camber eccentric bolt significantly moves rear toe!',
      '2. Adjust Rear Toe & Thrust Angle: Bring rear toe to spec and equalize left vs right rear toe to achieve near 0.00° thrust angle.',
      '3. Adjust Front Camber (if adjustable via slotted strut mount pin removal or camber plates).',
      '4. Adjust Front Toe & Center Steering Wheel: With the steering wheel verified dead-center, adjust front tie rod sleeves symmetrically until both sides meet individual target toe.',
      '5. Jounce suspension, roll car, re-verify final measurements.',
    ],
    warningNote: 'Never adjust front toe before setting rear thrust angle, or your steering wheel will be crooked when driving down a straight highway.',
  },
];

export const BMW_CHASSIS_GUIDES: Record<string, ChassisGuideContent> = {
  E60: {
    chassisCode: 'E60',
    chassisName: 'BMW 5-Series Sedan & Touring (E60 / E61)',
    overview: 'The E60 uses an aluminum double-pivot MacPherson front suspension and an Integral IV multi-link rear suspension with eccentric adjusters for camber and toe.',
    factoryTrackFrontMm: 1558,
    factoryTrackRearMm: 1582,
    trackDifferenceNote: 'Rear track is 24mm wider than front (12mm per side). When strings are parallel and centered, rear hub-to-string will measure approximately 12mm closer to the string than front hubs.',
    keySuspensionArchitecture: 'Front: MacPherson strut with steering rack tie rods. Rear: Aluminum Integral subframe with lower swing arm camber eccentric and forward toe control arm eccentric.',
    frontWheelGuide: [
      {
        wheel: 'Front Wheels (FL & FR)',
        adjustmentType: 'Toe',
        mechanism: 'Steering tie rod threaded adjusting sleeve with outer lock nut',
        toolSizes: '24mm open-end wrench (tie rod hex body) & 21mm wrench (lock nut)',
        directionOfTurn: 'Loosen 21mm lock nut. Turning top of left tie rod rearward pulls tie rod in (Toe-Out) or pushes out (Toe-In). Always confirm movement by checking front rim distance.',
        approximateSensitivity: '1 full turn (360°) of tie rod sleeve ≈ 3.5mm toe change at 18" rim lip (approx 0.45°). 1 hex flat (60°) ≈ 0.6mm toe change.',
        torqueSpec: 'Lock nut torque: 65 Nm (48 ft-lb)',
        proTips: [
          'Spray tie rod threads with penetrating oil (Kroil / WD40 Specialist) 15 minutes before adjusting.',
          'Hold the inner tie rod hex with a 24mm wrench while loosening the 21mm lock nut to prevent twisting the inner ball joint rubber boot.',
          'Verify steering wheel lock is still centered after tightening lock nuts.',
        ],
      },
      {
        wheel: 'Front Wheels (FL & FR)',
        adjustmentType: 'Camber',
        mechanism: 'Upper strut mount alignment pin (OEM non-adjustable from factory without mod)',
        toolSizes: '13mm socket (3 strut tower top nuts), 5mm drift punch and hammer',
        directionOfTurn: 'Jack front corner. Remove the 13mm strut nuts. Knock out the small steel alignment locator pin using a 5mm punch. Push strut top inward towards the engine as far as the slotted holes allow, then re-tighten nuts.',
        approximateSensitivity: 'Sliding strut top fully inward provides approx -0.35° to -0.55° extra negative camber.',
        torqueSpec: 'Strut tower top nuts (M8): 28 Nm (21 ft-lb)',
        proTips: [
          'Crucial DIY mod for BMW track and fast road enthusiasts to reduce front outer tire shoulder wear.',
          'If more camber is required (-1.5° or more), install aftermarket adjustable camber plates (e.g. Ground Control, Millway, or Vorshlag).',
        ],
      },
    ],
    rearWheelGuide: [
      {
        wheel: 'Rear Wheels (RL & RR)',
        adjustmentType: 'Camber',
        mechanism: 'Eccentric cam bolt on lower swing arm / wishbone to wheel carrier',
        toolSizes: '21mm socket / box wrench & 24mm eccentric cam nut wrench',
        directionOfTurn: 'Loosen 21mm nut slightly. Rotate 24mm eccentric bolt head. Rotating the high lobe outward pushes lower wheel carrier out, increasing negative camber.',
        approximateSensitivity: 'Quarter turn (90°) ≈ 0.6° camber change. NOTE: Increasing negative camber pulls wheel inward at front, inducing positive TOE-IN!',
        torqueSpec: 'Eccentric nut torque: 165 Nm (122 ft-lb) — Must tighten in normal ride position!',
        proTips: [
          'Always adjust rear camber BEFORE rear toe, because camber changes drastically affect toe!',
          'Clean road grime off the eccentric washer markings with a brass wire brush before adjusting.',
          'Mark baseline position with a white paint marker before turning.',
        ],
      },
      {
        wheel: 'Rear Wheels (RL & RR)',
        adjustmentType: 'Toe',
        mechanism: 'Eccentric cam bolt on rear forward toe tracking arm to subframe',
        toolSizes: '18mm socket & 21mm eccentric bolt wrench',
        directionOfTurn: 'Loosen 18mm nut. Rotate eccentric bolt. Turning the cam to push the forward arm outward creates Toe-In; pulling inward creates Toe-Out.',
        approximateSensitivity: 'Quarter turn (90°) ≈ 1.8mm toe change (approx 0.22°).',
        torqueSpec: 'Eccentric nut torque: 100 Nm (74 ft-lb)',
        proTips: [
          'Adjust left and right rear toe evenly to ensure rear Thrust Angle is 0.00° to 0.03°.',
          'Always re-check rear camber after locking rear toe nuts.',
        ],
      },
    ],
    bmwSpecificGotchas: [
      'Integral link bushings and guide rod ball joints wear out after 100,000 km; worn bushings make toe wander under acceleration.',
      'Active Steering (if equipped): Turn ignition on and center steering angle sensor, or use BMW INPA/ISTA to lock steering rack zero point.',
      'Rear subframe rubber mounts: Worn rear subframe bushings cause rear thrust angle to shift between acceleration and braking.',
    ],
  },
  E87: {
    chassisCode: 'E87',
    chassisName: 'BMW 1-Series Hatchback (E87 / E81 / E82 / E88)',
    overview: 'The E8x/E9x platform features a 5-link independent rear suspension with dual eccentric adjusters and front MacPherson struts with tie-rod toe.',
    factoryTrackFrontMm: 1484,
    factoryTrackRearMm: 1497,
    trackDifferenceNote: 'Rear track is 13mm wider than front (6.5mm per side). Centered strings will have rear hubs ~6.5mm closer to the string line than front hubs.',
    keySuspensionArchitecture: 'Front: Dual ball-joint MacPherson strut. Rear: 5-link stamped/cast multi-link rear suspension with dedicated toe and camber cams.',
    frontWheelGuide: [
      {
        wheel: 'Front Wheels (FL & FR)',
        adjustmentType: 'Toe',
        mechanism: 'Tie rod threaded adjusting collar with 21mm lock nut',
        toolSizes: '21mm open-end wrench (lock nut) & 13mm / 18mm tie rod hex wrench',
        directionOfTurn: 'Loosen 21mm lock nut. Rotate tie rod sleeve. Turning sleeve lengthens or shortens track rod to dial in precise toe-in.',
        approximateSensitivity: '1 full turn (360°) ≈ 3.2mm toe change at 17"/18" rim lip (~0.40°). 1 flat (60°) ≈ 0.55mm toe.',
        torqueSpec: 'Lock nut torque: 60 Nm (44 ft-lb)',
        proTips: [
          'Ensure the rubber bellows boot does not twist when turning the tie rod (spray silicone lube on boot neck).',
          'Tighten lock nut while counter-holding tie rod flat to prevent disturbing the setting.',
        ],
      },
      {
        wheel: 'Front Wheels (FL & FR)',
        adjustmentType: 'Camber',
        mechanism: 'Upper strut mount alignment pin punch mod / M3 control arms',
        toolSizes: '13mm socket (3 strut tower nuts), 5mm punch, hammer',
        directionOfTurn: 'Knock out the alignment pin from top of strut tower using 5mm punch. Loosen the three 13mm nuts slightly with wheel unloaded, push strut inward toward center of engine bay, re-torque nuts.',
        approximateSensitivity: 'Provides approx -0.4° to -0.6° extra negative camber.',
        torqueSpec: 'Strut top nuts: 28 Nm (21 ft-lb)',
        proTips: [
          'The single best free handling modification for E87/E90 front-end turn-in bite.',
          'For track enthusiasts: Swapping to E90/E92 M3 front lower control arms (TRW JTC1426/1427) gives an instant -0.75° camber and +0.5° caster with stiffer rubber bushings.',
        ],
      },
    ],
    rearWheelGuide: [
      {
        wheel: 'Rear Wheels (RL & RR)',
        adjustmentType: 'Camber',
        mechanism: 'Lower control arm eccentric cam bolt (camber bolt at subframe)',
        toolSizes: '18mm box wrench & 19mm / 21mm eccentric bolt socket',
        directionOfTurn: 'Loosen 18mm nut. Rotate eccentric bolt head to pivot bottom of wheel carrier outward for more negative camber.',
        approximateSensitivity: 'Quarter turn ≈ 0.5° camber change.',
        torqueSpec: 'Nut torque: 165 Nm (122 ft-lb)',
        proTips: [
          'E87 factory target camber is -1.4° to -1.8°. Avoid exceeding -2.0° on daily street driving to prevent inner tire wear.',
          'Always adjust rear camber before setting rear toe!',
        ],
      },
      {
        wheel: 'Rear Wheels (RL & RR)',
        adjustmentType: 'Toe',
        mechanism: 'Forward toe control link eccentric cam bolt at subframe',
        toolSizes: '18mm socket & 18mm box wrench',
        directionOfTurn: 'Loosen nut, rotate eccentric cam. Adjust to bring rear toe to +0.10° to +0.15° toe-in per side.',
        approximateSensitivity: 'Quarter turn ≈ 1.5mm toe change.',
        torqueSpec: 'Nut torque: 100 Nm (74 ft-lb)',
        proTips: [
          'Equalize left and right rear toe precisely to eliminate dog-tracking.',
        ],
      },
    ],
    bmwSpecificGotchas: [
      'Front tie rod lock nuts often seize from winter road salt; use heat or penetrating fluid if tight.',
      'Check rear spring coils for broken lower pig-tails before starting alignment; broken rear springs are common on E87 and distort ride height.',
    ],
  },
  F11: {
    chassisCode: 'F11',
    chassisName: 'BMW 5-Series Touring (F11)',
    overview: 'The F11 features an aluminum double-wishbone front axle (replacing MacPherson struts) and an Integral V multi-link rear suspension with self-leveling rear air springs.',
    factoryTrackFrontMm: 1600,
    factoryTrackRearMm: 1627,
    trackDifferenceNote: 'Rear track is 27mm wider than front (13.5mm per side). Centered strings will measure approximately 13.5mm closer to rear hub caps than front hub caps.',
    keySuspensionArchitecture: 'Front: Aluminum double-wishbone with high-mounted upper control arm. Rear: Integral V multi-link axle with pneumatic rear air springs and ride height sensors.',
    frontWheelGuide: [
      {
        wheel: 'Front Wheels (FL & FR)',
        adjustmentType: 'Toe',
        mechanism: 'Steering tie rod sleeve with outer locking nut',
        toolSizes: '24mm open-end wrench & 21mm lock nut wrench',
        directionOfTurn: 'Loosen 21mm lock nut. Rotate 24mm tie rod body to adjust front toe-in / toe-out.',
        approximateSensitivity: '1 full turn ≈ 3.5mm toe change (approx 0.44°). 1 flat ≈ 0.6mm.',
        torqueSpec: 'Lock nut torque: 75 Nm (55 ft-lb)',
        proTips: [
          'Because the F11 uses double wishbones, front camber and caster remain extremely stable throughout suspension travel.',
          'Keep steering wheel level locked during tie rod adjustments.',
        ],
      },
      {
        wheel: 'Front Wheels (FL & FR)',
        adjustmentType: 'Camber',
        mechanism: 'Fixed geometry (double wishbone) — requires BMW swivel bearing swap if out of spec',
        toolSizes: 'N/A for routine adjustments (factory non-adjustable)',
        directionOfTurn: 'BMW provides ±30 minute (-0.5°) offset replacement wheel swivel bearings if chassis suffered curb impact. For normal adjustments, camber is fixed by wishbone control arms.',
        approximateSensitivity: 'Fixed by upper/lower wishbone geometry.',
        torqueSpec: 'Control arm bolts (if replacing): 100 Nm + 90° angle',
        proTips: [
          'If front camber is uneven between left and right by more than 0.5°, inspect lower control arm bushings (hydro-mounts) and upper wishbone ball joints for tear or play.',
        ],
      },
    ],
    rearWheelGuide: [
      {
        wheel: 'Rear Wheels (RL & RR)',
        adjustmentType: 'Camber',
        mechanism: 'Lower control arm eccentric cam bolt at rear subframe',
        toolSizes: '21mm box wrench & 24mm socket',
        directionOfTurn: 'Loosen nut, rotate eccentric cam. Adjusts wheel camber angle.',
        approximateSensitivity: 'Quarter turn ≈ 0.55° camber change.',
        torqueSpec: 'Eccentric nut torque: 165 Nm (122 ft-lb)',
        proTips: [
          'CRITICAL FOR F11 TOURING: Ensure rear air suspension has settled at standard ride height before starting! Do not lift vehicle by body without putting air suspension in workshop mode or letting compressor pump up to baseline height.',
          'Check ride height from bottom rim lip to fender edge (typically ~610mm on 19" wheels, or ~597mm on M-Sport).',
        ],
      },
      {
        wheel: 'Rear Wheels (RL & RR)',
        adjustmentType: 'Toe',
        mechanism: 'Track rod eccentric cam bolt at rear subframe',
        toolSizes: '18mm wrench & 21mm socket',
        directionOfTurn: 'Loosen nut, rotate eccentric cam to dial in rear toe.',
        approximateSensitivity: 'Quarter turn ≈ 1.6mm toe change.',
        torqueSpec: 'Eccentric nut torque: 100 Nm (74 ft-lb)',
        proTips: [
          'Touring wagons carry heavy rear cargo; setting rear toe to +0.14° per side (total +0.28°) guarantees rock-solid stability even at 200 km/h autobahn speeds.',
        ],
      },
    ],
    bmwSpecificGotchas: [
      'Self-leveling rear air springs: If one air bag is slightly leaking, rear ride height will be lopsided, throwing off rear camber and toe. Verify equal left/right rear ride height before measuring!',
      'Rear axle steering (Integral Active Steering): If equipped, requires electronic centering via diagnostic tool before mechanical alignment.',
    ],
  },
};
