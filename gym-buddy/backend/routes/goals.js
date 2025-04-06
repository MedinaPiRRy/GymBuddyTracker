import express from "express";
import Goal from "../models/goal.js";

const router = express.Router();

// Create
router.post("/insert", (req, res) => {
  const input = req.body;
  Goal.create(input)
    .then(() => res.send({ message: "Goal added" }))
    .catch((err) => console.log(err));
});

// Read
router.get("/retrieve", (req, res) => {
  const input = req.query;
  Goal.find(input)
    .then((result) => res.send({ message: result }))
    .catch((err) => console.log(err));
});

// Update
router.put("/update", (req, res) => {
  const input = req.body;
  const key = { _id: input._id };
  const update_fields = input.fields;

  Goal.updateOne(key, { $set: update_fields })
    .then((result) => res.send({ message: result }))
    .catch((err) => console.log(err));
});

// Delete
router.delete("/delete", (req, res) => {
  const input = req.query;
  Goal.deleteOne(input)
    .then((result) => res.send({ message: result.deletedCount }))
    .catch((err) => console.log(err));
});

export default router;
