"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
const error_1 = require("./middleware/error");
const auth_1 = __importDefault(require("./routes/auth"));
const users_1 = __importDefault(require("./routes/users"));
const events_1 = __importDefault(require("./routes/events"));
const messages_1 = __importDefault(require("./routes/messages"));
const notifications_1 = __importDefault(require("./routes/notifications"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        methods: ['GET', 'POST']
    }
});
// Connect to MongoDB
(0, db_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express_1.default.json());
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/users', users_1.default);
app.use('/api/events', events_1.default);
app.use('/api/messages', messages_1.default);
app.use('/api/notifications', notifications_1.default);
// WebSocket connection handling
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    socket.on('join_room', (roomId) => {
        socket.join(roomId);
    });
    socket.on('leave_room', (roomId) => {
        socket.leave(roomId);
    });
    socket.on('send_message', (data) => {
        io.to(data.roomId).emit('receive_message', data);
    });
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});
// Error handling middleware
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
