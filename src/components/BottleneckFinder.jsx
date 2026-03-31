import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BottleneckFinder = ({ setBottleneck }) => {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState({ name: '', capacity: '', output: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStep({ ...newStep, [name]: value });
  };

  const addStep = () => {
    if (newStep.name && newStep.capacity && newStep.output) {
      const updatedSteps = [...steps, { ...newStep, id: Date.now() }];
      setSteps(updatedSteps);
      calculateBottleneck(updatedSteps);
      setNewStep({ name: '', capacity: '', output: '' });
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
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

  const bottleneck = steps.length > 0 ? steps[0] : null;

  const getBarColor = (utilisation, isBottleneck) => {
    if (isBottleneck) return 'rgba(220, 53, 69, 0.5)'; // Red for bottleneck
    if (utilisation >= 70 && utilisation < 90) return 'rgba(255, 193, 7, 0.5)'; // Amber/Orange
    if (utilisation < 70) return 'rgba(40, 167, 69, 0.5)'; // Green
    return 'rgba(53, 162, 235, 0.5)'; // Default blue for 90-99%
  };

  const getBorderColor = (utilisation, isBottleneck) => {
    if (isBottleneck) return 'rgba(220, 53, 69, 1)';
    if (utilisation >= 70 && utilisation < 90) return 'rgba(255, 193, 7, 1)';
    if (utilisation < 70) return 'rgba(40, 167, 69, 1)';
    return 'rgba(53, 162, 235, 1)';
  };

  const sortedStepsForChart = [...steps].sort((a, b) => b.utilisation - a.utilisation);

  const chartData = {
    labels: sortedStepsForChart.map(step => step.name),
    datasets: [
      {
        label: 'Utilisation (%)',
        data: sortedStepsForChart.map(step => step.utilisation),
        backgroundColor: sortedStepsForChart.map(step => getBarColor(step.utilisation, step.name === bottleneck?.name)),
        borderColor: sortedStepsForChart.map(step => getBorderColor(step.utilisation, step.name === bottleneck?.name)),
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
      <div className="input-group">
        <input type="text" name="name" placeholder="Step Name" value={newStep.name} onChange={handleInputChange} />
        <input type="number" name="capacity" placeholder="Available Capacity/hr" value={newStep.capacity} onChange={handleInputChange} />
        <input type="number" name="output" placeholder="Actual Output/hr" value={newStep.output} onChange={handleInputChange} />
        <button onClick={addStep}>Add Step</button>
      </div>
      <div className="input-group">
        <label htmlFor="csv-upload">Upload CSV:</label>
        <input type="file" id="csv-upload" accept=".csv" onChange={handleFileUpload} />
      </div>

      {bottleneck && (
        <div className="bottleneck-summary">
          <p>Your bottleneck is <span className="bottleneck-name">{bottleneck.name}</span> running at <span className="bottleneck-capacity">{bottleneck.utilisation.toFixed(2)}%</span> capacity.</p>
        </div>
      )}

      <div className="chart-container">
        {steps.length > 0 && <Bar options={chartOptions} data={chartData} />}
      </div>

      {steps.length > 0 && <hr className="divider" />}

      <div className="steps-list">
        <h3>Process Steps</h3>
        <table>
            <thead>
                <tr>
                    <th>Step Name</th>
                    <th>Utilisation</th>
                </tr>
            </thead>
            <tbody>
                {steps.map((step) => (
                    <tr key={step.id} className={step.name === bottleneck?.name ? 'bottleneck-row' : ''}>
                        <td>{step.name}</td>
                        <td>{step.utilisation.toFixed(2)}%</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default BottleneckFinder;
