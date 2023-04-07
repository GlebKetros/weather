// получаем географические координаты городо по его названию 
// для этого воспольльзуемся API геокодирования
const urlGeo = 'http://api.openweathermap.org/geo/1.0/direct'
const urlWeather = `https://api.openweathermap.org/data/2.5/weather`
const key = 'b8c763881bde95df3bc652f6049e4738'
const svgPath = 'images/svg-animated/'

const citySearch = document.getElementById('city-search')
const searchForm = document.getElementById('search-form')

const weatherIcons = [
    {key: 'clear sky', iconName: 'clear-sky.svg', weather: 'Sunny'},
    {key: 'few clouds', iconName: 'partly-cloudy.svg', weather: 'Partly cloudy'},
    {key: 'scattered clouds', iconName: 'cloudy.svg', weather: 'Cloudy'},
    {key: 'broken clouds', iconName: 'cloudy.svg', weather: 'Cloudy'},
    {key: 'overcast clouds', iconName: 'cloudy.svg', weather: 'Cloudy'},
    {key: 'shower rain', iconName: 'rainy.svg', weather: 'Rainy'},
    {key: 'light rain', iconName: 'rainy.svg', weather: 'Rainy'},
    {key: 'rain', iconName: 'rainy.svg', weather: 'Rainy'},
    {key: 'thunderstorm', iconName: 'thundery.svg', weather: 'Thundery'},
    {key: 'snow', iconName: 'snowy.svg', weather: 'Snowy'},
    {key: 'mist', iconName: 'foggy.svg', weather: 'Foggy'},
]
const getWeatherIcon = function(weatherKey) {
    const obj = weatherIcons.find(el => el.key === weatherKey)
    if (obj) return obj.iconName
    return false
}

const getWeatherDescriptionByKey = function(weatherKey) {
    const obj = weatherIcons.find(el => el.key === weatherKey)
    if (obj) return obj.weather
    return false
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// функция, добавляющая ноль в начале, если передаваемое число одноразрядное
const addZeroPrepend = (num) => {
    if (String(num).length == 1) {
        return '0' + num
    } else {
        return num
    }
}


// функция принимает название города и возвращает объект с координатами города
const getCoordinates = function(city) {
    
    return new Promise((resolve, reject) => {
        let result = {}
        fetch(`${urlGeo}?q=${city}&appid=${key}`)
            .then(res => res.json())
            .then(data => {
                result.city = data[0].local_names.en                
                result.lat = data[0].lat
                result.lon = data[0].lon

                resolve(result) 
            })
            .catch(err => {
                console.log(err)
                alert('city not found')
            })
    }).then(result => result)
}

// функция возвращает объект с данными о погоде в городе, координаты которого были в нее переданы
const getWeather = function(lat, lon) {
    let result = {
    }
    return new Promise((resolve, reject) => {
        fetch(`${urlWeather}?lat=${lat}&lon=${lon}&appid=${key}`)
            .then(res => res.json())
            .then(res => {
                result.city = res.name
                result.temperature = Math.round(res.main.temp - 273.15)
                result.weatherDescription = res.weather[0].description

                resolve(result) 
            })
    })
}

// функция принимает данные о погоде в городе и на их основе перерисовывает страницу
const renderWeatherInfo = function(weather) {
    const cityName = document.getElementById('city-name')
    const weatherIcon = document.getElementById('weather-icon')
    const temperature = document.getElementById('temperature')
    const weatherDescription = document.getElementById('weather-description')

    cityName.innerText = weather.city
    weatherIcon.src = `${svgPath}${getWeatherIcon(weather.weatherDescription)}`
    temperature.innerText = weather.temperature
    weatherDescription.innerText = getWeatherDescriptionByKey(weather.weatherDescription) 
}

const printWeatherByCity = function(city) {
    getCoordinates(city)
        .then(cityInfo => {
            return getWeather(cityInfo.lat, cityInfo.lon)
        })
        .then(weather => {
            renderWeatherInfo(weather)
        })   
} 

printWeatherByCity('pskov')


searchForm.addEventListener('submit', (event) => {
    event.preventDefault()

    printWeatherByCity(citySearch.value)
    citySearch.value = ''
})
// const render = new Promise((resolve, rejected) => {
//     getCoordinates()
// })

// render.then(console.log('suc'))


// const getCoordinates = (city) => {
//     let result = {}
//     fetch(`${urlGeo}?q=${city}&appid=${key}`)
//         .then(res => res.json())
//         .then(data => {
//             result.lat = data[0].lat
//             result.lon = data[0].lon
//             result.city = data[0].local_names.en
//         })
//         .catch(err => console.log(err))

//         console.log(result)
//     return result
// }



// const response = {
//     city: 'pskov',
//     lat: 57.8173923,
//     lon: 28.3343465,
// }
// console.log(response)
// console.log(response.lat)

// const url = `https://api.openweathermap.org/data/2.5/weather?lat=57.8173923&lon=28.3343465&appid=${key}`

// fetch(url)
//     .then(res => res.json())
//     .then(data => console.log(data))

// let geo = 'http://api.openweathermap.org/geo/1.0/direct?q=Moskow&appid=b8c763881bde95df3bc652f6049e4738'