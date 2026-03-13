import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Html, useProgress } from "@react-three/drei";
import ProductModel from "./ProductModel";
import ProductLights from "./ProductLights";
import ProductControls from "./ProductControls";

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-600 border-t-brand" />
        <p className="text-sm text-slate-400">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

export default function ProductViewer() {
  return (
    <Canvas
      camera={{ position: [12, 10, 12], fov: 50 }}
      gl={{ antialias: true, alpha: false, toneMapping: 1 }}
      dpr={[1, 1.5]}
    >
      <color attach="background" args={["#F3F1ED"]} />
      <ProductLights />
      <Suspense fallback={<Loader />}>
        <ProductModel />
      </Suspense>
      <ProductControls />
    </Canvas>
  );
}
