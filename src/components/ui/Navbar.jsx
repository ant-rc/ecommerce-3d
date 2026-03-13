import useProductStore from "../../store/useProductStore";

export default function Navbar() {
  const getCartCount = useProductStore((s) => s.getCartCount);
  const categories = useProductStore((s) => s.categories);
  const activeCategory = useProductStore((s) => s.activeCategory);
  const setActiveCategory = useProductStore((s) => s.setActiveCategory);
  const setPage = useProductStore((s) => s.setPage);
  const cartCount = getCartCount();

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4 lg:px-10">
      <button
        type="button"
        onClick={() => setPage("landing")}
        className="flex items-center gap-3"
      >
        <span className="font-display text-xl font-bold tracking-tight text-stone-900">
          Luxor
        </span>
        <span className="font-display text-xl font-light tracking-tight text-brand">
          Garden
        </span>
      </button>
      <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
        <button
          type="button"
          onClick={() => setActiveCategory(null)}
          className={`transition-colors ${
            activeCategory === null
              ? "font-semibold text-stone-900"
              : "text-stone-500 hover:text-stone-900"
          }`}
        >
          Tout
        </button>
        {Object.entries(categories).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveCategory(key)}
            className={`transition-colors ${
              activeCategory === key
                ? "font-semibold text-brand"
                : "text-stone-500 hover:text-stone-900"
            }`}
          >
            {label}
          </button>
        ))}
      </nav>
      <div className="flex items-center gap-5">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 cursor-pointer text-stone-500 transition-colors hover:text-stone-900">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <div className="relative cursor-pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-5 w-5 text-stone-500 transition-colors hover:text-stone-900">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
          </svg>
          {cartCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
