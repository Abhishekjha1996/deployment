const express = require("express");
const router = express.Router();
const { UserModal } = require("../model/register.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// router.get("/", (req, res) => {
//   res.send("hello");
// });

router.post("/register", async (req, res) => {
  const { email, pass, location, age } = req.body;
  try {
    bcrypt.hash(pass, 5, async (err, hash) => {
   const user = new UserModal({ email, pass:hash, location, age });
   await user.save();
   res.status(200).send({ "msg": "Register has done" })
    });
  } catch (error) {
    res.status(404).send({ "msg": error.message });
  }
});

router.post("/login", async (req, res) => {
  const {email, pass} = req.body;
  try {
    const user = await UserModal.findOne({email})
    if(user) {
      bcrypt.compare(pass, user.pass, (err, result) => {
        if(result) {
          res.status(200).send({
            msg: "login has done",
   "token": jwt.sign({"userID": user._id }, "secretkey")})
        }else {
          res.status(404).send({"msg": "login has not done"})    
        }
    });
      
    } 
  } catch (error) {
    res.status(404).send({ "msg": error.message });
  }
});

// router.get("/details", (req, res) => {
//   const { token } = req.query;

//   jwt.verify(token, "secretkey", (err, decoded) => {
//     decoded
//       ? res.status(200).send({ msg: "userdetails" })
//       : res.status(404).send({ msg: "error detected" });
//   });
// });

// router.get("/movies", (req, res) => {
//   const token = req.headers.authorization;

//   jwt.verify(token, "secretkey", (err, decoded) => {
//     decoded
//       ? res.status(200).send({ msg: "userdetails" })
//       : res.status(404).send({ msg: "error detected" });
//   });
// });

module.exports = {
  router,
};
