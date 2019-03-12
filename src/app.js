const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./ultils/geocode')
const forecast = require('./ultils/forecast')

const app = express()
const port = process.env.PORT || 3000

// Define paths for Express config
const publicDirPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static dir to serve
app.use(express.static(publicDirPath))

// Routes
app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Jem Alvarez'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Jem Alvarez'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        message: 'This is supposed to be a helpful message',
        title: 'Help',
        name: 'Jem Alvarez'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address'
        })
    }

    geocode(req.query.address, (geocodeErr, { lat, lon, location } = {}) => {
        if (geocodeErr) {
            return res.send({ error: geocodeErr })
        }

        forecast(lat, lon, (forecastErr, forecastData) => {
            if (forecastErr) {
                return res.send(forecastErr)
            }

            res.send({
                forecast: forecastData,
                location: location,
                address: req.query.address
            })
        })
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404 - Not found!',
        name: 'Jem Alvarez',
        error: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404 - Not found!',
        name: 'Jem Alvarez',
        error: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})