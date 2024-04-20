import express from "express";
import { getAllInventory } from "../routes/inventory.js";
import { getReservations } from "../routes/reservations.js";
import { ObjectId } from "mongodb";

const availableInventory = express.Router();

availableInventory.get("/", async (req,res) => {
  try {
    const startDate = req.query['start'];
    const endDate = req.query['end'];
    // get all inventory
    let inventory = await getAllInventory();
    // get reservations between dates
    let reservations= await getReservations(startDate, endDate);
    const map = new Map(
      inventory.map((item) => [
        item._id.toString(),
        item
      ]));
    console.log('map');
    console.log(map);
    // subtract reservation items from inventory
    reservations.forEach((reservation) => {
      reservation.items.forEach((itemId) => {
        console.log(`ItemId: ${itemId}`);
        let item = map.get(itemId);
        item.count--;
      });
    });
    // return inventory
    res.send(inventory).status(200);
  } catch (err) {
    console.log(`Error in availableInventory ${err}`);
    res.send(err).status(500);
  }
});

export default availableInventory;
