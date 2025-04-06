import express from "express";
import Workout from "../models/workout.js";

const router = express.Router();

// Insert Single Workout
router.post("/insert", (req, res) => {
  const input = req.body;
  Workout.create(input)
    .then(() => res.send({ message: "Workout added" }))
    .catch((err) => console.log(err));
});

// Insert Many
router.post("/insertMany", (req, res) => {
  const input = req.body;
  Workout.insertMany(input)
    .then((result) => res.send({ message: `${result.length} records added` }))
    .catch((err) => console.log(err));
});

// Retrieve
router.get("/retrieve", (req, res) => {
  const input = req.query;
  Workout.find(input)
    .then((result) => res.send({ message: result }))
    .catch((err) => console.log(err));
});

// Update
router.put("/update", (req, res) => {
  const input = req.body;
  const key = { _id: input._id };
  const update_fields = input.fields;

  Workout.updateOne(key, { $set: update_fields })
    .then((result) => res.send({ message: result }))
    .catch((err) => console.log(err));
});

// Delete
router.delete("/delete", (req, res) => {
  const input = req.query;
  Workout.deleteOne(input)
    .then((result) => res.send({ message: result.deletedCount }))
    .catch((err) => console.log(err));
});

export default router;
