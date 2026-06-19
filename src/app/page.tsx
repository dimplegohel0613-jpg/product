"use client";

import { useState, useCallback } from "react";
import Scene from "@/components/Scene";
import SmoothScroll from "@/components/SmoothScroll";
import FloatingPanel from "@/components/FloatingPanel";

const LABELS = [
  { num: "01", title: "Elegant Summer Dress", desc: "Full-body fashion illustration of a young woman wearing a flowing summer dress with elegant pose and soft smile. Watercolor and digital painting style with realistic fabric folds." },
  { num: "02", title: "Modern Kurti Collection", desc: "Full-body female model wearing a trendy embroidered kurti with matching leggings and handbag. Boutique ethnic wear with realistic textile details." },
  { num: "03", title: "Luxury Saree Showcase", desc: "Full-body woman modeling an elegant designer saree with graceful pose. Detailed fabric textures and realistic draping in watercolor style." },
  { num: "04", title: "Men's Casual Fashion", desc: "Handsome full-body male fashion model wearing a stylish shirt and jeans with confident pose. Realistic clothing textures in watercolor and digital painting style." },
  { num: "05", title: "Men's Formal Wear", desc: "Professional full-body male model in a tailored blazer and trousers. Luxury formal fashion with realistic fabric details and elegant standing pose." },
  { num: "06", title: "Girls Fashion Collection", desc: "Cute full-body little girl wearing a stylish trendy dress with smiling pose. Soft watercolor fashion illustration with pastel color palette." },
  { num: "07", title: "Boys Fashion Collection", desc: "Full-body young boy in fashionable casual clothing with trendy shirt and shorts. Cheerful pose with realistic clothing texture." },
  { num: "08", title: "Family Clothing Brand", desc: "Elegant family fashion illustration featuring stylish father, mother, son and daughter in coordinated outfits. Luxury clothing collection advertisement." },
];

const totalSlides = LABELS.length;

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  const activeIndex = Math.round(scrollProgress * totalSlides) % totalSlides;

  return (
    <SmoothScroll onScroll={handleScroll}>
        <Scene scrollProgress={scrollProgress} />

        <main className="relative z-10">
          {LABELS.map((_, i) => (
            <section key={i} className="min-h-screen" />
          ))}

          <FloatingPanel
            num={LABELS[activeIndex].num}
            title={LABELS[activeIndex].title}
            desc={LABELS[activeIndex].desc}
          />
        </main>
      </SmoothScroll>
  );
}
