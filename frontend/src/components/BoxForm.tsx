import { useState, useEffect } from 'react';
import type { Box } from '../types';

interface BoxFormProps {
  box?: Box;
  onSubmit: (box: Omit<Box, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export default function BoxForm({ box, onSubmit, onCancel }: BoxFormProps) {
  const [label, setLabel] = useState('');
  const [number, setNumber] = useState('');
  const [room, setRoom] = useState('');
  const [location, setLocation] = useState<'old_home' | 'new_home' | 'storage'>('old_home');

  useEffect(() => {
    if (box) {
      setLabel(box.label);
      setNumber(box.number.toString());
      setRoom(box.room);
      setLocation(box.location);
    }
  }, [box]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      label,
      number: parseInt(number),
      room,
      location,
    });
  };

  return (
    <div className="form-container">
      <h3>{box ? 'Edit Box' : 'Add New Box'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="label">Label *</label>
          <input
            id="label"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            placeholder="e.g., Kitchen Items"
          />
        </div>

        <div className="form-group">
          <label htmlFor="number">Box Number *</label>
          <input
            id="number"
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
            min="1"
            placeholder="e.g., 1"
          />
        </div>

        <div className="form-group">
          <label htmlFor="room">Room/Location *</label>
          <input
            id="room"
            type="text"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
            placeholder="e.g., Kitchen"
          />
        </div>

        <div className="form-group">
          <label htmlFor="location">Current Location *</label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value as 'old_home' | 'new_home' | 'storage')}
            required
          >
            <option value="old_home">Old Home</option>
            <option value="new_home">New Home</option>
            <option value="storage">Storage</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            {box ? 'Update' : 'Create'} Box
          </button>
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
