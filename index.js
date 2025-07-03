require('dotenv').config();
const cache = {};
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const API_KEY = process.env.API_KEY;
console.log('API Key:', API_KEY);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use('/weather/:city', (req, res, next)=>{
    const city = req.params.city;
    if(!city || !/^[a-zA-Z\s]+$/.test(city)){
        return res.status(400).json({error: 'Invalid city, use letters and spaces only'});
    }
    next();
})

//Define weather endpoint
app.get('/weather/:city', async(req, res)=>{
    const city = req.params.city;
    console.log('Fetching weather for:', city);

    if(cache[city]){
        console.log('Fetching from cache...');
        return res.json(cache[city]);
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
    try{
        const response = await axios.get(url);
        const data = response.data;
        console.log('API Response:', data);
        const weatherInfo = {
            city : data.name,
            temperature : data.main.temp,
            description : data.weather[0].description,
            humidity : data.main.humidity,
            windSpeed: data.wind.speed,
            pressure: data.main.pressure
        };
        cache[city] = weatherInfo;
        res.json(weatherInfo);
    }catch(err){
        console.log('Error:', err.message);
        res.status(400).json({error: 'Couldn\'t fetch the weather data, try again'});
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
});