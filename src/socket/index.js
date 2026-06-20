const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const cookie = require("cookie");

let io;

function initializeSocket(server) {

    io = new Server(server, {
        cors: {
            origin: 'https://frontend-oms.vercel.app',
            credentials: true,
        },
    });

    io.on("connection", (socket) => {

        try {

            const cookies = cookie.parse(
                socket.handshake.headers.cookie || ""
            );

            const token = cookies.token;

            if (!token) {

                console.log("No token found");

                socket.disconnect(true);

                return;
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.user = decoded;

            console.log(
                "Authenticated User:",
                decoded.id,
                decoded.role
            );

            // Personal Room
            socket.join(`user-${decoded.id}`);

            console.log(
                `Joined Room: user-${decoded.id}`
            );

            // Role Room
            socket.join(decoded.role);

            console.log(
                `Joined Room: ${decoded.role}`
            );

            console.log(
                "Socket Connected:",
                socket.id
            );

            socket.on("disconnect", () => {

                console.log(
                    "Socket Disconnected:",
                    socket.id
                );

            });

        } catch (error) {

            console.log(
                "Socket Authentication Failed"
            );

            console.log(error.message);

            socket.disconnect(true);

        }

    });

    return io;
}

function getIO() {

    if (!io) {
        throw new Error(
            "Socket.IO has not been initialized"
        );
    }

    return io;
}

module.exports = {
    initializeSocket,
    getIO,
};