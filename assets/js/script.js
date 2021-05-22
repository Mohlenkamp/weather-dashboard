// Globals
const buttonWrapper = document.getElementById('side-nav');
const openWeatherAPI = "a98edb796d457c1a906b4e45253f4940"
var cityName
var today = new Date();
var todayDate = ("(" + (today.getMonth()+1) + "/" + today.getDate() + "/" + today.getFullYear() + ")");

// Functions

function errorHandler(error){
    alert(error)
}


function setIconAndColor(data){
    // This is setting the little icon to the right of the city name and date
    // as well as the color box around the UV Index value
    // UV Color coding from:
    // https://wp02-media.cdn.ihealthspot.com/wp-content/uploads/sites/200/2018/08/03014643/UV-Index.png

    var todayUV = document.querySelector("#todayUV")
    var todayIcon = document.querySelector("#todayIcon")
    var iconID = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png"
    todayIcon.setAttribute("src", iconID)
    // clear all previous classes
    todayUV.classList.remove("uvi-low")
    todayUV.classList.remove("uvi-med")
    todayUV.classList.remove("uvi-high")
    todayUV.classList.remove("uvi-very-high")
    todayUV.classList.remove("uvi-extremely-high")
    // set the new class
    switch (parseInt(data.current.uvi)){
        case 0:
        case 1:
        case 2:
                todayUV.classList.add("uvi-low")
                break;
        case 3: 
        case 4:
        case 5:
                todayUV.classList.add("uvi-med")
                break;
        case 6:
        case 7: 
                todayUV.classList.add("uvi-high")
                break;
        case 8:
        case 9:
        case 10:
                todayUV.classList.add("uvi-very-high")
                break;      
        case 11:
        default:
                todayUV.classList.add("uvi-extremely-high")
                break;
    }
        
        
}

function updateFavButtons(cityName){
    // This fuction is supposed to add city to list of recent searches on sidebar nav
    // The mock up shows that we need 8 recent history buttons

    // I know I could make this more sophisticated by checking if it's already in the list 
    // to prevent duplicate savedCity buttons, but I'm really tired and it's not required 

    var prevValue
    var savedCityElement
    var savedCityButtonID 
    if (localStorage.getItem("#savedCity0")=== null){
        // The local storage is not initalized
        for (i=0;i<9;i++){
            savedCityButtonID = "#savedCity" + i.toString() 
            localStorage.setItem(savedCityButtonID," ")
        }
    }
    localStorage.setItem("#savedCity0",cityName)
    

    // Get list from LocalStorage, push cityName into location 0, then do set/swap
    for (i=8; i>0; i--){
        //Loop goes from bottom to top
        //Look for value in previous button
        savedCityButtonID = "#savedCity" + (i - 1).toString()
        prevValue = localStorage.getItem(savedCityButtonID)
        //Set swap on current button
        savedCityButtonID = "#savedCity" + (i).toString()
        savedCityElement = document.querySelector(savedCityButtonID)
        if (prevValue && (prevValue !== " ")){
            // only push prevValue to button if it exists
            savedCityElement.textContent = prevValue
            localStorage.setItem(savedCityButtonID,prevValue)
                }
        else{
            // location is empty
        }
    }
}

