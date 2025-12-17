import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface KineticTextProps {
  children: string;
  className?: string;
  delay?: number;
  splitBy?: "words" | "chars";
  variant?: "fade" | "blur" | "scale" | "slide";
}

const KineticText = ({
  children,
  className = "",
  delay = 0,
  splitBy = "words",
  variant = "fade",
}: KineticTextProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const items = splitBy === "words" ? children.split(" ") : children.split("");

  const variants = {
    fade: {
      hidden: { opacity: 0, y: 15 },
      visible: { opacity: 1, y: 0 },
    },
    blur: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    scale: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    slide: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delay,
        staggerChildren: splitBy === "chars" ? 0.02 : 0.08,
      },
    },
  };

  const item = {
    hidden: variants[variant].hidden,
    visible: {
      ...variants[variant].visible,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`inline ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      style={{ display: "inline" }}
    >
      {items.map((word, index) => (
        <motion.span 
          key={index} 
          variants={item} 
          style={{ display: "inline" }}
        >
          {word}
          {splitBy === "words" && index < items.length - 1 && " "}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default KineticText;
