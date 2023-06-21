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
const conversationRoutes = require('./routes/conversation');
const messageRoutes = require('./routes/message');
const multer = require('multer');
const path = require('path');

const PORT = 3500;
dotenv.config();
connectDb();

// Middleware
app.use('/uploads', express.static(path.join(__dirname, '/public/uploads')));
app.use(express.json());
app.use(helmet());
app.use(morgan('common'));
// app.use(credentials);
// app.use(cors(corsOptions));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
      cb(null, req.body.name);
    },
  });
  
  const upload = multer({ storage: storage });
  app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
      return res.status(200).json("File uploded successfully");
    } catch (error) {
      console.error(error);
    }
  });

app.use('/api/users', userRoutes);
app.use('/api/auth', auth);
app.use('/api/posts', postRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);



mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})
