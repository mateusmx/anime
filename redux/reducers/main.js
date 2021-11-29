import * as t from '../types';

const main = (
    state = {
        movies: {},
        starMovies: {},
        favoriteMovies: {},
    },
    action
) => {
    switch (action.type) {
        case t.SET_MOVIES:
            return {
                ...state,
                movies: action.payload,
            };

        default:
            return { ...state };
    }
};

export default main;
