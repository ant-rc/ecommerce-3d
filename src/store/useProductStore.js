import { create } from "zustand";

const ITEMS = [
  { id: "pergola_root", name: "Pergola", price: 899, category: "jardin", group: "structure" },
  { id: "table_root", name: "Table exterieur", price: 249, category: "jardin", group: "coin-repas" },
  { id: "chaise_ext_01_root", name: "Chaise Riviera gauche", price: 119, category: "jardin", group: "coin-repas" },
  { id: "chaise_ext_02_root", name: "Chaise Riviera droite", price: 119, category: "jardin", group: "coin-repas" },
  { id: "chaise_ext_03_root", name: "Chaise Riviera face A", price: 119, category: "jardin", group: "coin-repas" },
  { id: "chaise_ext_04_root", name: "Chaise Riviera face B", price: 119, category: "jardin", group: "coin-repas" },
  { id: "canape_ext_root", name: "Canape exterieur", price: 549, category: "jardin", group: "salon" },
  { id: "tapis_ext_root", name: "Tapis exterieur", price: 129, category: "jardin", group: "salon" },
  { id: "lustre_root", name: "Lustre suspendu", price: 129, category: "luminaires", group: "eclairage" },
  { id: "guirlande_ext_01_root", name: "Guirlande gauche", price: 35, category: "luminaires", group: "eclairage" },
  { id: "guirlande_ext_02_root", name: "Guirlande droite", price: 35, category: "luminaires", group: "eclairage" },
  { id: "majestic_plant_root", name: "Palmier royal", price: 45, category: "plantes", group: "plantes-sol" },
  { id: "plant_suspendue_root", name: "Fougere suspendue", price: 32, category: "plantes", group: "plantes-suspendues" },
  { id: "plant_terrase_root", name: "Olivier de terrasse", price: 28, category: "plantes", group: "plantes-sol" },
  { id: "plant_table_01_root", name: "Succulent Jade", price: 22, category: "plantes", group: "plantes-table" },
  { id: "plant_table_02_root", name: "Succulent Aloe", price: 22, category: "plantes", group: "plantes-table" },
  { id: "plant_pot_root", name: "Cactus en pot", price: 18, category: "plantes", group: "plantes-sol" },
  { id: "ivy_plant_root", name: "Lierre grimpant", price: 15, category: "plantes", group: "plantes-suspendues" },
];

const GROUPS = {
  structure: { name: "Structure", icon: "home" },
  "coin-repas": { name: "Coin repas", icon: "utensils" },
  salon: { name: "Espace salon", icon: "sofa" },
  eclairage: { name: "Eclairage", icon: "lamp" },
  "plantes-sol": { name: "Plantes au sol", icon: "tree" },
  "plantes-suspendues": { name: "Plantes suspendues", icon: "leaf" },
  "plantes-table": { name: "Plantes de table", icon: "flower" },
};

const CATEGORIES = {
  jardin: "Jardin",
  luminaires: "Luminaires",
  plantes: "Plantes",
};

const TEXTURE_PRESETS = [
  { name: "Ebene", color: "#2C1810" },
  { name: "Chene", color: "#C4A46C" },
  { name: "Noyer", color: "#5C3A1E" },
  { name: "Blanc", color: "#F5F0E8" },
  { name: "Anthracite", color: "#3C3C3C" },
];

const NO_COLOR_ITEMS = [
  "majestic_plant_root",
  "plant_suspendue_root",
  "plant_terrase_root",
  "plant_table_01_root",
  "plant_table_02_root",
  "plant_pot_root",
  "ivy_plant_root",
  "guirlande_ext_01_root",
  "guirlande_ext_02_root",
  "lustre_root",
  "tapis_ext_root",
];

const COLOR_BLOCKED_MESH_PATTERNS = [
  "coussin", "cushion", "fabric", "tissu", "textile",
  "assise", "seat", "pad",
  "verre", "glass", "vitre",
];

const useProductStore = create((set, get) => ({
  name: "Patio Ebony Collection",
  totalPrice: 2499.0,
  oldPrice: 3199.0,
  rating: 4.6,
  reviewCount: 128,
  items: ITEMS,
  groups: GROUPS,
  categories: CATEGORIES,
  texturePresets: TEXTURE_PRESETS,
  noColorItems: NO_COLOR_ITEMS,
  colorBlockedMeshPatterns: COLOR_BLOCKED_MESH_PATTERNS,
  selectedItem: "all",
  selectedGroup: null,
  selectedTexture: null,
  applyToAll: false,
  zoomTarget: null,
  activeCategory: null,
  hiddenItems: [],
  page: "landing",

  cart: {},

  setPage: (page) => set({ page }),
  setSelectedItem: (id) =>
    set({ selectedItem: id, selectedGroup: null, selectedTexture: null, applyToAll: false }),
  setSelectedGroup: (groupId) => {
    if (groupId === null) {
      set({ selectedGroup: null, selectedItem: "all", selectedTexture: null, applyToAll: false });
    } else {
      set({ selectedGroup: groupId, selectedItem: "all", selectedTexture: null, applyToAll: false });
    }
  },
  setZoomTarget: (target) => set({ zoomTarget: target }),
  setSelectedTexture: (color) => set({ selectedTexture: color, applyToAll: false }),
  setApplyToAll: (color) => set({ selectedTexture: color, applyToAll: true }),
  setActiveCategory: (cat) => {
    const state = get();
    if (state.activeCategory === cat) {
      set({ activeCategory: null, selectedItem: "all", selectedGroup: null });
    } else {
      set({ activeCategory: cat, selectedItem: "all", selectedGroup: null });
    }
  },
  toggleHideItem: (id) =>
    set((state) => {
      const hidden = state.hiddenItems.includes(id)
        ? state.hiddenItems.filter((h) => h !== id)
        : [...state.hiddenItems, id];
      return { hiddenItems: hidden };
    }),
  toggleHideGroup: (groupId) =>
    set((state) => {
      const groupItems = state.items
        .filter((i) => i.group === groupId)
        .map((i) => i.id);
      const allHidden = groupItems.every((id) => state.hiddenItems.includes(id));
      if (allHidden) {
        return { hiddenItems: state.hiddenItems.filter((h) => !groupItems.includes(h)) };
      }
      const newHidden = [...new Set([...state.hiddenItems, ...groupItems])];
      return { hiddenItems: newHidden };
    }),
  addToCart: (itemId) =>
    set((state) => {
      const current = state.cart[itemId] || 0;
      return { cart: { ...state.cart, [itemId]: current + 1 } };
    }),
  removeFromCart: (itemId) =>
    set((state) => {
      const current = state.cart[itemId] || 0;
      if (current <= 1) {
        const { [itemId]: _, ...rest } = state.cart;
        return { cart: rest };
      }
      return { cart: { ...state.cart, [itemId]: current - 1 } };
    }),
  getCartTotal: () => {
    const { cart, items } = get();
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = items.find((i) => i.id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0);
  },
  getCartCount: () => {
    const { cart } = get();
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  },
  getGroupItemIds: (groupId) => {
    const { items } = get();
    return items.filter((i) => i.group === groupId).map((i) => i.id);
  },
  getGroupPrice: (groupId) => {
    const { items } = get();
    return items.filter((i) => i.group === groupId).reduce((sum, i) => sum + i.price, 0);
  },
}));

export default useProductStore;
