const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json()); // Parse JSON requests

// MongoDB Connection URL
const url = 'mongodb://127.0.0.1:27017/friends';

// Define a Mongoose schema for your data
const memberSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile_No :Number,
});

// Create a Mongoose model based on the schema
const Member = mongoose.model('Member', memberSchema, 'members_data');

// Connect to MongoDB using Mongoose
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/submit-form', async (req, res) => {
    // Extract data from the form
    const { name, email , mobile_No} = req.body;

    // Create a new Member document
    const newMember = new Member({ name, email ,mobile_No });

    try {
        const existingMember = await Member.findOne({ name, email });

        if (existingMember) {
            console.log('Data already exists. Form submission aborted.');
            res.json({ success: false, message: 'Data already exists. Form submission aborted.' });
        } else {
            // Create a new Member document
            const newMember = new Member({ name, email , mobile_No });
            // Save the document to MongoDB (using async/await)
            const result = await newMember.save();
            console.log('Form data inserted into MongoDB:', result);
            res.json({ success: true, message: 'Form submitted successfully!' });
        }
    } catch (err) {
        console.error('Error inserting data into MongoDB:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Serve the HTML page directly
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/notes.html', (req, res) => {
    res.sendFile(__dirname + '/notes.html');
});
app.get('/projects.html', (req, res) => {
    res.sendFile(__dirname + '/projects.html');
});
app.get('/contact.html', (req, res) => {
    res.sendFile(__dirname + '/contact.html');
});
// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
