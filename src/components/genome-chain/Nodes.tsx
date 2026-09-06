import React from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';

// Base wrapper for the shared expand/shrink logic
function NodeWrapper({ isFocused, children }: { isFocused: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ 
        scale: isFocused ? 1.05 : 0.9, 
        opacity: isFocused ? 1 : 0.6 
      }}
      transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
      className="relative flex flex-col items-center"
    >
      {children}
    </motion.div>
  );
}

// 1. Motif Node (Jharokha carving)
export function MotifNode({ data }: NodeProps) {
  const isFocused = data.isFocused as boolean;
  
  return (
    <NodeWrapper isFocused={isFocused}>
      <div className="w-48 bg-[#171512] border-2 border-[#6B6355] rounded-t-full rounded-b-xl overflow-hidden shadow-xl p-2 flex flex-col items-center">
        <div className="w-full h-40 bg-[#22314F] rounded-t-full rounded-b-lg overflow-hidden mb-3">
          <img 
            src="https://images.unsplash.com/photo-1621217637841-3b7c80088828?w=400&q=80" 
            alt="Jharokha motif" 
            className="w-full h-full object-cover mix-blend-luminosity opacity-80"
          />
        </div>
        <h3 className="font-serif text-[#D9A404] text-lg mb-1">{data.label as string}</h3>
        <p className="text-[#E9E4D8] font-sans text-xs text-center pb-2 px-2">
          {data.caption as string}
        </p>
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </NodeWrapper>
  );
}

// 2. Art Node (Rajput miniature painting)
export function ArtNode({ data }: NodeProps) {
  const isFocused = data.isFocused as boolean;
  
  return (
    <NodeWrapper isFocused={isFocused}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="w-56 bg-[#22314F] border-4 border-[#D9A404] rounded-sm p-1 shadow-2xl">
        <div className="border border-[#D9A404]/50 p-2 bg-[#171512]">
          <div className="w-full h-32 overflow-hidden mb-3">
            <img 
              src="https://images.unsplash.com/photo-1578305718714-db14470bc904?w=400&q=80" 
              alt="Miniature painting" 
              className="w-full h-full object-cover sepia-[0.3]"
            />
          </div>
          <h3 className="font-serif text-[#E9E4D8] text-base text-center mb-1">{data.label as string}</h3>
          <p className="text-[#6B6355] font-sans text-[11px] text-center italic">
            {data.caption as string}
          </p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </NodeWrapper>
  );
}

// 3. Craft Node (Block-printed textile)
export function CraftNode({ data }: NodeProps) {
  const isFocused = data.isFocused as boolean;
  
  return (
    <NodeWrapper isFocused={isFocused}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="w-48 bg-[#A23E33] rounded-lg p-2 shadow-xl transform rotate-2">
        <div className="border-2 border-dashed border-[#E9E4D8]/40 p-2 h-40 flex flex-col items-center justify-center relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1605336152873-10a40234a65b?w=400&q=80" 
            alt="Block print" 
            className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-multiply"
          />
          <div className="relative z-10 bg-[#171512]/80 backdrop-blur-sm p-2 rounded w-full mt-auto">
            <h3 className="font-serif text-[#E9E4D8] text-sm text-center mb-1">{data.label as string}</h3>
            <p className="text-[#D9A404] font-sans text-[10px] text-center">
              {data.caption as string}
            </p>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Right} className="opacity-0" />
    </NodeWrapper>
  );
}

// 4. Artisan Node (Living artisan)
export function ArtisanNode({ data }: NodeProps) {
  const isFocused = data.isFocused as boolean;
  
  return (
    <NodeWrapper isFocused={isFocused}>
      <Handle type="target" position={Position.Left} className="opacity-0" />
      <div className="w-56 bg-[#E9E4D8] p-3 pb-5 rounded-sm shadow-2xl transform -rotate-1">
        <div className="w-full h-48 bg-[#6B6355] mb-3 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1542385151-efd9000785a0?w=400&q=80" 
            alt="Artisan" 
            className="w-full h-full object-cover grayscale contrast-125"
          />
        </div>
        <h3 className="font-serif text-[#171512] text-xl mb-1">{data.label as string}</h3>
        <p className="text-[#6B6355] font-sans text-xs mb-4">
          {data.caption as string}
        </p>
        <a 
          href="#" 
          className="block w-full py-2 bg-[#A23E33] hover:bg-[#8b332b] text-[#E9E4D8] text-center font-sans text-xs font-bold rounded shadow transition-colors"
          onClick={(e) => e.preventDefault()}
        >
          Support this artisan
        </a>
      </div>
    </NodeWrapper>
  );
}
