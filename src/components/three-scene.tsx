"use client";

/**
 * ThreeScene — Fermor's real-time "wealth object".
 *
 * A calm cluster of frosted-glass columns that rise on load like a SIP
 * compounding, idle-float in space, and lean toward the pointer.
 *
 * Two variants share one component:
 *   - hero:  grow-on-load + mouse parallax (fine pointers) or slow
 *            auto-rotate (coarse pointers).
 *   - story: bar heights + camera morph between the three How-it-works
 *            steps (Connect → Understand → Act), driven by scroll.
 *
 * Constraints honoured here:
 *   - No network assets: the environment map is built from Lightformers,
 *     the ground shadow is a painted radial gradient (no depth pass).
 *   - DPR capped at 2, frameloop paused when off-screen (see hero-scene).
 *   - prefers-reduced-motion never mounts this file at all (the parent
 *     renders the flat HTML dashboard mock instead).
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { EffectComposer, DepthOfField } from "@react-three/postprocessing";
import * as THREE from "three";

const JADE = "#158a68";
const JADE_DEEP = "#0d6e54";
const INK = "#0b1424";

const FROSTED_TINTS = [
  "#dff2ea",
  "#cbeade",
  "#b7e5d4",
  "#a3dcc8",
  "#e9f6f0",
  "#c2e6d8",
  "#8fd9bc",
  "#d5efe5",
];

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/* ------------------------------------------------------------------ *
 *  Soft painted ground shadow — one quad, zero per-frame cost.
 * ------------------------------------------------------------------ */
