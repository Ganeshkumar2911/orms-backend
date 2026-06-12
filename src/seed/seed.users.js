const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

const userModel = require("../models/user.model");

dotenv.config();

async function seedUsers() {

    try {

        await mongoose.connect(process.env.MONGO_URI);

        await userModel.deleteMany({});

        const users = [
            {
                name: "Deepak Admin",
                email: "deepakadmin@gmail.com",
                password: await bcrypt.hash("123456", 10),
                role: "deepak_admin"
            },
            {
                name: "Deepak Staff",
                email: "deepakstaff@gmail.com",
                password: await bcrypt.hash("123456", 10),
                role: "deepak_staff"
            },
            {
                name: "Naveen Admin",
                email: "naveenadmin@gmail.com",
                password: await bcrypt.hash("123456", 10),
                role: "naveen_admin"
            },
            {
                name: "Naveen Staff",
                email: "naveenstaff@gmail.com",
                password: await bcrypt.hash("123456", 10),
                role: "naveen_staff"
            }
        ];

        await userModel.insertMany(users);

        console.log("Users Seeded Successfully");

        process.exit();

    } catch (error) {

        console.log(error);

        process.exit(1);

    }

}

seedUsers();