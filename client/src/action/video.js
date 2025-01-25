import * as api from '../Api/index'

export const uploadvideo = (videoData) => async (dispatch) => {
    try {
        console.log("Attempting to upload video...");
        const { data } = await api.uploadvideo(videoData);
        console.log("Upload response:", data);
        
        dispatch({ 
            type: 'POST_VIDEO', 
            payload: data 
        });
        
        return data; // Return the data so we can handle success in the component
    } catch (error) {
        console.error("Error in upload action:", error);
        throw error; // Re-throw to handle in component
    }
}

export const getallvideo = () => async (dispatch) => {
    try {
        const { data } = await api.getvideos()
        dispatch({ type: 'FETCH_ALL_VIDEOS', payload: data })
    } catch (error) {
        console.log(error)
    }
}

export const likevideo = (likedata) => async (dispatch) => {
    try {
        const { id, Like } = likedata;
        console.log(likedata)
        const { data } = await api.likevideo(id, Like);
        dispatch({ type: "POST_LIKE", payload: data })
        dispatch(getallvideo())
    } catch (error) {
        console.log(error)
    }
}

export const viewvideo=(viewdata)=>async(dispatch)=>{
    try {
        const{id}=viewdata;
        console.log(id)
        const {data}=await api.viewsvideo(id)
        dispatch({type:"POST_VIEWS",data})
        dispatch(getallvideo())
    } catch (error) {
        console.log(error)
    }
}