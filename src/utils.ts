type Vector3 = { x: number; y: number; z: number };

export const interpolatePosition = (
  current: Vector3,
  target: Vector3,
  factor = 0.1
) => {
  return {
    x: current.x + (target.x - current.x) * factor,
    y: current.y + (target.y - current.y) * factor,
    z: current.z + (target.z - current.z) * factor,
  };
};
