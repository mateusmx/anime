import axios from 'axios';

const ax = axios.create({
    // .. where we make our configurations
    baseURL: 'https://kitsu.io/api/edge',
    headers: {
        'Accept': 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
    }
});

export default ax;