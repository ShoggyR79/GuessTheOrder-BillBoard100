const initialState = {
    songsArray : []
}

export const SongsReducer = (state = initialState, action) =>{
    switch(action.type){
        case 'SET_SONGS_LIST':{
            return {...state, songsArray:action.songs}
        }
        default:
            return {...state}
    }
}