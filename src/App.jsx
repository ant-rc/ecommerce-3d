import { lazy, Suspense } from "react";
import useProductStore from "./store/useProductStore";
import LandingPage from "./components/ui/LandingPage";

const ProductPage = lazy(() => import("./components/ui/ProductPage"));

export default function App() {
  const page = useProductStore((s) => s.page);

  if (page === "landing") {
    return <LandingPage />;
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-surface">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-brand" />
        </div>
      }
    >
      <ProductPage />
    </Suspense>
  );
}
