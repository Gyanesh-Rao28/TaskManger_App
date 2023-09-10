const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "n83bf929bf845hdi93hb"

// route 1: create a user  using : post "/api/auth/createuser" . Doesnt required auth
router.post("/signup",[
  body('username').isLength({min: 3}),
  body('email').isEmail(),
  body('password').isLength({min: 5})

] ,async (req, res) => {

  let success  = false

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
   return res.status(400).json({ errors: errors.array() });
  }

  
  // hasing and salting
  const salt = await bcrypt.genSalt(10)
  const xPass = await bcrypt.hash(req.body.password,salt);
  
  try{
    // check whether email exits or not
    let user = await User.findOne({email: req.body.email})
    if(user){
      return res.status(400).json({ success, errors: "Email already exits." });
    }
    //sending to database and creating a use
    user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: xPass,
    })

    const data = {
      user:{
        id:user.id,
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success, authToken });

  }catch(err){
    console.error(err.message);
    res.status(500).send("Internal error occured")
  }
})

//Route 2:  Authneticate a use : post "/api/auth/login"

router.post("/login",[
  body('email','Enter a valid email').isEmail(),
  body('password',"Password can't be blank").exists()
] ,async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  let success = false
  
  const {email, password} = req.body

  try{
    //email id exists or not
    let user = await User.findOne({ email });
    if(!user){
      success = false
      return res.status(400).json({ success, error:"Invalid credentials" });
    }
    //password veirfication
    const passwordComp = await bcrypt.compare(password,user.password)
    if(!passwordComp){
      success = false
      return res.status(400).json({ success, error: "Invalid credentials" });
    }

    const data = {
      user: {
        id: user.id,
      },
    };

    const authToken = jwt.sign(data, JWT_SECRET);
    success = true
    res.json({ success, authToken })

  }catch(err){
    console.error(err.message);
    success = false
    res.status(500).send("Internal error occured");
  }
})

//Route 3: Get logged user details; Post: "/api/auth/getuser": login required
router.post("/getuser", fetchuser, async (req, res) => {
  try {
    // console.log(req.user)
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user)
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }
});

module.exports = router
 