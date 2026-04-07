const express = require('express');
const app = express();
const PORT = 5500;
const userRoutes = require('./api/user')
const cors = require('cors');

app.use(cors());
require('dotenv').config();
require('./config/db');

app.use(express.json());

app.use('/api', userRoutes);

 
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});