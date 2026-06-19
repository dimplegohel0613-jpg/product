"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Points } from "three";
import * as THREE from "three";

const COUNT = 500;

function seededRandom() {
  let s = 3456;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const prand = seededRandom();

function createGeometry() {
  const pos = new Float32Array(COUNT * 3);
  const sz = new Float32Array(COUNT);
  const spd = new Float32Array(COUNT);
  const off = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const theta = prand() * Math.PI * 2;
    const r = 1.5 + prand() * 6;
    pos[i * 3] = Math.cos(theta) * r;
    pos[i * 3 + 1] = (prand() - 0.5) * 8;
    pos[i * 3 + 2] = Math.sin(theta) * r;
    sz[i] = 0.02 + prand() * 0.08;
    spd[i] = 0.1 + prand() * 0.5;
    off[i] = prand() * Math.PI * 2;
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geom.setAttribute("size", new THREE.BufferAttribute(sz, 1));
  (geom as THREE.BufferGeometry & { userData: Record<string, unknown> }).userData = { speeds: spd, offsets: off, initialPos: pos.slice(), sizes: sz.slice() };
  return geom;
}

const geometry = createGeometry();

export default function Particles() {
  const ref = useRef<Points>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const sizeArr = ref.current.geometry.attributes.size.array as Float32Array;
    const { speeds, offsets, initialPos, sizes } = geometry.userData as { speeds: Float32Array; offsets: Float32Array; initialPos: Float32Array; sizes: Float32Array };
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      pos[i3] = initialPos[i3] + Math.cos(t * speeds[i] * 0.5 + offsets[i]) * 0.2;
      pos[i3 + 1] = initialPos[i3 + 1] + Math.sin(t * speeds[i] + offsets[i]) * 0.4;
      pos[i3 + 2] = initialPos[i3 + 2] + Math.sin(t * speeds[i] * 0.6 + offsets[i] * 1.3) * 0.2;
      sizeArr[i] = sizes[i] * (0.8 + Math.sin(t * speeds[i] + offsets[i]) * 0.3);
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        color="#c8a46d"
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
