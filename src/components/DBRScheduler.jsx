import React, { useState, useEffect } from 'react';
import Collapsible from './Collapsible';

const DBRScheduler = ({ bottleneck }) => {
  const [orders, setOrders] = useState([]);
  const [newOrder, setNewOrder] = useState({ name: '', quantity: '', dueDate: '' });
  const [bufferDays, setBufferDays] = useState(3);
  const [lastDeletedOrder, setLastDeletedOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewOrder({ ...newOrder, [name]: value });
  };

  const addOrder = () => {
    if (newOrder.name && newOrder.quantity && newOrder.dueDate) {
      setLastDeletedOrder(null); // Hide undo button on new add
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

    if (percentage > 50) return { text: 'Act Now', color: 'RED', className: 'status-red' };
    return { text: 'On Track', color: 'GREEN', className: 'status-green' };
  };

  const deleteOrder = (id) => {
    const deleted = orders.find(order => order.id === id);
    setLastDeletedOrder(deleted);
    setOrders(orders.filter(order => order.id !== id));
  };

  const undoDelete = () => {
    if (lastDeletedOrder) {
      setOrders([...orders, lastDeletedOrder].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
      setLastDeletedOrder(null);
    }
  };

  return (
    <div className="module">
      <h2>Module 2: DBR Scheduler</h2>
      <Collapsible title="Buffer Legend">
        <ul className="legend-list">
          <li><span className="legend-color-dot status-red"></span> RED - Act Now (over 50% of buffer consumed)</li>
          <li><span className="legend-color-dot status-green"></span> GREEN - On Track (under 50% of buffer consumed)</li>
        </ul>
      </Collapsible>
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
          <div className="input-group vertical-inputs">
            <div>
              <label htmlFor="orderName">Order Name</label>
              <input id="orderName" type="text" name="name" placeholder="e.g., Project X" value={newOrder.name} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="quantity">Quantity</label>
              <input id="quantity" type="number" name="quantity" placeholder="e.g., 100" value={newOrder.quantity} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="dueDate">Due Date</label>
              <input id="dueDate" type="date" name="dueDate" value={newOrder.dueDate} onChange={handleInputChange} />
            </div>
            <button onClick={addOrder}>Add Order</button>
          </div>

          {lastDeletedOrder && (
            <div className="undo-container">
              <button onClick={undoDelete}>Undo Delete</button>
            </div>
          )}

          <div className="schedule-table">
            <h3>Production Schedule</h3>
            <table>
              <thead>
                <tr>
                  <th>Order Name</th>
                  <th>Release Date</th>
                  <th>Due Date</th>
                  <th>Buffer Status</th>
                  <th>Action</th>
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
                      <td>
                        <span className={`status-dot ${status.className}`}></span>
                        {status.color}
                      </td>
                      <td><button onClick={() => deleteOrder(order.id)}>Delete</button></td>
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
