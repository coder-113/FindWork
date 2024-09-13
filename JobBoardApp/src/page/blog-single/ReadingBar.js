import { motion, useScroll, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "./readingBar.css";
const Bar = styled.div`
  background: #89ba16 !important;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 10px;
  transform-origin: 0%;
`;

const ReadingBar = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
    
  });
  return <motion.div className="progress-bar" style={{ scaleX }} />;
};

export default ReadingBar;
