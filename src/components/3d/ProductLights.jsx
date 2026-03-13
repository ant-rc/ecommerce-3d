export default function ProductLights() {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 12, 8]} intensity={1} />
      <directionalLight position={[-8, 10, -6]} intensity={0.4} />
    </>
  );
}
