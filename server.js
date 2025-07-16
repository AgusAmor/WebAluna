import express from "express";
import { db } from "./src/config/firebase.js";

const app = express();
const PORT = 5000;

app.get("/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    res.json(products);
  } catch (error) {
    console.error("Error al traer productos:", error);
    res.status(500).json({ error: "Error al conectarse a Firestore" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
