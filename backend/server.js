const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("MongoDB Connection Error:", error.message);
  });

// Food Schema
const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model("Food", foodSchema);

// Order Schema
const orderSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
    },
    items: [
      {
        foodId: String,
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

// Health Check
app.get("/", (req, res) => {
  res.json({
    message: "Food Ordering API is running",
  });
});

// Get all food items
app.get("/api/foods", async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.json(foods);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch food items",
    });
  }
});

// Add food item
app.post("/api/foods", async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const food = await Food.create({
      name,
      description,
      price,
      category,
    });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add food item",
    });
  }
});

// Create order
app.post("/api/orders", async (req, res) => {
  try {
    const { customerName, items, totalAmount } = req.body;

    if (!customerName || !items || items.length === 0 || !totalAmount) {
      return res.status(400).json({
        message: "Invalid order data",
      });
    }

    const order = await Order.create({
      customerName,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create order",
    });
  }
});

// Get all orders
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
});

// Delete order
app.delete("/api/orders/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete order",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});