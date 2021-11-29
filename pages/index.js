import Head from 'next/head'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setMovies } from '../redux/actions/main'
import ax from '../axiosConfig';

export default function Home() {

  const dispatch = useDispatch();
  const movies = useSelector(state => state.main.movies)

  useEffect(() => {
    getData();
    async function getData() {
      const response = await ax.get('/anime');
      const animesArray = [];
      response.data.data.map((data) => {
        let anime = {};
        anime.title = data.attributes.titles.en;
        anime.img = data.attributes.posterImage.medium;
        anime.rating = data.attributes.averageRating
        anime.favorites = data.attributes.favoritesCount

        animesArray.push(anime);
      })
      dispatch(setMovies(animesArray));
    }

  }, [])

  return (
    <>
      <Head>
        <title>Cruisebound Anime</title>
        <meta name="description" content="Cruisebound Anime Application" />
        <link rel="icon" href="https://www.cruisebound.com/favicon.ico" />
      </Head>
      <div>
        En casa
      </div>
    </>
  )
}
