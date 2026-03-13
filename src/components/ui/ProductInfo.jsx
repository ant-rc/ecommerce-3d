import useProductStore from "../../store/useProductStore";
import ItemSelector from "./ItemSelector";
import TexturePicker from "./TexturePicker";
import StarRating from "./StarRating";

export default function ProductInfo() {
  const {
    name,
    totalPrice,
    oldPrice,
    rating,
    reviewCount,
    items,
    groups,
    selectedItem,
    selectedGroup,
    noColorItems,
    cart,
    addToCart,
    removeFromCart,
    getCartTotal,
    getCartCount,
  } = useProductStore();

  const selected = items.find((i) => i.id === selectedItem);
  const discount = Math.round(((oldPrice - totalPrice) / oldPrice) * 100);
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();

  const activeGroup = selectedGroup ? groups[selectedGroup] : null;
  const groupItems = selectedGroup
    ? items.filter((i) => i.group === selectedGroup)
    : [];

  // Show texture picker unless a no-texture item is individually selected
  const showTexturePicker =
    selectedItem === "all" ||
    selectedGroup !== null ||
    !noColorItems.includes(selectedItem);

  return (
    <div className="flex flex-col gap-8 overflow-y-auto border-l border-stone-200 bg-white px-6 py-8 lg:px-10">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone-400">
        <span className="cursor-pointer hover:text-stone-600">Accueil</span>
        <span className="mx-2">/</span>
        <span className="cursor-pointer hover:text-stone-600">Jardin</span>
        <span className="mx-2">/</span>
        <span className="cursor-pointer hover:text-stone-600">Patios</span>
        <span className="mx-2">/</span>
        <span className="text-stone-700">{name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-bold tracking-tight text-stone-900 lg:text-4xl">
          {name}
        </h1>
        <p className="text-sm leading-relaxed text-stone-500">
          Ensemble patio premium en bois d&apos;ebene avec mobilier, eclairage
          integre et plantes decoratives. Un espace de vie exterieur complet.
        </p>
        <div className="mt-1 flex items-center gap-3">
          <StarRating value={rating} />
          <span className="text-sm text-stone-400">
            {rating}/5 ({reviewCount} avis)
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-stone-900">
          {totalPrice.toFixed(2)}&nbsp;&euro;
        </span>
        <span className="text-lg text-stone-400 line-through">
          {oldPrice.toFixed(2)}&nbsp;&euro;
        </span>
        <span className="rounded-full bg-red-50 px-3 py-0.5 text-xs font-semibold text-red-600">
          -{discount}%
        </span>
      </div>

      {/* Selected group info */}
      {activeGroup && !selected && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800">
              {activeGroup.name}
            </span>
            <span className="text-sm font-bold text-brand">
              {groupItems.reduce((s, i) => s + i.price, 0).toFixed(2)}&nbsp;&euro;
            </span>
          </div>
          <p className="mt-1 text-xs text-stone-400">
            {groupItems.length} element{groupItems.length > 1 ? "s" : ""}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => groupItems.forEach((i) => addToCart(i.id))}
              className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.97]"
            >
              Ajouter le groupe au panier
            </button>
          </div>
        </div>
      )}

      {/* Selected item info + add to cart */}
      {selected && (
        <div className="rounded-xl border border-brand/30 bg-brand/5 px-5 py-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-stone-800">
              {selected.name}
            </span>
            <span className="text-sm font-bold text-brand">
              {selected.price.toFixed(2)}&nbsp;&euro;
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => addToCart(selected.id)}
              className="rounded-lg bg-stone-900 px-4 py-2 text-xs font-semibold text-white transition-all hover:bg-stone-800 active:scale-[0.97]"
            >
              Ajouter au panier
            </button>
            {cart[selected.id] > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => removeFromCart(selected.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-sm text-stone-500 transition-colors hover:bg-stone-100"
                  aria-label="Retirer du panier"
                >
                  &minus;
                </button>
                <span className="text-sm font-medium text-stone-700">
                  {cart[selected.id]}
                </span>
                <button
                  type="button"
                  onClick={() => addToCart(selected.id)}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-stone-200 text-sm text-stone-500 transition-colors hover:bg-stone-100"
                  aria-label="Ajouter au panier"
                >
                  +
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Item selector */}
      <ItemSelector />

      {/* Texture picker */}
      {showTexturePicker && <TexturePicker />}

      <hr className="border-stone-100" />

      {/* Cart summary */}
      {cartCount > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
            Panier ({cartCount} article{cartCount > 1 ? "s" : ""})
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(cart).map(([itemId, qty]) => {
              const item = items.find((i) => i.id === itemId);
              if (!item) return null;
              return (
                <div
                  key={itemId}
                  className="flex items-center justify-between rounded-lg bg-panel px-4 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-stone-700">{item.name}</span>
                    <span className="text-xs text-stone-400">x{qty}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-stone-700">
                      {(item.price * qty).toFixed(2)}&nbsp;&euro;
                    </span>
                    <button
                      type="button"
                      onClick={() => removeFromCart(itemId)}
                      className="text-xs text-stone-400 transition-colors hover:text-red-500"
                      aria-label={`Retirer ${item.name}`}
                    >
                      &times;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between border-t border-stone-100 pt-3">
            <span className="text-sm font-semibold text-stone-700">Total</span>
            <span className="text-lg font-bold text-stone-900">
              {cartTotal.toFixed(2)}&nbsp;&euro;
            </span>
          </div>
          <button
            type="button"
            className="w-full rounded-xl bg-stone-900 px-6 py-4 text-sm font-semibold tracking-wide text-white transition-all hover:bg-stone-800 active:scale-[0.98]"
          >
            COMMANDER &mdash; {cartTotal.toFixed(2)}&nbsp;&euro;
          </button>
        </div>
      )}

      {cartCount === 0 && (
        <p className="text-center text-sm text-stone-400">
          Selectionnez un element et ajoutez-le au panier
        </p>
      )}

      <p className="flex items-center gap-2 text-xs text-emerald-600">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
        En stock &mdash; Livraison offerte sous 5-7 jours
      </p>

      <hr className="border-stone-100" />

      {/* Features */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Caracteristiques
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            ["Bois", "Ebene certifie FSC"],
            ["Garantie", "5 ans"],
            ["Resistance", "UV & humidite"],
            ["Montage", "Notice incluse"],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-panel px-4 py-3">
              <p className="text-[11px] font-medium uppercase text-stone-400">
                {label}
              </p>
              <p className="text-sm font-medium text-stone-700">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
