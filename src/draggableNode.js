// draggableNode.js

export const DraggableNode = ({ type, label, color = '#6366f1', icon = '⚙️' }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-pill"
      onDragStart={(e) => onDragStart(e, type)}
      draggable
      style={{ '--pill-color': color }}
    >
      <span className="pill-dot" style={{ background: color }} />
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  );
};
