// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const ejs = require('ejs');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Connect to MongoDB
const DB_NAME = 'NASA';

mongoose.connect(`mongodb+srv://gurnanivansh57:iz64rqtBBQss8iQ7@cluster101.nuwewcc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a route for the home route ("/")
app.get('/', (req, res) => {
  res.send('Welcome to the NASA API');
});

// Route to render a page for the collection_data_inventory collection
app.get('/nakamura_1979_sm_locations', async (req, res) => {
    try {
        // Access the collection directly using mongoose.connection
        const documents = await mongoose.connection.db.collection('nakamura_1979_sm_locations').find({}, { _id: 0 }).toArray();
    
        // Send the extracted data for all documents as a JSON response
        res.json(documents);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
      }
});

// ... rest of your code

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
