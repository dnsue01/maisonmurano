"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark, LOGO_FACETS, LOGO_TRANSFORMS } from "@/components/brand/logo-mark";
import { cn } from "@/lib/utils";

/**
 * The Maison Murano cross modelled in 3D: the traced facets are extruded with
 * a bevel and rendered in polished chrome (like the brand's YouTube/Instagram
 * avatar), turning slowly. Falls back to the flat mark without WebGL or with
 * reduced motion.
 */
export function ChromeLogo({ className }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setFallback(true);
      return;
    }
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("three");
      const { SVGLoader } = await import("three/examples/jsm/loaders/SVGLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      if (disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFallback(true);
        return;
      }
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

      const camera = new THREE.PerspectiveCamera(30, 1, 10, 6000);
      camera.position.set(0, 0, 2050);

      // Build the 16 facets as one SVG and extrude them.
      const svg = `<svg xmlns="http://www.w3.org/2000/svg">${LOGO_TRANSFORMS.map(
        (t) => `<g transform="${t}">${LOGO_FACETS.map((d) => `<path d="${d}"/>`).join("")}</g>`
      ).join("")}</svg>`;
      const data = new SVGLoader().parse(svg);
      const material = new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 1, roughness: 0.16 });
      const group = new THREE.Group();
      for (const path of data.paths) {
        for (const shape of SVGLoader.createShapes(path)) {
          const geo = new THREE.ExtrudeGeometry(shape, {
            depth: 46,
            bevelEnabled: true,
            bevelThickness: 14,
            bevelSize: 6,
            bevelSegments: 4,
            curveSegments: 24,
          });
          const mesh = new THREE.Mesh(geo, material);
          group.add(mesh);
        }
      }
      // SVG y points down; flip so the cross reads upright, then centre the depth.
      group.scale.set(1, -1, 1);
      group.position.z = -23;
      const pivot = new THREE.Group();
      pivot.add(group);
      scene.add(pivot);

      const key = new THREE.DirectionalLight(0xffffff, 1.4);
      key.position.set(600, 900, 1400);
      scene.add(key);

      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      let raf = 0;
      let visible = true;
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
      io.observe(el);
      const start = performance.now();
      const tick = (now: number) => {
        raf = requestAnimationFrame(tick);
        if (!visible) return;
        const t = (now - start) / 1000;
        pivot.rotation.y = t * 0.9;
        pivot.rotation.x = Math.sin(t * 0.6) * 0.12;
        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        group.traverse((o) => {
          if ((o as import("three").Mesh).geometry) (o as import("three").Mesh).geometry.dispose();
        });
        material.dispose();
        pmrem.dispose();
        renderer.dispose();
        renderer.domElement.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div ref={host} className={cn("relative [&>canvas]:h-full [&>canvas]:w-full", className)} aria-hidden="true">
      {fallback && <LogoMark className="h-full w-full text-cream" />}
    </div>
  );
}
