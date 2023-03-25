const express = require("express");
const noteroute = express.Router();
const { NotesModal } = require("../model/notes.model");
const jwt = require("jsonwebtoken");

noteroute.get("/", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secretkey");
  try {
    if (decoded) {
      const data = await NotesModal.find({ userID: decoded.userID });
      res.status(200).send(data);
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

noteroute.post("/add", async (req, res) => {
  const data = req.body;
  try {
    const node = new NotesModal(data);
    await node.save();
    res.status(200).send(node);
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

noteroute.patch("/update/:noteID", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secretkey");
  const noteID = req.params.noteID;
  const req_id = decoded.userID;
  const note = await NotesModal.findOne({ _id: noteID });
  const userID_in_note = note.userID;
  const newdata = req.body;

  try {
    if (req_id === userID_in_note) {
      await NotesModal.findByIdAndUpdate({ _id: noteID }, newdata);
      res.status(200).send({ msg: "data has been updated" });
    } else {
      res.status(404).send({ msg: "Not Authorised !" });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});

noteroute.delete("/delete/:noteID", async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, "secretkey");
  const noteID = req.params.noteID;
  const req_id = decoded.userID;
  const note = await NotesModal.findOne({ _id: noteID });
  const userID_in_note = note.userID;

  try {
    if (req_id === userID_in_note) {
      await NotesModal.findByIdAndDelete({ _id: noteID });
      res.status(200).send({ msg: "data jas been deleted" });
    } else {
      res.status(404).send({ msg: "Not Authorised" });
    }
  } catch (error) {
    res.status(404).send({ msg: error.message });
  }
});


module.exports = {
  noteroute,
};
