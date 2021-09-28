var TCYang100622ApiKey = "f6f99b4eef66d2120612d0e1e2bb8814",
  units = "Imperial",
  cityArray = [],
  cityAndDateEl = document.querySelector('#cityAndDate'),
  tempEl = document.querySelector('#temp'),
  windSpeedEl = document.querySelector('#windSpeed'),
  humidityEl = document.querySelector('#humidity'),
  uvIndexEl = document.querySelector('#uvIndex'),
  currentDay = moment().format('L');




function findCity() {
  var searchCity = document.getElementById('searchCity').value;

  //fetch data from openweathermap.org
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=" + units + "&appid=" + TCYang100622ApiKey)
    .then(function (response) {
      return response.json();
    })
    .then(function (response) {
      console.log(response);

      //Add city and date to top [City (mm/dd/yyyy) weather image]
      var weatherCondition = response.weather[0].icon;

      var weatherIcon = document.createElement("img");
      weatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + weatherCondition + "@2x.png", alt = "current weather condition", width = 50, height = 50);

      cityAndDateEl.innerHTML = '';
      cityAndDateEl.append(searchCity + " " + currentDay);
      cityAndDateEl.appendChild(weatherIcon);

      //Add current temperature
      tempEl.innerHTML = '';
      var temperature = response.main.temp;
      tempEl.append("Temp: " + temperature + " \xB0F");

      //Add current wind speed
      windSpeedEl.innerHTML = '';
      var wind = response.wind.speed;
      windSpeedEl.append("Wind: " + wind + " MPH");

      //Add current humidity
      humidityEl.innerHTML = '';
      var humid = response.main.humidity;
      humidityEl.append("Humidity: " + humid + " %");

      //TODO: Add UV index and highlight the UV index green
      uvIndexEl.innerHTML = '';
      var lattitude = response.coord.lat;
      var longitude = response.coord.lon;

      fetch("https:api.openweathermap.org/data/2.5/onecall?lat=" + lattitude + "&lon=" + longitude + "&units=imperial&exclude=minutely,hourly,alerts&appid=" + TCYang100622ApiKey).then(function (uvData) {
        return uvData.json();
      })
        .then(function (uvData) {
          console.log(uvData);
          var ultraVioletIndex = uvData.current.uvi;
          uvIndexEl.append("UV Index: " + ultraVioletIndex);

          //5 day forcast needs to include date, weather icon, temperature, wind speed and humidity
          for (let i = 0; i < 5; i++) {
            var oneDay = moment().add((i + 1), 'd').format('L');
            
            var forecastDayEl = document.querySelector('#forecast' + i);
            forecastDayEl.innerHTML='';
            forecastDayEl.append(oneDay);

            var fcWeatherIconData = uvData.daily[i].weather[0].icon;
            var fcWeatherIconEl = document.querySelector('#fcWeatherIcon' + i);
            var fcWeatherIcon = document.createElement("img");
            fcWeatherIcon.setAttribute("src", "https://openweathermap.org/img/wn/" + fcWeatherIconData + "@2x.png", alt = "current weather condition", width = 30, height = 30);
            fcWeatherIconEl.innerHTML='';
            fcWeatherIconEl.appendChild(fcWeatherIcon);

            var tempNum = uvData.daily[i].temp.day;
            var fcTempEl = document.querySelector('#fcTemp' + i);
            fcTempEl.innerHTML='';
            fcTempEl.append("Temp: " + tempNum + " \xB0F");

            var wSpeed = uvData.daily[i].wind_speed;
            var fcWindEl = document.querySelector('#fcWind' + i);
            fcWindEl.innerHTML='';
            fcWindEl.append("Wind: " + wSpeed + " MPH");

            var moistureNDaAir = uvData.daily[i].humidity;
            var fcHumidityEl = document.querySelector('#fcHumidity' + i);
            fcHumidityEl.innerHTML='';
            fcHumidityEl.append("Humidity: " + moistureNDaAir + " %");
          }

        });
      for (let k = 0; k < 6; k++) {
        document.getElementById('passCity' + k).innerHTML = "";
      }
      
      pastCity();
    }); 
//TODO: Remove city from input and move to first storage spot (removing the city from input needs to be done at the end)
function pastCity (){
    //create an array - done in variable declare section
    //TODO: push input data into array
    cityArray.splice(0,0,searchCity);
    console.log(cityArray);
    //TODO: set local storage
    localStorage.setItem("city",JSON.stringify(cityArray));
    console.log(cityArray.length);
    for (let j = 0; j < cityArray.length; j++) {
      var passCityEl = document.querySelector('#passCity' + j);
      var pCity = cityArray[j];
      console.log(pCity);
      passCityEl.append(pCity);
    }
    document.querySelector('#searchCity').value = '';
}
}

