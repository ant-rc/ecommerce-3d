import ProductViewer from "../3d/ProductViewer";
import ProductInfo from "./ProductInfo";
import Navbar from "./Navbar";

export default function ProductPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-sans">
      <Navbar />
      <main className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_480px]">
        <div className="relative h-[50vh] lg:sticky lg:top-0 lg:h-screen">
          <ProductViewer />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/80 px-5 py-2 text-xs tracking-wide text-stone-500 shadow-sm backdrop-blur">
            Cliquer et glisser pour pivoter le modele
          </div>
        </div>
        <ProductInfo />
      </main>
    </div>
  );
}
