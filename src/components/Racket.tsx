import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { Suspense, forwardRef } from "react";
import useRacket from "../hooks/useRacket";

interface RacketProps extends RigidBodyProps {
  children?: React.ReactNode;
}

const Racket = forwardRef<RapierRigidBody, RacketProps>(
  ({ children, ...props }, ref) => {
    const { racketHitBall } = useRacket();

    return (
      <RigidBody
        ref={ref}
        ccd
        canSleep={false}
        colliders={false}
        rotation={[Math.PI * 0.5, 0, Math.PI]}
        type="fixed"
        {...props}
      >
        <CuboidCollider
          name={props.name}
          onCollisionExit={racketHitBall}
          position={[0.05, 0, -0.2]}
          args={[2.2, 0.1, 2.2]}
        />
        <Suspense>{children}</Suspense>
      </RigidBody>
    );
  }
);

export default Racket;
