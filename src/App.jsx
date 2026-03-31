import React, { useState } from 'react';
import BottleneckFinder from './components/BottleneckFinder';
import DBRScheduler from './components/DBRScheduler';
import FinancialDashboard from './components/FinancialDashboard';
import './App.css';

function App() {
  const [bottleneck, setBottleneck] = useState(null);

  // A "genuine" bottleneck is the highest utilized step, but ONLY if its utilization is > 70%.
  const genuineBottleneck = bottleneck && bottleneck.utilisation > 70 ? bottleneck : null;

  return (
    <div className="App">
      <header className="App-header">
        <h1>TOC Analyzer</h1>
      </header>
      <main>
        <BottleneckFinder setBottleneck={setBottleneck} />
        <DBRScheduler bottleneck={bottleneck} />
        <FinancialDashboard bottleneck={genuineBottleneck} />
      </main>
    </div>
  );
}

export default App;

