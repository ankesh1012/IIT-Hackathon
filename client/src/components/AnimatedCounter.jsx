import { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({ to, duration = 1500, suffix = "+" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef();

  useEffect(() => {
    let start = 0;
    const end = typeof to === "number" ? to : parseInt(to, 10);
    if (start === end) return;
    let current = start;
    const increment = end / (duration / 16); // approx 60fps
    function updateCounter() {
      current += increment;
      if (current >= end) {
        setCount(end);
      } else {
        setCount(Math.floor(current));
        ref.current = requestAnimationFrame(updateCounter);
      }
    }
    ref.current = requestAnimationFrame(updateCounter);
    return () => cancelAnimationFrame(ref.current);
  }, [to, duration]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
