const assert = require('assert');
const User = require('../../backend/models/users')

// Delete user
describe("Delete the user", async () => {

    // Find created product by ID and delete it.
    // Then assert attempt to find it returns null. 
    it('Delete user by ID', async () => {

        let user = await User.create({name:"test user2",     
                                      email:"test@test4.com",
                                      password:"123456",
                                      avatar:{public_id:"avatars/123456",
                                              url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                     });

        await User.findByIdAndDelete(user._id);
        assert(User.findOne({name:"test user2"} === null));
    });

    // Find created product by name and delete it.
    // Then assert attempt to find it returns null. 
    it('Delete user by name', async () => {

        let user = await User.create({name:"test user2",     
                                      email:"test@test4.com",
                                      password:"123456",
                                      avatar:{public_id:"avatars/123456",
                                              url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                     });

        await User.findOneAndDelete({name:"test user2"});
        assert(User.findOne({name:"test user2"} === null));
    });

    // Find created product by ID and delete it.
    // Then assert attempt to find it returns null. 
    it('Delete user by "test user', async () => {

        let user = await User.create({name:"test user2",     
                                      email:"test@test4.com",
                                      password:"123456",
                                      avatar:{public_id:"avatars/123456",
                                              url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                     });

        await User.deleteOne({name:"test user2"});
        assert(User.findOne({name:"test user2"} === null));
    });
})