
require('dotenv').config();

export default {
    uri: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URL}/${process.env.MONGO_DB}?retryWrites=true&w=majority`
};