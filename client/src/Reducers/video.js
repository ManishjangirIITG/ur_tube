const videoReducer = (state = { videos: [] }, action) => {
    switch (action.type) {
        case 'POST_VIDEO':
            return { ...state, videos: [...state.videos, action.payload] }
        case 'POST_LIKE':
            return {...state};
        case 'POST_VIEWS':
            return {...state};
        case 'FETCH_ALL_VIDEOS':
            return {...state,data:action.payload};
        default:
            return state
    }
}

export default videoReducer