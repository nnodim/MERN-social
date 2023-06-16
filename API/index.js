const express = require('express');
const app = express();
const cors = require('cors');
const { corsOptions } = require('./config/corsOptions');
const {credentials} = require('./middleware/credentials');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDb = require('./config/dbconn');
const userRoutes = require('./routes/user');
const auth = require('./routes/auth');
const postRoutes = require('./routes/post');


const PORT = 3500;
dotenv.config();

connectDb();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
app.use(credentials);
app.use(cors(corsOptions));

app.use('/api/users', userRoutes);
app.use('/api/auth', auth);
app.use('/api/posts', postRoutes);



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
