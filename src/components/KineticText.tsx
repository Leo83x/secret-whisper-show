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
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    blur: {
      hidden: { opacity: 0, filter: "blur(10px)" },
      visible: { opacity: 1, filter: "blur(0px)" },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    slide: {
      hidden: { opacity: 0, x: -30 },
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
      className={`inline-block ${className}`}
      variants={container}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {items.map((word, index) => (
        <motion.span key={index} variants={item} className="inline-block">
          {word}
          {splitBy === "words" && index < items.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default KineticText;
