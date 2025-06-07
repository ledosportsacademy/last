const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend build directory
app.use(express.static(path.join(__dirname, '../../frontend/dist')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ledosportsacademy:KYbsTxWjVBvPnREP@ledosportsacademy.ejcd06z.mongodb.net/?retryWrites=true&w=majority&appName=ledosportsacademy';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch((err) => console.error('MongoDB connection error:', err));

// Add mongoose debug logging
mongoose.set('debug', true);

// Models
const Member = require('./models/Member');
const Experience = require('./models/Experience');
const Donation = require('./models/Donation');
const Expense = require('./models/Expense');

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ledo-sports-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

// API Routes
// Root API route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to LEDO Sports Academy API' });
});

// Routes
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  
  // In a real application, these credentials should be stored securely in a database
  if (email === 'ledosportsacademy@gmail.com' && password === '@Ledoxyz.com') {
    const token = jwt.sign(
      { email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    res.send({ token });
  } else {
    res.status(401).send({ error: 'Invalid credentials' });
  }
});

// Members routes
app.get('/api/members', async (req, res) => {
  try {
    const members = await Member.find();
    console.log('Retrieved members:', members.length);
    res.send(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send({ error: 'Error fetching members', details: error.message });
  }
});

app.post('/api/members', auth, async (req, res) => {
  try {
    console.log('Creating new member:', req.body);
    const member = new Member(req.body);
    await member.save();
    console.log('Member created successfully:', member._id);
    res.status(201).send(member);
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(400).send({ error: 'Error creating member', details: error.message });
  }
});

app.patch('/api/members/:id', auth, async (req, res) => {
  try {
    console.log('Updating member:', req.params.id, req.body);
    const member = await Member.findByIdAndUpdate(
      req.params.id,
      { 
        $set: {
          hasPaidWeeklyFee: req.body.hasPaidWeeklyFee,
          lastPaymentDate: req.body.lastPaymentDate
        }
      },
      { new: true }
    );

    if (!member) {
      console.error('Member not found:', req.params.id);
      return res.status(404).send({ error: 'Member not found' });
    }

    console.log('Member updated successfully:', member._id);
    res.send(member);
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(400).send({ error: 'Error updating member', details: error.message });
  }
});

// Experiences routes
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find().sort({ date: -1 });
    console.log('Retrieved experiences:', experiences.length);
    res.send(experiences);
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).send({ error: 'Error fetching experiences', details: error.message });
  }
});

app.post('/api/experiences', async (req, res) => {
  try {
    console.log('Creating new experience:', req.body);
    const experience = new Experience(req.body);
    await experience.save();
    console.log('Experience created successfully:', experience._id);
    res.status(201).send(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(400).send({ error: 'Error creating experience', details: error.message });
  }
});

// Donations routes
app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ date: -1 });
    res.send(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).send({ error: 'Error fetching donations' });
  }
});

app.post('/api/donations', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admins can add donations' });
    }
    const donation = new Donation(req.body);
    await donation.save();
    res.status(201).send(donation);
  } catch (error) {
    console.error('Error adding donation:', error);
    res.status(400).send({ error: 'Error adding donation' });
  }
});

// Expenses routes
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.send(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).send({ error: 'Error fetching expenses' });
  }
});

app.post('/api/expenses', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admins can add expenses' });
    }
    const expense = new Expense(req.body);
    await expense.save();
    res.status(201).send(expense);
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(400).send({ error: 'Error adding expense' });
  }
});

app.put('/api/expenses/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).send({ error: 'Only admins can edit expenses' });
    }
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) {
      return res.status(404).send({ error: 'Expense not found' });
    }
    res.send(expense);
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(400).send({ error: 'Error updating expense' });
  }
});

// Analysis routes
app.get('/api/analysis', async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;
    const query = {};
    
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const [members, donations, expenses] = await Promise.all([
      Member.find(query),
      type === 'fees' ? [] : Donation.find(query),
      type === 'donations' ? [] : Expense.find(query),
    ]);

    const weeklyFeeCollection = members.filter(m => m.hasPaidWeeklyFee).length * 20;
    const pendingFees = members.filter(m => !m.hasPaidWeeklyFee).length * 20;
    const donationTotal = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const expenseTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

    const analysis = {
      weeklyFeeCollection: type === 'donations' || type === 'expenses' ? 0 : weeklyFeeCollection,
      pendingFees: type === 'donations' || type === 'expenses' ? 0 : pendingFees,
      donationTotal: type === 'fees' || type === 'expenses' ? 0 : donationTotal,
      expenseTotal: type === 'fees' || type === 'donations' ? 0 : expenseTotal,
      availableAmount: weeklyFeeCollection + donationTotal - expenseTotal,
    };

    res.send(analysis);
  } catch (error) {
    console.error('Error generating analysis:', error);
    res.status(500).send({ error: 'Error generating analysis' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});

// Start server
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Hide password in logs
}); 