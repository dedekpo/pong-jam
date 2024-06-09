import { RapierRigidBody } from "@react-three/rapier";
import React, { createContext, useContext, useRef, RefObject } from "react";
import * as THREE from "three";

interface BallContextProps {
  ballApi: RefObject<RapierRigidBody> | null;
  racketApi: RefObject<RapierRigidBody> | null;
  racketMesh: RefObject<THREE.Group> | null;
  opponentApi: RefObject<RapierRigidBody> | null;
  opponentMesh: RefObject<THREE.Group> | null;
  playerIsHandlingBall: React.MutableRefObject<boolean>;
}

const RefsContext = createContext<BallContextProps>({
  ballApi: null,
  racketApi: null,
  racketMesh: null,
  opponentApi: null,
  opponentMesh: null,
  playerIsHandlingBall: { current: false },
});

export const RefsProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const ballApi = useRef<RapierRigidBody>(null);
  const racketApi = useRef<RapierRigidBody>(null);
  const racketMesh = useRef<THREE.Group>(null);
  const opponentApi = useRef<RapierRigidBody>(null);
  const opponentMesh = useRef<THREE.Group>(null);
  const playerIsHandlingBall = useRef<boolean>(false);

  const value = {
    ballApi,
    racketApi,
    racketMesh,
    opponentApi,
    opponentMesh,
    playerIsHandlingBall,
  };

  return <RefsContext.Provider value={value}>{children}</RefsContext.Provider>;
};

export const useRefs = () => {
  const context = useContext(RefsContext);

  if (!context) {
    throw new Error("useRefs must be used within a RefsProvider");
  }

  return context;
};
