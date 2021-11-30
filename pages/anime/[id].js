import Head from 'next/head'
import Link from 'next/link'
import ax from '../../axiosConfig';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAnimes, toggleFavoriteAnime, toggleStarredAnime } from '../../redux/actions/main'

import { Typography, Grid, Autocomplete, InputAdornment, TextField, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SearchIcon from '@mui/icons-material/Search';

import AnimeCardComponent from '../../components/AnimeCardComponent';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useRouter } from 'next/dist/client/router';

export default function Anime() {

    const dispatch = useDispatch();
    const router = useRouter();

    const [currentAnime, setCurrentAnime] = useState({});
    const [loading, setLoading] = useState(true);
    const starredAnimes = useSelector(state => state.main.starredAnimes)
    const favoriteAnimes = useSelector(state => state.main.favoriteAnimes)
    const [characters, setCharacters] = useState([]);
    const [episodes, setEpisodes] = useState([]);

    useEffect(() => {
        setLoading(true);
        waitForRouter();
        function waitForRouter() {
            if (typeof router.query.id !== "undefined") {
                getData();
            }
        }

        async function getData() {
            const anime = {};
            const response = await ax.get(`/anime/${router.query.id}`);
            const data = response.data.data

            anime.id = router.query.id;
            anime.title = data.attributes.titles.en || data.attributes.titles.en_jp;

            const descriptionArray = (data.attributes.description).split('\n');
            anime.description = '';
            descriptionArray.map((desc, index) => {
                if (index + 1 === descriptionArray.length) {
                    anime.writtenBy = desc;
                } else {
                    anime.description += desc;
                }
            })

            // anime.description = 
            // anime.writtenBy = (data.attributes.description).split('\n')[1];
            anime.img = data.attributes.posterImage.medium;
            anime.rating = data.attributes.averageRating;
            anime.userCount = data.attributes.userCount;
            anime.favorites = data.attributes.favoritesCount;
            anime.ratingRank = data.attributes.ratingRank;
            anime.ageRating = data.attributes.ageRating;
            anime.ageRatingGuide = data.attributes.ageRatingGuide;
            anime.startDate = data.attributes.startDate;
            anime.endDate = data.attributes.endDate;
            anime.status = data.attributes.status;
            anime.subtype = data.attributes.subtype;


            anime.episodesLink = (data.relationships.episodes.links.related).replace('https://kitsu.io/api/edge', '');
            anime.charactersLink = (data.relationships.characters.links.related).replace('https://kitsu.io/api/edge', '');

            setCurrentAnime(anime);

            const episodesResponse = await ax.get(anime.episodesLink);

            let episodesArray = [];

            episodesResponse.data.data.map((data) => {
                let episode = {};
                episode.id = data.id;
                episode.airdate = data.attributes.airdate;
                episode.number = data.attributes.number;
                episode.description = data.attributes.synopsis || data.attributes.titles.en_us || data.attributes.titles.en_jp
                episodesArray.push(episode);
            })

            setEpisodes(episodesArray);

            const charactersResponse = await ax.get(anime.charactersLink);
            let mediaArray = [];
            charactersResponse.data.data.map((links) => {
                mediaArray.push((links.links.self).replace('https://kitsu.io/api/edge', ''));
            })

            setCharacters([]);

            mediaArray.map(async (link) => {
                const mediaResponse = await ax.get(`${link}/character`);
                const char = mediaResponse.data.data

                let character = {};
                character.id = char.id;
                character.name = char.attributes.name;
                character.img = char.attributes.image.small;

                setCharacters((char) => [...char, character]);
            })

            setLoading(false);
        }
    }, [router.query.id])

    const handleStarred = () => {
        dispatch(toggleStarredAnime(currentAnime.id));
    }

    const handleFavorite = () => {
        dispatch(toggleFavoriteAnime(currentAnime.id));
    }

    if (loading) {
        return (
            <div>
                Loading ...
            </div>
        )
    } else {
        return (
            <>
                <Head>
                    <title>Anime List</title>
                    <meta name="description" content="Cruisebound Anime Application" />
                    <link rel="icon" href="https://www.cruisebound.com/favicon.ico" />
                </Head>

                <Grid container>


                    <Grid item={true} xs={12} sx={{ display: 'flex', justifyContent: 'center', pt: 3 }}>
                        <Typography variant="h4" color="initial">{currentAnime.title}</Typography>
                    </Grid>
                    <Grid item={true} xs={12} sx={{ display: 'flex', justifyContent: 'start' }}>
                        <Link href="/"><Button variant="body2" color="initial">{"< Back"}</Button></Link>
                    </Grid>
                    <Grid item={true} xs={12} md={3} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'center', alignItems: { xs: 'center', md: 'start' }, pl: 2 }}>
                        <Card sx={{ maxWidth: 450 }}>
                            <CardMedia
                                sx={{ cursor: 'pointer' }}
                                component="img"
                                alt={currentAnime.title}
                                image={currentAnime.img}
                            />
                            <Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                    <Button size="small" onClick={handleStarred}>
                                        {starredAnimes.includes(currentAnime.id) ? (<StarIcon fontSize="medium" sx={{ color: 'gold' }} />) : (<StarBorderIcon fontSize="medium" />)}
                                    </Button>
                                    <Typography gutterBottom variant="body2" sx={{ pt: 0.5 }}>
                                        {currentAnime.rating} from {currentAnime.userCount} users
                                    </Typography>
                                </Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                    <Button size="small" onClick={handleFavorite}>
                                        {favoriteAnimes.includes(currentAnime.id) ? (<FavoriteIcon fontSize="medium" sx={{ color: 'red' }} />) : (<FavoriteBorderIcon fontSize="medium" />)}

                                    </Button>
                                    <Typography gutterBottom variant="body2" sx={{ pt: 0.5 }}>
                                        {currentAnime.favorites} Ranked #{currentAnime.ratingRank}
                                    </Typography>
                                </Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                    <Typography gutterBottom variant="body2" sx={{ pt: 0.5, pl: 3 }}>
                                        Rated {currentAnime.ageRating}: {`(${currentAnime.ageRatingGuide})`}
                                    </Typography>
                                </Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                    <Typography gutterBottom variant="body2" sx={{ pt: 0.5, pl: 3 }}>
                                        Aired on {currentAnime.startDate}
                                    </Typography>
                                </Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                    <Typography gutterBottom variant="body2" sx={{ pt: 0.5, pl: 3 }}>
                                        {currentAnime.status === 'finished' ? `Ended on ${currentAnime.endDate}` : 'Ongoing'}
                                    </Typography>
                                </Grid>
                                <Grid sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                    <Typography gutterBottom variant="body2" sx={{ pt: 0.5, pl: 3 }}>
                                        Type: {currentAnime.subtype}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                    <Grid item={true} xs={12} md={9} sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'start', backgroundColor: 'orange' }}>

                        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                            <Typography gutterBottom variant="body1" sx={{ pt: 0.5, pl: 3 }}>
                                {currentAnime.description}
                            </Typography>

                            <Grid>
                                <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                    Characters
                                </Typography>
                                <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                    {characters.map((char) => {
                                        return (<Typography key={char.id}>{char.name}</Typography>)
                                    })}
                                </Typography>
                                <Grid>

                                </Grid>
                            </Grid>

                            <Grid>
                                <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                    Episodes
                                </Typography>
                                <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                    {episodes.map((episode) => {
                                        return (<Typography key={episode.id}>{episode.airdate} {episode.number}: {episode.description}</Typography>)
                                    })}
                                </Typography>
                                <Grid>

                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </>
        )
    }


}
