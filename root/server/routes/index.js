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

// POST ROUTES

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
        console.log(req.body.password);
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
                //res.redirect('/login.html');
            } else {
                return res.status(403).send('Email already in use');
            }
        }).catch((error) => {
            res.status(500).send(`Error occured: ${error}`);
        });
});

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
            if(user){
                if(await bcrypt.compare(req.body.password, user.password)){
                    const tokenPayload = {
                        email: user.email
                    }
                    jwt.sign(
                      tokenPayload, 
                      process.env.SECRET,
                      {expiresIn: '1h'},
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

  router.post('/api/user/bio',
    passport.authenticate('jwt', { session: false }),
    async (req, res)=>{
      let user = await Users.findOne({email: req.user});
      if(user){
        user.title = req.body.title;
        user.detail = req.body.detail;
        user.save();
        res.json({msg: 'Bio updated successfully'});
      }
      else{
        res.status(404).json({msg: 'User not found'});
      }
  }
);

const updateLikedUsers = async (req, res) => {
  try {
      const { likedUsers, unlikedUsers } = req.body;
      const currentUser = req.user;

      // Find the current user
      const user = await Users.findOne({ email: currentUser });
      if (!user) return res.status(404).json({ msg: 'User not found' });

      // Update the current user's liked users
      user.liked = likedUsers;
      await user.save();

      // Find users to update (liked and unliked)
      const [likedUserUpdates, unlikedUserUpdates] = await Promise.all([
          Promise.all(likedUsers.map(email => Users.findOne({ email }))),
          Promise.all(unlikedUsers.map(email => Users.findOne({ email })))
      ]);

      // Process unliked users
      await Promise.all(unlikedUserUpdates.map(unlikedUser => {
          if (unlikedUser) {
              unlikedUser.likedBy = unlikedUser.likedBy.filter(likedBy => likedBy !== currentUser);
              return unlikedUser.save();
          }
      }));

      // Process liked users
      await Promise.all(likedUserUpdates.map(likedUser => {
          if (likedUser) {
              if (!likedUser.likedBy.includes(currentUser)) {
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


// GET ROUTES

router.get('/api/user/check-auth', 
  passport.authenticate('jwt', { session: false }),
  (req, res)=>{

    if(req.user){
      res.json({isAuthenticated: true});
    }
    else{
      res.status(403).json({isAuthenticated: false});
    }
});

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

router.get('/api/user/image', 
  passport.authenticate('jwt', { session: false }),
  async (req, res)=>{
    let image = await Image.findOne({email: req.user});
    if(image){
      res.setHeader('Content-Type', image.mimetype);
      res.setHeader('Content-Disposition', 'inline');
      res.send(image.buffer);
    }
    else{
      res.status(404).json({msg: 'Image not found'});
    }
});

router.get('/api/all-users',
  passport.authenticate('jwt', { session: false }), 
  async (req, res) => {
    try {
      let rawData = await Users.find();
      let restOfUsers = rawData.filter(user => user.email !== req.user.email); 

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

router.get('/api/chat', async (req, res) => {
  try {
    const { sender, recipient } = req.query;
    const messages = await Chat.find({
      $or: [
        { sender, recipient },
        { sender: recipient, recipient: sender }
      ]
    }).sort({ timestamp: 1 }); // Sort by timestamp in ascending order
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

router.get('/api/auth/google', 
  passport.authenticate('google', { scope: ['profile', 'email', 'openid']}));


router.get('/api/auth/google/callback', 
  passport.authenticate('google', { session: false }),
  (req, res)=>{
    try {
      if(req.user){
        const tokenPayload = {
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
                  res.redirect(`http://localhost:3000/auth/google?token=${token}`);
              }
          });
      }
    } catch (error) {
      res.status(500).send(`Nanni Error occured: ${error}`);
    }
  });

module.exports = router;