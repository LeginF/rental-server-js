import express from "express";
import cors from "cors";
import inventory from "./routes/inventory.js";
import customers from "./routes/customers.js";
import reservations from "./routes/reservations.js";
import availableInventory from "./routes/availableInventory.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/inventory", inventory);
app.use("/customers", customers);
app.use("/reservations", reservations);
app.use("/availableInventory", availableInventory);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
