import { useEffect, useRef } from "react";
import { extend } from "@react-three/fiber";
import { Text } from "troika-three-text";

extend({ Text });

const CakeText = ({ font, text, color, position, fontSize }) => {
  const textRef = useRef();

  useEffect(() => {
    if (textRef.current) {
      const textMesh = textRef.current;

      // Update text properties
      textMesh.font = "/GreatVibes-Regular.ttf";
      textMesh.text = text;
      textMesh.fontSize = fontSize;
      textMesh.color = color;

      // Apply rotation
      textMesh.rotation.x = Math.PI / -2;

      // Sync to apply changes
      textMesh.sync();
    }
  }, [font, text, color, fontSize]);

  return (
    <primitive
      object={textRef.current || new Text()}
      ref={textRef}
      position={position}
    />
  );
};

export default CakeText;
