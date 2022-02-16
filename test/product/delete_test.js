const assert = require('assert');
const Product = require('../../backend/models/product')

// Delete product
describe("Delete the product", async () => {

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

    // Find created product by ID and delete it.
    // Then assert attempt to find it returns null. 
    it('Delete by ID', async () => {

        await Product.findByIdAndDelete(japaneseWhiskey._id);
        assert(Product.findOne({name:"Nikka"} === null));
    });

    // Find created product by name and delete it.
    // Then assert attempt to find it returns null. 
    it('Delete by name', async () => {
        
        await Product.findOneAndDelete({name:"Nikka"});
        assert(Product.findOne({name:"Nikka"} === null));
    });

    // Find created product by ID and delete it.
    // Then assert attempt to find it returns null. 
    it('Delete by Nikka', async () => {

        await Product.deleteOne({_id:japaneseWhiskey._id});
        assert(Product.findOne({name:"Nikka"} === null));
    });
})