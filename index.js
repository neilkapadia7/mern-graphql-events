const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql')
const dotenv = require('dotenv')
const {connectDB} = require('./config/db')
const graphQLSchema = require('./graphql/schema/index')
const graphQLResolver = require('./graphql/resolvers/index')


const app = express();
dotenv.config()

connectDB()

// app.use(bodyParser.json());
app.use(express.json());


// Indicates that it will return a list of strings and ! means it will never be null

app.use('/graphql', graphqlHTTP({
    schema: graphQLSchema,
    rootValue: graphQLResolver,
    graphiql: true
}));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started at port number ${PORT}`));
