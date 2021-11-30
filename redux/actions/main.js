import * as t from '../types';

export const setAnimes = (animes) => (dispatch) => {
    dispatch({
        type: t.SET_ANIMES,
        payload: animes,
    });
};

export const toggleFavoriteAnime = (animeId) => (dispatch) => {
    dispatch({
        type: t.TOGGLE_FAVORITE_ANIME,
        payload: animeId,
    });
};

export const toggleStarredAnime = (animeId) => (dispatch) => {
    dispatch({
        type: t.TOGGLE_STARRED_ANIME,
        payload: animeId,
    });
};

export const toggleWatchedEpisode = (episodeId) => (dispatch) => {
    console.log("Action toggle watched episode");
    dispatch({
        type: t.TOGGLE_WATCHED_EPISODE,
        payload: episodeId,
    });
};

export const initializeFavoriteAnimes = (animes) => (dispatch) => {
    dispatch({
        type: t.INITIALIZE_FAVORITE_ANIMES,
        payload: animes,
    });
};

export const initializeStarredAnimes = (animes) => (dispatch) => {
    dispatch({
        type: t.INITIALIZE_STARRED_ANIMES,
        payload: animes,
    });
};

export const initializeWatchedEpisodes = (episodes) => (dispatch) => {
    dispatch({
        type: t.INITIALIZE_WATCHED_EPISODES,
        payload: episodes,
    });
};


