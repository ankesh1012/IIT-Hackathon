// server/socketHandler.js
const Message = require('./models/Message');

// Store active users and their socket IDs { userId: socketId }
const activeUsers = new Map();

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`Socket connected: ${socket.id}`);

        // 1. Authenticate and map User ID to Socket ID
        socket.on('authenticate', (userId) => {
            activeUsers.set(userId, socket.id);
            console.log(`User ${userId} authenticated and active.`);
            // Notify user's contacts they are online (optional)
        });

        // 2. Handle sending a new message
        socket.on('send_message', async ({ recipientId, content, senderId }) => {
            // Check for valid data
            if (!recipientId || !content || !senderId) return;

            // 2.1 Save the message to the database
            const message = new Message({
                sender: senderId,
                recipient: recipientId,
                content: content,
            });
            await message.save();

            // 2.2 Get the recipient's socket ID
            const recipientSocketId = activeUsers.get(recipientId);

            // 2.3 Construct the message object to send to both parties
            const messageToSend = {
                sender: { _id: senderId, name: 'You' }, // Simplified sender info for immediate display
                content: content,
                createdAt: new Date().toISOString(),
            };

            // 2.4 Deliver the message to the recipient (if online)
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive_message', messageToSend);
            }
            
            // 2.5 Echo the message back to the sender for confirmation/display
            socket.emit('receive_message', messageToSend);
        });

        // 3. Handle disconnection
        socket.on('disconnect', () => {
            // Remove user from the active map
            let disconnectedUserId = null;
            for (const [userId, socketId] of activeUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    activeUsers.delete(userId);
                    break;
                }
            }
            if (disconnectedUserId) {
                console.log(`User ${disconnectedUserId} disconnected.`);
            }
        });
    });
};