function GroundShadow({ radius = 3.4 }: { radius?: number }) {
  const texture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        size * 0.05,
        size / 2,
        size / 2,
        size / 2,
      );
      gradient.addColorStop(0, "rgba(11, 20, 36, 0.26)");
      gradient.addColorStop(0.55, "rgba(11, 20, 36, 0.10)");
      gradient.addColorStop(1, "rgba(11, 20, 36, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <planeGeometry args={[radius, radius]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ *
 *  One frosted column.
 * ------------------------------------------------------------------ */
interface BarSpec {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  tint: string;
  /** per-step height multipliers for the story variant */
  steps?: [number, number, number];
}

interface BarsProps {
  variant: "hero" | "story";
  step: number;
  reduced: boolean;
  bars: BarSpec[];
}

function Bars({ variant, step, reduced, bars }: BarsProps) {
  const group = useRef<THREE.Group | null>(null);
  const columnRefs = useRef<Array<THREE.Group | null>>([]);
  const startedAt = useRef<number | null>(null);

  useFrame((state: RootState) => {
    const t = state.clock.elapsedTime;
    if (startedAt.current === null) startedAt.current = t;

    for (let i = 0; i < bars.length; i++) {
      const column = columnRefs.current[i];
      if (!column) continue;

      if (variant === "hero") {
        // Grow upward on load, staggered — a SIP compounding.
        const delay = reduced ? 0 : 0.12 * i;
        const elapsed = t - startedAt.current - delay;
        const progress = reduced ? 1 : Math.min(1, Math.max(0, elapsed / 1.5));
        column.scale.y = 0.04 + 0.96 * easeOutCubic(progress);
      } else {
        // Story morph: lerp toward the active step's height multiplier.
        const spec = bars[i];
        const target = spec.steps ? spec.steps[step] : 1;
        column.scale.y += (target - column.scale.y) * 0.08;
      }
    }

    if (group.current && !reduced) {
      // Gentle idle float + a whisper of breathing.
      group.current.position.y = Math.sin(t * 0.7) * 0.05;
      group.current.rotation.y = Math.sin(t * 0.18) * 0.04;
    }
  });

  return (
    <group ref={group}>
      {bars.map((spec, i) => (
        // Each column scales about its base (y=0), so bar + cap grow
        // together without drifting off the ground plane.
        <group
          key={i}
          ref={(node: THREE.Group | null) => {
            columnRefs.current[i] = node;
          }}
          position={[spec.x, 0, spec.z]}
          scale={[1, 0.04, 1]}
        >
          <RoundedBox
            args={[spec.width, spec.height, spec.depth]}
            radius={0.055}
            smoothness={4}
            bevelSegments={3}
            position={[0, spec.height / 2, 0]}
          >
            <meshPhysicalMaterial
              color={spec.tint}
              transparent
              opacity={0.62}
              roughness={0.38}
              metalness={0}
              clearcoat={0.85}
              clearcoatRoughness={0.35}
              envMapIntensity={0.9}
              ior={1.4}
              side={THREE.DoubleSide}
            />
          </RoundedBox>

          {/* Jade cap — the "value" mark on top of each column. */}
          <mesh position={[0, spec.height + 0.03, 0]}>
            <boxGeometry args={[spec.width * 0.66, 0.05, spec.depth * 0.66]} />
            <meshStandardMaterial
              color={JADE}
              emissive={JADE_DEEP}
              emissiveIntensity={0.35}
              roughness={0.5}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ *
 *  Camera rig: pointer parallax (hero), step framing (story).
 * ------------------------------------------------------------------ */
const STORY_CAMERAS: Array<[number, number, number]> = [
  [0.2, 3.2, 7.4], // Connect — wide, level, everything arriving
  [-2.2, 2.4, 6.6], // Understand — closer, swung left
  [2.8, 1.7, 6.0], // Act — low and to the right, looking up at growth
];

const LOOK_AT = new THREE.Vector3(0, 0.75, 0);

const HERO_RADIUS = Math.hypot(3.6, 6.4); // orbit radius for coarse-pointer auto-rotate
const HERO_Y = 2.6;

function CameraRig({
  variant,
  step,
  pointerGain,
}: {
  variant: "hero" | "story";
  step: number;
  pointerGain: number;
}) {
  const { camera, clock } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef(new THREE.Vector3(3.6, HERO_Y, 6.4));
  const lookAt = useRef(new THREE.Vector3(0, 0.75, 0));

  useEffect(() => {
    if (pointerGain <= 0) return;
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointerGain]);

  useFrame((_, delta) => {
    const lerp = Math.min(1, delta * 3);

    if (variant === "story") {
      const [x, y, z] = STORY_CAMERAS[step] ?? STORY_CAMERAS[0];
      target.current.set(x, y, z);
    } else if (pointerGain > 0) {
      target.current.set(
        3.6 + pointer.current.x * 0.75 * pointerGain,
        HERO_Y - pointer.current.y * 0.5 * pointerGain,
        6.4,
      );
    } else {
      // Coarse pointers: a slow, constant auto-orbit instead of tilt.
      const angle = clock.elapsedTime * 0.1;
      target.current.set(
        Math.sin(angle) * HERO_RADIUS,
        HERO_Y,
        Math.cos(angle) * HERO_RADIUS,
      );
    }

    camera.position.lerp(target.current, lerp);
    lookAt.current.lerp(LOOK_AT, lerp);
    camera.lookAt(lookAt.current);
  });

  return null;
}

/* ------------------------------------------------------------------ *
 *  Lights + one-time procedural environment (no HDR downloads).
 * ------------------------------------------------------------------ */
function Studio() {
  return (
    <>
      <ambientLight intensity={0.9} color="#f4f1e9" />
      <directionalLight position={[4, 7, 5]} intensity={1.6} color="#fffdf7" />
      <directionalLight position={[-5, 3, -2]} intensity={0.5} color="#cfe8de" />
      <directionalLight position={[0, -3, -6]} intensity={0.35} color={JADE} />

      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={2.4}
          position={[0, 5, -6]}
          scale={[10, 4, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.4}
          position={[-6, 2, 2]}
          rotation-y={Math.PI / 2}
          scale={[8, 3, 1]}
          color="#eaf6f1"
        />
        <Lightformer
          intensity={1.1}
          position={[6, 1, 2]}
          rotation-y={-Math.PI / 2}
          scale={[8, 3, 1]}
          color="#dff0e8"
        />
        <Lightformer
          intensity={0.8}
          position={[0, -4, 0]}
          rotation-x={Math.PI / 2}
          scale={[10, 10, 1]}
          color="#f7f6f2"
        />
      </Environment>
    </>
  );
}

/* ------------------------------------------------------------------ *
 *  Layouts
 * ------------------------------------------------------------------ */
const HERO_BARS: BarSpec[] = [
  { x: -2.05, z: -0.4, width: 0.52, height: 1.5, depth: 0.52, tint: FROSTED_TINTS[4] },
  { x: -1.4, z: -0.15, width: 0.56, height: 1.9, depth: 0.56, tint: FROSTED_TINTS[0] },
  { x: -0.72, z: 0.1, width: 0.58, height: 2.35, depth: 0.58, tint: FROSTED_TINTS[1] },
  { x: -0.02, z: 0.3, width: 0.6, height: 2.8, depth: 0.6, tint: FROSTED_TINTS[2] },
  { x: 0.7, z: 0.42, width: 0.6, height: 3.25, depth: 0.6, tint: FROSTED_TINTS[3] },
  { x: 1.4, z: 0.3, width: 0.58, height: 3.7, depth: 0.58, tint: FROSTED_TINTS[6] },
  { x: -1.72, z: 0.95, width: 0.5, height: 1.1, depth: 0.5, tint: FROSTED_TINTS[7] },
  { x: 0.28, z: 1.15, width: 0.54, height: 1.7, depth: 0.54, tint: FROSTED_TINTS[5] },
];

const STORY_BARS: BarSpec[] = [
  { x: -2.1, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[4], steps: [0.32, 0.5, 0.34] },
  { x: -1.4, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[0], steps: [0.32, 0.72, 0.5] },
  { x: -0.7, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[1], steps: [0.32, 0.46, 0.64] },
  { x: 0, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[2], steps: [0.32, 0.84, 0.8] },
  { x: 0.7, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[3], steps: [0.32, 0.58, 0.96] },
  { x: 1.4, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[6], steps: [0.32, 0.78, 1.12] },
  { x: 2.1, z: 0, width: 0.5, height: 2.6, depth: 0.5, tint: FROSTED_TINTS[5], steps: [0.32, 0.62, 1.28] },
];

/* ------------------------------------------------------------------ *
 *  Scene root
 * ------------------------------------------------------------------ */
export interface ThreeSceneProps {
  variant?: "hero" | "story";
  /** active How-it-works step (0..2), story variant only */
  step?: number;
  /** disable pointer parallax / DOF on modest hardware */
  quality?: "high" | "low";
  /** paused when the canvas is scrolled away ("never" stops the rAF loop) */
  frameloop?: "always" | "demand" | "never";
}

export default function ThreeScene({
  variant = "hero",
  step = 0,
  quality = "high",
  frameloop = "always",
}: ThreeSceneProps) {
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    setCoarse(
      typeof window !== "undefined" &&
        typeof window.matchMedia === "function" &&
        !window.matchMedia("(pointer: fine)").matches,
    );
  }, []);

  const pointerGain = variant === "hero" && !coarse ? 1 : 0;
  const showDof = quality === "high" && variant === "hero";

  return (
    <Canvas
      frameloop={frameloop}
      dpr={[1, 2]}
      camera={{ fov: 40, position: [3.6, HERO_Y, 6.4], near: 0.1, far: 60 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <Studio />
      <CameraRig variant={variant} step={step} pointerGain={pointerGain} />
      <group position={[0, -1.1, 0]}>
        <Bars
          variant={variant}
          step={step}
          reduced={false}
          bars={variant === "story" ? STORY_BARS : HERO_BARS}
        />
        <GroundShadow radius={variant === "story" ? 7 : 7.5} />
      </group>

      {showDof ? (
        <EffectComposer multisampling={4}>
          <DepthOfField focusDistance={0.028} focalLength={0.055} bokehScale={2.4} height={440} />
        </EffectComposer>
      ) : null}
    </Canvas>
  );
}
