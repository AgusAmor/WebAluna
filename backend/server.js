import express from "express";
import cors from "cors";
import productsRoutes from "./src/routes/products.routes.js";
import userRoutes from "./src/routes/users.routes.js";

const app = express();
const PORT = 5000;

app.use(express.json({ limit: "10mb" }));

app.use(cors());
app.use(express.json());

app.use("/products", productsRoutes);
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
