import * as t from '../types';

const main = (
    state = {
        animes: [],
        starredAnimes: [],
        favoriteAnimes: [],
    },
    action
) => {
    switch (action.type) {
        case t.SET_ANIMES:
            return {
                ...state,
                animes: [...state.animes, action.payload],
            };

        case t.TOGGLE_FAVORITE_ANIME:
            const oldStateFavorite = { ...state };
            let favorite = [...oldStateFavorite.favoriteAnimes];
            if (favorite.includes(action.payload)) {
                favorite.map((id, index) => {
                    if (id === action.payload) {
                        favorite.splice(index, 1);
                    }
                })
            } else {
                favorite.push(action.payload);
            }

            return {
                ...state,
                favoriteAnimes: favorite,
            };

        case t.TOGGLE_STARRED_ANIME:
            const oldStateStarred = { ...state };
            let starred = [...oldStateStarred.starredAnimes];
            if (starred.includes(action.payload)) {
                starred.map((id, index) => {
                    if (id === action.payload) {
                        starred.splice(index, 1);
                    }
                })
            } else {
                starred.push(action.payload);
            }

            return {
                ...state,
                starredAnimes: starred,
            };

        case t.INITIALIZE_FAVORITE_ANIMES:
            return {
                ...state,
                favoriteAnimes: action.payload,
            };

        case t.INITIALIZE_STARRED_ANIMES:
            return {
                ...state,
                starredAnimes: action.payload,
            };



        default:
            return { ...state };
    }
};

export default main;
