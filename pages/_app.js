import { CssBaseline } from '@mui/material';
import { wrapper } from '../redux/store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { initializeFavoriteAnimes, initializeStarredAnimes } from '../redux/actions/main';

function MyApp({ Component, pageProps }) {

  const dispatch = useDispatch();
  const starredAnimes = useSelector(state => state.main.starredAnimes)
  const favoriteAnimes = useSelector(state => state.main.favoriteAnimes)

  useEffect(() => {
    const favoriteArray = [...window.localStorage.getItem('favoriteAnimes')]
    const starredArray = [...window.localStorage.getItem('starredAnimes')]

    dispatch(initializeFavoriteAnimes(favoriteArray.filter((val) => val !== ',')));
    dispatch(initializeStarredAnimes(starredArray.filter((val) => val !== ',')));
  }, []);

  useEffect(() => {
    // window.localStorage.removeItem('favoriteAnimes');
    window.localStorage.setItem('favoriteAnimes', favoriteAnimes);
  }, [favoriteAnimes]);

  useEffect(() => {
    // window.localStorage.removeItem('starredAnimes');
    window.localStorage.setItem('starredAnimes', starredAnimes);
  }, [starredAnimes]);

  return (
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

export default wrapper.withRedux(MyApp);
