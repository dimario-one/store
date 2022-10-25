import { NEWS } from "../Types/Types";

const initialState = {
    newsData: "",
};

export const newsReducer = (state = initialState, action) => {
    console.log(action.type,"action.type");
    switch (action.type) {
        case NEWS:
            console.log(newsReducer,"newsReducer")
            return {
                ...state,
                news: action.data,
            };

        default:
            return state;
    }
};
