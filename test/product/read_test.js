const assert = require('assert');
const Product = require('../../backend/models/product')

// Read product
describe("Read the product", async () => {

    let japaneseWhiskey;

    // Before each "it" test create a product, in order to be tested
    beforeEach(async () => {

        japaneseWhiskey = await Product.create({name:"Nikka",     
                                                price:"5",
                                                strength:"43",
                                                volume:"30",
                                                description:"Test",
                                                category:"Blend",
                                                stock:"6",
                                                user:"61a1f1824215212905b6a62b"
                                               });
        
    })

    // Find all products with same name as the one just created.
    // Assert the ID of the last of the products named Nikka equals the ID of the one just created.
    it("Find all Nikkas", async () => {

        const nikkas = await Product.find({name:"Nikka"})
        assert(nikkas[nikkas.length - 1]._id.toString() === japaneseWhiskey._id.toString())
    })
});