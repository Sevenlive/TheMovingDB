import type { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Boxes</h3>
          <p className="stat-number">{stats.totalBoxes}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Items</h3>
          <p className="stat-number">{stats.totalItems}</p>
        </div>
      </div>

      <div className="stats-section">
        <h3>Boxes by Location</h3>
        <div className="stats-grid">
          <div className="stat-card small">
            <h4>Old Home</h4>
            <p className="stat-number small">{stats.boxesByLocation.old_home}</p>
          </div>
          <div className="stat-card small">
            <h4>New Home</h4>
            <p className="stat-number small">{stats.boxesByLocation.new_home}</p>
          </div>
          <div className="stat-card small">
            <h4>Storage</h4>
            <p className="stat-number small">{stats.boxesByLocation.storage}</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <h3>Items by Location</h3>
        <div className="stats-grid">
          <div className="stat-card small">
            <h4>Old Home</h4>
            <p className="stat-number small">{stats.itemsByLocation.old_home}</p>
          </div>
          <div className="stat-card small">
            <h4>New Home</h4>
            <p className="stat-number small">{stats.itemsByLocation.new_home}</p>
          </div>
          <div className="stat-card small">
            <h4>Storage</h4>
            <p className="stat-number small">{stats.itemsByLocation.storage}</p>
          </div>
          <div className="stat-card small">
            <h4>Unassigned</h4>
            <p className="stat-number small">{stats.itemsByLocation.unassigned}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
