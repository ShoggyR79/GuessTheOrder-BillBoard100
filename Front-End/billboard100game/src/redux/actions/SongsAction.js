import axios from "axios"

const url = "http://localhost:8080/api"

export const getSongs = () => {
    
    return async (dispatch) => {

        try {

            const result = await axios({
                url: `${url}/scrape`,
                method: 'GET'
            })
            dispatch({
                type: "SET_SONGS_LIST",
                songs: result.data.data
            })
            
        } catch (error) {
            console.log(error)

        }
    }
}