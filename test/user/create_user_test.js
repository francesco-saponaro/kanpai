const assert = require('assert');
const User = require('../../backend/models/users')

// Create user
describe("Create the user", () => {

    it("Create user", async () => {

        // Create user
        const user = await User.create({name:"test user",     
                                        email:"test@test2.com",
                                        password:"123456",
                                        avatar:{public_id:"avatars/123456",
                                                url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                                       });
        
        // Assert is not new since its just been created
        assert(!user.isNew)  
    })
})
