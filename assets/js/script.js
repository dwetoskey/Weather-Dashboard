function init () {
    const cityEl = document.getElementById ("city");
    const searchEl = document.getElementById ("search");
    const clearEl = document.getElementById ("clear");
    const nameEl = document.getElementById("cityName");
    const currentPicEl = document.getElementById('pic');
    const currentTempEl = document.getElementById('temperature');
    const currentHumidityEl = document.getElementById('humidity');
    const currentWindEl = document.getElementById('wind');
    const currentUVEl = document.getElementById('UV');
    const historyEl = document.getElementById('history');
    var fivedayEl = document.getElementById('fiveday');
    var searchHistory = JSON.parse(localStorage.getItem('search')) || [];
    var todayweatherEl = document.getElementById("today");

    const APIKey = "a27fabe54ef9070c1f4f01e966734358";

    function getWeather(cityName) {
        let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=" + APIKey;
        axios.get(queryURL)
            .then(function (response) {
                todayweatherEl.classList.remove('d-none');
                const currentDate = new Date(response.data.dt * 1000);
                const day = currentDate.getDate();
                const month = currentDate.getMonth() + 1;
                const year = currentDate.getFullYear();
                nameEl.innerHTML = response.data.name + " (" + month + "/" + day + "/" + year + ") ";
                let weatherPic = response.data.weather[0].icon;
                currentPicEl.setAttribute('src', "https://openweathermap.org/img/wn/" + weatherPic + "@2x.png");
                currentPicEl.setAttribute('alt', response.data.weather[0].description);
                currentTempEl.innerHTML = "Temp: " + k2f(response.data.main.temp) + ' &#176F';
                currentHumidityEl.innerHTML = "Humidity: " + response.data.main.humidity + "%";
                currentWindEl.innerHTML = "Wind: " + response.data.wind.speed + "MPH " + response.data.wind.direction;
                
                let lat = response.data.coord.lat;
                let lon = response.data.coord.lat;
                let UVURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey + "&cnt=1";
                axios.get(UVURL)
                    .then(function (response) {
                        let UVIndex = document.createElement("span");

                        if (response.data[0].value < 4) {
                            UVIndex.setAttribute("class", "badge badge-success");
                        }
                        else {
                            UVIndex.setAttribute("class", "badge badge-danger");
                        }
                        UVIndex.innerHTML = response.data[0].value;
                        currentUVEl.innerHTML = "UV Index: ";
                        currentUVEl.append(UVIndex);
                    });
                    
                    let cityID = response.data.id;
                    let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?id=" + cityID + "&appid=" + APIKey;
                    axios.get(forecastURL)
                        .then(function (response) {
                            fivedayEl.classList.remove('d-none');

                            const forecastEl = document.querySelectorAll('.forecast');
                            for (i= 0; i < forecastEl.length; i++) {
                                forecastEl[i].innerHTML = "";
                                const forecastIndex = i * 8 + 4;
                                const forecastDate = new Date(response.data.list[forecastIndex].dt * 1000);
                                const forecastDay = forecastDate.getDate();
                                const forecastMonth = forecastDate.getMonth() + 1;
                                const forecastYear = forecastDate.getFullYear();
                                const forecastDateEl = document.createElement('p');
                                forecastDateEl.setAttribute("class", "mt-4 mb-0 forecast");
                                forecastDateEl.innerHTML = forecastMonth + '/' + forecastDay + '/' + forecastYear;
                                forecastEl[i].append(forecastDateEl);

                                const forecastWeatherEl = document.createElement('img');
                                forecastWeatherEl.setAttribute("src", "https://openweathermap.org/img/wn/" + response.data.list[forecastIndex].weather[0].icon + "@2x.png");
                                forecastEl[i].append(forecastWeatherEl);
                                const forecastTempEl = document.createElement('p');
                                forecastTempEl.innerHTML = "Temp: " + k2f(response.data.list[forecastIndex].main.temp) + "&#176F";
                                forecastEl[i].append(forecastTempEl);
                                const forecastHumidityEl = document.createElement("p");
                                forecastHumidityEl.innerHTML = "Humidity: " + response.data.list[forecastIndex].main.humidity + "%";
                                forecastEl[i].append(forecastHumidityEl);
                            }
                        })
                    

            });
    }

    searchEl.addEventListener('click', function() {
        const searchTerm = cityEl.value;
        getWeather(searchTerm);
        searchHistory.push(searchTerm);
        localStorage.setItem("search", JSON.stringify(searchHistory));
        searchhistory();
    })

    clearEl.addEventListener("click", function () {
        localStorage.clear();
        searchHistory = [];
        searchhistory();
    })

    function k2f(K) {
        return Math.floor ((K - 273.15) * 1.8 +32);
    }

    function searchhistory () {
        historyEl.innerHTML = "";
        for (let i = 0; i < searchHistory.length; i++) {
            const history = document.createElement("input");
            history.setAttribute("type", "text");
            history.setAttribute("readonly", true);
            history.setAttribute("class", "form-control d-block bg-white");
            history.setAttribute("value", searchHistory[i]);
            history.addEventListener("click", function () {
                getWeather(history.value);
            })
            historyEl.append(history);            
            }

    }
    searchhistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[searchHistory.length - 1]);
    }

}

init();

