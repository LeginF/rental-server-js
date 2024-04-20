import express from "express";
import { getAllInventory } from "../routes/inventory.js";

const availableInventory = express.Router();

availableInventory.get("/", async (req,res) => {
  try {
    // get all inventory
    let inventory = await getAllInventory();
    // get reservations between dates
    // subtract reservation items from inventory
    // return inventory
    res.send(inventory).status(200);
  } catch (err) {
    console.log(`Error in availableInventory ${err}`);
    res.send(err).status(500);
  }
});

export default availableInventory;
