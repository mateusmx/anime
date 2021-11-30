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
    const favoriteArray = [...window.localStorage.getItem('favoriteAnimes') || []]
    const starredArray = [...window.localStorage.getItem('starredAnimes') || []]
    const watchedArray = [window.localStorage.getItem('watchedEpisodes') || []]

    if (watchedArray.length > 0 && watchedArray[0].length > 0) {
      const splitting = watchedArray[0].split(",");
      const watched = [];
      splitting.map((val) => {
        if (val) {
          watched.push((val));
        }
      })
      dispatch(initializeWatchedEpisodes(watched));
    } else {
      dispatch(initializeWatchedEpisodes([]));
    }


    dispatch(initializeFavoriteAnimes(favoriteArray.filter((val) => val !== ',')));
    dispatch(initializeStarredAnimes(starredArray.filter((val) => val !== ',')));
    // dispatch(initializeWatchedEpisodes(watchedArray.filter((val) => val !== ',')));
  }, []);

  useEffect(() => {
    // window.localStorage.removeItem('favoriteAnimes');
    window.localStorage.setItem('favoriteAnimes', favoriteAnimes);
  }, [favoriteAnimes]);

  useEffect(() => {
    // window.localStorage.removeItem('starredAnimes');
    window.localStorage.setItem('starredAnimes', starredAnimes);
  }, [starredAnimes]);

  useEffect(() => {
    // window.localStorage.removeItem('starredAnimes');
    window.localStorage.setItem('watchedEpisodes', watchedEpisodes);
  }, [watchedEpisodes]);

  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

export default wrapper.withRedux(MyApp);
