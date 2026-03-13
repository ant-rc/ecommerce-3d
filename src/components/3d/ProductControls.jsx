import { useRef, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import useProductStore from "../../store/useProductStore";

const OVERVIEW_POSITION = new THREE.Vector3(30, 22, 30);
const OVERVIEW_TARGET = new THREE.Vector3(0, 0, 0);

function findClearCameraPosition(center, dist, scene) {
  const raycaster = new THREE.Raycaster();
  const candidates = [
    new THREE.Vector3(dist * 0.5, dist * 0.8, dist * 0.5),
    new THREE.Vector3(-dist * 0.5, dist * 0.8, dist * 0.5),
    new THREE.Vector3(dist * 0.5, dist * 0.8, -dist * 0.5),
    new THREE.Vector3(-dist * 0.5, dist * 0.8, -dist * 0.5),
    new THREE.Vector3(0, dist * 1.0, dist * 0.4),
    new THREE.Vector3(dist * 0.7, dist * 0.6, 0),
  ];

  let bestPos = candidates[0];
  let fewestHits = Infinity;

  const selectedItem = useProductStore.getState().selectedItem;

  for (const offset of candidates) {
    const pos = center.clone().add(offset);
    const direction = new THREE.Vector3().subVectors(center, pos).normalize();
    const distance = pos.distanceTo(center);

    raycaster.set(pos, direction);
    raycaster.far = distance;
    const hits = raycaster.intersectObject(scene, true);

    const obstructions = hits.filter((h) => {
      if (!h.object.visible) return false;
      let current = h.object;
      while (current) {
        if (current.name === selectedItem) return false;
        if (current.name === "pergola_root") return false;
        current = current.parent;
      }
      return true;
    });

    if (obstructions.length < fewestHits) {
      fewestHits = obstructions.length;
      bestPos = pos;
    }

    if (fewestHits === 0) break;
  }

  return bestPos;
}

export default function ProductControls() {
  const controlsRef = useRef();
  const camera = useThree((s) => s.camera);
  const scene = useThree((s) => s.scene);
  const zoomTarget = useProductStore((s) => s.zoomTarget);
  const selectedItem = useProductStore((s) => s.selectedItem);

  const goalPos = useRef(OVERVIEW_POSITION.clone());
  const goalLookAt = useRef(OVERVIEW_TARGET.clone());
  const animating = useRef(false);

  useEffect(() => {
    if (!zoomTarget) {
      goalPos.current.copy(OVERVIEW_POSITION);
      goalLookAt.current.copy(OVERVIEW_TARGET);
      animating.current = true;
    } else {
      const center = new THREE.Vector3(...zoomTarget.center);
      const dist = Math.max(zoomTarget.distance, 4);

      const bestPos = findClearCameraPosition(center, dist, scene);
      goalPos.current.copy(bestPos);
      goalLookAt.current.copy(center);
      animating.current = true;
    }
  }, [zoomTarget, selectedItem, scene]);

  useFrame(() => {
    if (!animating.current || !controlsRef.current) return;

    camera.position.lerp(goalPos.current, 0.05);
    controlsRef.current.target.lerp(goalLookAt.current, 0.05);
    controlsRef.current.update();

    if (camera.position.distanceTo(goalPos.current) < 0.1) {
      animating.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      minDistance={2}
      maxDistance={200}
      minPolarAngle={Math.PI / 8}
      maxPolarAngle={Math.PI / 2.2}
      target={[0, 0, 0]}
    />
  );
}
