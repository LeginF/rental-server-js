import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const reservations = express.Router();

// Get items in the inventory
// If no parameters, return the complete inventory
// If start and end parameters, return items that are
// available between those dates.
reservations.get("/", async (req, res) => {
  let collection = await db.collection("reservations");
  let startDate = req.query['start'];
  let endDate = req.query['end'];
  let results = undefined;
  if (startDate && endDate) {
    // TODO: retrieve items not reserved
  } else {
    results = await collection.find({}).toArray();
  }
  res.send(results).status(200);
});

// Add new reservations.item
// TODO: Make secure
reservations.post("/", async(req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      count: req.body.count,
    };
    let collection = await db.collection("reservations");
    let result = await collection.insertOne(newDocument);
    console.log(`Created new reservations.item ${result.insertedId}`);
    res.send(result).status(204);
  } catch (err) {
    console.error({
      message: 'Error adding reservations.',
      error: err
    });
    res.status(500).send("Error adding reservations.");
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
