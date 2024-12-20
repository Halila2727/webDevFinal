
// Loading the environment and getting dependencies
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000; // Setting port

// Setting EJS as template engine, parsing JSON
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
// Home page
app.get('/', (req, res) => {
  res.render('index');
});

// Fetching joke by category
app.get('/joke/:category', async (req, res) => {
  try {
    const { category } = req.params;
    // Fetching joke from API based on category above
    const response = await axios.get(`https://v2.jokeapi.dev/joke/${category}`);
    const joke = response.data;
    
    // Saving joke to database based on if it is a single line joke or a two-parter
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
  } catch (error) { // error handling
    console.error('Error:', error);
    res.status(500).send('Error fetching joke');
  }
});

// Fetching joke based on searched input
app.get('/search', async (req, res) => {
  try {
      const searchTerm = req.query.term;
      // Fetching joke from API based on query above
      const response = await axios.get(`https://v2.jokeapi.dev/joke/Any?contains=${searchTerm}`);
      const joke = response.data;
      
      // Handling the error of not having matching joke. Might be happening commonly
      if (joke.error) {
          return res.render('jokeResult', { error: 'No jokes found with that term.' });
      }

      // Saving joke to database based on type of joke
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
  } catch (error) { //error handling
      console.error('Error:', error);
      res.render('jokeResult', { error: 'No matching joke found with your keyword(s)!' });
  }
});

// Joke history route
app.get('/history', async (req, res) => {
  try {
    // Fetching all jokes from database, from most recent to least
    const result = await db.query('SELECT * FROM jokes ORDER BY created_at DESC');
    res.render('historyTable', { jokes: result.rows });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error fetching history');
  }
});

// Starting server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});