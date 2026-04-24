import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5005/api/orders";

const initialForm = {
  customerName: "",
  product: "",
  quantity: "",
  price: ""
};

function App() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Unable to fetch orders");
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          customerName: formData.customerName,
          product: formData.product,
          quantity: Number(formData.quantity),
          price: Number(formData.price)
        })
      });

      if (!response.ok) {
        throw new Error("Unable to add order");
      }

      setFormData(initialForm);
      await fetchOrders();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error("Unable to update order status");
      }

      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteOrder = async (id) => {
    setError("");

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) {
        throw new Error("Unable to delete order");
      }

      await fetchOrders();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header className="hero">
          <p className="eyebrow">MERN Stack Project</p>
          <h1>Order Management System</h1>
          <p className="subtitle">
            Create, track, and update customer orders with live status management.
          </p>
        </header>

        <section className="panel">
          <h2>Add New Order</h2>
          <form className="order-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="customerName"
              placeholder="Customer Name"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="product"
              placeholder="Product"
              value={formData.product}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add Order"}
            </button>
          </form>
        </section>

        <section className="panel">
          <div className="section-header">
            <h2>Orders List</h2>
            <button className="secondary-btn" onClick={fetchOrders} type="button">
              Refresh
            </button>
          </div>

          {error ? <p className="message error">{error}</p> : null}
          {loading ? <p className="message">Loading orders...</p> : null}

          {!loading && orders.length === 0 ? (
            <p className="message">No orders found yet.</p>
          ) : (
            <div className="order-grid">
              {orders.map((order) => (
                <article className="order-card" key={order._id}>
                  <div className="order-card-top">
                    <h3>{order.customerName}</h3>
                    <span className={`status status-${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <p>
                    <strong>Product:</strong> {order.product}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {order.quantity}
                  </p>
                  <p>
                    <strong>Price:</strong> ${Number(order.price).toFixed(2)}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ${Number(order.totalAmount).toFixed(2)}
                  </p>

                  <div className="actions">
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order._id, "Shipped")}
                      disabled={order.status === "Shipped" || order.status === "Delivered"}
                    >
                      Mark as Shipped
                    </button>
                    <button
                      type="button"
                      onClick={() => updateOrderStatus(order._id, "Delivered")}
                      disabled={order.status === "Delivered"}
                    >
                      Mark as Delivered
                    </button>
                    <button
                      type="button"
                      className="danger-btn"
                      onClick={() => deleteOrder(order._id)}
                    >
                      Delete Order
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
