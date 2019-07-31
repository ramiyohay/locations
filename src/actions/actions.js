import {GET_USED_CATEGORIES, SET_USED_CATEGORIES} from "../services/Constants";

export function getUsedCategories() {
    return {
        type: GET_USED_CATEGORIES
    }
}

export function setUsedCategories(payload) {
    return {
        type: SET_USED_CATEGORIES,
        payload
    }
}
