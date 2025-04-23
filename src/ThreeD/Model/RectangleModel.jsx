import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";

export function RectangleModel(props) {
  const { nodes, materials } = useGLTF("/rectangle3.glb");
  return (
    <group {...props} dispose={null}>
      {props.numberOfLayers >= 1 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.rectangle1.geometry}
          material={materials["Material.002"]}
        >
          <meshBasicMaterial color={props.customColors.layer1 || "#ff0000"} />
        </mesh>
      )}
      {props.numberOfLayers >= 2 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.rectangle2.geometry}
          material={materials["Material.003"]}
          position={[-0.069, 0.723, 0]}
          scale={0.724}
        >
          <meshBasicMaterial color={props.customColors.layer2 || "#00ff00"} />
        </mesh>
      )}
      {props.numberOfLayers >= 3 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.rectangle3.geometry}
          material={materials["Material.001"]}
          position={[-0.156, 1.236, 0.016]}
          scale={[0.518, 0.591, 0.518]}
        >
          <meshBasicMaterial color={props.customColors.layer3 || "#0000ff"} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload("/rectangle3.glb");

export default RectangleModel;
