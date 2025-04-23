import React, { useState } from "react";
import { useGLTF } from "@react-three/drei";
import { SquareModel } from "./SquareModel";
import { HeartModel } from "./HeartModel";
import { RectangleModel } from "./RectangleModel";

export function ModelOne(props) {
  const { nodes } = useGLTF("circleupgraded3.glb");
  const [hovered, setHover] = useState(false);

  const layerHeight = 0.9; // Adjust based on the actual height of each layer
  const baseScale = [0.902, 0.257, 0.902]; // Scale for the first layer

  const renderShape = () => {
    switch (props.shape) {
      case "square":
        return (
          <SquareModel
            customColors={props.customColors}
            numberOfLayers={props.numberOfLayers}
            castShadow
            receiveShadow
            scale={[4, 4, 4]}
          />
        );
      case "heart":
        return (
          <HeartModel
            customColors={props.customColors}
            numberOfLayers={props.numberOfLayers}
            castShadow
            receiveShadow
            scale={[4, 4, 4]}
          />
        );
      case "rectangle":
        return (
          <RectangleModel
            customColors={props.customColors}
            numberOfLayers={props.numberOfLayers}
            castShadow
            receiveShadow
            scale={[4, 4, 4]}
          />
        );

      default:
        return (
          <group
            dispose={null}
            onPointerOver={() => setHover(true)}
            onPointerOut={() => setHover(false)}
            scale={[6, 6, 6]}
          >
            {/* Layer 1 */}
            {props.numberOfLayers >= 1 && (
              <mesh
                castShadow
                receiveShadow
                geometry={nodes?.Cylinder?.geometry}
                scale={[0.902, 0.374, 0.902]}
              >
                <meshBasicMaterial
                  color={props.customColors.layer1 || "#ff0000"}
                />
              </mesh>
            )}
            {/* Layer 2 */}
            {props.numberOfLayers >= 2 && (
              <mesh
                castShadow
                receiveShadow
                geometry={nodes?.Cylinder001?.geometry}
                position={[0, 0.668, 0]}
                scale={[0.706, 0.321, 0.706]}
              >
                <meshBasicMaterial
                  color={props.customColors.layer2 || "#00ff00"}
                />
              </mesh>
            )}
            {/* Layer 3 */}
            {props.numberOfLayers >= 3 && (
              <mesh
                castShadow
                receiveShadow
                geometry={nodes?.Cylinder002?.geometry}
                position={[0, 1.234, 0]}
                scale={[0.498, 0.257, 0.498]}
              >
                <meshBasicMaterial
                  color={props.customColors.layer3 || "#0000ff"}
                />
              </mesh>
            )}
          </group>
        );
    }
  };

  return <>{renderShape()}</>;
}

export default ModelOne;
