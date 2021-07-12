const Events = require('../../models/Events')
const Users = require('../../models/Users')
const bcrypt = require('bcryptjs')  

const user = async userId => {
    try {
        console.log(userId);
        const userData = await Users.findById(userId)
        console.log(userData)
        return {
            ...userData._doc,
            _id: userData._doc._id,
            createdEvents: events.bind(this, userData._doc.createdEvents)
        }
    } catch(err) {
        console.log(err);
    }
}

const events = async eventId => {
    try {
        console.log(eventId);
        const eventData = await Events.find({_id: {$in: eventId}})
        eventData.map(eventItem => {
            return {
                ...eventItem._doc,
                _id: eventItem.id,
                date: new Date(eventItem.date).toISOString(),
                creator: eventItem.creator
            }
        })
        return eventData;
    } catch(err) {
        console.log(err);
        throw err;
    }
}


module.exports = {
    events: async () => {
        try {
            const events = Events.find({}).populate('creator', '-password')
            events.map(event => {
                return {
                    ...event._doc, 
                    _id: event._doc._id,
                    date: new Date(event._doc.date).toISOString(),
                    creator: user.bind(this, event._doc.creator)
                }
            })
        }
        catch(err) {
            console.log(err)
            throw err;
        }
    },
    createEvent: async (args) => {
        try {
            const event = new Events({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date: new Date(args.eventInput.date).toISOString(),
                creator: '60eae88708c7ae5564463519',
            })
            let createdEvent;
            const result = await event.save()
            createdEvent = {
                ...result._doc, 
                _id: result._doc._id.toString(), 
                date: new Date(result._doc.date).toISOString(),
                creator: user.bind(this, result._doc.creator)
            }   
            const user = await Users.findById('60eae88708c7ae5564463519')
            if(!user) {
                throw new Error("User Doesn't Exists");
            }
            user.createdEvents.push(event);
            await user.save()
            return createdEvent
            // return event
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    },
    createUser: async (args) => {
        try {
            const userData = await Users.findOne({email: args.userInput.email})
            if(userData) {
                throw new Error('User Already Exists');
            }                  
            const hashedPassword = await bcrypt.hash(args.userInput.password, 12)  
            
            const newUser = new Users({
                email: args.userInput.email,
                password: hashedPassword,
            })
            await newUser.save()
            console.log(result);
            return {...result._doc, password: null, _id: result.id}
        }       
        catch(error) {
            console.log(error);
            throw error;
        }
    }
}