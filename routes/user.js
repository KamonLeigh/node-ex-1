const express = require('express');

const router = new express.Router();

router.get('/', (req, res) => {
  res.send({
    message: 'login',
  });
});

router.get('/me', (req, res) => {
  res.send({
    test: 'ok',
  });
});

module.exports = router;
