import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/foods`);

      setFoods(response.data);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
      setMessage("Unable to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (food) => {
    const existingItem = cart.find((item) => item._id === food._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === food._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...food, quantity: 1 }]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const placeOrder = async () => {
    if (!customerName.trim()) {
      alert("Please enter customer name");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      const orderData = {
        customerName,
        items: cart.map((item) => ({
          foodId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: calculateTotal(),
      };

      await axios.post(`${API_URL}/api/orders`, orderData);

      setMessage("Order placed successfully!");

      setCart([]);
      setCustomerName("");
    } catch (error) {
      console.error("Failed to place order:", error);
      setMessage("Failed to place order");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>🍔 Food Ordering App</h1>
        <p>Fresh food delivered to your door</p>
      </header>

      <main className="container">

        <section className="menu-section">
          <h2>Our Menu</h2>

          {loading ? (
            <p>Loading food items...</p>
          ) : foods.length === 0 ? (
            <p>No food items available.</p>
          ) : (
            <div className="food-grid">
              {foods.map((food) => (
                <div className="food-card" key={food._id}>
                  <div className="food-image">
                    🍽️
                  </div>

                  <h3>{food.name}</h3>

                  <p>{food.description}</p>

                  <span className="category">
                    {food.category}
                  </span>

                  <div className="food-bottom">
                    <strong>₹{food.price}</strong>

                    <button onClick={() => addToCart(food)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="cart-section">
          <h2>🛒 Your Cart</h2>

          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              {cart.map((item) => (
                <div className="cart-item" key={item._id}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>₹{item.price} each</p>
                  </div>

                  <div className="quantity">
                    <button
                      onClick={() => decreaseQuantity(item._id)}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item._id)}
                    >
                      +
                    </button>
                  </div>

                  <strong>
                    ₹{item.price * item.quantity}
                  </strong>

                  <button
                    className="remove"
                    onClick={() => removeFromCart(item._id)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <div className="total">
                <h3>Total: ₹{calculateTotal()}</h3>
              </div>

              <div className="order-form">
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <button onClick={placeOrder}>
                  Place Order
                </button>
              </div>
            </>
          )}

          {message && (
            <div className="message">
              {message}
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default App;