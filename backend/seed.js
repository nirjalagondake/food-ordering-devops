const mongoose = require("mongoose");
require("dotenv").config();

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String
});

const Food = mongoose.model("Food", foodSchema);

const foods = [
  {
    name: "Pizza",
    description: "Cheese pizza",
    price: 199,
    category: "Pizza"
  },
  {
    name: "Burger",
    description: "Classic cheese burger",
    price: 149,
    category: "Burger"
  },
  {
    name: "Pasta",
    description: "Creamy white sauce pasta",
    price: 179,
    category: "Pasta"
  },
  {
    name: "Sandwich",
    description: "Fresh vegetable sandwich",
    price: 99,
    category: "Sandwich"
  },
  {
    name: "Biryani",
    description: "Chicken biryani",
    price: 249,
    category: "Biryani"
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Food.deleteMany();

    await Food.insertMany(foods);

    console.log("Food data inserted successfully");

    await mongoose.connection.close();

    console.log("Database connection closed");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

seedDatabase();