const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'nodeapp';

const middleware = {
  createError: (req, res, next) => {
    const error = new Error(`${req.originalUrl} not found`);
    res.status(404);
    next(error);
  },
  // eslint-disable-next-line no-unused-vars
  notFound: (error, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
      message: error.message,
      stack: error.stack,
    });
  },
  auth: (req, res, next) => {
    let token;
    let decoded;

    try {
      token = req.header('Authorization').replace('Bearer ', '');
      decoded = jwt.verify(token, 'thisisatest');
    } catch (error) {
      res.status(401).send('please sign in!!!');
    }

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const col = db.collection('people');

        // eslint-disable-next-line no-underscore-dangle
        const user = await col.findOne({ email: decoded._id, tokens: [token] });

        if (!user) {
          throw new Error('you cannot view data');
        }

        req.user = user;
        req.token = token;

        next();
      } catch (error) {
        res.status(401).send('please authenticate');
      }
      client.close();
    }());
  },
};

module.exports = middleware;
