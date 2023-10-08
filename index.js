// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Connect to MongoDB
const DB_NAME = 'NASA';

async function connectToMongoDB() {
  try {
    await mongoose.connect(
      `mongodb+srv://gurnanivansh57:iz64rqtBBQss8iQ7@cluster101.nuwewcc.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Call the function to connect to MongoDB
connectToMongoDB();

// Define a route for the home route ("/")
app.get('/', (req, res) => {
  res.send('Welcome to the NASA API');
});

// Route to retrieve data from the nakamura_1979_sm_locations collection
app.get('/nakamura_1979_sm_locations', async (req, res) => {
  try {
    // Access the collection directly using mongoose.connection
    const documents = await mongoose.connection.db.collection('nakamura_1979_sm_locations').find({}).project({ _id: 0}).toArray();

    // Send the extracted data for all documents as a JSON response
    res.json(documents);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/nakamura_1983_ai_locations', async (req, res) => {
  try {
    // Access the collection directly using mongoose.connection
    const documents = await mongoose.connection.db.collection('nakamura_1983_ai_locations').find({}).project({ _id: 0}).toArray();

    // Send the extracted data for all documents as a JSON response
    res.json(documents);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/nakamura_1983_sm_arrivals', async (req, res) => {
  try {
    // Access the collection directly using mongoose.connection
    const documents = await mongoose.connection.db.collection('nakamura_1983_sm_arrivals').find({}).project({ _id: 0}).toArray();

    // Send the extracted data for all documents as a JSON response
    res.json(documents);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/gagnepian_2006_catalog', async (req, res) => {
  try {
    const documents = await mongoose.connection.db.collection('gagnepian_2006_catalog')
      .find({})
      .project({ _id: 0, Lat: 1, Long: 1 })
      .toArray();

    res.json(documents);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.get('/combinedData', async (req, res) => {
  try {
    const locationData = await mongoose.connection.db.collection('nakamura_1979_sm_locations').find({}).toArray();
    const arrivalData = await mongoose.connection.db.collection('nakamura_1983_sm_arrivals').find({}).toArray();

    const combinedData = [];

    locationData.forEach(location => {
      // console.log('Checking location:', location); // Add this line to see the current location being checked
      const matchingArrival = arrivalData.find(arrival =>
        arrival.Day === location.Day && arrival.Year === location.Year
      );

      if (matchingArrival) {
        // console.log('Matching arrival found:', matchingArrival); // Add this line to see the matching arrival
        // Combine data with Lat, Long, and Station
        const combinedEntry = {
          Lat: location.Lat,
          Long: location.Long,
          Station: matchingArrival.Station,
          StationData: {
            P_YN: matchingArrival.P_YN,
            P_NG: matchingArrival.P_NG,
            P_JK: matchingArrival.P_JK,
            P_PH: matchingArrival.P_PH,
            P_Mean: matchingArrival.P_Mean,
            S_YN: matchingArrival.S_YN,
            S_NG: matchingArrival.S_NG,
            S_JK: matchingArrival.S_JK,
            S_PH: matchingArrival.S_PH,
            S_Mean: matchingArrival.S_Mean
          }
        };
        // console.log('Combined Entry:', combinedEntry); // Add this line to see the combined entry
        combinedData.push(combinedEntry);
      }
    });

    // console.log('Combined Data:', combinedData); // Add this line to see the final combined data
    res.json(combinedData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});











// ... rest of your code

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
