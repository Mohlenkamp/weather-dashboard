// Globals

const openWeatherAPI = "a98edb796d457c1a906b4e45253f4940"
var cityName
var today = new Date();
var todayDate = ("(" + (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear() + ")");


// Functions

function setIconAndColor(data){
    // This is setting the little icon to the right of the city name and date
    // as well as the color box around the UV Index value
    var todayUV = document.querySelector("#todayUV")
    var todayIcon = document.querySelector("#todayIcon")

    
}

function updateFavButtons(cityName){
    // This fuction is supposed to add city to list of recent searches on sidebar nav
    var savedCity
    // Get list from LocalStorage

    // Check if already there
    
    // If new city, add to savedCity1 and push other values down

    //
}

function fillInCardDeck(data){

}

function fillInMainCard(data){
    //This function will fill in the weather data for the current conditions in the "main" card area

    //Getting target elements
    var city = document.querySelector("#cityName") 
    var cityDate = document.querySelector("#dateForecast")
    var todayTemp = document.querySelector("#todayTemp")
    var todayWind = document.querySelector("#todayWind") 
    var todayHumidity = document.querySelector("#todayHumidity")
    var todayUV = document.querySelector("#todayUV") 
    
    city.textContent = cityName
    todayTemp.textContent = data.current.temp 
    cityDate.textContent = todayDate
    todayWind.textContent = data.current.wind_speed
    todayHumidity.textContent = data.current.humidity
    todayUV.textContent = data.current.uvi
    // Also need to set  today's icon and UVI color code
    setIconAndColor(data)

}

function weatherFetch(cityName) {
    // This function uses the OpenWeather API spec to get the weather data for a selected city (cityName)
    // Nesting the API calls to get all the data
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&exclude=minutely,hourly,daily,alert&units=imperial&appid=" + openWeatherAPI
    // Begin Fetch
    fetch(apiUrl)
    .then(function(res1){ 
        if (res1.ok) {
            res1.json().then(function(data) {
            // Calling 2nd Fetch to get current day data including UV Index
                debugger

                var cityLat = data.city.coord.lat
                var cityLon = data.city.coord.lon
                apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + cityLat + "&lon=" + cityLon + "&exclude=minutely,hourly,daily,alerts&units=imperial&appid=" + openWeatherAPI
            return fetch(apiUrl)
                    .then (function(res2){
                    if (res2.ok) {
                        //This gives us all the current day data we need
                        res2.json().then(function(currentDay){
                            debugger
                            fillInMainCard(currentDay)
                            apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial&appid=" + openWeatherAPI
                        //Calling 3rd Fetch to get 5 day forecast to fill in lower card deck
                        return fetch(apiUrl)
                            .then (function(res3){
                            if (res3.ok){
                                //This gives us the 5 day forecast data we need
                                res2.json().then(function(forecast){
                                    debugger
                                    fillInCardDeck(forecast)
                                    updateFavButtons(cityName) 
                                });
                            }
                            else{
                                alert('Error: Response 3 did not happen');
                            }
                            }); // end fetch3 function
                        });
                    }
                    else{
                        alert('Error: Response 2 did not happen');
                    }
                }); // end fetch2 function
            });
        } else {
            alert('Error: Response 1 did not happen');
        }
    }); // end fetch1 function
}  //end function weatherFetch






// Main 

cityName = "Nashville"
 weatherFetch(cityName) //testing param




// Event Listeners

// create event listener on search button to call weatherFetch

