const assert = require('assert');
const User = require('../../backend/models/users')

// Update user
describe("Update the user", async () => {

    // Set name of newly created user to a different name and save it, when using "set" its only saved in 
    // memory not in database, therefore must use save() afterwards.
    // Find all users.
    // Then assert last created user name equals the modified name. 
    it("Set and Save", async () => {

        let user = await User.create({name:"test user3",     
                                      email:"test@test5.com",
                                      password:"123456",
                                      avatar:{public_id:"avatars/123456",
                                              url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                     });

        await user.set("name", "Kirin")
        await user.save()
        const users = await User.find()
        assert(users[users.length - 1].name === "Kirin")
    });

    // Create user names "test user3"
    // Update email of all users named "test user3".
    // Find all users named "test user3".
    // Then assert their email equals the modified email.
    it("Update", async () => {

        let user = await User.create({name:"test user3",     
                                      email:"test@test6.com",
                                      password:"123456",
                                      avatar:{public_id:"avatars/123456",
                                              url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                     });

        await User.updateMany({name:"test user3"}, {email:"test@test7.com"})
        const users = await User.find({name:"test user3"})
        assert(users.every(user => user.email === "test@test7.com"))
    });
})
