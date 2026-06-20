require("dotenv").config();
const { initializeSocket } = require("./src/socket");

const http = require("http");

const app = require("./src/app");
const connectDB = require("./src/config/db");

async function startServer() {

    try {

        await connectDB();

        const server = http.createServer(app);

        initializeSocket(server);

        server.listen(3000, () => {
            console.log("Server running on port 3000");
        });

    } catch (error) {

        console.error(error);

    }

}

startServer();