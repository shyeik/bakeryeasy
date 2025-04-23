import React from "react";
import { useGLTF } from "@react-three/drei";

export function HeartModel(props) {
  const { nodes } = useGLTF("/heart3.glb");

  return (
    <group {...props} dispose={null}>
      {/* Layer 1 */}
      {props.numberOfLayers >= 1 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube.geometry}
          rotation={[1.558, 0.002, 2.337]}
          scale={[1, 1, 0.545]}
        >
          <meshBasicMaterial color={props.customColors.layer1 || "#ff0000"} />
        </mesh>
      )}

      {/* Layer 2 */}
      {props.numberOfLayers >= 2 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube001.geometry}
          position={[0.021, 0.916, 0.196]}
          rotation={[1.558, 0.002, 2.337]}
          scale={[0.759, 0.759, 0.414]}
        >
          <meshBasicMaterial color={props.customColors.layer2 || "#00ff00"} />
        </mesh>
      )}

      {/* Layer 3 */}
      {props.numberOfLayers >= 3 && (
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.Cube002.geometry}
          position={[0.021, 1.63, 0.196]}
          rotation={[1.558, 0.002, 2.337]}
          scale={[0.541, 0.541, 0.295]}
        >
          <meshBasicMaterial color={props.customColors.layer3 || "#0000ff"} />
        </mesh>
      )}
    </group>
  );
}

useGLTF.preload("/heart3.glb");

export default HeartModel;
