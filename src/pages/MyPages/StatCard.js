import React from 'react';

function StatCard({ stats }) {
    return (
        <div className="stat-card">
            <div className="stat-card-header">
                <span className="stat-icon">{stats.icon}</span>
                <span className="stat-name">{stats.title}</span>
            </div>
            <div className="stat-value-box">
                <span className="stat-value">{stats.statistics.value}</span>
                <span className="stat-unit">{stats.statistics.unit}</span>
            </div>
        </div>
    );
}

export default StatCard;