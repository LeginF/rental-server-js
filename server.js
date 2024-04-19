import express from "expres";
import cors from "cors";
import records from "./routes/inventory.js";

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/inventory", inventory);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
