import React, { useState } from 'react';
import BottleneckFinder from './components/BottleneckFinder';
import DBRScheduler from './components/DBRScheduler';
import GlobalFinancialSettings from './components/GlobalFinancialSettings';
import BusinessImpactDashboard from './components/BusinessImpactDashboard';
import './App.css';

function App() {
  const [bottleneck, setBottleneck] = useState(null);
  const [financialSettings, setFinancialSettings] = useState({
    unitSellingPrice: '',
    unitVariableCost: '',
    monthlyOperatingExpense: '',
  });

  return (
    <div className="App">
      <header className="App-header">
        <h1>TOC Decision Support System</h1>
      </header>
      <main>
        <GlobalFinancialSettings settings={financialSettings} onSettingsChange={setFinancialSettings} />
        <BottleneckFinder setBottleneck={setBottleneck} />
        <DBRScheduler bottleneck={bottleneck} />
        <BusinessImpactDashboard bottleneck={bottleneck} financialSettings={financialSettings} />
      </main>
    </div>
  );
}

export default App;

