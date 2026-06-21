const admin = require("../config/firebase");

async function sendNotification(req, res) {

    const  token  = 'd7nJdvOm0sUb8pRu3W1NVk:APA91bG9IeqGtvpnZFThhcdT6A4kkRxn3uzSKzBzvlR0avugpiCARqDjrzFX3ytV4P6fkqY8cyFUylrdQnt9zKlkLmgGfli5KNeT0U6SZV4rEPifn6viJ34';

    await admin.messaging().send({
        token,
        notification: {
            title: "New Order",
            body: "Order ORD-0001 Created"
        },
        webpush: {
            notification: {
                icon: `${process.env.FRONTEND_URL}/icon-512.png`,
                badge: `${process.env.FRONTEND_URL}/icon-512.png`
            },
            fcmOptions: {
                link: `${process.env.FRONTEND_URL}/orders`
            }
        }
    });

    res.json({
        success: true
    });
}

module.exports = {
    sendNotification
};
