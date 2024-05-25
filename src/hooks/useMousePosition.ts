import { useEffect, useState } from "react";

export default function useMousePosition() {
  const [mousePosition, setMousePosition] = useState({
    xPercent: 0,
    yPercent: 0,
  });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      const xPercent = (ev.clientX / window.innerWidth) * 100;
      const yPercent = (ev.clientY / window.innerHeight) * 100;
      setMousePosition({ xPercent, yPercent });
    };

    window.addEventListener("mousemove", updateMousePosition);
    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
}
