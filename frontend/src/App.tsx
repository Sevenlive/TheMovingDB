import { useState, useEffect } from 'react';
import './App.css';
import { boxesApi, itemsApi, dashboardApi } from './api';
import type { Box, Item, DashboardStats } from './types';
import Dashboard from './components/Dashboard';
import BoxList from './components/BoxList';
import ItemList from './components/ItemList';
import BoxForm from './components/BoxForm';
import ItemForm from './components/ItemForm';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'boxes' | 'items'>('dashboard');
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [editingBox, setEditingBox] = useState<Box | null>(null);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [showBoxForm, setShowBoxForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [boxFilter, setBoxFilter] = useState<number | undefined>();
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [boxesData, itemsData, statsData] = await Promise.all([
        boxesApi.getAll({ search: searchTerm, location: locationFilter || undefined }),
        itemsApi.getAll({ search: searchTerm, box_id: boxFilter }),
        dashboardApi.getStats(),
      ]);
      setBoxes(boxesData);
      setItems(itemsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchTerm, locationFilter, boxFilter]);

  const handleCreateBox = async (box: Omit<Box, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await boxesApi.create(box);
      await loadData();
      setShowBoxForm(false);
    } catch (error) {
      console.error('Error creating box:', error);
    }
  };

  const handleUpdateBox = async (id: number, box: Partial<Box>) => {
    try {
      await boxesApi.update(id, box);
      await loadData();
      setEditingBox(null);
    } catch (error) {
      console.error('Error updating box:', error);
    }
  };

  const handleDeleteBox = async (id: number) => {
    if (confirm('Are you sure you want to delete this box?')) {
      try {
        await boxesApi.delete(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting box:', error);
      }
    }
  };

  const handleCreateItem = async (item: Omit<Item, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await itemsApi.create(item);
      await loadData();
      setShowItemForm(false);
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  const handleUpdateItem = async (id: number, item: Partial<Item>) => {
    try {
      await itemsApi.update(id, item);
      await loadData();
      setEditingItem(null);
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await itemsApi.delete(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📦 TheMovingDB</h1>
        <p>Organize your moving inventory</p>
      </header>

      <nav className="app-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={activeTab === 'boxes' ? 'active' : ''}
          onClick={() => setActiveTab('boxes')}
        >
          Boxes
        </button>
        <button
          className={activeTab === 'items' ? 'active' : ''}
          onClick={() => setActiveTab('items')}
        >
          Items
        </button>
      </nav>

      <main className="app-main">
        {loading && <div className="loading">Loading...</div>}

        {activeTab === 'dashboard' && stats && <Dashboard stats={stats} />}

        {activeTab === 'boxes' && (
          <div>
            <div className="toolbar">
              <input
                type="text"
                placeholder="Search boxes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                <option value="old_home">Old Home</option>
                <option value="new_home">New Home</option>
                <option value="storage">Storage</option>
              </select>
              <button
                onClick={() => {
                  setShowBoxForm(true);
                  setEditingBox(null);
                }}
                className="btn-primary"
              >
                + Add Box
              </button>
            </div>

            {(showBoxForm || editingBox) && (
              <BoxForm
                box={editingBox || undefined}
                onSubmit={(box) => {
                  if (editingBox?.id) {
                    handleUpdateBox(editingBox.id, box);
                  } else {
                    handleCreateBox(box as Omit<Box, 'id' | 'created_at' | 'updated_at'>);
                  }
                }}
                onCancel={() => {
                  setShowBoxForm(false);
                  setEditingBox(null);
                }}
              />
            )}

            <BoxList
              boxes={boxes}
              onEdit={setEditingBox}
              onDelete={handleDeleteBox}
              onViewItems={(boxId) => {
                setBoxFilter(boxId);
                setActiveTab('items');
              }}
            />
          </div>
        )}

        {activeTab === 'items' && (
          <div>
            <div className="toolbar">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select
                value={boxFilter || ''}
                onChange={(e) => setBoxFilter(e.target.value ? Number(e.target.value) : undefined)}
                className="filter-select"
              >
                <option value="">All Boxes</option>
                {boxes.map((box) => (
                  <option key={box.id} value={box.id}>
                    Box #{box.number} - {box.label}
                  </option>
                ))}
              </select>
              <button
                onClick={() => {
                  setShowItemForm(true);
                  setEditingItem(null);
                }}
                className="btn-primary"
              >
                + Add Item
              </button>
            </div>

            {(showItemForm || editingItem) && (
              <ItemForm
                item={editingItem || undefined}
                boxes={boxes}
                onSubmit={(item) => {
                  if (editingItem?.id) {
                    handleUpdateItem(editingItem.id, item);
                  } else {
                    handleCreateItem(item as Omit<Item, 'id' | 'created_at' | 'updated_at'>);
                  }
                }}
                onCancel={() => {
                  setShowItemForm(false);
                  setEditingItem(null);
                }}
              />
            )}

            <ItemList
              items={items}
              boxes={boxes}
              onEdit={setEditingItem}
              onDelete={handleDeleteItem}
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
