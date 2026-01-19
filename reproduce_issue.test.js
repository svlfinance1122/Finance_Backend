const express = require('express');
const request = require('supertest');
const userRouter = require('./routes/User.router');

// Mock middlewares and controllers to isolate routing logic
jest.mock('./middlewares/auth.middleware', () => {
    return (req, res, next) => {
        // Simulate auth failure if reached
        res.status(401).json({ success: false, message: "Authentication required" });
    };
});

jest.mock('./controllers/Auth.controller', () => ({
    loginUser: (req, res) => res.status(200).send('login'),
    registerUser: (req, res) => res.status(201).json({ message: "User registered successfully" }),
    getAllUsersExceptAdmin: (req, res) => res.status(200).send('all users'),
    getSingleUser: (req, res) => res.status(200).send('single user'),
    updateUser: (req, res) => res.status(200).send('update user'),
    deleteUser: (req, res) => res.status(200).send('delete user'),
    addAreaToUser: (req, res) => res.status(200).send('add area'),
    updatePasswordByUsername: (req, res) => res.status(200).send('update pass'),
    sendOtpToUser: (req, res) => res.status(200).send('send otp'),
    validateOtp: (req, res) => res.status(200).send('validate otp')
}));

const app = express();
app.use(express.json());
app.use('/', userRouter);

describe('Route Auth Test', () => {
    it('POST /new-user should NOT require authentication', async () => {
        const res = await request(app)
            .post('/new-user')
            .send({
                username: "test",
                password: "password",
                name: "Test User"
            });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    it('GET /all-users SHOULD require authentication', async () => {
        const res = await request(app).get('/all-users');
        expect(res.status).toBe(401);
        expect(res.body.message).toBe("Authentication required");
    });
});
