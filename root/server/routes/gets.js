var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {body, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('dotenv').config();
require('../auth/validateToken');
require('../auth/googleAuth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const Users = require("../models/Users");
const Image = require("../models/Image");
const Chat = require("../models/Chat");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// GET ROUTES

// To get the user's information
router.get('/api/user',
  passport.authenticate('jwt', { session: false }),
  async (req, res)=>{
    let user = await Users.findOne({email: req.user});
    if(user){
      res.json(user);
    }
    else{
      res.status(404).json({msg: 'User not found'});
    }
});

// To get the user's image
router.get('/api/user/image', 
  passport.authenticate('jwt', { session: false }),
  async (req, res)=>{
    try {
      let image = await Image.findOne({email: req.user});
      if(image){
        res.setHeader('Content-Type', image.mimetype);
        res.setHeader('Content-Disposition', 'inline');
        res.send(image.buffer);
      }
      else{
        res.status(404).json({msg: 'Image not found'});
      }
    } catch (error) {
      res.status(500).json({msg: 'Server error'});
    }
});

// To get all users, used to create the slider to suggest users
router.get('/api/all-users',
  passport.authenticate('jwt', { session: false }), 
  async (req, res) => {
    try {
      let allUsers = await Users.find();
      let restOfUsers = allUsers.filter(user => user.email !== req.user.email); // so I won't suggest myself

      let usersWithImages = await Promise.all(
        restOfUsers.map(async user => {
          let image = await Image.findOne({ email: user.email });
          return {
            ...user.toObject(), 
            image: image ? `data:${image.mimetype};base64,${image.buffer.toString('base64')}` : null
          };
        })
      );
      res.json(usersWithImages);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
});

// To get whom the user liked
router.get('/api/user/like',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
      try {
          const user = await Users.findOne({ email: req.user });
          if (!user) return res.status(404).json({ msg: 'User not found' });
          res.json({ likedUsers: user.liked });
      } catch (error) {
          console.error('Error fetching liked users:', error);
          res.status(500).json({ msg: 'Server error' });
      }
  }
);

// To get the chat messages between two users
router.get('/api/chat', async (req, res) => {
  try {
    const { sender, recipient } = req.query;
    const messages = await Chat.find({
      $or: [ // used $or to get messages irrespective of the sender or recipient
        { sender, recipient }, 
        { sender: recipient, recipient: sender }
      ]
    }).sort({ timestamp: 1 }); // Sort by timestamp (which is in the chat db) in ascending order
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// To initiate the Google OAuth process
router.get('/api/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email', 'openid']}));

// This is what I gave as the redirect URL in the Google Cloud Console
router.get('/api/auth/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res)=>{
    try {
      if(req.user){ // If the user is found in the db
        const tokenPayload = { // Create a token payload, to do equivalent of what I did in the login route
          email: req.user.email
        }
        jwt.sign(
          tokenPayload, 
          process.env.SECRET,
          {expiresIn: '1h'},
          (error, token) => {
              if(error){
                  res.status(403).send(`Error in token signing: ${error}`);
              } else {
                  res.redirect(`http://localhost:3000/auth/google?token=${token}`); // Redirect to the frontend with the token
              }
          });
      }
    } catch (error) {
      res.status(500).send(`Nanni Error occured: ${error}`);
    }
  });

module.exports = router;