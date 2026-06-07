// toolbar.js

import { DraggableNode } from './draggableNode';

const NODE_DEFS = [
  // Original 4
  { type: 'customInput',  label: 'Input',     color: '#10b981', icon: '📥' },
  { type: 'llm',          label: 'LLM',       color: '#8b5cf6', icon: '🧠' },
  { type: 'customOutput', label: 'Output',    color: '#f59e0b', icon: '📤' },
  { type: 'text',         label: 'Text',      color: '#ec4899', icon: '📝' },
  // 5 New
  { type: 'api',          label: 'API Call',  color: '#0ea5e9', icon: '🌐' },
  { type: 'filter',       label: 'Filter',    color: '#f97316', icon: '🔍' },
  { type: 'transform',    label: 'Transform', color: '#14b8a6', icon: '🔄' },
  { type: 'note',         label: 'Note',      color: '#eab308', icon: '🗒️' },
  { type: 'merge',        label: 'Merge',     color: '#db2777', icon: '🔀' },
];

export const PipelineToolbar = () => (
  <div className="toolbar">
    <div className="toolbar-brand">VS Pipeline</div>
    <div className="toolbar-divider" />
    <span className="toolbar-section-label">Nodes</span>
    <div className="toolbar-nodes">
      {NODE_DEFS.map((n) => (
        <DraggableNode key={n.type} type={n.type} label={n.label} color={n.color} icon={n.icon} />
      ))}
    </div>
  </div>
);
