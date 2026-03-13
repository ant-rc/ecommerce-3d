import useProductStore from "../../store/useProductStore";

export default function TexturePicker() {
  const texturePresets = useProductStore((s) => s.texturePresets);
  const selectedTexture = useProductStore((s) => s.selectedTexture);
  const setSelectedTexture = useProductStore((s) => s.setSelectedTexture);
  const setApplyToAll = useProductStore((s) => s.setApplyToAll);
  const applyToAll = useProductStore((s) => s.applyToAll);
  const selectedItem = useProductStore((s) => s.selectedItem);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-400">
          Couleur / Texture
        </h3>
        <button
          type="button"
          onClick={() => {
            if (selectedTexture) {
              setApplyToAll(selectedTexture);
            }
          }}
          className={`rounded-md px-2.5 py-1 text-[11px] font-medium transition-all ${
            applyToAll
              ? "bg-brand text-white"
              : "bg-panel text-stone-500 hover:bg-stone-200 hover:text-stone-700"
          }`}
          title="Appliquer la couleur au mobilier (hors plantes, luminaires, coussins, verre, tapis)"
        >
          Appliquer a tout
        </button>
      </div>
      <div className="flex flex-wrap gap-3">
        {texturePresets.map((preset) => (
          <button
            key={preset.color}
            type="button"
            onClick={() => {
              if (applyToAll) {
                setApplyToAll(preset.color);
              } else {
                setSelectedTexture(preset.color);
              }
            }}
            className={`flex flex-col items-center gap-1.5 rounded-lg px-3 py-2 transition-all ${
              selectedTexture === preset.color
                ? "bg-brand/10 ring-2 ring-brand"
                : "hover:bg-panel"
            }`}
            aria-label={`Couleur ${preset.name}`}
          >
            <span
              className="block h-8 w-8 rounded-full border border-stone-200 shadow-sm"
              style={{ backgroundColor: preset.color }}
            />
            <span className="text-[11px] font-medium text-stone-500">
              {preset.name}
            </span>
          </button>
        ))}
      </div>
      {applyToAll && (
        <p className="text-[11px] text-stone-400">
          Couleur appliquee a tout le mobilier (hors plantes, luminaires, coussins, assises, verre, tapis)
        </p>
      )}
    </div>
  );
}
