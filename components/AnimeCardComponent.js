import * as React from 'react';
import Link from 'next/link';

import { Box, Grid, Card, CardMedia, CardContent, Typography, CardActions, Button } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

import { useSelector, useDispatch } from 'react-redux';
import { toggleFavoriteAnime, toggleStarredAnime } from '../redux/actions/main';


export default function AnimeCardComponent({ anime } = anime) {

  const starredAnimes = useSelector(state => state.main.starredAnimes)
  const favoriteAnimes = useSelector(state => state.main.favoriteAnimes)
  const dispatch = useDispatch();


  const handleStarred = () => {
    dispatch(toggleStarredAnime(anime.id));
  }

  const handleFavorite = () => {
    dispatch(toggleFavoriteAnime(anime.id));
  }

  return (
    <Grid key={anime.id} item={true} xs={12} md={6} lg={4} xl={3} p={2} sx={{ display: 'flex', alignItems: 'stretch', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: "500px", position: 'relative' }}>
        <Link href={`/anime/${anime.id}`}>
          <CardMedia
            sx={{ cursor: 'pointer' }}
            component="img"
            alt={anime.title}
            image={anime.img}
          />
        </Link>
        <Box sx={{ position: 'absolute', top: '79%', backgroundColor: 'rgba(0,0,0,0.8)', width: '100%', color: 'white' }}>
          <Link href={`/anime/${anime.id}`}>
            <CardContent sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}>
              <Typography gutterBottom variant="h5" component="div">
                {anime.title}
              </Typography>
            </CardContent>
          </Link>
          <CardActions sx={{ display: 'flex', justifyContent: 'space-around' }}>
            <Button size="small" sx={{ color: 'white' }} onClick={handleStarred}>
              {starredAnimes.includes(anime.id) ? (<StarIcon fontSize="medium" sx={{ color: 'gold' }} />) : (<StarBorderIcon fontSize="medium" />)}

              {anime.rating}
            </Button>
            <Button size="small" sx={{ color: 'white' }} onClick={handleFavorite}>
              {favoriteAnimes.includes(anime.id) ? (<FavoriteIcon fontSize="medium" sx={{ color: 'red' }} />) : (<FavoriteBorderIcon fontSize="medium" />)}

              {anime.favorites}</Button>
          </CardActions>
        </Box>
      </Card>
    </Grid>
  );
}
