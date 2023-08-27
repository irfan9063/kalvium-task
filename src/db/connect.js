const mongoose = require("mongoose");

const ConnectDB = async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    console.log("connected to database")
}
module.exports = ConnectDB;