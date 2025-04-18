// import path from 'path';
// require('dotenv').config();
// require('DB_URI').env;
// require('dotenv').config();
require('dotenv').config({ path: '../.env' }); 




if (!process.env.ACCESS_TOKEN_SECRET) {
    throw new Error("ACCESS_TOKEN_SECRET is missing in .env");
  }

// const config = require("./config.json")
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const User = require('./models/user.model');
const Note = require('./models/note.model');
// const __dirname = path.resolve();

const express = require('express');
const cors = require('cors');

const app = express();
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utilities');
const path = require('path');

// const __dirname = require('path').resolve();
const path = require('path'); // Keep only this one
const __dirname = path.resolve();

app.use(express.json());
app.use(cors({
     origin: process.env.FRONTEND_URL || "http://localhost:5173",
     credentials: true }));
app.get('/', (req, res) => {
    res.json({data: 'Hello World!'});
});
// create acc
app.post("/create-account", async (req, res) => {
    const {fullName, email, password} = req.body;
    if (!fullName) {
        return res
        .status(400)
        .json({error: true, message: 'Full name is required'});
    }
    if (!email) {
        return res
        .status(400)
        .json({error: true, message: 'Email is required'});
    }
    if (!password) {
        return res
        .status(400)
        .json({error: true, message: 'Password is required'});
    }
    const isUser = await User.findOne({email: email});
    if (isUser) {
        return res
        .status(400)
        .json({error: true, message: 'Email already exists'});
    }
    const user = new User({
        fullName,
        email,
        password,
    });
    await user.save();
    const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
    });
    return res.json({
        error: false,
        message: 'Account created successfully',

    })
})





// login
app.post("/login", async (req, res) => {
    const {email, password} = req.body;

    if (!email) {
        return res
        .status(400)
        .json({error: true, message: 'Email is required'});
    }
    if (!password) {
        return res
        .status(400)
        .json({error: true, message: 'Password is required'});
    }
    const userInfo = await User.findOne({email: email});
    if (!userInfo) {
        return res
        .status(400)
        .json({error: true, message: 'Email or password is incorrect'});
    }
    if (userInfo.email == email && userInfo.password == password) {
       const user = { user: userInfo };
       const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1h',
       });
       return res.json({
        error: false,
        message: "Login successful",
        email,
        accessToken,
       });
    } else{
        return res
        .status(400)
        .json({error: true, message: 'Email or password is incorrect'});
    }
});


// get user
app.get("/get-user", authenticateToken, async (req, res) => {
    try {
        const { user } = req.user;
        const isUser = await User.findById(user._id);
        
        if (!isUser) {
            return res
                .status(404)
                .json({ error: true, message: 'User not found' });
        }

        return res.json({
            user: {
                _id: isUser._id,
                fullName: isUser.fullName,
                email: isUser.email,
                createdOn: isUser.createdOn,
            },
            message: ""
        });
    } catch (error) {
        return res
            .status(500)
            .json({ error: true, message: error.message });
    }
});





// add notes
app.post("/add-note", authenticateToken, async (req, res) => {
    const {title, content, tags}= req.body;
    const {user} = req.user;
    if (!title) {
        return res
        .status(400)
        .json({error: true, message: 'Title is required'});
    }
    if (!content) {
        return res
        .status(400)
        .json({error: true, message: 'Content is required'});
    }
    try {
        const note = new Note({
            title,
            content,
            tags: tags || [],
            userId: user._id,
        });
        await note.save();
        return res.json({
            error: false,
            message: "Note added successfully",
            note,
        });
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
});

// edit notes
app.put("/edit-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {title, content, tags, isPinned} = req.body;
    const {user} = req.user;
    if (!title && !content && !tags) {
        return res
        .status(400)
        .json({error: true, message: 'At least one field is required'});
    }

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id,
        });
        if (!note) {
            return res
            .status(400)
            .json({error: true, message: 'Note not found'});
        }
        if (title) {
            note.title = title;
        }
        if (content) {
            note.content = content;
        }
        if (tags) {
            note.tags = tags;
        }
        if (isPinned) {
            note.isPinned = isPinned;
        }
        await note.save();
        return res.json({
            error: false,
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
});



// get all notes
app.get("/get-all-notes", authenticateToken, async (req, res) => {
    const {user} = req.user;
    try {
        const notes = await Note.find({userId: user._id}).sort({isPinned: -1});
        return res.json({
            error: false,
            message: "Notes fetched successfully",
            notes,
    });
    }
    catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
    
});


// delete note
app.delete("/delete-note/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const {user} = req.user;
    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id,
            });
            if (!note) {
            return res
            .status(400)
            .json({error: true, message: 'Note not found'});
        }
        await note.deleteOne({_id: noteId, userId: user._id});
        return res.json({
            error: false,
            message: "Note deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({error: true, message: error.message});
    }
});


// update isPinned
app.put("/update-note-pinned/:noteId", authenticateToken, async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    const { user } = req.user;

    if (isPinned === undefined) {
        return res
            .status(400)
            .json({ error: true, message: 'isPinned field is required' });
    }

    try {
        const note = await Note.findOne({
            _id: noteId,
            userId: user._id,
        });

        if (!note) {
            return res
                .status(400)
                .json({ error: true, message: 'Note not found' });
        }

        note.isPinned = isPinned;
        await note.save();

        return res.json({
            error: false,
            message: "Note updated successfully",
            note,
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: error.message });
    }
});

// search notes
app.get("/search-notes/", authenticateToken, async (req, res) => {
    const { user } = req.user;
    const { query } = req.query;
 
    if (!query) {
        return res
            .status(400)
            .json({ error: true, message: "Search query is required" });
    }
 
    try {
        const matchingNotes = await Note.find({
            userId: user._id,
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { content: { $regex: new RegExp(query, "i") } },
            ],
        });
     
        return res.json({
            error: false,
            notes: matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
     } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
     }
 });


 if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
 }


app.listen(8000);
module.exports = app;