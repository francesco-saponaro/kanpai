const assert = require('assert');
const User = require('../../backend/models/users')

// Read the user
describe('Read the user', () => {

    // Create user.
    // Find all users with same name as the one just created.
    // Assert the ID of the last of the users named "test user" equals the ID of the one just created
    it('Find all test users', async () => {

        let user = await User.create({name:"test user",     
                                      email:"test@test3.com",
                                      password:"123456",
                                      avatar:{public_id:"avatars/123456",
                                              url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                     });


        const users = await User.find({name:"test user"})
        assert(users[users.length - 1]._id.toString() === user._id.toString() )
    })
})