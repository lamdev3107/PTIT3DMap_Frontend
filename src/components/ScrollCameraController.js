import { useEffect, useRef } from "react";
import { getProject, val } from "@theatre/core";

export default function ScrollSequenceController({ sequence }) {
  const scrollSpeed = 0.005;
  const damping = 0.1; // 0.1 là mượt vừa phải
  const currentRef = useRef(sequence.position); // vị trí hiện tại
  const targetRef = useRef(currentRef.current); // vị trí mục tiêu

  // Cuộn chuột → cập nhật targetRef
  useEffect(() => {
    const handleWheel = (e) => {
      const direction = e.deltaY > 0 ? 1 : -1;
      const sequenceLength = 18;
      let next = targetRef.current + direction * scrollSpeed * sequenceLength;

      // loop
      if (next > length) next = 0;
      if (next < 0) next = sequenceLength;

      targetRef.current = next;
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [scrollSpeed, sequence]);

  // Animation loop
  useEffect(() => {
    let frameId;

    const animate = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const next = current + (target - current) * damping;

      currentRef.current = next;
      sequence.position = next;

      frameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(frameId);
  }, [damping, sequence]);

  return null;
}
