const assert = require('assert');
const Product = require('../../backend/models/product')

// Update product
describe("Update the product", async () => {

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
        
    });

    // Set name of newly created product to a different name and save it, when using "set" its only saved in 
    // memory not in database, therefore must use save() afterwards.
    // Find all products.
    // Then assert last created product name equals the modified name. 
    it("Set and Save", async () => {

        await japaneseWhiskey.set("name", "Kirin")
        await japaneseWhiskey.save()
        const products = await Product.find()
        assert(products[products.length - 1].name === "Kirin")
    });

    // Update price of all products named "Nikka".
    // Find all products named "Nikka".
    // Then assert their price equals the modified price.
    it("Update Nikkas", async () => {

        await Product.updateMany({name:"Nikka"}, {price:"4"})
        const products = await Product.find({name:"Nikka"})
        assert(products.every(product => product.price === 4))
    });
})