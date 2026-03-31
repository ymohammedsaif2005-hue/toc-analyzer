import React, { useState, useEffect } from 'react';

const DBRScheduler = ({ bottleneck }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ name: '', quantity: '', dueDate: '' });
  const [bufferDays, setBufferDays] = useState(3);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const addOrder = () => {
    if (newOrder.name && newOrder.quantity && newOrder.dueDate) {
      const releaseDate = new Date(newOrder.dueDate);
      releaseDate.setDate(releaseDate.getDate() - bufferDays);

      const updatedOrders = [...orders, { ...newOrder, id: Date.now(), releaseDate }];
      setOrders(updatedOrders);
      setNewOrder({ name: '', quantity: '', dueDate: '' });
    }
  };

  const getBufferStatus = (releaseDate, dueDate) => {
    const today = new Date();
    const totalBuffer = new Date(dueDate) - new Date(releaseDate);
    const elapsed = today - new Date(releaseDate);
    const percentage = (elapsed / totalBuffer) * 100;

    if (percentage > 66) return { text: 'RED', className: 'status-red' };
    if (percentage > 33) return { text: 'YELLOW', className: 'status-yellow' };
    return { text: 'GREEN', className: 'status-green' };
  };

  return (
    <div className="module">
      <h2>Module 2: DBR Scheduler</h2>
      {bottleneck ? (
        <>
          <div className="drum-info">
            <p>Drum: <span className="drum-name">{bottleneck.name}</span></p>
          </div>
          <div className="input-group">
            <label htmlFor="buffer-days">Buffer (days):</label>
            <input
              type="number"
              id="buffer-days"
              value={bufferDays}
              onChange={(e) => setBufferDays(parseInt(e.target.value, 10))}
            />
          </div>
          <div className="input-group">
            <input type="text" name="name" placeholder="Order Name" value={newOrder.name} onChange={handleInputChange} />
            <input type="number" name="quantity" placeholder="Quantity" value={newOrder.quantity} onChange={handleInputChange} />
            <input type="date" name="dueDate" placeholder="Due Date" value={newOrder.dueDate} onChange={handleInputChange} />
            <button onClick={addOrder}>Add Order</button>
          </div>

          <div className="schedule-table">
            <h3>Production Schedule</h3>
            <table>
              <thead>
                <tr>
                  <th>Order Name</th>
                  <th>Release Date</th>
                  <th>Due Date</th>
                  <th>Buffer Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = getBufferStatus(order.releaseDate, order.dueDate);
                  return (
                    <tr key={order.id}>
                      <td>{order.name}</td>
                      <td>{new Date(order.releaseDate).toLocaleDateString()}</td>
                      <td>{new Date(order.dueDate).toLocaleDateString()}</td>
                      <td><span className={`status-badge ${status.className}`}>{status.text}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p>Please identify the bottleneck in Module 1 first.</p>
      )}
    </div>
  );
};

export default DBRScheduler;
