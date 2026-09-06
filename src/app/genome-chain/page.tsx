"use client";

import React, { useState, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { ThreadEdge } from '@/components/genome-chain/ThreadEdge';
import { MotifNode, ArtNode, CraftNode, ArtisanNode } from '@/components/genome-chain/Nodes';

const nodeTypes = {
  motif: MotifNode,
  art: ArtNode,
  craft: CraftNode,
  artisan: ArtisanNode,
};

const edgeTypes = {
  thread: ThreadEdge,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'motif',
    position: { x: 50, y: 150 },
    data: { 
      label: 'Jharokha Carving',
      caption: 'An iconic stone window arch motif found in Rajasthani forts.',
    },
  },
  {
    id: '2',
    type: 'art',
    position: { x: 350, y: 150 },
    data: { 
      label: 'Rajput Miniature',
      caption: 'The motif frames royal figures in 17th-century court paintings.',
    },
  },
  {
    id: '3',
    type: 'craft',
    position: { x: 700, y: 150 },
    data: { 
      label: 'Block-Printed Textile',
      caption: 'Adapted into repeating patterns in Sanganeri fabric.',
    },
  },
  {
    id: '4',
    type: 'artisan',
    position: { x: 1050, y: 150 },
    data: { 
      label: 'Ramesh Chippa',
      caption: 'Master block-printer keeping the Jharokha motif alive today in Bagru.',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', type: 'thread' },
  { id: 'e2-3', source: '2', target: '3', type: 'thread' },
  { id: 'e3-4', source: '3', target: '4', type: 'thread' },
];

export default function GenomeChainView() {
  const [revealedCount, setRevealedCount] = useState(1);

  // Derive visible nodes and edges based on revealedCount
  const nodes = useMemo(() => {
    return initialNodes.map((node, index) => {
      const isVisible = index < revealedCount;
      const isFocused = index === revealedCount - 1;
      
      return {
        ...node,
        hidden: !isVisible,
        data: {
          ...node.data,
          isFocused,
        }
      };
    });
  }, [revealedCount]);

  const edges = useMemo(() => {
    return initialEdges.map((edge, index) => {
      // Edge is visible if the target node is revealed
      const isVisible = index < revealedCount - 1;
      // It's the "revealing" edge if it's the most recently added one
      const isRevealing = index === revealedCount - 2;

      return {
        ...edge,
        hidden: !isVisible,
        data: {
          isRevealing,
        }
      };
    });
  }, [revealedCount]);

  const handleRevealNext = () => {
    if (revealedCount < 4) {
      setRevealedCount(prev => prev + 1);
    }
  };

  return (
    <main className="w-screen h-screen bg-[#171512] font-sans flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-start pointer-events-none">
        <div>
          <h1 className="text-[#A23E33] font-serif text-3xl font-bold">Genome Chain</h1>
          <p className="text-[#6B6355] text-sm mt-1 max-w-md">
            Tracing the cultural thread of the Jharokha motif across time, mediums, and people.
          </p>
        </div>
      </header>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full h-full relative z-10">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.5}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          proOptions={{ hideAttribution: true }}
          className="bg-[#171512]"
        >
          <Background color="#6B6355" gap={24} size={1} className="opacity-20" />
        </ReactFlow>
      </div>

      {/* Interaction Footer */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
        {revealedCount < 4 ? (
          <button
            onClick={handleRevealNext}
            className="px-8 py-3 bg-[#D9A404] hover:bg-[#c29204] text-[#171512] font-sans font-bold text-sm rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
          >
            Reveal the connection
          </button>
        ) : (
          <p className="text-[#E9E4D8] italic font-serif text-lg opacity-80">
            The thread continues with you.
          </p>
        )}
      </div>
    </main>
  );
}
