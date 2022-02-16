const assert = require('assert');
const Product = require('../../backend/models/product')

// Add review object to product reviews array
describe("Add review to product", () => {

    // Create a product.
    // Find newly created product, push a review object to its reviews array and save it.
    // Assert the new review object comment in the reviews array, matches what we expect. 
    it('Add review', async () => {

        const japaneseWhiskey = await Product.create({name:"Nikka",     
                                                      price:"5",
                                                      strength:"43",
                                                      volume:"30",
                                                      description:"Test",
                                                      category:"Blend",
                                                      stock:"6",
                                                      user:"61a1f1824215212905b6a62b"
                                                     });
   
        const product = await Product.findOne({name:'Nikka'})
        await product.reviews.push({user:"61a1f1824215212905b6a62b",
                                    name:"francesco saponaro",
                                    rating: 3,
                                    comment: "Test"});
        await product.save()

        assert(product.reviews[0].comment === "Test");
    });

    // Create a product with also a review object in its reviews array.
    // Find newly created product, remove the first object from its reviews array and save.
    // Assert the the product reviews array its empty. 
    it('Remove review', async () => {

        const japaneseWhiskey = await Product.create({name:"Nikka",     
                                                     price:"5",
                                                     strength:"43",
                                                     volume:"30",
                                                     description:"Test",
                                                     category:"Blend",
                                                     stock:"6",
                                                     reviews:[{user:"61a1f1824215212905b6a62b",
                                                               name:"francesco saponaro",
                                                               rating: 3,
                                                               comment: "Test"}],
                                                     user:"61a1f1824215212905b6a62b"
                                                     });
        
        const product = await Product.findById(japaneseWhiskey._id)
        await product.reviews[0].remove()
        await product.save()

        assert(product.reviews.length === 0)
     
    })
})