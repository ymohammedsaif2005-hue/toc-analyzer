import React, { useState, useCallback, useRef } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Collapsible from './Collapsible';
import { useArrowNavigation } from '../hooks/useArrowNavigation';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BottleneckFinder = ({ setBottleneck }) => {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState({ name: '', capacity: '', output: '' });
  const [lastDeletedStep, setLastDeletedStep] = useState(null);
  const inputContainerRef = useRef(null);
  useArrowNavigation(inputContainerRef);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStep({ ...newStep, [name]: value });
  };

  const handleStepInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      addStep();
    }
  };

  const addStep = () => {
    if (newStep.name && newStep.capacity && newStep.output) {
      setLastDeletedStep(null); // Hide undo button on new add
      const updatedSteps = [...steps, { ...newStep, id: Date.now() }];
      setSteps(updatedSteps);
      calculateBottleneck(updatedSteps);
      setNewStep({ name: '', capacity: '', output: '' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLastDeletedStep(null); // Hide undo button on new add
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.map(row => ({
            name: row['Step Name'],
            capacity: parseFloat(row['Available Capacity per hour']),
            output: parseFloat(row['Actual Output per hour']),
            id: Date.now() + Math.random()
          })).filter(s => s.name && !isNaN(s.capacity) && !isNaN(s.output));
          const updatedSteps = [...steps, ...parsedData];
          setSteps(updatedSteps);
          calculateBottleneck(updatedSteps);
        },
      });
    }
  };

  const calculateBottleneck = (currentSteps) => {
    if (currentSteps.length === 0) {
        setBottleneck(null);
        return;
    }

    const stepsWithUtilisation = currentSteps.map(step => ({
      ...step,
      utilisation: (step.output / step.capacity) * 100,
    }));

    const sortedSteps = [...stepsWithUtilisation].sort((a, b) => b.utilisation - a.utilisation);
    const bottleneck = sortedSteps[0];
    setBottleneck(bottleneck);
    setSteps(sortedSteps);
  };

  const deleteStep = (id) => {
    const deleted = steps.find(step => step.id === id);
    setLastDeletedStep(deleted);
    const remainingSteps = steps.filter(step => step.id !== id);
    setSteps(remainingSteps);
    calculateBottleneck(remainingSteps);
  };

  const undoDelete = () => {
    if (lastDeletedStep) {
      const restoredSteps = [...steps, lastDeletedStep];
      setSteps(restoredSteps);
      calculateBottleneck(restoredSteps);
      setLastDeletedStep(null);
    }
  };

  const showBottleneckInfo = steps.length >= 2 && steps.some(step => step.utilisation > 70);

  const renderBottleneckAlert = () => {
    if (!showBottleneckInfo) {
        // If there are steps but they are all healthy, show the green message
        if (steps.length >= 2) {
            return (
                <div className="bottleneck-summary healthy">
                    <p>All processes are healthy — no constraint identified.</p>
                </div>
            );
        }
        // Otherwise, show nothing
        return null;
    }

    if (bottleneck) {
      return (
        <div className="bottleneck-summary">
          <p>Your bottleneck is <span className="bottleneck-name">{bottleneck.name}</span> running at <span className="bottleneck-capacity">{bottleneck.utilisation.toFixed(2)}%</span> capacity.</p>
        </div>
      );
    }

    return null;
  };

  const bottleneck = steps.length > 0 ? steps[0] : null;

  const getBarColor = (utilisation) => {
    // Red scale for 90-100
    if (utilisation >= 90) {
        let alpha;
        if (utilisation >= 95) { // 95-100 -> 0.8-1.0
            alpha = 0.8 + ((utilisation - 95) / 5) * 0.2;
        } else if (utilisation >= 91) { // 91-94 -> 0.6-0.75
            alpha = 0.6 + ((utilisation - 91) / 3) * 0.15;
        } else { // 90 -> 0.5
            alpha = 0.5;
        }
        return `rgba(220, 53, 69, ${alpha})`; // Red
    }
    // Amber scale for 70-89
    if (utilisation >= 70) {
        let alpha;
        if (utilisation >= 85) { // 85-89 -> 0.8-1.0
            alpha = 0.8 + ((utilisation - 85) / 4) * 0.2;
        } else if (utilisation >= 75) { // 75-84 -> 0.6-0.75
            alpha = 0.6 + ((utilisation - 75) / 9) * 0.15;
        } else { // 70-74 -> 0.5
            alpha = 0.5;
        }
        return `rgba(255, 193, 7, ${alpha})`; // Amber
    }
    // Flat green for < 70
    return 'rgba(40, 167, 69, 0.5)'; // Green
  };

  const getTooltipMessage = (utilisation) => {
    if (utilisation >= 95) return 'Critical constraint — this is your bottleneck, prioritise immediately';
    if (utilisation >= 91) return 'Near-critical — monitor closely, approaching constraint status';
    if (utilisation >= 90) return 'High utilisation — approaching warning zone';
    if (utilisation >= 85) return 'High warning — risk of becoming constraint';
    if (utilisation >= 75) return 'Moderate warning — keep an eye on capacity';
    if (utilisation >= 70) return 'Light warning — capacity is okay, but monitor';
    return 'Healthy — sufficient spare capacity available';
  };

  const getBorderColor = (utilisation) => {
    if (utilisation >= 90) return 'rgba(220, 53, 69, 1)';
    if (utilisation >= 70) return 'rgba(255, 193, 7, 1)';
    return 'rgba(40, 167, 69, 1)';
  };

  const sortedStepsForChart = [...steps].sort((a, b) => b.utilisation - a.utilisation);

  const chartData = {
    labels: sortedStepsForChart.map(step => step.name),
    datasets: [
      {
        label: 'Utilisation (%)',
        data: sortedStepsForChart.map(step => step.utilisation),
        backgroundColor: sortedStepsForChart.map(step => getBarColor(step.utilisation)),
        borderColor: sortedStepsForChart.map(step => getBorderColor(step.utilisation)),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Process Step Utilisation',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Process Steps'
        }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
            callback: function(value) {
                return value + '%'
            }
        }
      },
    },
  };

  return (
    <div className="module">
      <h2>Module 1: Bottleneck Finder</h2>
      <Collapsible title="Chart Legend">
        <ul className="legend-list">
          <li><span className="legend-color-box status-red" style={{opacity: 0.9}}></span> Darker red = more critical</li>
          <li><span className="legend-color-box status-red" style={{opacity: 0.5}}></span> Lighter red = approaching constraint</li>
          <li><span className="legend-color-box status-yellow" style={{opacity: 0.9}}></span> Darker amber = higher risk</li>
          <li><span className="legend-color-box status-yellow" style={{opacity: 0.5}}></span> Lighter amber = moderate risk</li>
          <li><span className="legend-color-box status-green"></span> Green = healthy</li>
        </ul>
      </Collapsible>
      <div className="input-group" ref={inputContainerRef}>
        <input type="text" name="name" placeholder="Step Name" value={newStep.name} onChange={handleInputChange} onKeyDown={handleStepInputKeyDown} />
        <input type="number" name="capacity" placeholder="Available Capacity/hr" value={newStep.capacity} onChange={handleInputChange} onKeyDown={handleStepInputKeyDown} />
        <input type="number" name="output" placeholder="Actual Output/hr" value={newStep.output} onChange={handleInputChange} onKeyDown={handleStepInputKeyDown} />
        <button onClick={addStep}>Add Step</button>
      </div>
      <div className="input-group">
        <label htmlFor="csv-upload">Upload CSV:</label>
        <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} />
      </div>

      {lastDeletedStep && (
        <div className="undo-container">
          <button onClick={undoDelete}>Undo Delete</button>
        </div>
      )}

      {renderBottleneckAlert()}

      <div className="chart-container">
        {steps.length > 0 && <Bar options={chartOptions} data={chartData} />}
      </div>

      {steps.length > 0 && <hr className="divider" />}

      {showBottleneckInfo && bottleneck && (
        <div className="summary-box">
            <h3>What this means</h3>
            <p>The bottleneck is the slowest part of your process, limiting the overall output. To increase throughput, you must focus on improving the efficiency and capacity of the <strong>{bottleneck.name}</strong> step.</p>
        </div>
      )}

      <div className="steps-list">
        <h3>Process Steps</h3>
        <table>
            <thead>
                <tr>
                    <th>Step Name</th>
                    <th>Utilisation</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {steps.map((step) => (
                    <tr key={step.id}>
                        <td>{step.name}</td>
                        <td>
                            <span 
                                className="utilisation-indicator" 
                                style={{ backgroundColor: getBarColor(step.utilisation) }}
                                title={getTooltipMessage(step.utilisation)}
                            ></span>
                            {step.utilisation.toFixed(2)}%
                        </td>
                        <td><button onClick={() => deleteStep(step.id)}>Delete</button></td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default BottleneckFinder;
