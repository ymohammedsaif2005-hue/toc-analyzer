import React from 'react';

const BusinessImpactDashboard = ({ bottleneck, financialSettings }) => {
  if (!bottleneck || !financialSettings) {
    return null;
  }

  const { unitSellingPrice, unitVariableCost, monthlyOperatingExpense } = financialSettings;
  const bottleneckOutput = bottleneck.output;
  const hoursInMonth = 720;

  const throughput = (unitSellingPrice - unitVariableCost) * bottleneckOutput * hoursInMonth;
  const netProfit = throughput - monthlyOperatingExpense;
  const productivity = monthlyOperatingExpense > 0 ? throughput / monthlyOperatingExpense : 0;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="module">
      <h2>Business Impact Dashboard</h2>
      <div className="dashboard-metrics">
        <div className="metric">
          <span className="metric-label">Current Drum Pace:</span>
          <span className="metric-value">{bottleneckOutput.toFixed(2)} units/hr</span>
        </div>
        <div className="metric">
          <span className="metric-label">Monthly Net Profit:</span>
          <span className={`metric-value ${netProfit >= 0 ? 'profit' : 'loss'}`}>
            {formatCurrency(netProfit)}
          </span>
        </div>
        <div className="metric">
          <span className="metric-label">Productivity Ratio:</span>
          <span className="metric-value">{productivity.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default BusinessImpactDashboard;
