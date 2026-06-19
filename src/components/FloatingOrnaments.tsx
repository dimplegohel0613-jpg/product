"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const RING_COUNT = 3;
const SPARKLE_COUNT = 40;

function seededRandom() {
  let s = 1234;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const rand = seededRandom();

const ringData = Array.from({ length: RING_COUNT }, (_, i) => ({
  radius: 5 + i * 1.5,
  speed: 0.1 + i * 0.05,
  phase: (i / RING_COUNT) * Math.PI * 2,
  tilt: (i - 1) * 0.08,
}));

const sparkleGeo = (() => {
  const pos = new Float32Array(SPARKLE_COUNT * 3);
  for (let i = 0; i < SPARKLE_COUNT; i++) {
    const theta = rand() * Math.PI * 2;
    const r = 3 + rand() * 5;
    pos[i * 3] = Math.cos(theta) * r;
    pos[i * 3 + 1] = (rand() - 0.5) * 4;
    pos[i * 3 + 2] = Math.sin(theta) * r;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  return geom;
})();

export default function FloatingOrnaments() {
  const ringRefs = useRef<(THREE.Mesh | null)[]>([]);
  const sparkleRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ringRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const data = ringData[i];
      mesh.rotation.x = Math.sin(t * data.speed + data.phase) * data.tilt;
      mesh.rotation.z = Math.cos(t * data.speed * 0.7 + data.phase) * data.tilt * 0.5;
      const pulse = 1 + Math.sin(t * data.speed + data.phase) * 0.02;
      mesh.scale.setScalar(pulse);
    });
    if (sparkleRef.current) {
      sparkleRef.current.rotation.y = t * 0.02;
    }
  });

  return (
    <group>
      {ringData.map((data, i) => (
        <mesh
          key={i}
          ref={(el) => { ringRefs.current[i] = el; }}
          rotation={[data.tilt, data.phase, 0]}
        >
          <ringGeometry args={[data.radius - 0.03, data.radius + 0.03, 64]} />
          <meshBasicMaterial
            color="#c8a46d"
            transparent
            opacity={0.08 + i * 0.03}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      <points ref={sparkleRef} geometry={sparkleGeo}>
        <pointsMaterial
          size={0.04}
          color="#c8a46d"
          transparent
          opacity={0.4}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
