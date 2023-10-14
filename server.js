const express = require('express')
const connectDB = require('./config/db');
require('dotenv').config();
const cors = require('cors');
const path = require('path');

//Middleware
const { errorResponseHandler, invalidPathHandler } = require('./middleware/errorHandler');

//Routes
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');

connectDB();
const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send('Server is running')
});

app.use('/api/users',userRoutes);
app.use('/api/posts',postRoutes);
app.use('/api/comments',commentRoutes);

app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(invalidPathHandler);
app.use(errorResponseHandler);

app.listen(PORT,()=>console.log('Server is live on port # ' + PORT))
