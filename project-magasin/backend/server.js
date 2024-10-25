const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

console.log('Mongo URI:', process.env.MONGO_URI);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => {
  console.error('MongoDB connection error:', err.message); // Log any MongoDB connection errors
});

// Import routes
const adherentRoutes = require('./routes/adherentRoutes');
app.use('/api/adherents', adherentRoutes);

const productRoutes = require('./routes/productRoutes');
app.use('/api/products', productRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
