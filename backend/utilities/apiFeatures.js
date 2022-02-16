// Class for search functionality.
// It will be passed to the controller with desired parameters.

class APIFeatures {

    // This are the query (Mongo query for example Product.find()) and 
    // queryString (req.query) passed in as parameters.
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString
    }

    // If there is a "keyword" variable in the req.query, search for a 
    // product.name that contains the keyword value (case insensitively).
    // Otherwise return an empty object.
    search() {
        
        const keyword = this.queryString.keyword ? {
            name: {
                $regex: this.queryString.keyword,
                $options: 'i'
            }
        } : {}

        // Pass the keyword variable into the Mongo query
        this.query = this.query.find({...keyword});
        return this
    }


    // Filter method to further filter the products
    filter() {

        // Make a copy of the req.query string
        const queryCopy = {...this.queryString};

        // Removing keyword and pagination fields from the req.query string,
        // So you'll be left with only all other filter fields.
        const fieldToRemove = ['keyword', 'limit', 'page']
        fieldToRemove.forEach(field => delete queryCopy[field])

        // Turn the req.query string object into JSON string so we can use
        // the replace function on it.
        // We need to add a "$" to any of the gt, gte, lt, lte fields as
        // they are Mongo operators and need to start with a dollar sign.
        // We use Mongo operators for advanced filter for price, ratings etc..
        // \b allows you to perform a “whole words only” search using a regular 
        // expression in the form of \bword\b.
        let queryStr = JSON.stringify(queryCopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)

        // JSON Parse the req.query into the Mongo query
        this.query = this.query.find(JSON.parse(queryStr));
        return this
    }

    // Pagination method to limit products display for each page
    pagination(resPerPage) {

        // Get the page variable from the req.query, if it doesnt exist 
        // it will be 1 by default.
        const currentPage = Number(this.queryString.page) || 1;

        // Skip variable to calculate products to be skipped depending on which page we are
        const skip = resPerPage * (currentPage - 1);

        // Limit the Mongo query by desired amount of products
        // and skip products based on which page you are.
        this.query = this.query.limit(resPerPage).skip(skip);
        return this

    }
}

module.exports = APIFeatures;