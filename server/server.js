const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const accountRoutes = require('./routes/account');

const app = express();

mongoose.connect(process.env.DATABASE_URL)
.then(()=>{console.log('Connected to Database')})
.catch((err)=>{console.error('Database connection error:', err)});

app.use(cors());
app.use(express.json());

// Debug: check if accountRoutes is valid
if (typeof accountRoutes !== 'function') {
    console.error('Error: accountRoutes is not a function');
    console.error('Type:', typeof accountRoutes);
    console.error('Value:', accountRoutes);
    process.exit(1);
}

app.use('/api', accountRoutes);

const port = process.env.PORT 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});



