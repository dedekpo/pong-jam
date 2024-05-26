import { useEffect, useState } from "react";

export default function useTouchPosition() {
  const [position, setPosition] = useState({
    xPercent: 0,
    yPercent: 0,
  });

  useEffect(() => {
    const updatePosition = (ev: MouseEvent | TouchEvent) => {
      let clientX = 0;
      let clientY = 0;

      if (ev instanceof MouseEvent) {
        clientX = ev.clientX;
        clientY = ev.clientY;
      } else if (ev.touches && ev.touches.length > 0) {
        clientX = ev.touches[0].clientX;
        clientY = ev.touches[0].clientY;
      }

      const xPercent = (clientX / window.innerWidth) * 100;
      const yPercent = (clientY / window.innerHeight) * 100;
      setPosition({ xPercent, yPercent });
    };

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("touchmove", updatePosition);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("touchmove", updatePosition);
    };
  }, []);

  return position;
}
