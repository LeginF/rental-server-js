import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const reservations = express.Router();

export async function getReservations(startDate, endDate) {
  let collection = await db.collection("reservations");
  let results = undefined;
  if (startDate && endDate) {
    // either the reservation's start or end date
    // to fall between the query's start and end dates
    let filter = {
      $or: [
        {
          startDate: { 
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        },
        {
          endDate: {
            $lte: new Date(endDate),
            $gte: new Date(startDate),
          },
        }
      ]
    }
    results = await collection.find(filter).toArray();
  } else {
    results = await collection.find({}).toArray();
  }
  return results;
}

// Get items in the inventory
// If no parameters, return the complete inventory
// If start and end parameters, return items that are
// available between those dates.
reservations.get("/", async (req, res) => {
  try {
    let startDate = req.query['start'];
    let endDate = req.query['end'];
    let results = await getReservations(startDate, endDate);
    res.send(results).status(200);
  } catch (err) {
    console.error({
      message: "Error getting reservations",
      error: err,
    });
    res.send(err).status(500);
  }
});

// Add new reservations.item
// TODO: Verify customer and reservation
reservations.post("/", async(req, res) => {
  try {
    let newDocument = {
      customerId: req.body.customerId,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate),
      items: req.body.items,
      ccAuthorization: null,
      cost: null,
    };
    let collection = await db.collection("reservations");
    let result = await collection.insertOne(newDocument);
    console.log(`Created new reservation ${result.insertedId}`);
    res.send(result).status(204);
  } catch (err) {
    console.error({
      message: 'Error adding reservation.',
      error: err
    });
    res.status(500).send("Error adding reservation.");
  }
});

// Update reservations.item
reservations.patch("/:id", async (req, res) => {
  res.status(501).send("Cannot patch reservations.at this time");
  try {
    // TODO:
    // get the reservations.item
    // update the fields that were passed
    // update the record in the db
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error updating reservations.{req.params.id}`);
  }
});

// Delete reservations.item
reservations.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      res.status(400).send("ID required.");
    } else {
      let document = {
        _id: new ObjectId(id) 
      };
      console.log(document);
      let collection = await db.collection("reservations");
      let result = await collection.deleteOne(document);
      if (result.deletedCount === 0) {
        res.status(404).send(`Cannot delete ${id}. Not found.`);
        console.log(`failed to delete ${id}. Not found.`);
      } else {
        console.log(`deleted reservations.item ${id}`);
        res.send(result).status(204);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error deleting reservations.{req.params.id}`);
  }
});


export default reservations;
