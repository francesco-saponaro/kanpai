import React, { useState } from 'react'

// Search bar component
// Destructure and pass in the function the history object from the props
// So below instead of typing props.history.push we can
// just type history.push
const Search = ({ history }) => {

    // The setKeyword will set the state keyword to whatever the onchange 
    // input target value is (see below) 
    const [keyword, setKeyword] = useState("");

    // On submitting the form this function wil fire
    // which will check if there is a keyword value in the state
    // and if so it will push the URL with the keyword value into 
    // the react router history object, which will redirect to that URL
    const searchHandler = (e) => {

        e.preventDefault()

        if(keyword.trim()) {

            history.push(`/search/${keyword}`)
        } else {

            history.push('/')
        }
    }

    return (
        // Search form
        <form onSubmit={searchHandler}>
            <div className="input-group w-100">
                
                {/* Search form input */}
                <input 
                    id="search_field" 
                    className="form-control border-0 rounded-0" 
                    type="text" 
                    name="" 
                    placeholder="Search Whiskeys"
                    onChange={(e) => setKeyword(e.target.value)}
                />

                {/* Submit button */}
                <div className="input-group-append">
                    <button id="search_btn" className="form-control btn border-0 rounded-0" type="submit">
                        <span className="icon">
                            <i className="fas fa-search"></i>
                        </span>
                    </button>
                </div>
            </div>
        </form>
    );
}

export default Search;