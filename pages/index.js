import Head from 'next/head'
import ax from '../axiosConfig';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAnimes } from '../redux/actions/main'

import { Typography, Grid, Autocomplete, InputAdornment, TextField, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';

import AnimeCardComponent from '../components/AnimeCardComponent';
import InfiniteScroll from 'react-infinite-scroll-component';


export default function Home() {

  const dispatch = useDispatch();
  const starredAnimes = useSelector(state => state.main.starredAnimes)
  const favoriteAnimes = useSelector(state => state.main.favoriteAnimes)
  const [next, setNext] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(100000);
  const [availableAnimes, setAvailableAnimes] = useState([]);
  const [displayingAnimes, setDisplayingAnimes] = useState([]);
  const [favoriteFilter, setFavoriteFilter] = useState(false);
  const [starredFilter, setStarredFilter] = useState(false);
  const [searchFilter, setSearchFilter] = useState(false);

  useEffect(() => {
    getData();
    async function getData() {
      const response = await ax.get('/anime');
      const animesArray = [];
      response.data.data.map((data) => {
        let anime = {};
        anime.id = data.id;
        anime.title = data.attributes.titles.en || data.attributes.titles.en_jp;
        anime.synopsis = data.attributes.synopsis
        anime.img = data.attributes.posterImage.medium;
        anime.rating = data.attributes.averageRating
        anime.favorites = data.attributes.favoritesCount
        animesArray.push(anime);
      })
      dispatch(setAnimes(animesArray));
      setAvailableAnimes(animesArray);
      setDisplayingAnimes(animesArray);
      setLimit(response.data.meta.count);
      setNext((response.data.links.next).replace('https://kitsu.io/api/edge', ''));
    }
  }, [])

  const handleFavoriteClick = () => {
    if (favoriteFilter) {
      if (starredFilter) {
        // Starred filter is active so need to filter available (all) - starred ones.
        setDisplayingAnimes(availableAnimes.filter((anime) => starredAnimes.includes(anime.id)));
      } else {
        // No filters are applied.
        setDisplayingAnimes([...availableAnimes]);
      }
    } else {
      if (starredFilter) {
        // Both filters are applied.
        setDisplayingAnimes(displayingAnimes.filter((anime) => starredAnimes.includes(anime.id) && favoriteAnimes.includes(anime.id)));
      } else {
        // Only Favorite filter is being applied.
        setDisplayingAnimes(displayingAnimes.filter((anime) => favoriteAnimes.includes(anime.id)));
      }
    }
    setFavoriteFilter(!favoriteFilter);
  }

  const handleStarredClick = () => {
    if (starredFilter) {
      if (favoriteFilter) {
        // Favorite filter is active so need to filter available (all) - favorite ones.
        setDisplayingAnimes(availableAnimes.filter((anime) => favoriteAnimes.includes(anime.id)));
      } else {
        // No filters are applied.
        setDisplayingAnimes([...availableAnimes]);
      }
    } else {
      if (favoriteFilter) {
        // Both filters are applied.
        setDisplayingAnimes(displayingAnimes.filter((anime) => starredAnimes.includes(anime.id) && favoriteAnimes.includes(anime.id)));
      } else {
        // Only Starred filter is being applied.
        setDisplayingAnimes(displayingAnimes.filter((anime) => starredAnimes.includes(anime.id)));
      }
    }
    setStarredFilter(!starredFilter);
  }

  const fetchMoreData = async () => {
    // If the length of available animes is higher than the limit - 1 = 17253 (17254 is the total provided by the API) 
    // Then we set the flag that there is no more animes to fetch.
    if (availableAnimes.length > limit - 1) {
      setHasMore(false);
      return;
    }

    const response = await ax.get(next);
    const animesArray = [];
    response.data.data.map((data) => {
      let anime = {};
      anime.id = data.id;
      anime.title = data.attributes.titles.en || data.attributes.titles.en_jp;
      anime.synopsis = data.attributes.synopsis
      anime.img = data.attributes.posterImage.medium;
      anime.rating = data.attributes.averageRating
      anime.favorites = data.attributes.favoritesCount
      setAvailableAnimes((available) => [...available, anime]);
      setDisplayingAnimes((available) => [...available, anime]);
      animesArray.push(anime);
    })
    dispatch(setAnimes(animesArray));
    setNext((response.data.links.next).replace('https://kitsu.io/api/edge', ''));

  };

  return (
    <>
      <Head>
        <title>Anime List</title>
        <meta name="description" content="Cruisebound Anime Application" />
        <link rel="icon" href="https://www.cruisebound.com/favicon.ico" />
      </Head>

      <Grid container>
        <Grid item={true} xs={12} sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Typography variant="h4" color="initial">Anime List</Typography>
        </Grid>
        <Grid item={true} xs={12} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center' }}>
          <Grid item={true} xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', pl: 2, justifyContent: { xs: 'center', md: 'start' } }}>
            <Typography variant="caption" color="initial" fontSize={16} pr={1}>Filter</Typography>
            <Button size="small" onClick={handleStarredClick}>
              {starredFilter ? (<StarIcon sx={{ color: 'gold' }} fontSize="medium" />) : (<StarBorderIcon fontSize="medium" sx={{ color: 'black' }} />)}

            </Button>
            <Button size="small" onClick={handleFavoriteClick}>
              {favoriteFilter ? (<FavoriteIcon sx={{ color: 'red' }} fontSize="medium" />) : (<FavoriteBorderIcon fontSize="medium" sx={{ color: 'black' }} />)}

            </Button>
          </Grid>
          <Grid item={true} xs={12} md={4}>
            <Autocomplete
              sx={{
                minWidth: '400px', '& .MuiOutlinedInput-root': {
                  borderRadius: "50px",
                  padding: "2px"
                }
              }}
              freeSolo
              disableClearable
              options={displayingAnimes.length > 1 ? displayingAnimes.map((option) => option.title) : []}
              renderInput={(params) => (
                <TextField
                  sx={{ borderRadius: "50px", padding: "0px" }}
                  {...params}
                  placeholder="Search Anime"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                    startAdornment: (
                      <InputAdornment position="start" sx={{ pl: "8px" }}>
                        <SearchIcon />
                      </InputAdornment>
                    )
                  }}
                />
              )}
            />
          </Grid>
          <Grid item={true} xs={12} md={4} sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', md: 'end' } }}>
            <Typography variant="caption" color="initial" fontSize={16} sx={{ pr: 2 }}> {displayingAnimes.length === 1 ? (`1 Result`) : (`${displayingAnimes.length} Results`)}</Typography>
          </Grid>
        </Grid>

        {displayingAnimes.length > 0 ? (
          displayingAnimes.map((anime) => {

            return (<AnimeCardComponent key={anime.id} anime={anime} />)
          })
        ) : (favoriteFilter || starredFilter || searchFilter) ? ('No matching criteria, try another filter') : ('Loading ...')}

        {(favoriteFilter || starredFilter || searchFilter) ? null : (
          <InfiniteScroll
            dataLength={availableAnimes.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<h4>Loading more awesome Animes ...</h4>}
            endMessage={
              <div>
                Looks like those are all the animes
              </div>
            }
          >
          </InfiniteScroll>
        )}





      </Grid>
    </>
  )
}
