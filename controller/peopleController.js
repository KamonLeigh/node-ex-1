/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
const { MongoClient, ObjectID } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const url = 'mongodb://localhost:27017';
const dbName = 'nodeapp';

const peopleController = {
  people: (req, res) => {
    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, {
          useUnifiedTopology: true,
        });
        const db = client.db(dbName);

        const col = db.collection('people');

        const results = await col.find({}).toArray();

        results.forEach((result) => {
          delete result.password;
          delete result.tokens;
        });

        res.json(results);
      } catch (error) {
        res.json('tests');
      }
      client.close();
    }());
  },
  peopleSignup: async (req, res) => {
    const {
      email,
      password,
    } = req.body;

    const user = {
      email,
      password,
      tokens: [],
    };

    user.password = await bcrypt.hash(user.password, 8);

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, {
          useUnifiedTopology: true,
        });

        const db = client.db(dbName);

        const col = db.collection('people');

        const check = await col.find({
          email: user.email,
        });

        if (!check) {
          res.status(404).send({
            message: 'email already taken',
          });
        } else {
          const token = jwt.sign({
            _id: user.email,
          }, 'thisisatest');
          user.tokens.push(token);

          const response = await col.insertOne(user);

          res.status(200).send({
            response,
            token,
          });
        }
      } catch (err) {
        res.status(404).send(err.stack);
      }

      client.close();
    }());
  },
  // eslint-disable-next-line consistent-return
  addMessagePeople: (req, res) => {
    const { task } = req.body;

    if (!task) return res.status('401').send('please provide a task!!');

    const payload = {};

    payload.task = task;

    payload.date = Date.now();
    // eslint-disable-next-line no-underscore-dangle
    payload.userId = req.user._id;
    payload.email = req.user.email;

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('tasks');

        const response = await col.insertOne(payload);

        res.status(201).send(response);
      } catch (error) {
        res.status(404).send(error.stack);
      }

      client.close();
    }());
  },
  showMessagesPeople: (req, res) => {
    const userId = req.user._id;

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });

        const db = client.db(dbName);
        const col = db.collection('tasks');

        const response = await col.find({ userId: new ObjectID(userId) }).toArray();

        res.status(201).send(response);
      } catch (error) {
        res.status(404).send(error.stack);
      }
      client.close();
    }());
  },
  showMessagePeople(req, res) {
    const userId = req.user._id;
    const { id } = req.params;

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);
        const col = db.collection('tasks');

        const response = await col.findOne({ userId: new ObjectID(userId), _id: new ObjectID(id) });
        res.status(201).send(response);
      } catch (error) {
        res.status(404).send(error.message);
      }
      client.close();
    }());
  },
  deleteMessagePeople: (req, res) => {
    const userId = req.user._id;
    const { id } = req.params;

    (async function mongo() {
      let client;

      try {
        client = await MongoClient.connect(url, { useUnifiedTopology: true });
        const db = client.db(dbName);

        const col = db.collection('tasks');

        // eslint-disable-next-line max-len
        const response = await col.findOneAndDelete({ userId: new ObjectID(userId), _id: new ObjectID(id) });

        res.status(201).send(response);
      } catch (error) {
        res.status(404).send(error.stack);
      }

      client.close();
    }());
  },

};

module.exports = peopleController;
