require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.render('index');
});

app.get('/joke/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}`);
    const joke = response.data;
    
    if (joke.type === 'single') {
      await db.query(
        'INSERT INTO jokes (type, category, joke) VALUES ($1, $2, $3)',
        ['single', joke.category, joke.joke]
      );
    } else {
      await db.query(
        'INSERT INTO jokes (type, category, setup, delivery) VALUES ($1, $2, $3, $4)',
        ['two-parter', joke.category, joke.setup, joke.delivery]
      );
    }

    res.render('jokeResult', { joke });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching joke');
  }
});

app.get('/search', async (req, res) => {
  try {
      const searchTerm = req.query.term;
      const response = await axios.get(`https://v2.jokeapi.dev/joke/Any?contains=${searchTerm}`);
      const joke = response.data;
      
      if (joke.error) {
          return res.render('jokeResult', { error: 'No jokes found with that term.' });
      }

      if (joke.type === 'single') {
          await db.query(
              'INSERT INTO jokes (type, category, joke) VALUES ($1, $2, $3)',
              ['single', joke.category, joke.joke]
          );
      } else {
          await db.query(
              'INSERT INTO jokes (type, category, setup, delivery) VALUES ($1, $2, $3, $4)',
              ['twopart', joke.category, joke.setup, joke.delivery]
          );
      }

      res.render('jokeResult', { joke });
  } catch (error) {
      console.error('Error:', error);
      res.render('jokeResult', { error: 'No matching joke found with your keyword(s)!' });
  }
});

app.get('/history', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jokes ORDER BY created_at DESC');
    res.render('historyTable', { jokes: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching history');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});