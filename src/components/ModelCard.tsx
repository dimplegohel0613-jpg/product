"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Group, Mesh, Points } from "three";
import * as THREE from "three";
import { useTexture, Text } from "@react-three/drei";

interface ModelCardProps {
  imagePath: string;
  title: string;
  index: number;
  isActive: boolean;
  visibility: number;
}

function seededRandom() {
  let s = 5678;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}
const srand = seededRandom();

function SparkleBurst({ active }: { active: boolean }) {
  const ref = useRef<Points>(null);
  const progress = useRef(0);

  const geo = useMemo(() => {
    const pos = new Float32Array(40 * 3);
    for (let i = 0; i < 40; i++) {
      const theta = srand() * Math.PI * 2;
      const phi = Math.acos(2 * srand() - 1);
      const r = 0.3 + srand() * 0.4;
      pos[i * 3] = Math.sin(phi) * Math.cos(theta) * r;
      pos[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * r;
      pos[i * 3 + 2] = Math.cos(phi) * r;
    }
    const geom = new THREE.BufferGeometry();
    geom.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return geom;
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    progress.current += ((active ? 1 : 0) - progress.current) * 0.1;
    const s = progress.current * 2;
    ref.current.scale.setScalar(1 + s);
    (ref.current.material as THREE.PointsMaterial).opacity = progress.current * 0.6;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.03}
        color="#c8a46d"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function ModelCard({ imagePath, title, index, isActive, visibility }: ModelCardProps) {
  const groupRef = useRef<Group>(null);
  const imgRef = useRef<Mesh>(null);
  const titleTextRef = useRef<THREE.Mesh & { material: THREE.MeshBasicMaterial }>(null);
  const texture = useTexture(imagePath);
  const { camera, pointer } = useThree();
  const timeRef = useRef(0);
  const lookTarget = useRef(new THREE.Vector3());
  const enterRef = useRef(0);
  const activeZ = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (enterRef.current < 1) {
      enterRef.current = Math.min(1, enterRef.current + delta * 2.5);
    }

    lookTarget.current.set(
      camera.position.x + pointer.x * 0.4,
      camera.position.y + pointer.y * 0.3,
      camera.position.z
    );
    groupRef.current.lookAt(lookTarget.current);

    timeRef.current += delta;
    activeZ.current += ((isActive ? 0.6 : 0) - activeZ.current) * 0.1;

    const targetOpacity = (0.15 + visibility * 0.85) * enterRef.current;

    if (imgRef.current) {
      (imgRef.current.material as THREE.MeshBasicMaterial).opacity += (targetOpacity - (imgRef.current.material as THREE.MeshBasicMaterial).opacity) * 0.08;
    }

    if (titleTextRef.current) {
      (titleTextRef.current.material as THREE.MeshBasicMaterial).opacity += (targetOpacity - (titleTextRef.current.material as THREE.MeshBasicMaterial).opacity) * 0.08;
    }

    const floatY = Math.sin(timeRef.current * 0.8 + index * 0.9) * 0.12;
    groupRef.current.position.y = floatY;
    groupRef.current.position.z += (activeZ.current - groupRef.current.position.z) * 0.08;

    const baseScale = (0.4 + visibility * 0.6) * 1.1 * Math.min(1, enterRef.current * 1.5);
    const targetScale = isActive ? baseScale * 1.35 : baseScale;
    const currentScale = groupRef.current.scale.x;
    const newScale = currentScale + (targetScale - currentScale) * 0.1;
    groupRef.current.scale.setScalar(newScale);
  });

  return (
    <group ref={groupRef}>
      <mesh ref={imgRef} position={[0, 0, 0]}>
        <planeGeometry args={[2.25, 3.375]} />
        <meshBasicMaterial map={texture} transparent opacity={1} />
      </mesh>

      <SparkleBurst active={isActive} />

      <group position={[0, -1.83, 0.01]}>
        <Text
          ref={titleTextRef}
          position={[0, 0, 0]}
          fontSize={isActive ? 0.15 : 0.14}
          color="#c8a46d"
          anchorX="center"
          anchorY="middle"
          maxWidth={1.7}
          textAlign="center"
        >
          {title}
        </Text>
      </group>
    </group>
  );
}
