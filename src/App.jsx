import React, { useState } from 'react';
import BottleneckFinder from './components/BottleneckFinder';
import DBRScheduler from './components/DBRScheduler';
import './App.css';

function App() {
  const [bottleneck, setBottleneck] = useState(null);

  return (
    <div className="App">
      <header className="App-header">
        <h1>TOC Analyzer</h1>
      </header>
      <main>
        <BottleneckFinder setBottleneck={setBottleneck} />
        <DBRScheduler bottleneck={bottleneck} />
      </main>
    </div>
  );
}

export default App;

