// nodes/index.js
// All nodes — originals refactored + 5 new ones — using BaseNode abstraction

import { useState, useEffect, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { BaseNode } from './BaseNode';

// ─────────────────────────────────────────────
//  ORIGINAL 4 NODES (refactored with BaseNode)
// ─────────────────────────────────────────────

export const InputNode = (props) =>
  <BaseNode {...props} config={{
    title: 'Input',
    icon: '📥',
    color: '#10b981',
    inputs: [],
    outputs: [{ id: 'value', label: 'Value' }],
    fields: [
      { key: 'inputName', label: 'Name', type: 'text', defaultValue: props.id?.replace('customInput-', 'input_') || 'input' },
      { key: 'inputType', label: 'Type', type: 'select', options: ['Text', 'File'], defaultValue: 'Text' },
    ],
  }} />;

export const OutputNode = (props) =>
  <BaseNode {...props} config={{
    title: 'Output',
    icon: '📤',
    color: '#f59e0b',
    inputs: [{ id: 'value', label: 'Value' }],
    outputs: [],
    fields: [
      { key: 'outputName', label: 'Name', type: 'text', defaultValue: props.id?.replace('customOutput-', 'output_') || 'output' },
      { key: 'outputType', label: 'Type', type: 'select', options: ['Text', 'Image'], defaultValue: 'Text' },
    ],
  }} />;

export const LLMNode = (props) =>
  <BaseNode {...props} config={{
    title: 'LLM',
    icon: '🧠',
    color: '#8b5cf6',
    inputs: [
      { id: 'system', label: 'System Prompt' },
      { id: 'prompt', label: 'User Prompt' },
    ],
    outputs: [{ id: 'response', label: 'Response' }],
    fields: [
      { key: 'info', label: 'Large Language Model node', type: 'display' },
    ],
  }} />;

// ─────────────────────────────────────────────
//  TEXT NODE — Part 3: dynamic resize + {{ var }} handles
// ─────────────────────────────────────────────

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

export const TextNode = ({ id, data }) => {
  const [text, setText] = useState(data?.text || '{{input}}');
  const [variables, setVariables] = useState([]);
  const textareaRef = useRef(null);

  // Extract {{ variables }} from text
  useEffect(() => {
    const matches = [];
    let m;
    const re = new RegExp(VAR_REGEX.source, 'g');
    while ((m = re.exec(text)) !== null) {
      if (!matches.includes(m[1])) matches.push(m[1]);
    }
    setVariables(matches);
  }, [text]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div
      className="base-node text-node"
      style={{ minWidth: 220, width: Math.max(220, text.length * 7.5) + 'px', maxWidth: 480 }}
    >
      {/* Dynamic variable handles on left */}
      {variables.map((varName, i) => (
        <Handle
          key={varName}
          type="target"
          position={Position.Left}
          id={`${id}-${varName}`}
          style={{ top: `${((i + 1) / (variables.length + 1)) * 100}%` }}
          title={varName}
        >
          <span className="handle-label">{varName}</span>
        </Handle>
      ))}

      <div className="base-node-header" style={{ borderTopColor: '#ec4899' }}>
        <span className="base-node-icon">📝</span>
        <span className="base-node-title">Text</span>
      </div>

      <div className="base-node-body">
        <label className="node-label">Content</label>
        <textarea
          ref={textareaRef}
          className="node-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ resize: 'none', overflow: 'hidden', width: '100%' }}
          placeholder="Type text… use {{variable}} to add handles"
        />
        {variables.length > 0 && (
          <div className="variable-chips">
            {variables.map((v) => (
              <span key={v} className="variable-chip">{'{{' + v + '}}'}</span>
            ))}
          </div>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};


// ─────────────────────────────────────────────
//  5 NEW NODES
// ─────────────────────────────────────────────

/** 1. API Call Node */
export const ApiNode = (props) =>
  <BaseNode {...props} config={{
    title: 'API Call',
    icon: '🌐',
    color: '#0ea5e9',
    inputs: [{ id: 'body', label: 'Request Body' }],
    outputs: [{ id: 'response', label: 'Response' }, { id: 'status', label: 'Status' }],
    fields: [
      { key: 'url', label: 'URL', type: 'text', defaultValue: 'https://api.example.com' },
      { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], defaultValue: 'GET' },
    ],
  }} />;

/** 2. Filter / Condition Node */
export const FilterNode = (props) =>
  <BaseNode {...props} config={{
    title: 'Filter',
    icon: '🔍',
    color: '#f97316',
    inputs: [{ id: 'data', label: 'Data In' }],
    outputs: [{ id: 'match', label: 'Match' }, { id: 'nomatch', label: 'No Match' }],
    fields: [
      { key: 'field', label: 'Field', type: 'text', defaultValue: 'value' },
      { key: 'operator', label: 'Operator', type: 'select', options: ['equals', 'contains', 'gt', 'lt', 'not equals'], defaultValue: 'equals' },
      { key: 'value', label: 'Compare To', type: 'text', defaultValue: '' },
    ],
  }} />;

/** 3. Data Transform Node */
export const TransformNode = (props) =>
  <BaseNode {...props} config={{
    title: 'Transform',
    icon: '🔄',
    color: '#14b8a6',
    inputs: [{ id: 'input', label: 'Input' }],
    outputs: [{ id: 'output', label: 'Output' }],
    fields: [
      { key: 'operation', label: 'Operation', type: 'select', options: ['to uppercase', 'to lowercase', 'trim', 'parse JSON', 'stringify JSON', 'reverse'], defaultValue: 'to uppercase' },
    ],
  }} />;

/** 4. Note / Comment Node */
export const NoteNode = (props) =>
  <BaseNode {...props} config={{
    title: 'Note',
    icon: '🗒️',
    color: '#eab308',
    inputs: [],
    outputs: [],
    fields: [
      { key: 'note', label: 'Note text', type: 'textarea', defaultValue: 'Add a comment here...' },
    ],
  }} />;

/** 5. Merge Node — combines two streams */
export const MergeNode = (props) =>
  <BaseNode {...props} config={{
    title: 'Merge',
    icon: '🔀',
    color: '#db2777',
    inputs: [
      { id: 'a', label: 'Stream A' },
      { id: 'b', label: 'Stream B' },
    ],
    outputs: [{ id: 'merged', label: 'Merged' }],
    fields: [
      { key: 'strategy', label: 'Strategy', type: 'select', options: ['concat', 'zip', 'interleave'], defaultValue: 'concat' },
    ],
  }} />;
