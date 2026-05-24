import { GitBranch } from 'lucide-react';
import ReactFlow, { Background, Controls, MarkerType } from 'reactflow';
import ResultCard from './ResultCard.jsx';

const nodeStyle = {
  background: '#FFFFFF',
  border: '1px solid #D8D2C8',
  borderLeft: '5px solid #E8963A',
  borderRadius: 0,
  color: '#1A1612',
  fontSize: 13,
  fontFamily: 'DM Mono, ui-monospace, monospace',
  fontWeight: 500,
  padding: '11px 16px',
  minWidth: 110,
  textAlign: 'center',
};

function normalizeTree(tree = {}) {
  const nodes = Array.isArray(tree.nodes) ? tree.nodes : [];
  const edges = Array.isArray(tree.edges) ? tree.edges : [];

  return {
    nodes: nodes.map((node, index) => ({
      id: String(node.id ?? index + 1),
      data: { label: node.label || node.type || 'NODE' },
      position: node.position || { x: (index % 3) * 190, y: Math.floor(index / 3) * 110 },
      style: {
        ...nodeStyle,
        borderLeftColor: node.active ? '#D4502A' : '#E8963A',
        background: node.active ? '#FFF3CD' : '#FFFFFF',
        boxShadow: 'none',
      },
    })),
    edges: edges.map((edge, index) => ({
      id: edge.id || `edge-${index}`,
      source: String(edge.source),
      target: String(edge.target),
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed, color: '#D4502A' },
      style: { stroke: '#D4502A', strokeWidth: 2 },
    })),
  };
}

export default function QueryTree({ tree, style }) {
  const { nodes, edges } = normalizeTree(tree);

  return (
    <ResultCard title="Query Tree Visualization" icon={GitBranch} className="animate-cardIn" style={style}>
      <div className="h-[420px] overflow-hidden border border-app-border bg-app-code">
        {nodes.length ? (
          <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
            <Background color="#D8D2C8" gap={18} />
            <Controls />
          </ReactFlow>
        ) : (
          <div className="grid h-full place-items-center font-sans text-sm text-app-muted">
            Query tree is unavailable for this response.
          </div>
        )}
      </div>
    </ResultCard>
  );
}
