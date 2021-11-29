import * as t from '../types';

export const setMovies = (movies) => (dispatch) => {
    dispatch({
        type: t.SET_MOVIES,
        payload: movies,
    });
};