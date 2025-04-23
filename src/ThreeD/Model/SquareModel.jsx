import React from "react";
import { useGLTF } from "@react-three/drei";

export function SquareModel(props) {
  const { nodes, materials } = useGLTF("/square3.glb");

  return (
    <group {...props} dispose={null}>
      {/* Layer 1 */}
      {props.numberOfLayers >= 1 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.square1.geometry}
          position={[0, -0.312, 0]}
        >
          <meshBasicMaterial color={props.customColors.layer1 || "#ff0000"} />
        </mesh>
      )}
      {/* Layer 2 */}
      {props.numberOfLayers >= 2 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.square2.geometry}
          position={[0, 0.562, 0]}
          scale={0.707} // Maintain square proportions
        >
          <meshBasicMaterial color={props.customColors.layer2 || "#00ff00"} />
        </mesh>
      )}
      {/* Layer 3 */}
      {props.numberOfLayers >= 3 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.square3.geometry}
          position={[0, 1.18, 0]}
          scale={0.508} // Adjust scale proportionally
        >
          <meshBasicMaterial color={props.customColors.layer3 || "#0000ff"} />
        </mesh>
      )}
    </group>
  );
}
