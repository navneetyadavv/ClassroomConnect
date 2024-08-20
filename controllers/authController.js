
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Principal from '../models/Principal.js';


export const principalLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const principal = await Principal.findOne({ email });
        const errorMsg = 'Auth failed, email or password is wrong';
        if (!principal) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, principal.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: principal.email, _id: principal._id, role: 'Principal' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: principal.name,
            role: 'Principal'
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        const errorMsg = 'Auth failed, email or password is wrong';
        if (!user) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: errorMsg, success: false });
        }
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            name: user.name,
            role: user.role
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
