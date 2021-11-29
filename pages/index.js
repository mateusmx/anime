import Head from 'next/head'
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setMovies } from '../redux/actions/main'

export default function Home() {

  const dispatch = useDispatch();
  const movies = useSelector(state => state.main.movies)
  console.log(movies);

  useEffect(() => {
    dispatch(setMovies('test'));
  }, [])

  return (
    <>
      <Head>
        <title>Cruisebound Anime</title>
        <meta name="description" content="Cruisebound Anime Application" />
        <link rel="icon" href="https://www.cruisebound.com/favicon.ico" />
      </Head>
      <div>
        En casa {movies}
      </div>
    </>
  )
}
