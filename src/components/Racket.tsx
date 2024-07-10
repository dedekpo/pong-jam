import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { Suspense, forwardRef, useRef } from "react";
import useRacket from "../hooks/useRacket";
import { useGameStore } from "../stores/game-store";
import { useFrame } from "@react-three/fiber";
import { useOnlineStore } from "../stores/online-store";

interface RacketProps extends RigidBodyProps {
  children?: React.ReactNode;
}

const Racket = forwardRef<RapierRigidBody, RacketProps>(
  ({ children, ...props }, ref) => {
    const { racketHitBall } = useRacket();
    const { touchedLastBy } = useGameStore((state) => state);
    const { room } = useOnlineStore((state) => state);
    const racketHitDelay = useRef(false);

    // Ensure ref is treated as a RefObject<RapierRigidBody> by TypeScript
    const rigidBodyRef = ref as React.MutableRefObject<RapierRigidBody | null>;

    useFrame(() => {
      if (!touchedLastBy && rigidBodyRef.current && !room) {
        const playerModifier = props.name === "player-racket" ? 1 : -1;
        rigidBodyRef.current.setTranslation(
          { x: 0, y: 4, z: 30 * playerModifier },
          true
        );
      }
    });

    return (
      <RigidBody
        ref={rigidBodyRef}
        ccd
        canSleep={false}
        colliders={false}
        rotation={[Math.PI * 0.5, 0, Math.PI]}
        type="kinematicPosition"
        {...props}
      >
        <CuboidCollider
          name={props.name}
          onContactForce={({ totalForceMagnitude, target }) => {
            if (totalForceMagnitude < 10 || racketHitDelay.current) return;
            const isPlayer = target.colliderObject?.name === "player-racket";

            racketHitBall(isPlayer);
            racketHitDelay.current = true;
            setTimeout(() => {
              racketHitDelay.current = false;
            }, 500);
          }}
          position={[0.05, 0, -0.2]}
          args={[2.2, 0.3, 2.2]}
        />
        <Suspense>{children}</Suspense>
      </RigidBody>
    );
  }
);

export default Racket;
