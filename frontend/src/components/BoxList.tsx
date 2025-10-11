import type { Box } from '../types';

interface BoxListProps {
  boxes: Box[];
  onEdit: (box: Box) => void;
  onDelete: (id: number) => void;
  onViewItems: (boxId: number) => void;
}

const locationLabels: Record<string, string> = {
  old_home: 'Old Home',
  new_home: 'New Home',
  storage: 'Storage',
};

export default function BoxList({ boxes, onEdit, onDelete, onViewItems }: BoxListProps) {
  if (boxes.length === 0) {
    return <div className="empty-state">No boxes found. Add your first box!</div>;
  }

  return (
    <div className="list-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Number</th>
            <th>Label</th>
            <th>Room</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boxes.map((box) => (
            <tr key={box.id}>
              <td>#{box.number}</td>
              <td>{box.label}</td>
              <td>{box.room}</td>
              <td>
                <span className={`badge badge-${box.location}`}>
                  {locationLabels[box.location] || box.location}
                </span>
              </td>
              <td className="actions">
                <button
                  onClick={() => onViewItems(box.id!)}
                  className="btn-small btn-info"
                  title="View items"
                >
                  👁️ View Items
                </button>
                <button
                  onClick={() => onEdit(box)}
                  className="btn-small btn-secondary"
                  title="Edit box"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(box.id!)}
                  className="btn-small btn-danger"
                  title="Delete box"
                >
                  🗑️ Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
