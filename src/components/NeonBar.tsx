import { Bloom, EffectComposer } from "@react-three/postprocessing";

export default function NeonBar() {
  return (
    <EffectComposer>
      <Bloom luminanceThreshold={0.2} luminanceSmoothing={2} intensity={1} />
    </EffectComposer>
  );
}
