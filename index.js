const express = require('express');
const bodyParser = require('body-parser');
const {graphqlHTTP} = require('express-graphql')
const {buildSchema} = require('graphql')
const dotenv = require('dotenv')
const {connectDB} = require('./config/db')
const Events = require('./models/Events')
const Users = require('./models/Users')
const bcrypt = require('bcryptjs')

const app = express();
dotenv.config()

connectDB()

app.use(bodyParser.json());
app.use(express.json());
// Indicates that it will return a list of strings and ! means it will never be null

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!,
            email: String!,
            password: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        
        input UserInput {
            email: String!
            password: String! 
        }

        type RootQuery {
            events: [Event!]! 
        }
        
        type RootMutation {
            createEvent(eventInput: EventInput): Event 
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
        events: () => {
            return Events.find({})
                .then(events => {
                    return events.map(event => {
                        return {...event._doc, _id: event._doc._id.toString()}
                    })
                })
                .catch(err => {
                    console.log(err)
                    throw err;
                })
        },
        createEvent: (args) => {
            const event = new Events({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date).toISOString(),
                creator: '60eae88708c7ae5564463519',
            })
            let createdEvent;
            return event.save()
              .then(result => {
                createdEvent = {...result._doc, _id: event._doc._id.toString()}   
                return Users.findById('60eae88708c7ae5564463519')
              })
              .then(user => {
                  if(!user) {
                    throw new Error("User Doesn't Exists");
                  }
                  user.createdEvents.push(event);
                  return user.save()
              })
              .then(result => {
                console.log(createdEvent);
                return createdEvent
              })
              .catch(err => {
                  console.log(err);
                  throw err;
              })
            return event
        },
        createUser: (args) => {
            return Users.findOne({email: args.userInput.email})
              .then(user => {
                  if(user) {
                      throw new Error('User Already Exists');
                  }                  
                  return bcrypt.hash(args.userInput.password, 12)  
              })
                .then(hashedPassword => {
                    const user = new Users({
                        email: args.userInput.email,
                        password: hashedPassword,
                    })
                    return user.save()
                })
                .then(result => {
                    console.log(result);
                    return {...result._doc, password: null, _id: result.id}
                })
                .catch(error => {
                    console.log(error);
                    throw error;
                })
        }
    },
    graphiql: true
}));

const PORT = process.env.PORT || 5000

app.listen(PORT, () => console.log(`Server started at port number ${PORT}`));
