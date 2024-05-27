import { Text } from "@react-three/drei";

export default function Neons() {
  const zArcsPositions = [-100, -140, -180, -220];
  const xCeilingPositions = [-40, -20, 0, 20, 40];
  const xFloorPositions = [-100, -60, -10, 0, 10, 60, 100];

  return (
    <>
      {zArcsPositions.map((zPosition) => (
        <NeonArc key={zPosition} zPosition={zPosition} />
      ))}

      {xCeilingPositions.map((xPosition) => (
        <NeonCeiling key={xPosition} xPosition={xPosition} />
      ))}

      {xFloorPositions.map((xPosition) => (
        <FloorArc key={xPosition} xPosition={xPosition} />
      ))}
    </>
  );
}

function FloorArc({ xPosition = 0 }) {
  const isCenter = xPosition > -20 && xPosition < 20;
  const isOuter = Math.abs(xPosition) === 100;

  return (
    <Text
      position={[xPosition - 4, -30, isCenter ? -150 : -40]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
      outlineColor={isOuter ? "blue" : "red"}
      outlineWidth={0.1}
      outlineBlur={0.6}
      scale={isOuter ? 20 : 10}
      fillOpacity={0.5}
      letterSpacing={-0.0001}
      font="./sans-serif.woff"
    >
      _________________________
    </Text>
  );
}

function NeonArc({ zPosition = 0 }) {
  return (
    <>
      <Text
        position={[-60, -4, zPosition]}
        rotation={[0, 0, Math.PI / 2]}
        outlineColor="blue"
        outlineWidth={0.2}
        outlineBlur={0.5}
        scale={10}
        fillOpacity={0.5}
        letterSpacing={-0.0001}
        font="./sans-serif.woff"
      >
        __________
      </Text>
      <Text
        position={[50, 0, zPosition]}
        rotation={[0, 0, Math.PI / 2]}
        outlineColor="blue"
        outlineWidth={0.2}
        outlineBlur={0.5}
        scale={10}
        fillOpacity={0.5}
        letterSpacing={-0.0001}
        font="./sans-serif.woff"
      >
        __________
      </Text>
    </>
  );
}

function NeonCeiling({ xPosition = 0 }) {
  return (
    <Text
      position={[xPosition, 30, -150]}
      rotation={[Math.PI / 2, 0, Math.PI / 2]}
      outlineColor="blue"
      outlineWidth={0.2}
      outlineBlur={0.5}
      scale={10}
      fillOpacity={0.5}
      letterSpacing={-0.0001}
      font="./sans-serif.woff"
    >
      ____________________
    </Text>
  );
}
