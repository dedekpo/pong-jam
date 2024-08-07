/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { GLTF, SkeletonUtils } from "three-stdlib";
import { forwardRef, useMemo } from "react";
import { useGraph } from "@react-three/fiber";

type GLTFResult = GLTF & {
  nodes: {
    arm: THREE.SkinnedMesh;
    mesh: THREE.Mesh;
    mesh_1: THREE.Mesh;
    mesh_2: THREE.Mesh;
    mesh_3: THREE.Mesh;
    mesh_4: THREE.Mesh;
    Bone: THREE.Bone;
    Bone003: THREE.Bone;
    Bone006: THREE.Bone;
    Bone010: THREE.Bone;
  };
  materials: {
    glove: THREE.MeshStandardMaterial;
    wood: THREE.MeshStandardMaterial;
    side: THREE.MeshStandardMaterial;
    foam: THREE.MeshStandardMaterial;
    lower: THREE.MeshStandardMaterial;
    upper: THREE.MeshStandardMaterial;
  };
};

const url = "./assets/pingpong.glb";

interface RacketMeshProps extends Omit<JSX.IntrinsicElements["group"], "ref"> {
  color: string;
}

const RacketMesh = forwardRef<THREE.Group, RacketMeshProps>(
  ({ color, ...props }, ref) => {
    const { scene, materials } = useGLTF(url) as GLTFResult;

    // Skinned meshes cannot be re-used in threejs without cloning them
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    // useGraph creates two flat object collections for nodes and materials
    const { nodes } = useGraph(clone) as any;

    return (
      <group ref={ref} {...props} dispose={null}>
        <group rotation={[1.877, -0.345, 2.323]} scale={2.968}>
          <skinnedMesh
            geometry={nodes.arm.geometry}
            material={materials.glove}
            skeleton={nodes.arm.skeleton}
          />
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone003} />
          <primitive object={nodes.Bone006} />
          <primitive object={nodes.Bone010} />
        </group>
        <group
          position={[0.405, 0, -0.373]}
          rotation={[0, -0.038, 0]}
          scale={141.943}
        >
          <mesh geometry={nodes.mesh.geometry} material={materials.wood} />
          <mesh geometry={nodes.mesh_1.geometry} material={materials.side} />
          <mesh geometry={nodes.mesh_2.geometry} material={materials.foam} />
          <mesh
            geometry={nodes.mesh_3.geometry}
            material={
              new THREE.MeshStandardMaterial({
                color,
                metalness: 0,
                roughness: 1,
              })
            }
          />
          <mesh
            geometry={nodes.mesh_4.geometry}
            material={
              new THREE.MeshStandardMaterial({
                color,
                metalness: 0,
                roughness: 1,
              })
            }
          />
        </group>
      </group>
    );
  }
);

export default RacketMesh;

useGLTF.preload(url);
