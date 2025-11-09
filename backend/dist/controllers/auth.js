"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const user = await User_1.default.create({
            email,
            password,
            name,
            role
        });
        // Create token
        const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};
exports.register = register;
