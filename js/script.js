const urlGeo = 'https://api.openweathermap.org/geo/1.0/direct'
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
    {key: 'moderate rain', iconName: 'rainy.svg', weather: 'Rainy'},
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

function renderHumidityScale (value) {
    const scale = document.getElementById('humidityScaleMain')

    scale.style.strokeDashoffset = 189 / 100 * (100 - value) + 94
}

//фенкция скрывает лоадер, если он виден и делает видимым, если скрыт
function toggleLoader() {
    const preloader = document.querySelector('#preloader')
    if (getComputedStyle(preloader).display === 'none') {
        preloader.style.display = 'flex'
    } else {
        preloader.style.display = 'none'
    }
}

// функция принимает название города и возвращает объект с координатами города
async function getCoordinates (city) {
    let result = {}

    try {
        const res = await fetch(`${urlGeo}?q=${city}&appid=${key}`)
        const data = await res.json()
        await (function() {
            if (data.length == 0) {
                alert('City not found')
            }
        })()

        result.city = await data[0].local_names.en                
        result.lat = await data[0].lat
        result.lon = await data[0].lon         
    } catch(e) {
        throw e
    }

    return result
}

// функция возвращает объект с данными о погоде в городе, координаты которого были в нее переданы
async function getWeather (lat, lon) {
    let result = {}

    try {
    const res = await fetch(`${urlWeather}?lat=${lat}&lon=${lon}&appid=${key}`)
    const data = await res.json()

    result.city = await data.name
    result.temperature = await Math.round(data.main.temp - 273.15)
    result.feelsLike = await Math.round(data.main.feels_like - 273.15)
    result.pressure = await data.main.pressure
    result.weatherDescription = await data.weather[0].description
    result.humidity = await data.main.humidity        
    } catch(e) {
        throw e
    }

    return result
}

// функция принимает данные о погоде в городе и на их основе перерисовывает страницу
const renderWeatherInfo = function(weather) {
    document.getElementById('city-name').innerText = `${weather.city}`
    document.getElementById('weather-icon').src = `${svgPath}${getWeatherIcon(weather.weatherDescription)}`
    document.getElementById('temperature').innerText = weather.temperature
    document.getElementById('weather-description').innerText = getWeatherDescriptionByKey(weather.weatherDescription) 
    
    document.getElementById('humidity').innerText = weather.humidity
    document.getElementById('feelsLike').innerText = weather.feelsLike 
    document.getElementById('pressure').innerText = weather.pressure

    renderHumidityScale(weather.humidity)
}


async function printWeatherByCity(city) {
    toggleLoader()

    try {
        const cityInfo = await getCoordinates(city)
        const weather = await getWeather(cityInfo.lat, cityInfo.lon)
        renderWeatherInfo(weather)        
    } catch(e) {
        console.log(e)
    } finally {
        toggleLoader()
    }
} 

printWeatherByCity('pskov')

searchForm.addEventListener('submit', (event) => {
    event.preventDefault()

    printWeatherByCity(citySearch.value)
    citySearch.value = ''
})

