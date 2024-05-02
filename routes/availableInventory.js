import express from "express";
import { getAllInventory } from "../routes/inventory.js";
import { getReservations } from "../routes/reservations.js";
import { ObjectId } from "mongodb";

const availableInventory = express.Router();

availableInventory.get("/", async (req,res) => {
  try {
    const startDate = req.query['start'];
    const endDate = req.query['end'];
    console.log(`get availableInventory ${startDate} ${endDate}`);
    if (!startDate || !endDate) {
      console.error('availableInventory request missing dates');
      res.status(400).send('Missing start/end date(s)');
      return;
    }
    // get all inventory
    const  inventory = await getAllInventory(startDate, endDate);
    // build an inventory map
    const map = new Map(
      inventory.map((item) => [
        item._id.toString(),
        item
      ]));
    // get reservations between dates
    const reservations= await getReservations(startDate, endDate);
    // subtract reserved items from inventory
    reservations.forEach((reservation) => {
      reservation.items.forEach((itemId) => {
        let item = map.get(itemId);
        item.count--;
      });
    });
    // return inventory
    let retValue = {
      inventory: inventory,
      startDate: startDate,
      endDate: endDate,
    };
    res.send(retValue).status(200);
  } catch (err) {
    console.log(`Error in availableInventory ${err}`);
    res.send(err).status(500);
  }
});

export default availableInventory;
