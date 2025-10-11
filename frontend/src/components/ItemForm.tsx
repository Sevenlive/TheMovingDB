import { useState, useEffect } from 'react';
import type { Item, Box } from '../types';

interface ItemFormProps {
  item?: Item;
  boxes: Box[];
  onSubmit: (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export default function ItemForm({ item, boxes, onSubmit, onCancel }: ItemFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [boxId, setBoxId] = useState<number | null>(null);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description || '');
      setCategory(item.category || '');
      setCondition(item.condition || '');
      setBoxId(item.box_id || null);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      description: description || undefined,
      category: category || undefined,
      condition: condition || undefined,
      box_id: boxId,
    });
  };

  return (
    <div className="form-container">
      <h3>{item ? 'Edit Item' : 'Add New Item'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name *</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., Dinner Plates"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Set of 8 white ceramic plates"
            rows={3}
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., Kitchenware, Electronics, Books"
          />
        </div>

        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option value="">Select condition</option>
            <option value="new">New</option>
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="box">Assign to Box</label>
          <select
            id="box"
            value={boxId || ''}
            onChange={(e) => setBoxId(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">No box (unassigned)</option>
            {boxes.map((box) => (
              <option key={box.id} value={box.id}>
                Box #{box.number} - {box.label} ({box.room})
              </option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {item ? 'Update' : 'Create'} Item
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
