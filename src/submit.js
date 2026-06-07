// submit.js — Part 4: Backend Integration

import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({ nodes: state.nodes, edges: state.edges });

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://127.0.0.1:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      if (!response.ok) throw new Error(`Server error: ${response.status}`);
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="submit-bar">
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={loading || nodes.length === 0}
        >
          {loading ? 'Analyzing…' : '⚡ Submit Pipeline'}
        </button>
        {nodes.length === 0 && (
          <span style={{ fontSize: 12, color: '#7b839a' }}>Drop some nodes to get started</span>
        )}
        {error && (
          <span style={{ fontSize: 12, color: '#f87171' }}>⚠ {error}</span>
        )}
      </div>

      {result && (
        <PipelineResultModal result={result} onClose={() => setResult(null)} />
      )}
    </>
  );
};

const PipelineResultModal = ({ result, onClose }) => {
  const { num_nodes, num_edges, is_dag } = result;

  return (
    <div className="pipeline-result-overlay" onClick={onClose}>
      <div className="pipeline-result-card" onClick={(e) => e.stopPropagation()}>
        <div className="result-title">
          <span>📊</span> Pipeline Analysis
        </div>

        <div className="result-grid">
          <div className="result-stat">
            <div className="result-stat-value">{num_nodes}</div>
            <div className="result-stat-label">Nodes</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{num_edges}</div>
            <div className="result-stat-label">Edges</div>
          </div>
          <div className="result-stat">
            <div className="result-stat-value">{is_dag ? '✓' : '✗'}</div>
            <div className="result-stat-label">Is DAG</div>
          </div>
        </div>

        <div>
          <span className={`result-dag-badge ${is_dag ? 'is-dag' : 'not-dag'}`}>
            {is_dag
              ? '✅ Valid DAG — pipeline can execute sequentially'
              : '❌ Not a DAG — pipeline contains cycles'}
          </span>
        </div>

        <button className="result-close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};
