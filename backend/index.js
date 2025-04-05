const express = require("express");
const db = require("./config/db");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/productRoutes");
require("dotenv").config();
app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);

db();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server is running on port 5000");
});
