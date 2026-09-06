import React from 'react';
import { motion } from 'framer-motion';
import { BaseEdge, EdgeProps } from '@xyflow/react';

export function ThreadEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  data
}: EdgeProps) {
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  // A thread drooping down organically
  const cx1 = sourceX + dx * 0.25;
  const cy1 = sourceY + 40; 
  
  const cx2 = sourceX + dx * 0.75;
  const cy2 = targetY + 20; 

  // Cubic bezier for a droopy thread
  const pathData = `M ${sourceX} ${sourceY} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetX} ${targetY}`;

  return (
    <motion.path
      d={pathData}
      fill="none"
      stroke="#A23E33" // Madder
      strokeWidth={2}
      strokeLinecap="round"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        filter: "drop-shadow(0px 1px 2px rgba(162, 62, 51, 0.2))"
      }}
    />
  );
}
