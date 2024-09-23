const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'AWS!@!@!';

const userRegisters = db.userregisters;

//user registration
const registration = async(req, res) => {
    try {
        const { name, emailId, contact, password } = req.body;

        // Input validation (basic example)
        if (!name || !emailId || !contact || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if the user already exists
        const existingUser = await userRegisters.findOne({ where: { emailId } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await userRegisters.create({
            name,
            emailId,
            contact,
            password: hashedPassword // Store hashed password
        });

        // Respond with the created user
        res.status(201).json(newUser);

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//login functionality
const userLogin = async(req, res) => {
    try {
        const { emailId, password } = req.body;

        // Find the user by email
        const user = await userRegisters.findOne({ where: { emailId } });



        if (!user) {
            return res.status(401).json({ error: 'Invalid  email' });
        }

        // Compare the provided password with the hashed password stored in the database
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, emailId: user.emailId }, JWT_SECRET, {
            expiresIn: '1h' // Token expiration time
        });

        // Update the user record with the new token
        await userRegisters.update({ token }, { where: { emailId } });

        const data = {
            token,
            emailId: user.emailId,
            name: user.name
        }

        // Send response with the token, email, and name
        res.status(200).json({
            message: "login successfully",
            status: true,
            response: data
        });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// end login functionality

// logout functionality

const userLogout = async(req, res) => {
        try {
            let token = req.body.token
            const decoded = jwt.verify(token, JWT_SECRET);
            var emailId = decoded.emailId
            const checkUser = await userRegisters.findOne({ where: { emailId: emailId } })
            if (!checkUser) {
                return res.status(401).json({ error: 'Invalid user' });
            }
            const logout = await userRegisters.update({ token: '' }, {
                where: { emailId: emailId }
            }, )

            if (logout) {
                res.status(200).json({ status: true, message: 'user logout successfully' });
            } else {
                res.status(200).json({ status: false, message: 'Something went wrong!' });
            }


        } catch (error) {
            console.error('Error during user login:', error);
            res.status(500).json({ error: 'Internal server error' });

        }
    }
    // end logout functionality


module.exports = {
    registration,
    userLogin,
    userLogout
};