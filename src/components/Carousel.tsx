"use client";

import { useRef, useMemo } from "react";
import type { Group } from "three";
import { useFrame, useThree } from "@react-three/fiber";
import ModelCard from "./ModelCard";

const ITEMS = [
  { src: "/models/Elegant%20Summer%20Dress.png", title: "Elegant Summer Dress" },
  { src: "/models/Modern%20Kurti%20Collection.png", title: "Modern Kurti Collection" },
  { src: "/models/Luxury%20Saree%20Showcase.png", title: "Luxury Saree Showcase" },
  { src: "/models/Men%27s%20Casual%20Fashion.png", title: "Men's Casual Fashion" },
  { src: "/models/Men%27s%20Formal%20Wear.png", title: "Men's Formal Wear" },
  { src: "/models/Girls%20Fashion%20Collection.png", title: "Girls Fashion Collection" },
  { src: "/models/Boys%20Fashion%20Collection.png", title: "Boys Fashion Collection" },
  { src: "/models/Family%20Clothing%20Brand.png", title: "Family Clothing Brand" },
];

const COUNT = ITEMS.length;
const RADIUS = 6.6;

export default function Carousel({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const groupRef = useRef<Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!groupRef.current) return;
    const scrollRot = -scrollProgress * Math.PI * 2;
    const mouseRot = pointer.x * 0.3;
    groupRef.current.rotation.y = scrollRot + mouseRot;
  });

  const activeIndex = Math.round(scrollProgress * COUNT) % COUNT;

  const cards = useMemo(
    () =>
      ITEMS.map((item, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        const x = Math.sin(angle) * RADIUS;
        const z = Math.cos(angle) * RADIUS;
        const dist = Math.min((i - activeIndex + COUNT) % COUNT, (activeIndex - i + COUNT) % COUNT);
        let visibility: number;
        if (dist === 0) visibility = 1;
        else if (dist === 1) visibility = 0.65;
        else if (dist === 2) visibility = 0.35;
        else visibility = 0.04;
        return (
          <group key={item.src} position={[x, 0, z]}>
            <ModelCard
              imagePath={item.src}
              title={item.title}
              index={i}
              isActive={i === activeIndex}
              visibility={visibility}
            />
          </group>
        );
      }),
    [activeIndex]
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {cards}
    </group>
  );
}
