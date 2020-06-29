const express = require('express');

const {
  people,
  peopleSignup,
  addMessagePeople,
  showMessagesPeople,
  showMessagePeople,
  deleteMessagePeople,
} = require('../controller/peopleController');

const { auth } = require('../middleware');

const router = new express.Router();

router.get('/', auth, people);
router.post('/signup', peopleSignup);
router.post('/message', auth, addMessagePeople);
router.get('/message/:id', auth, showMessagePeople);
router.delete('/message/:id', auth, deleteMessagePeople);
router.get('/messages', auth, showMessagesPeople);

module.exports = router;
