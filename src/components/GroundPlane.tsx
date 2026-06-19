"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const uniforms = {
  uTime: { value: 0 },
};

export default function GroundPlane() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh
      ref={ref}
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -1.8, 0]}
      receiveShadow
    >
      <planeGeometry args={[22, 22]} />
      <shaderMaterial
        transparent
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          varying vec3 vPos;
          void main() {
            vUv = uv;
            vec4 worldPos = modelMatrix * vec4(position, 1.0);
            vPos = worldPos.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPos;
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          varying vec3 vPos;

          void main() {
            vec2 center = vUv - 0.5;
            float dist = length(center);
            float alpha = smoothstep(0.8, 0.0, dist) * 0.3;

            float ripple = sin(vPos.x * 2.5 + vPos.z * 2.5 + uTime * 0.4) * 0.5 + 0.5;
            float ripple2 = sin(vPos.x * 4.0 - vPos.z * 3.0 + uTime * 0.6) * 0.5 + 0.5;
            float combined = ripple * 0.6 + ripple2 * 0.4;

            alpha *= 0.5 + combined * 0.5;

            vec3 dark = vec3(0.03, 0.03, 0.06);
            vec3 gold = vec3(0.25, 0.2, 0.12);
            vec3 col = mix(dark, gold, combined * 0.4);

            float glow = exp(-dist * 3.0) * 0.15;
            col += vec3(0.5, 0.4, 0.2) * glow;

            gl_FragColor = vec4(col, alpha);
          }
        `}
      />
    </mesh>
  );
}
