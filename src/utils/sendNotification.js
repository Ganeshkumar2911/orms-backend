const admin = require("../config/firebase");
const userModel = require("../models/user.model");

async function sendNotification({
    roles = [],
    title,
    body,
    path = "/orders",
}) {

    const users = await userModel.find({
        role: { $in: roles },
        fcmToken: { $ne: null },
    });

    if (!users.length) return;

    const notifications = users.map(user =>
        admin.messaging().send({
            token: user.fcmToken,
            notification: {
                title,
                body,
            },
            webpush: {
                notification: {
                    icon: `${process.env.FRONTEND_URL}/icon-512.png`,
                },
                fcmOptions: {
                    link: `${process.env.FRONTEND_URL}${path}`,
                },
            },
        })
    );

    await Promise.all(notifications);
}

module.exports = sendNotification;