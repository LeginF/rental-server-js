import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";

const inventory  = express.Router();

export async function getAllInventory() {
  console.log("getAllInventory");
  let collection = await db.collection("inventory");
  let results = undefined;
  results = await collection.find({}).toArray();
  return results;
}

// Get items in the inventory
inventory.get("/", async (req, res) => {
  let results = await getAllInventory();
  res.send(results).status(200);
});

// Add new inventory item
// TODO: Make secure
inventory.post("/", async(req, res) => {
  try {
    let newDocument = {
      name: req.body.name,
      description: req.body.description,
      imageUrl: req.body.imageUrl,
      count: req.body.count,
    };
    let collection = await db.collection("inventory");
    let result = await collection.insertOne(newDocument);
    console.log(`Created new inventory item ${result.insertedId}`);
    res.send(result).status(204);
  } catch (err) {
    console.error({
      message: 'Error adding inventory', 
      error: err
    });
    res.status(500).send("Error adding inventory");
  }
});

// Update inventory item
inventory.patch("/:id", async (req, res) => {
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

// Delete inventory item
inventory.delete("/:id", async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      res.status(400).send("ID required.");
    } else {
      let document = {
        _id: new ObjectId(id) 
      };
      console.log(document);
      let collection = await db.collection("inventory");
      let result = await collection.deleteOne(document);
      if (result.deletedCount === 0) {
        res.status(404).send(`Cannot delete ${id}. Not found.`);
        console.log(`failed to delete ${id}. Not found.`);
      } else {
        console.log(`deleted inventory item ${id}`);
        res.send(result).status(204);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error deleting inventory {req.params.id}`);
  }
});


export default inventory;
