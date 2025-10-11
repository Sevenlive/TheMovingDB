import type { Item, Box } from '../types';

interface ItemListProps {
  items: Item[];
  boxes: Box[];
  onEdit: (item: Item) => void;
  onDelete: (id: number) => void;
}

export default function ItemList({ items, boxes, onEdit, onDelete }: ItemListProps) {
  const getBoxLabel = (boxId?: number | null) => {
    if (!boxId) return 'Unassigned';
    const box = boxes.find((b) => b.id === boxId);
    return box ? `Box #${box.number} - ${box.label}` : 'Unknown';
  };

  if (items.length === 0) {
    return <div className="empty-state">No items found. Add your first item!</div>;
  }

  return (
    <div className="list-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Condition</th>
            <th>Box</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.description || '-'}</td>
              <td>
                {item.category ? (
                  <span className="badge badge-category">{item.category}</span>
                ) : (
                  '-'
                )}
              </td>
              <td>{item.condition || '-'}</td>
              <td>{getBoxLabel(item.box_id)}</td>
              <td className="actions">
                <button
                  onClick={() => onEdit(item)}
                  className="btn-small btn-secondary"
                  title="Edit item"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => onDelete(item.id!)}
                  className="btn-small btn-danger"
                  title="Delete item"
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
