import express from "express";
import db from "../db/connection.js";
import { ObjectID } from "mongodb";

const router = express.Router();

// Get items in the inventory
// If no parameters, return the complete inventory
// If start and end parameters, return items that are
// available between those dates.
router.get("/", async (req, res) => {
  let collection = await db.colection("inventory");
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

// Add new inventory item
// TODO: Make secure
router.post("/", async(req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      count: req.body.count,
    };
    let collection = await db.collection("inventory");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding inventory");
  }
});

// Update inventory item
router.patch("/:id", async (req, res) => {
  res.status(501).send("Cannot patch inventory at this time");
  try {
    // TODO:
    // get the inventory item
    // update the fields that were passed
    // update the record in the db
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error updating inventory {req.params.id}`);
  }
});
