"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, Vignette, EffectComposer } from "@react-three/postprocessing";
import Carousel from "./Carousel";
import Particles from "./Particles";
import GroundPlane from "./GroundPlane";
import DynamicLight from "./DynamicLight";
import AmbientBg from "./AmbientBg";
import FloatingOrnaments from "./FloatingOrnaments";

export default function Scene({ scrollProgress = 0 }: { scrollProgress?: number }) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-0">
      <Canvas
        camera={{ position: [0, 0.3, 13], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100vw", height: "100vh" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 8, 6]} intensity={2.0} />
        <directionalLight position={[-3, 4, -2]} intensity={0.5} color="#c8a46d" />
        <pointLight position={[0, 3, 2]} intensity={0.8} color="#c8a46d" />
        <pointLight position={[-4, -1, 4]} intensity={0.4} color="#4466ff" />
        <pointLight position={[4, 2, -3]} intensity={0.3} color="#ff66aa" />

        <AmbientBg />
        <DynamicLight />
        <GroundPlane />
        <Carousel scrollProgress={scrollProgress} />
        <FloatingOrnaments />
        <Particles />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.8}
            intensity={1.2}
          />
          <Vignette
            offset={0.2}
            darkness={0.7}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
