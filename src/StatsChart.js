import React from 'react';

function StatsChart({ stats }) {
  if (!stats || stats.length === 0) return null;

  // Each statObj has base_stat and stat.name
  // We'll find the max base_stat to scale the bars
  const maxStat = Math.max(...stats.map(s => s.base_stat));

  // Adjusted dimensions and spacing
  const chartWidth = 300;
  const chartHeight = 150;
  const barWidth = 40; // Fixed bar width
  const barGap = 10;   // Gap between bars
  const totalBarSpace = (barWidth + barGap) * stats.length - barGap;
  const startX = (chartWidth - totalBarSpace) / 2; // Center the bars

  return (
    <div className="stats-chart">
      <svg width={chartWidth} height={chartHeight} style={{ background: '#f8f9fa', marginTop: '1rem' }}>
        {stats.map((statObj, index) => {
          const barHeight = (statObj.base_stat / maxStat) * (chartHeight - 30); // Leave room for text
          const x = startX + index * (barWidth + barGap);
          
          return (
            <g key={statObj.stat.name}>
              <rect
                x={x}
                y={chartHeight - barHeight - 25} // Move up to make room for labels
                width={barWidth}
                height={barHeight}
                fill="#007bff"
                opacity="0.8"
              />
              <text
                x={x + barWidth/2}
                y={chartHeight - barHeight - 30} // Position above bar
                textAnchor="middle"
                fontSize="12"
                fill="#495057"
              >
                {statObj.base_stat}
              </text>
              <text
                x={x + barWidth/2}
                y={chartHeight - 10} // Position below bar
                textAnchor="middle"
                fontSize="10"
                fill="#495057"
              >
                {statObj.stat.name.split('-')[0].toUpperCase()}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default StatsChart; 