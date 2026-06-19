"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export default function DynamicLight() {
  const lightRef = useRef<THREE.PointLight>(null);
  const { pointer } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 2, 3));

  useFrame(() => {
    if (!lightRef.current) return;
    targetPos.current.x += (pointer.x * 4 - targetPos.current.x) * 0.05;
    targetPos.current.y += (pointer.y * 2 + 2 - targetPos.current.y) * 0.05;
    lightRef.current.position.lerp(targetPos.current, 0.08);
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 2, 3]}
      intensity={1.2}
      color="#c8a46d"
      distance={12}
      decay={2}
    />
  );
}
