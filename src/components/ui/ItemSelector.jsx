import { useMemo } from "react";
import useProductStore from "../../store/useProductStore";

function EyeIcon({ hidden }) {
  if (hidden) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-3.5 w-3.5">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default function ItemSelector() {
  const items = useProductStore((s) => s.items);
  const groups = useProductStore((s) => s.groups);
  const selectedItem = useProductStore((s) => s.selectedItem);
  const selectedGroup = useProductStore((s) => s.selectedGroup);
  const setSelectedItem = useProductStore((s) => s.setSelectedItem);
  const setSelectedGroup = useProductStore((s) => s.setSelectedGroup);
  const cart = useProductStore((s) => s.cart);
  const hiddenItems = useProductStore((s) => s.hiddenItems);
  const toggleHideItem = useProductStore((s) => s.toggleHideItem);
  const toggleHideGroup = useProductStore((s) => s.toggleHideGroup);
  const activeCategory = useProductStore((s) => s.activeCategory);

  const filteredItems = activeCategory
    ? items.filter((i) => i.category === activeCategory)
    : items;

  // Group items by their group key
  const groupedItems = useMemo(() => {
    const map = {};
    filteredItems.forEach((item) => {
      if (!map[item.group]) map[item.group] = [];
      map[item.group].push(item);
    });
    return map;
  }, [filteredItems]);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
        Elements inclus
      </h3>
      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
        {/* Ensemble Patio */}
        <button
          type="button"
          onClick={() => { setSelectedItem("all"); setSelectedGroup(null); }}
          className={`flex items-center justify-between rounded-lg px-4 py-2.5 text-left text-sm transition-all ${
            selectedItem === "all" && !selectedGroup
              ? "bg-stone-900 font-semibold text-white"
              : "bg-panel text-stone-600 hover:bg-stone-200"
          }`}
        >
          <span>{activeCategory ? "Tout afficher" : "Ensemble Patio"}</span>
        </button>

        {/* Groups */}
        {Object.entries(groupedItems).map(([groupKey, groupItems]) => {
          const group = groups[groupKey];
          if (!group) return null;
          const isGroupSelected = selectedGroup === groupKey;
          const allGroupHidden = groupItems.every((i) => hiddenItems.includes(i.id));
          const groupPrice = groupItems.reduce((s, i) => s + i.price, 0);

          return (
            <div key={groupKey} className="flex flex-col">
              {/* Group header */}
              <div
                className={`flex items-center gap-1 rounded-lg transition-all ${
                  isGroupSelected ? "bg-stone-800" : "bg-stone-100 hover:bg-stone-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedGroup(isGroupSelected ? null : groupKey)}
                  className={`flex flex-1 items-center justify-between px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider ${
                    isGroupSelected ? "text-white" : "text-stone-500"
                  } ${allGroupHidden ? "opacity-40" : ""}`}
                >
                  <span>{group.name}</span>
                  <span className={`text-[10px] font-medium normal-case ${
                    isGroupSelected ? "text-stone-300" : "text-stone-400"
                  }`}>
                    {groupPrice.toFixed(2)}&nbsp;&euro;
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => toggleHideGroup(groupKey)}
                  className={`mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors ${
                    isGroupSelected
                      ? "text-stone-300 hover:text-white"
                      : "text-stone-400 hover:text-stone-700"
                  }`}
                  aria-label={allGroupHidden ? `Afficher ${group.name}` : `Cacher ${group.name}`}
                >
                  <EyeIcon hidden={allGroupHidden} />
                </button>
              </div>

              {/* Group items */}
              {groupItems.map((item) => {
                const isHidden = hiddenItems.includes(item.id);
                const isItemSelected = selectedItem === item.id && !selectedGroup;
                return (
                  <div
                    key={item.id}
                    className={`ml-3 flex items-center gap-1 rounded-lg transition-all ${
                      isItemSelected ? "bg-stone-900" : "hover:bg-stone-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedItem(item.id)}
                      className={`flex flex-1 items-center justify-between px-3 py-2 text-left text-sm ${
                        isItemSelected ? "font-semibold text-white" : "text-stone-600"
                      } ${isHidden ? "opacity-40" : ""}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-1 w-1 rounded-full ${
                          isItemSelected ? "bg-brand" : "bg-stone-300"
                        }`} />
                        <span>{item.name}</span>
                        {cart[item.id] > 0 && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                              isItemSelected
                                ? "bg-white/20 text-white"
                                : "bg-brand/15 text-brand"
                            }`}
                          >
                            {cart[item.id]}
                          </span>
                        )}
                      </div>
                      <span className={`text-xs ${
                        isItemSelected ? "text-stone-300" : "text-stone-400"
                      }`}>
                        {item.price.toFixed(2)}&nbsp;&euro;
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleHideItem(item.id)}
                      className={`mr-1.5 flex h-6 w-6 shrink-0 items-center justify-center rounded transition-colors ${
                        isItemSelected
                          ? "text-stone-300 hover:text-white"
                          : "text-stone-400 hover:text-stone-700"
                      }`}
                      aria-label={isHidden ? `Afficher ${item.name}` : `Cacher ${item.name}`}
                    >
                      <EyeIcon hidden={isHidden} />
                    </button>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
