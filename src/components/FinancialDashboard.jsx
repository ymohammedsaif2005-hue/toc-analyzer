import React, { useState } from 'react';

const FinancialDashboard = ({ bottleneck }) => {
  const [price, setPrice] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [operatingExpense, setOperatingExpense] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    const p = parseFloat(price);
    const vc = parseFloat(variableCost);
    const oe = parseFloat(operatingExpense);

    if (bottleneck && !isNaN(p) && !isNaN(vc) && !isNaN(oe)) {
      const throughput = (p - vc) * bottleneck.output * 720;
      const netProfit = throughput - oe;
      const productivity = oe > 0 ? throughput / oe : 0;

      setResults({
        throughput,
        netProfit,
        productivity,
      });
    }
  };

  return (
    <div className="financial-dashboard-container">
      <div className="module">
        <h2>Global Financial Settings</h2>
        <div className="input-group vertical-inputs">
          <div>
            <label htmlFor="sellingPrice">Unit Selling Price</label>
            <input id="sellingPrice" type="number" placeholder="e.g., 150" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          <div>
            <label htmlFor="variableCost">Unit Variable Cost</label>
            <input id="variableCost" type="number" placeholder="e.g., 50" value={variableCost} onChange={(e) => setVariableCost(e.target.value)} />
          </div>
          <div>
            <label htmlFor="operatingExpense">Monthly Operating Expense</label>
            <input id="operatingExpense" type="number" placeholder="e.g., 50000" value={operatingExpense} onChange={(e) => setOperatingExpense(e.target.value)} />
          </div>
          <button onClick={handleCalculate}>Calculate</button>
        </div>
      </div>

      <div className="module">
        <h2>Business Impact Dashboard</h2>
        {!bottleneck ? (
          <p>Please identify your bottleneck in Module 1 first.</p>
        ) : !results ? (
          <p>Enter financial settings and click 'Calculate' to see the business impact.</p>
        ) : (
          <div className="impact-metrics">
            <div className="metric">
              <span className="metric-label">Current Drum Pace:</span>
              <span className="metric-value">{bottleneck.name} ({bottleneck.output}/hr)</span>
            </div>
            <div className="metric">
              <span className="metric-label">Monthly Throughput:</span>
              <span className="metric-value">${results.throughput.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </div>
            <div className="metric">
              <span className="metric-label">Monthly Net Profit:</span>
              <span className={`metric-value ${results.netProfit >= 0 ? 'profit' : 'loss'}`}>
                ${results.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
            <div className="metric">
              <span className="metric-label">Productivity Ratio:</span>
              <span className="metric-value">{results.productivity.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialDashboard;
