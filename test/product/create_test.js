const assert = require('assert');
const Product = require('../../backend/models/product')

// Create product
describe("Create the first data", () => {

    it("Create new product", async () => {

        // Create product
        const japaneseWhiskey = await Product.create({name:"Nikka",     
                                                      price:"5",
                                                      strength:"43",
                                                      volume:"30",
                                                      description:"Test",
                                                      category:"Blend",
                                                      stock:"6",
                                                      user:"61a1f1824215212905b6a62b"
                                                    });
        
        // Assert is not new since its just been created
        assert(!japaneseWhiskey.isNew)  
    });
})
