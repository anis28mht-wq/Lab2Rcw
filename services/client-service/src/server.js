import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import routes from "./routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ service: "client-service", status: "UP" }));
app.use("/api/clients", routes);

// Middleware d'erreurs centralisé : transforme les erreurs levées par le
// service (avec un champ .status) en réponses HTTP cohérentes.
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(err.status || 500).json({ message: err.message || "Erreur interne du serveur" });
});

const PORT = process.env.PORT || 4001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/eventia_clients";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`client-service sur le port ${PORT}`));
  })
  .catch((err) => {
    console.error("Erreur de connexion MongoDB :", err.message);
    process.exit(1);
  });
