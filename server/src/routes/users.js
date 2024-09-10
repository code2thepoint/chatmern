const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const config = require('../config');
const jwtAuth = passport.authenticate('jwt', { session: false });
const User = require('../models/users');
const Message = require('../models/message');

const router = express.Router();


router.get('/currentuser', jwtAuth, (async (req, res) => {
  res.json(renderFields(req.user));
}));

router.post('/signup', async (req, res) => {
  try {
    let newUser = req.body;

    const userExist = await User.find()
      .or([{ username: newUser.username }, { email: newUser.email }])
      .then(users => users.length > 0);

    if (userExist) {
      console.log(
        `Email [${newUser.email}] or username [${newUser.username}] already exist in the database`
      );
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hash = await bcrypt.hash(newUser.password, 10);

    const createdUser = await new User({
      ...newUser,
      password: hash,
    }).save();

    res.status(201).json({
      token: createToken(createdUser._id),
      user: renderFields(createdUser),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

async function obtainUser(criteria) {
  try {
    return await User.findOne(criteria);
  } catch (error) {
    throw new Error('Error to obtain the user: ' + error.message);
  }
}

router.post('/login', async (req, res) => {
  try {
    let userNotAuthenticated = req.body;

    let userRegistered = await obtainUser({ email: userNotAuthenticated.email });

    if (!userRegistered) {
      console.log(
        `[${userNotAuthenticated.email}] does not exist. You could not be authenticated`
      );
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    let correctPass = await bcrypt.compare(
      userNotAuthenticated.password,
      userRegistered.password
    );

    if (correctPass) {
      let token = createToken(userRegistered._id);

      console.log(
        `${userNotAuthenticated.email} successfully authenticated.`
      );

      const user = renderFields(userRegistered);

      res.status(200).json({ token, user });
    } else {
      console.log(`${userNotAuthenticated.email} incorrect password`);
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

function createToken(userId) {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn
  });
}

function renderFields(user) {
  return {
    _id: user._id || user.id,  
    email: user.email,
    username: user.username,
    firstImage: user.firstImage,
  };
}


///////////////




router.get('/hi', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching users' });
  }   
}); 


router.post("/messages", async (req, res) => {
  try {
    const { senderId, recepientId, messageText } = req.body;

    console.log("Received data:", req.body);

    const newMessage = new Message({
      senderId,
      recepientId,
      message: messageText,
      timestamp: new Date(),
    });

    await newMessage.save();

    res.status(200).json({ message: "Message sent Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

 

router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;  


    const recepientId = await User.findById(userId);  

    res.json(recepientId);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});







router.get("/messages/:senderId/:recepientId", async (req, res) => {
  try {
    const { senderId, recepientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/deleteMessages", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "invalid req body!" });
    }

    await Message.deleteMany({ _id: { $in: messages } });

    res.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server" });
  }
});










module.exports = router;



