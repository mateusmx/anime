import Head from 'next/head'
import Link from 'next/link'
import ax from '../../axiosConfig';
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setAnimes, toggleFavoriteAnime, toggleStarredAnime, toggleWatchedEpisode } from '../../redux/actions/main'

import { Typography, Grid, Autocomplete, InputAdornment, TextField, Card, CardMedia, CardContent, CardActions, Button, Box } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CheckIcon from '@mui/icons-material/Check';

import { useRouter } from 'next/dist/client/router';

export default function Anime() {

    const dispatch = useDispatch();
    const router = useRouter();

    const [currentAnime, setCurrentAnime] = useState({});
    const [loading, setLoading] = useState(true);
    const starredAnimes = useSelector(state => state.main.starredAnimes)
    const favoriteAnimes = useSelector(state => state.main.favoriteAnimes)
    const watchedEpisodes = useSelector(state => state.main.watchedEpisodes)
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

            // Getting all the details for the anime
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

            setCurrentAnime(anime);

            anime.episodesLink = (data.relationships.episodes.links.related).replace('https://kitsu.io/api/edge', '');
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


            anime.charactersLink = (data.relationships.characters.links.related).replace('https://kitsu.io/api/edge', '');
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
                character.img = char.attributes.image && (char.attributes.image.original || char.attributes.image.medium);
                if (!characters.includes(char)) {
                    setCharacters((char) => [...char, character]);
                }

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

    const handleEpisode = (episodeId) => {
        dispatch(toggleWatchedEpisode(episodeId));
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
                    <Grid container item={true} xs={12} md={9} sx={{ backgroundColor: 'orange' }}>
                        <Grid sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'start' }}>
                            <Typography gutterBottom variant="body1" sx={{ pt: 0.5, pl: 3 }}>
                                {currentAnime.description}
                            </Typography>

                        </Grid>
                        <Grid item={true} xs={12}>
                            <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                Characters
                            </Typography>
                        </Grid>
                        {!loading && characters.map((char) => {

                            return (
                                <Grid key={char.id} item={true} xs={12} md={6} lg={4} xl={3} p={2} sx={{ display: 'flex', justifyContent: 'center' }}>
                                    <Card sx={{ minWidth: '200px', maxWidth: "300px", maxHeight: '300px', position: 'relative' }}>
                                        <CardMedia
                                            sx={{ cursor: 'pointer' }}
                                            component="img"
                                            alt={char.name}
                                            image={char.img}
                                        />

                                        <Box sx={{ position: 'absolute', top: '84%', backgroundColor: 'rgba(0,0,0,0.8)', width: '100%', color: 'white' }}>
                                            <CardContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                                                <Typography variant="body2" component="div" fontSize={12}>
                                                    {char.name}
                                                </Typography>
                                            </CardContent>
                                        </Box>
                                    </Card>
                                </Grid>
                            )
                        })}
                        <Grid container>
                            <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                Episodes
                            </Typography>
                            <Typography gutterBottom variant="h5" sx={{ pt: 0.5, pl: 3 }}>
                                {!loading && episodes.map((episode) => {
                                    return (
                                        <Grid key={episode.id} sx={{ display: 'flex', alignItems: 'start', justifyContent: 'start' }}>
                                            <Button size="small" onClick={() => handleEpisode(episode.id)}>
                                                {watchedEpisodes.includes(episode.id) ? (<CheckIcon fontSize="medium" sx={{ color: 'green' }} />) : (<CheckIcon fontSize="medium" sx={{ color: 'black' }} />)}
                                            </Button>
                                            <Typography>{episode.airdate} {episode.number}: {episode.description}</Typography>
                                        </Grid>
                                    )
                                })}
                            </Typography>
                            <Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </>
        )
    }


}
