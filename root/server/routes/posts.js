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
const { sendResetPasswordEmail } = require('../auth/resetAuth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Users = require("../models/Users");
const Image = require("../models/Image");
const Chat = require("../models/Chat");

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// POST ROUTES

// To register a new user
router.post('/api/user/register', 
  upload.none(),
  body('email').isEmail(),
  body('password')
  .isLength({ min: 8 })
  .matches(/[a-z]/).withMessage('at least one lowercase letter')
  .matches(/[A-Z]/)
  .matches(/[0-9]/)
  .matches(/[~`!@#$%^&*()-_+={}[]|\;:"<>,.?|\/]/) // to include / used \ before /
  
  ,(req, res, next)=>{  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send('Password is not strong enough');
    }
    Users.findOne({email: req.body.email})
        .then(async (user) => {
            if(!user){
              const hashedPassword = await bcrypt.hash(req.body.password, 10)
                let newUser = new Users({
                    name: req.body.name,
                    email: req.body.email,
                    password: hashedPassword,
                    date: new Date()
                });
                newUser.save();
                return res.send(newUser);
            } else {
                return res.status(403).send('Email already in use');
            }
        }).catch((error) => {
            res.status(500).send(`Error occured: ${error}`);
        });
});

// To login a user
router.post('/api/user/login', 
  upload.none(),
  body('email').isEmail(),
  body('password')
  .isLength({ min: 8 })
  .matches(/[a-z]/)
  .matches(/[A-Z]/)
  .matches(/[0-9]/)
  .matches(/[~`!@#$%^&*()-_+={}[]|\;:"<>,.?|\/]/) // to include / used \ before /
  
  ,async (req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send('Invalid credentials');
    }
    Users.findOne({email: req.body.email})
        .then(async (user) => {
            if(user){ // Create a token, if the user
                if(await bcrypt.compare(req.body.password, user.password)){
                    const tokenPayload = {
                        email: user.email
                    }
                    jwt.sign(
                      tokenPayload, 
                      process.env.SECRET,
                      {expiresIn: '2h'}, // I assigned 2 hours for the token to expire
                      (error, token) => {
                          if(error){
                              res.status(403).send(`Error in signing: ${error}`);
                          } else {
                              res.json({
                                success: true,
                                token: token});
                          }
                      })}
                else{
                    res.status(403).send('Invalid credentials');
                }
            }
            else{
                res.status(403).send('Invalid credentials');
            }
        }
    ).catch((error) => {
        res.status(500).send(`Error in .findOne: ${error}`);
    });
});

// To add an image to the user
router.post('/api/user/image', 
  passport.authenticate('jwt', { session: false }),
  upload.single('image'),
  async (req, res)=>{
    if(req.file){
      // If the user has already uploaded an image, I will delete it
      const existingImage = await Image.findOne({email: req.user});
      if(existingImage)
        await Image.deleteOne({email: req.user});

      const image = req.file;
      let newImage = new Image({
        email: req.user,
        buffer: image.buffer,
        mimetype: image.mimetype,
        name: image.originalname,
        encoding: image.encoding
      });
      newImage.save();
      res.json
      ({msg: 'Image uploaded successfully'});
    }
    else{
      res.status(500).json({msg: 'Error occured! Image not uploaded'});
    }
  });

// To update the bio of the user  
router.post('/api/user/bio',
  passport.authenticate('jwt', { session: false }),
  async (req, res)=>{
    let user = await Users.findOne({email: req.user});
    if(user){ // I deleted the previous bio and added the new one
      user.title = req.body.title; 
      user.detail = req.body.detail;
      user.save();
      res.json({msg: 'Bio updated successfully'});
    }
    else{
      res.status(404).json({msg: 'User not found'});
    }
});

// To update the liked users of the user (will feed it to the below post route)
const updateLikedUsers = async (req, res) => {

      /*  LOGIC OF LIKE/UNLIKE: 
       *  In my db, I have a liked & likedBy array in the user schema.
       *  It is easy to update who the user liked, just replace the liked users array with the new one.
       *  Then I will add this current user to the likedBy array of the liked users.
       *  But if the current user unlikes previously liked users, I have to remove the user from the 
       *  likedBy array of the liked users. So I have to keep track of who the user liked before.
       */ 

  try {
      const { likedUsers, unlikedUsers } = req.body;
      const currentUser = req.user;

      // Find the current user
      const user = await Users.findOne({ email: currentUser });
      if (!user) return res.status(404).json({ msg: 'User not found' });

      // Update the current user's liked users
      user.liked = likedUsers;
      await user.save();

      // Find users to update (liked and unliked). Used Promise.all to avoid nested promises
      const [likedUserUpdates, unlikedUserUpdates] = await Promise.all([
          Promise.all(likedUsers.map(email => Users.findOne({ email }))),
          Promise.all(unlikedUsers.map(email => Users.findOne({ email })))
      ]);

      // Process unliked users, remove the current user from their likedBy array
      await Promise.all(unlikedUserUpdates.map(unlikedUser => {
          if (unlikedUser) {
              unlikedUser.likedBy = unlikedUser.likedBy.filter(likedBy => likedBy !== currentUser);
              return unlikedUser.save();
          }
      }));

      // Process liked users, if the current user is not in their likedBy array already, add them
      await Promise.all(likedUserUpdates.map(likedUser => {
          if (likedUser) {
              if (!likedUser.likedBy.includes(currentUser)) { // to avoid duplicates
                  likedUser.likedBy.push(currentUser);
                  return likedUser.save();
              }
          }
      }));
      res.json({ msg: 'Liked users updated successfully' });
  } catch (error) {
      console.error('Error updating liked users:', error);
      res.status(500).json({ msg: 'Server error' });
  }
};

router.post('/api/user/like', passport.authenticate('jwt', { session: false }), updateLikedUsers);

// To save the chat messages, including the sender, recipient, and text
router.post('/api/chat', async (req, res) => {
  try {
    const { sender, recipient, text } = req.body;
    const message = new Chat({ sender, recipient, text });
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Check for the email, and if it exists, send a password reset link
router.post('/api/user/reset-password',
  upload.none(),
  body('email').isEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'invalidEmail' });
    }
    try {
        const user = await Users.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ error: 'noEmail' });

        // Now that the user exists, I will send the password reset link

        // Generate a one-time token
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hour from now

        // Save the token and expiration to the user's record
        user.resetToken = token;
        user.resetTokenExpiration = expiration;
        await user.save();

        try {
        // Send an email with the reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        await sendResetPasswordEmail(user.email, resetLink);
        } catch (error) {
        console.error('Error sending reset password email:', error.message)};

        res.json({ msg: 'resetSuccess' });
    } catch (error) {
        res.status(500).json({ error: 'resetFail' });
    }
  });

router.post('/api/user/reset-password/:token', async (req, res) => {
    try {
        const user = await Users.findOne({
            resetToken: req.params.token,
            resetTokenExpiration: { $gt: Date.now() } // Check if token is still valid
        });

        if (!user) return res.status(400).json({ error: 'invalidOrExpiredToken' });

        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        user.password = hashedPassword;
        user.resetToken = undefined; // Clear the token
        user.resetTokenExpiration = undefined; // Clear the expiration
        await user.save();

        res.json({ msg: 'passwordResetSuccess' });
    } catch (error) {
        res.status(500).json({ error: 'resetFail' });
    }
});



module.exports = router;
