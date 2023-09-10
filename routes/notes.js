const express = require("express");
const Notes = require("../models/Notes");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

//Route1: Get all the note; Get: http://localhost:5000/api/notes/fetchallnotes ; login required

router.get("/fetchallnotes",fetchuser, async(req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }
});

//Route2: adding notes; post: http://localhost:5000/api/notes/addnotes ; login required

router.post("/addnote",[
  body('title',"Title should be more than 5 letters").isLength({min: 5}),
  body('description').isLength({min: 10}),
  body('status').isLength({min: 3})
], fetchuser, async(req, res) => {
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { title, description, status } = req.body;
    // If there is bad request or any error

    

    let note = new Notes({
      title,
      description,
      status,
      user: req.user.id,
    });
    const saved = await note.save();

    res.json(saved);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }
});

// Route 3: Updating an existing notes; POST: "http://localhost:5000/api/notes/updatenote/:id" ; login required

router.put("/updatenote/:id", fetchuser, async (req, res) => {
  
  const { title, description, status } = req.body;
  
  let newnote ={}
  
  if(title){newnote.title = title}
  if(description){newnote.description = description}
  if(status){newnote.status = status}

  try{

    //checking if note is exists or not
    let note = await Notes.findById(req.params.id)
    if(!note){
      return res.status(404).send("Not Found");
    }
    
    //checking if its a same user or not
    if(note.user.toString()!==req.user.id){
      return res.status(401).send("Not Allowed");
    }
    
    
    //updating note
    note = await Notes.findByIdAndUpdate(req.params.id, {$set:newnote}, {new:true})
    res.json({note})
  }catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }

});

router.delete("/deletenote/:id", fetchuser, async (req, res) => {

  try {
    //checking if note is exists or not
    let note = await Notes.findById(req.params.id);
    if (!note) {
      return res.status(404).send("Not Found");
    }

    //checking if its a same user or not
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    //Deleting notes
    note = await Notes.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted.", note: note });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Internal error occured");
  }


});


module.exports = router;
