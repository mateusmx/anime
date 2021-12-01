import { CssBaseline } from '@mui/material';
import { wrapper } from '../redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeFavoriteAnimes, initializeStarredAnimes, initializeWatchedEpisodes } from '../redux/actions/main';

function MyApp({ Component, pageProps }) {

  const dispatch = useDispatch();
  const starredAnimes = useSelector(state => state.main.starredAnimes)
  const favoriteAnimes = useSelector(state => state.main.favoriteAnimes)
  const watchedEpisodes = useSelector(state => state.main.watchedEpisodes)

  useEffect(() => {

    const favoriteArray = JSON.parse(window.localStorage.getItem("favoriteAnimes")) || [];
    const starredArray = JSON.parse(window.localStorage.getItem("starredAnimes")) || [];
    const watchedArray = JSON.parse(window.localStorage.getItem('watchedEpisodes')) || [];

    dispatch(initializeFavoriteAnimes(favoriteArray));
    dispatch(initializeStarredAnimes(starredArray));
    dispatch(initializeWatchedEpisodes(watchedArray));
  }, []);

  useEffect(() => {
    window.localStorage.setItem('favoriteAnimes', JSON.stringify(favoriteAnimes));
  }, [favoriteAnimes]);

  useEffect(() => {
    window.localStorage.setItem('starredAnimes', JSON.stringify(starredAnimes));
  }, [starredAnimes]);

  useEffect(() => {
    window.localStorage.setItem('watchedEpisodes', JSON.stringify(watchedEpisodes));
  }, [watchedEpisodes]);

  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

export default wrapper.withRedux(MyApp);
