"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const uniforms = {
  uColorTop: { value: new THREE.Color("#0a0a18") },
  uColorMid: { value: new THREE.Color("#1a1028") },
  uColorBot: { value: new THREE.Color("#080810") },
  uTime: { value: 0 },
};

export default function AmbientBg() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime * 0.1;
    const t = Math.sin(state.clock.elapsedTime * 0.05) * 0.03;
    uniforms.uColorMid.value.setHSL(0.75 + t, 0.3, 0.1);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[50, 32, 32]} />
      <shaderMaterial
        side={THREE.BackSide}
        depthWrite={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vPos;
          void main() {
            vPos = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uColorTop;
          uniform vec3 uColorMid;
          uniform vec3 uColorBot;
          uniform float uTime;
          varying vec3 vPos;

          void main() {
            float h = normalize(vPos).y;
            float t = h * 0.5 + 0.5;
            vec3 col = mix(uColorBot, uColorMid, smoothstep(0.0, 0.35, t));
            col = mix(col, uColorTop, smoothstep(0.35, 0.75, t));

            float stars = step(0.997, fract(sin(vPos.x * 100.0 + vPos.y * 73.0 + vPos.z * 51.0) * 43758.5453));
            col += vec3(0.8, 0.7, 0.5) * stars * 0.6;

            float glow = exp(-abs(h - 0.25) * 4.0) * 0.06;
            col += vec3(0.5, 0.4, 0.2) * glow;

            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}
