const assert = require('assert');
const Product = require('../../backend/models/product')

// Check Mongoose product model validation
describe('Product validation', () => {

    // Create a product with an undefined name.
    // Check if it validates with "validateSync".
    // Extract the message from the validation result and assert it matches what we expect.
    it('Name is required', () => {

        const japaneseWhiskey = new Product({name:undefined,     
                                             price:"5",
                                             strength:"43",
                                             volume:"30",
                                             description:"Test",
                                             category:"Blend",
                                             stock:"6",
                                             user:"61a1f1824215212905b6a62b"
                                            });

        const result = japaneseWhiskey.validateSync();
        const { message } = result.errors.name
        assert(message === 'Please enter product name')
    });

    // Create a product with a name exceeding allowed length.
    // Check if it validates with "validateSync".
    // Extract the message from the validation result and assert it matches what we expect.
    it('Name is too long', () => {

        const japaneseWhiskey = new Product({name:"pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp",     
                                             price:"5",
                                             strength:"43",
                                             volume:"30",
                                             description:"Test",
                                             category:"Blend",
                                             stock:"6",
                                             user:"61a1f1824215212905b6a62b"
                                            });

        const result = japaneseWhiskey.validateSync();
        const { message } = result.errors.name
        assert(message === 'Product name cannot exceeed 100 characters')
    });

    // Create a product with a wrong category.
    // Check if it validates with "validateSync".
    // Extract the message from the validation result and assert it matches what we expect.
    it('Wrong category', () => {
        
        const japaneseWhiskey = new Product({name:"Nikka",     
                                             price:"5",
                                             strength:"43",
                                             volume:"30",
                                             description:"Test",
                                             category:"Wrong",
                                             stock:"6",
                                             user:"61a1f1824215212905b6a62b"
                                            });

        const result = japaneseWhiskey.validateSync();
        const { message } = result.errors.category
        assert(message === 'Please select correct category for product')
    })
})