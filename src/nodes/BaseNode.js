// BaseNode.js
// Core abstraction for all nodes — Part 1

import { Handle, Position } from 'reactflow';

/**
 * BaseNode — renders any node from a simple config object.
 *
 * Config shape:
 * {
 *   title: string,
 *   color: string,          // header accent color
 *   inputs: [{ id, label, style? }],   // left-side Handles
 *   outputs: [{ id, label, style? }],  // right-side Handles
 *   fields: [{ key, label, type, options?, defaultValue? }],
 *   icon: string (emoji or text)
 * }
 *
 * Usage:
 *   export const MyNode = (props) => <BaseNode {...props} config={myConfig} />;
 */
export const BaseNode = ({ id, data, config }) => {
  const { title, color = '#6366f1', inputs = [], outputs = [], fields = [], icon = '⚙️' } = config;

  return (
    <div className="base-node">
      {/* Input Handles */}
      {inputs.map((handle, i) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          style={{
            top: inputs.length === 1 ? '50%' : `${((i + 1) / (inputs.length + 1)) * 100}%`,
            ...handle.style,
          }}
          title={handle.label}
        />
      ))}

      {/* Header */}
      <div className="base-node-header" style={{ borderTopColor: color }}>
        <span className="base-node-icon">{icon}</span>
        <span className="base-node-title">{title}</span>
      </div>

      {/* Fields */}
      <div className="base-node-body">
        {fields.map((field) => (
          <NodeField key={field.key} field={field} nodeId={id} data={data} />
        ))}
      </div>

      {/* Output Handles */}
      {outputs.map((handle, i) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id}`}
          style={{
            top: outputs.length === 1 ? '50%' : `${((i + 1) / (outputs.length + 1)) * 100}%`,
            ...handle.style,
          }}
          title={handle.label}
        />
      ))}
    </div>
  );
};

/** Renders a single field based on its type */
const NodeField = ({ field, nodeId, data }) => {
  const { key, label, type, options = [], defaultValue = '' } = field;
  const value = data?.[key] ?? defaultValue;

  const handleChange = (e) => {
    // Dispatch a custom event so nodes can optionally listen
    const event = new CustomEvent('nodeFieldChange', {
      detail: { nodeId, key, value: e.target.value },
    });
    window.dispatchEvent(event);
  };

  if (type === 'select') {
    return (
      <div className="node-field">
        <label className="node-label">{label}</label>
        <select className="node-select" defaultValue={value} onChange={handleChange}>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </div>
    );
  }

  if (type === 'textarea') {
    return (
      <div className="node-field">
        <label className="node-label">{label}</label>
        <textarea className="node-textarea" defaultValue={value} onChange={handleChange} rows={3} />
      </div>
    );
  }

  if (type === 'display') {
    return (
      <div className="node-field">
        <span className="node-display-text">{label}</span>
      </div>
    );
  }

  // default: text input
  return (
    <div className="node-field">
      <label className="node-label">{label}</label>
      <input className="node-input" type="text" defaultValue={value} onChange={handleChange} />
    </div>
  );
};
