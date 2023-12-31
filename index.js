const express = require('express');
const db = require("./config");
const app = express();
const cors = require("cors");
var firebase = require("firebase");

app.use(cors());

function fetchDataFromFirebase() {
  const dbRef = firebase.database().ref();
  return dbRef.child("Sensor").get().then((snapshot) => {
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return "No data available";
    }
  }).catch((error) => {
    console.error(error);
    throw error;
  });
}

// API端點
app.get('/api/sensor', async (req, res) => {
  try {
    const data = await fetchDataFromFirebase();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data from Firebase' });
  }
});

// 首次調用
fetchDataFromFirebase();

// 每30秒刷新一次
setInterval(fetchDataFromFirebase, 30000);

app.listen(5002, function () {
  console.log('listening on port 5002!');
});
