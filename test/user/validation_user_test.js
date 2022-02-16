const assert = require('assert');
const User = require('../../backend/models/users')

// Check Mongoose User model validation
describe('User validation', () => {

    // Create a user with an undefined name.
    // Check if it validates with "validateSync".
    // Extract the message from the validation result and assert it matches what we expect.
    it('Name is required', () => {

        const user = new User({name:undefined,     
                               email:"test@test8.com",
                               password:"123456",
                               avatar:{public_id:"avatars/123456",
                                       url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                              });

        const result = user.validateSync();
        const { message } = result.errors.name
        assert(message === 'Please enter your name')
    });

    // Create a user with a name exceeding allowed length.
    // Check if it validates with "validateSync".
    // Extract the message from the validation result and assert it matches what we expect.
    it('Name is too long', () => {

        const user = new User({name:"pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp",     
                               email:"test@test9.com",
                               password:"123456",
                               avatar:{public_id:"avatars/123456",
                                       url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                              });

        const result = user.validateSync();
        const { message } = result.errors.name
        assert(message === 'Your name cannot exceed 30 characters')
    });

    // Create a user with an invalid email.
    // Check if it validates with "validateSync".
    // Extract the message from the validation result and assert it matches what we expect.
    it('Email is invalid', () => {

        const user = new User({name:"test user",     
                               email:"testtest10.com",
                               password:"123456",
                               avatar:{public_id:"avatars/123456",
                                       url:"https://res.cloudinary.com/kanpaiwhiskeys/"}
                              });

        const result = user.validateSync();
        const { message } = result.errors.email
        assert(message === 'Please enter a valid email')
    });
})