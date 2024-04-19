import express from "express";
import db from "../db/connection.js";
import { ObjectId } from "mongodb";
import jsSHA from "jssha";

const customers  = express.Router();

// Get all customers
// TODO: make secure
customers.get("/", async (req, res) => {
  let collection = await db.collection("customers");
  let results = await collection.find({}).toArray();
  res.send(results).status(200);
});

// Get a specific customer
customers.get("/:id", async (req, res) => {
  let collection = await db.collection("customers");
  let document = {
    _id: new ObjectId(req.params.id),
  };
  let results = await collection.findOne(document);
  res.send(results).status(200);
});

// Add new customer
customers.post("/", async(req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.address || 
      !req.body.city ||
      !req.body.state ||
      !req.body.postCode ||
      !req.body.password ||
      !req.body.email) {
      console.log("Cannot create customer. Missing parameter.");
      res.status(400)
        .send("Missing name, email, address, city, state, postCode, or password.");
    } else {
      let newDocument = {
        name: req.body.name,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        postCode: req.body.postCode,
        email: req.body.email,
        password: hashPassword(req.body.password), 
        lastOrderDate: null,
      };
      let collection = await db.collection("customers");
      let result = await collection.insertOne(newDocument);
      console.log(`Created new customer ${result.insertedId}`);
      let returnDoc = {
        _id: result.insertedId,
        token: Date().valueOf(),
      };

      res.send(returnDoc).status(204);
    }
  } catch (err) {
    console.error({
      message: 'Error adding customer', 
      error: err,
    });
    res.status(500).send("Error adding customer");
  }
});

// Update customers.item
customers.patch("/:id", async (req, res) => {
  res.status(501).send("Cannot patch customers at this time");
  try {
    // TODO:
    // get the customers.item
    // update the fields that were passed
    // update the record in the db
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error updating customers.{req.params.id}`);
  }
});

// Delete customers. Maybe remove old/unused accounts.
customers.delete("/", async (req, res) => {
  try {
    res.status(501).send("Deleting customers is unsupported.");
  } catch (err) {
    console.error(err);
    res.status(500).send(`Error deleting customers.{req.params.id}`);
  }
});

customers.post("/:id/login", async (req, res) => {
  try {
    let password = req.body.password;
    let hash = hashPassword(password);
    let collection = await db.collection("customers");
    let id = req.params.id;
    console.log(`Attempting to log in ${id}`);
    let query = {
      _id: new ObjectId(id),
    }
    let customer = await collection.findOne(query);
    if (!customer.password) {
      console.log(`Cannot log in ${id}. Not found.`);
      res.status(403);
    } else {
      if (customer.password === hash) {
        let token = await loginCustomer(customer);
        console.log(`successfully logged in ${id} with token ${token}`);
        res.send(token).status(200);
      } else {
        console.log(`Bad login attempt on ${id}.`);
        res.status(403);
      }
    }
  } catch (err) {
    console.error({
      message: "Cannot log in user.",
      error: err,
    });
    res.status(500).send("Error logging in.");
  }
});

function hashPassword(clearText) {
  const shaObj = new jsSHA("SHA-512", "TEXT", { encoding: "UTF8" });
  shaObj.update(clearText);
  return shaObj.getHash("HEX");
};


function createToken() {
  let currentTimeStamp = new Date().valueOf().toString();
  console.log(`created token ${currentTimeStamp}`);
  return currentTimeStamp;
}


async function loginCustomer(customer) {
  try {
    let currentTimeStamp = new Date().valueOf();
    customer.lastLogin = currentTimeStamp;
    let collection = await db.collection("customers");
    const filter = { 
      _id: new ObjectId(customer._id) 
    };
    const update = {
      $set: {
        lastLogin: customer.lastLogin,
      },
    };
    collection.updateOne(filter, update);
    return createToken();
  } catch (err) {
    console.error(`Error in loginCustomer: ${err}`);
    return null;
  }
}

export default customers;