function fillInCardDeck(data){
    // The data coming back is in an array of 8 readings per day time 5 days.
    // Only the midnight reading is for the whole day, so we'll only take that reading.

    var cardDT 
    var cardDate
    var cardDateElement
    var cardTempElement
    var cardWindElement
    var cardHumidityElement
    var cardIconElement
    var maxTemp
    var maxWind
    var maxHumidity
    var dayIcon

   
    // Found a logic problem in the OpenWeather array coming back. It doesn't always start with the midnight reading first, so
    // I have to parse the dateDT stamp to look for that first midnight array entry. Then, it will be every 8th
    // entry after that one.
    var forecastArrayAdjustment = 0
    for (i = 0; i < 8; i++) {
        // Loop through first 8 entries to find first midnight reading
        testDT = (data.list[i].dt_txt.slice(data.list[i].dt_txt.length - 8));
        if (testDT === "00:00:00") {
            forecastArrayAdjustment = i
            i = 8 //No need to check anymore
        }
    }

    for (day=0;day<5;day++){
        //looping through each card in the deck
        //debugger
        cardDT = new Date(data.list[forecastArrayAdjustment].dt_txt); 
        cardDate = ("(" + (cardDT.getMonth()+1) + "/" + cardDT.getDate() + "/" + cardDT.getFullYear() + ")");  
        cardDateElement = document.querySelector("#day" + (day + 1).toString() + "Date")
        cardDateElement.textContent = cardDate
        i=0
        maxTemp=0
        maxWind=0
        maxHumidity=0
        for (i=(forecastArrayAdjustment);i<(forecastArrayAdjustment + 8);i++){
            //Find the largest value for the day in the array series because there's not
            //a single point of data (that's free) from OpenWeather
            //debugger
            if (i<40){
                // Make sure we don't exceed array limit
                if(maxTemp < data.list[i].main.temp){
                    maxTemp = data.list[i].main.temp
                    dayIcon = data.list[i].weather[0].icon  //Picking icon at max temp time
                }
                if(maxWind < data.list[i].wind.speed){
                    maxWind = data.list[i].wind.speed
                }
                if(maxHumidity < data.list[i].main.humidity){
                    maxHumidity = data.list[i].main.humidity
                }
            }
        }
        cardTempElement = document.querySelector("#day" + (day + 1).toString() + "Temp")
        cardTempElement.textContent = maxTemp
        cardWindElement = document.querySelector("#day" + (day + 1).toString() + "Wind")
        cardWindElement.textContent = maxWind
        cardHumidityElement = document.querySelector("#day" + (day + 1).toString() + "Humidity")
        cardHumidityElement.textContent = maxHumidity
        cardIconElement = document.querySelector("#day" + (day + 1).toString() + "Icon")
        cardIconElement.setAttribute("src","http://openweathermap.org/img/wn/" + dayIcon + "@2x.png")
        // Looks weird, but this adjusts how we pull the data from the array that comes back
        // it's based on the first entry that happens on each day at midnight
        forecastArrayAdjustment = forecastArrayAdjustment + 8}
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
    
    city.textContent = cityName.toUpperCase()
    todayTemp.textContent = data.current.temp 
    cityDate.textContent = todayDate
    todayWind.textContent = data.current.wind_speed
    todayHumidity.textContent = data.current.humidity
    todayUV.textContent = data.current.uvi
    // Also need to set  today's icon and UVI color code
    setIconAndColor(data)

}

function weatherFetch(cityName, bManualSearch) {
    // This function uses the OpenWeather API spec to get the weather data for a selected city (cityName)
    // Nesting the API calls to get all the data
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&exclude=minutely,hourly,daily,alert&units=imperial&appid=" + openWeatherAPI
    // Begin Fetch
    debugger
    fetch(apiUrl)
    .then(function(res1){ 
        if (res1.ok) {
            res1.json().then(function(data) {
            // Calling 2nd Fetch to get current day data including UV Index
                //debugger
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
                            //apiUrl = "https://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityName + "&cnt=5&units=imperial&appid=" + openWeatherAPI
                            apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&cnt=40&exclude=minutely,hourly,alerts&units=imperial&appid=" + openWeatherAPI
                        //Calling 3rd Fetch to get 5 day forecast to fill in lower card deck
                        return fetch(apiUrl)
                            .then (function(res3){
                            if (res3.ok){
                                //This gives us the 5 day forecast data we need
                                res3.json().then(function(forecast){
                                    debugger
                                    fillInCardDeck(forecast)
                                    // The savedCity buttons only update if the fetches all work and it was a manual search
                                    if (bManualSearch){
                                        updateFavButtons(cityName) 
                                    }
                                });
                            }
                            else{
                                errorHandler('There was a problem retrieving the 5-day forecast. Please try again later.');
                            }
                            }); // end fetch3 function
                        });
                    }
                    else{
                        errorHandler('There was a problem retrieving the current day forecast. Please try again later.')
                    }
                }); // end fetch2 function
            });
        } else {
            errorHandler('There was a problem with your request. Check the city spelling and try again.')
        }
    }); // end fetch1 function
}  //end function weatherFetch




// Event Listeners
window.onload = function() {
    updateFavButtons("Nashville") // becasue I like it
  };


// create event listener on search button to call weatherFetch
$("#btnSearch").click(function() {
    cityName = $("#searchCity").val();
    weatherFetch(cityName,true);
  });

$(".saveCity").click(function() {
    cityName = this.innerHTML
    weatherFetch(cityName,false);
  });