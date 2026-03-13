import { useEffect, useMemo, useCallback, useRef } from "react";
import { useGLTF, Center } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useProductStore from "../../store/useProductStore";

function findRootAncestor(obj) {
  let current = obj;
  while (current) {
    if (current.name && current.name.endsWith("_root")) {
      return current.name;
    }
    current = current.parent;
  }
  return null;
}

function isMeshColorBlocked(mesh, patterns) {
  const name = (mesh.name || "").toLowerCase();
  return patterns.some((p) => name.includes(p));
}

export default function ProductModel() {
  const { scene } = useGLTF("/models/Projet_Patio.glb");
  const selectedItem = useProductStore((s) => s.selectedItem);
  const selectedGroup = useProductStore((s) => s.selectedGroup);
  const setSelectedItem = useProductStore((s) => s.setSelectedItem);
  const setZoomTarget = useProductStore((s) => s.setZoomTarget);
  const selectedTexture = useProductStore((s) => s.selectedTexture);
  const applyToAll = useProductStore((s) => s.applyToAll);
  const hiddenItems = useProductStore((s) => s.hiddenItems);
  const activeCategory = useProductStore((s) => s.activeCategory);
  const items = useProductStore((s) => s.items);
  const noColorItems = useProductStore((s) => s.noColorItems);
  const colorBlockedMeshPatterns = useProductStore((s) => s.colorBlockedMeshPatterns);
  const invalidate = useThree((s) => s.invalidate);
  const gl = useThree((s) => s.gl);

  const highlightTimer = useRef(null);
  const highlightFade = useRef(false);
  const highlightIntensity = useRef(0);
  const pergolaTargetOpacity = useRef(1);

  // Compute which item IDs are "active" (selected item or group items)
  const activeItemIds = useMemo(() => {
    if (selectedGroup) {
      return items.filter((i) => i.group === selectedGroup).map((i) => i.id);
    }
    if (selectedItem !== "all") {
      return [selectedItem];
    }
    return [];
  }, [selectedItem, selectedGroup, items]);

  useEffect(() => {
    const toRemove = [];
    scene.traverse((child) => {
      if (child.isLight) toRemove.push(child);
    });
    toRemove.forEach((l) => l.parent?.remove(l));
  }, [scene]);

  useEffect(() => {
    scene.traverse((child) => {
      if (!child.isMesh) return;
      if (Array.isArray(child.material)) {
        child.material = child.material.map((m) => m.clone());
      } else {
        child.material = child.material.clone();
      }
    });
  }, [scene]);

  const meshData = useMemo(() => {
    const data = [];
    scene.traverse((child) => {
      if (!child.isMesh) return;
      const rootName = findRootAncestor(child);
      data.push({ mesh: child, rootName });
    });
    return data;
  }, [scene]);

  // Visibility
  useEffect(() => {
    const categoryItems = activeCategory
      ? items.filter((i) => i.category === activeCategory).map((i) => i.id)
      : null;

    meshData.forEach(({ mesh, rootName }) => {
      const isHidden = hiddenItems.includes(rootName);
      const isCategoryFiltered = categoryItems && !categoryItems.includes(rootName);
      mesh.visible = !isHidden && !isCategoryFiltered;
    });
    invalidate();
  }, [hiddenItems, activeCategory, meshData, items, invalidate]);

  // Pergola transparency
  useEffect(() => {
    const hasActiveInside = activeItemIds.length > 0 &&
      !activeItemIds.includes("pergola_root");
    pergolaTargetOpacity.current = hasActiveInside ? 0.15 : 1;
  }, [activeItemIds]);

  useFrame(() => {
    meshData.forEach(({ mesh, rootName }) => {
      if (rootName !== "pergola_root") return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        const target = pergolaTargetOpacity.current;
        const current = mat.opacity;
        const diff = target - current;
        if (Math.abs(diff) < 0.01) {
          mat.opacity = target;
        } else {
          mat.opacity += diff * 0.08;
        }
        mat.transparent = mat.opacity < 1;
        mat.depthWrite = mat.opacity >= 0.99;
        mat.needsUpdate = true;
      });
    });
  });

  // Zoom target
  useEffect(() => {
    if (activeItemIds.length === 0) {
      if (activeCategory) {
        const categoryItems = items
          .filter((i) => i.category === activeCategory)
          .map((i) => i.id);
        const box = new THREE.Box3();
        meshData.forEach(({ mesh, rootName }) => {
          if (categoryItems.includes(rootName)) box.expandByObject(mesh);
        });
        if (!box.isEmpty()) {
          const center = new THREE.Vector3();
          box.getCenter(center);
          const size = new THREE.Vector3();
          box.getSize(size);
          const maxDim = Math.max(size.x, size.y, size.z);
          setZoomTarget({ center: center.toArray(), distance: maxDim * 1.6 });
        }
      } else {
        setZoomTarget(null);
      }
      return;
    }

    const box = new THREE.Box3();
    meshData.forEach(({ mesh, rootName }) => {
      if (activeItemIds.includes(rootName)) box.expandByObject(mesh);
    });
    if (!box.isEmpty()) {
      const center = new THREE.Vector3();
      box.getCenter(center);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      setZoomTarget({ center: center.toArray(), distance: maxDim * 1.4 });
    }
  }, [activeItemIds, activeCategory, meshData, items, setZoomTarget]);

  // Highlight
  useEffect(() => {
    if (highlightTimer.current) clearTimeout(highlightTimer.current);

    if (activeItemIds.length > 0) {
      highlightIntensity.current = 0.25;
      highlightFade.current = false;

      meshData.forEach(({ mesh, rootName }) => {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        const isActive = activeItemIds.includes(rootName);
        mats.forEach((mat) => {
          if (mat.emissive) {
            if (isActive) {
              mat.emissive.set("#E8A040");
              mat.emissiveIntensity = 0.25;
            } else {
              mat.emissive.set("#000000");
              mat.emissiveIntensity = 0;
            }
            mat.needsUpdate = true;
          }
        });
      });
      invalidate();

      highlightTimer.current = setTimeout(() => {
        highlightFade.current = true;
      }, 1500);
    } else {
      highlightIntensity.current = 0;
      highlightFade.current = false;
      meshData.forEach(({ mesh }) => {
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat.emissive) {
            mat.emissive.set("#000000");
            mat.emissiveIntensity = 0;
            mat.needsUpdate = true;
          }
        });
      });
      invalidate();
    }

    return () => {
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, [activeItemIds, meshData, invalidate]);

  useFrame(() => {
    if (!highlightFade.current || highlightIntensity.current <= 0) return;
    highlightIntensity.current = Math.max(highlightIntensity.current - 0.008, 0);
    const intensity = highlightIntensity.current;
    const store = useProductStore.getState();
    const currentActiveIds = store.selectedGroup
      ? store.items.filter((i) => i.group === store.selectedGroup).map((i) => i.id)
      : store.selectedItem !== "all" ? [store.selectedItem] : [];

    meshData.forEach(({ mesh, rootName }) => {
      if (!currentActiveIds.includes(rootName)) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      mats.forEach((mat) => {
        if (mat.emissive) {
          mat.emissiveIntensity = intensity;
          mat.needsUpdate = true;
        }
      });
    });
    if (intensity <= 0) highlightFade.current = false;
  });

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      const rootName = findRootAncestor(event.object);
      if (rootName) setSelectedItem(rootName);
    },
    [setSelectedItem]
  );

  const handlePointerOver = useCallback(() => {
    gl.domElement.style.cursor = "pointer";
  }, [gl]);
  const handlePointerOut = useCallback(() => {
    gl.domElement.style.cursor = "auto";
  }, [gl]);

  // Texture color
  useEffect(() => {
    if (!selectedTexture) return;
    const color = new THREE.Color(selectedTexture);

    if (applyToAll) {
      meshData.forEach(({ mesh, rootName }) => {
        if (noColorItems.includes(rootName)) return;
        if (isMeshColorBlocked(mesh, colorBlockedMeshPatterns)) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat.color) { mat.color.copy(color); mat.needsUpdate = true; }
        });
      });
    } else {
      // Apply to active items (single or group)
      const targetIds = activeItemIds.length > 0 ? activeItemIds : [];
      if (targetIds.length === 0) return;

      meshData.forEach(({ mesh, rootName }) => {
        if (!targetIds.includes(rootName)) return;
        if (noColorItems.includes(rootName)) return;
        if (isMeshColorBlocked(mesh, colorBlockedMeshPatterns)) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat.color) { mat.color.copy(color); mat.needsUpdate = true; }
        });
      });
    }
    invalidate();
  }, [selectedTexture, applyToAll, activeItemIds, meshData, noColorItems, colorBlockedMeshPatterns, invalidate]);

  return (
    <Center>
      <primitive
        object={scene}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </Center>
  );
}

useGLTF.preload("/models/Projet_Patio.glb");
