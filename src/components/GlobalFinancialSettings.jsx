import React from 'react';

const GlobalFinancialSettings = ({ settings, onSettingsChange }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onSettingsChange({ ...settings, [name]: parseFloat(value) || 0 });
  };

  return (
    <div className="module">
      <h2>Global Financial Settings</h2>
      <div className="input-group vertical-inputs">
        <div>
          <label htmlFor="unitSellingPrice">Unit Selling Price ($)</label>
          <input
            id="unitSellingPrice"
            type="number"
            name="unitSellingPrice"
            placeholder="e.g., 150"
            value={settings.unitSellingPrice}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="unitVariableCost">Unit Variable Cost ($)</label>
          <input
            id="unitVariableCost"
            type="number"
            name="unitVariableCost"
            placeholder="e.g., 50"
            value={settings.unitVariableCost}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="monthlyOperatingExpense">Monthly Operating Expense ($)</label>
          <input
            id="monthlyOperatingExpense"
            type="number"
            name="monthlyOperatingExpense"
            placeholder="e.g., 50000"
            value={settings.monthlyOperatingExpense}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  );
};

export default GlobalFinancialSettings;
