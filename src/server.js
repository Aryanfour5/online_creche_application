// Import necessary modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
// Note: With Express 4.16+, body-parser's functionality is included in express
// So you can remove body-parser if you're using express.json()

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/Creche_application", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => {
  console.error('❌ MongoDB connection error:', err);
  process.exit(1); // Exit process with failure
});

// Define User Schema
const userSchema = new mongoose.Schema({
    username:    { type: String, required: true, unique: true, trim: true },
    email:       { type: String, required: true, unique: true, trim: true },
    password:    { type: String, required: true },
    aadharCard:  { type: String, required: true, unique: true, trim: true }, // Aadhar Card
    phoneNumber: { type: String, required: true, unique: true, trim: true }, // Phone Number
}, { timestamps: true });

// Create User Model
const User = mongoose.model('User', userSchema);

// POST /signup Route
app.post('/signup', async (req, res) => {
  // Destructure all required fields from the request body
  const { username, email, password, aadharCard, phoneNumber } = req.body;

  try {
    // Check if all required fields are present
    if (!username || !email || !password || !aadharCard || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Optional: Validate Aadhar Card and Phone Number formats
    const aadharRegex = /^\d{12}$/; // 12-digit Aadhar
    const phoneRegex = /^[6-9]\d{9}$/; // 10-digit Indian phone numbers starting with 6-9

    if (!aadharRegex.test(aadharCard)) {
      return res.status(400).json({ message: 'Invalid Aadhar Card number. It should be a 12-digit number.' });
    }

    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({ message: 'Invalid Phone Number. It should be a 10-digit number starting with 6-9.' });
    }

    // Check if a user with the same email, Aadhar Card, or Phone Number already exists
    const existingUser = await User.findOne({
      $or: [
        { email },
        { aadharCard },
        { phoneNumber }
      ]
    });

    if (existingUser) {
      return res.status(409).json({ message: 'User with this email, Aadhar Card, or phone number already exists.' });
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user with all required fields
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      aadharCard,
      phoneNumber,
    });

    // Save the user to the database
    await newUser.save();

    // Respond with a success message
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during signup:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }
  
      const user = await User.findOne({ email });
  
      if (!user) {
        // If user not found
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // Compare provided password with hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        // If password does not match
        return res.status(401).json({ message: 'Invalid email or password.' });
      }
  
      // (Optional) Create a session or JWT token here
  
      // Respond with success message
      res.status(200).json({ message: 'Login successful!' });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
