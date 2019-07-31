import {GET_USED_CATEGORIES, SET_USED_CATEGORIES} from "../services/Constants";

const initialState = {
    usedCategories: []
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USED_CATEGORIES: {
            const usedCategories = action.payload;
            return {
                ...state,
                usedCategories
            };
        }
        case GET_USED_CATEGORIES: {
            return state.usedCategories;
        }
        default:
            return state;
    }
};

export default reducer;
