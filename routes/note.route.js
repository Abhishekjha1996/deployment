const express = require("express");
const noteroute = express.Router();
const { NotesModal } = require("../model/notes.model");
const jwt = require("jsonwebtoken");

noteroute.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1]
  const decoded = jwt.verify(token, "secretkey")
  try {
    if (decoded) {
    const data = await NotesModal.find({"userID": decoded.userID })
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(404).send({ "msg": error.message });
  }
});

noteroute.post("/add", async (req, res) => {
  const data = req.body;
  try {
    const node = new NotesModal(data);
    await node.save();
    res.status(200).send(node);
  } catch (error) {
    res.status(404).send({ "msg": error.message });
  }
});

module.exports = {
  noteroute,
};
