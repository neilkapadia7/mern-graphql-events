const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(`mongodb+srv://im_neil17:${process.env.MONGO_PASS}@prisma.wffbg.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        })

        console.log(`MongoDB Connected: ${connect.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = {connectDB}