const apiKey = "443ca5186866a70d54e25c4442078beb"
var cityEl = document.getElementById("input-city")
var fiveDayEl=document.getElementById("five-day-forecast");
var searchButton=document.getElementById("get-weather");
var searchHistory = JSON.parse(localStorage.getItem("prevSearch")) || [];
var prevSearchEl = document.getElementById("prev-searches");
var cityDate = document.getElementById("city-date");



onload = displayPrevSearches

searchButton.addEventListener("click", function(){
    
   displayWeather()
   
})

// functions to fetch APIs and display current and forecast weather.
function displayWeather(){
   var city = cityEl.value;
   var request1URL = "https://api.openweathermap.org/data/2.5/weather?q="+ city + ",us&units=imperial&appid=" + apiKey;
    fetch(request1URL)
 
    .then(function(response1){
        return response1.json();
    })
    
    .then(function(response1){
        var currWethEl= document.querySelector("#curr-weather-ul");
        var lat=response1.coord.lat;
        var long=response1.coord.lon;
        var request2URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey + "&exclude=minutely,hourly,alerts";
        
        currWethEl.innerHTML=" ";
        var currTemp=document.createElement("li");
        var currWind=document.createElement("li");
        var currHumid=document.createElement("li");
            
        currTemp.textContent= "Current Tempreture: "+ response1.main.temp + "\u00B0 F";
        currWind.textContent= "Current Wind: "+ response1.wind.speed + " MPH";
        currHumid.textContent= "Current Humidity: "+ response1.main.humidity + "%";

        currWethEl.appendChild(currTemp);
        currWethEl.appendChild(currWind);
        currWethEl.appendChild(currHumid);
        
        fetch(request2URL)

        .then(function(response2) {
            return response2.json();
          })
        
        .then(function(response2){
        var currUVIli=document.createElement("span")
        var currUVI=document.createElement("span");
        currUVIli.textContent="Current UV Index: "
        currUVI.textContent= response2.current.uvi;
        currUVI.setAttribute("id", "UVI-span")
        currWethEl.appendChild(currUVIli);
        currWethEl.appendChild(currUVI);
        
        if (response2.current.uvi < 4 ) {
            currUVI.setAttribute("class", "badge bg-success");
        }
        else if (response2.current.uvi < 8) {
            currUVI.setAttribute("class", "badge bg-warning text-dark");
        }
        else {
            currUVI.setAttribute("class", "badge bg-danger");
        }
        fiveDayForecast(response2.daily)
        })
    
        cityDate.textContent = city + " - " + moment().format('MMMM Do YYYY');
    })
    storeCity()
   
}

// function to display 5-day forecast dynamically

function fiveDayForecast(forecast){
    fiveDayEl.innerHTML=" ";
    for(i=1; i<6; i++){
        var unixDate=forecast[i].dt;
        var forecastDate=moment.unix(unixDate).format("MM/DD/YYYY");
    
        var forecastTemp=forecast[i].temp.day;
        var forecastWind=forecast[i].wind_speed;
        var forecastHumid=forecast[i].humidity;

        
        var cardEl=document.createElement("div");
        var dateEl=document.createElement("h5");
        var imgEl=document.createElement("img");
        var tempEl=document.createElement("p");
        var windEl=document.createElement("p");
        var humidEl=document.createElement("p");
        var icon=forecast[i].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        
        dateEl.textContent=forecastDate;
        imgEl.src=iconurl;
        tempEl.textContent= "Temp: " + forecastTemp;
        windEl.textContent= "Wind: " + forecastWind+ " MPH";
        humidEl.textContent= "Humidity: " + forecastHumid + "%";

        fiveDayEl.appendChild(cardEl);
        cardEl.appendChild(dateEl);
        cardEl.appendChild(imgEl);
        cardEl.appendChild(tempEl);
        cardEl.appendChild(windEl);
        cardEl.appendChild(humidEl);
    
    }
}

    // store search data in local storage

    function storeCity() {
        var searchTerm = cityEl.value;
        if(searchHistory.indexOf(searchTerm.toLowerCase()) !== -1 || searchTerm == ""){
            console.log("Not added to local storage because previous search already exists");
            console.log(searchTerm);
            console.log(cityEl.value);
                }else{
                searchHistory.push(searchTerm.toLowerCase());
                localStorage.setItem("prevSearch", JSON.stringify(searchHistory));
                addLastSearch()
                }
        
    }


    function displayPrevSearches(){
        for(i=0; i<searchHistory.length; i++){
            var prevItem = searchHistory[i];
            var prevItemEl=document.createElement("button");

                prevItemEl.textContent = prevItem;
                prevItemEl.setAttribute("value", prevItem)
                prevSearchEl.appendChild(prevItemEl);
                

                prevItemEl.addEventListener("click", function(event){
                     var searchPrev=event.target.value;
                    cityEl.value = searchPrev;
                    displayWeather();
                    })
    }
}

function addLastSearch(){
    var lastItem = searchHistory[searchHistory.length -1]
    var lastItemEl=document.createElement("button");

    lastItemEl.setAttribute("value",lastItem);
    lastItemEl.textContent=lastItem;
    prevSearchEl.appendChild(lastItemEl);

    lastItemEl.addEventListener("click", function(event){
        var lastSearch=event.target.value;
       cityEl.value = lastSearch;
       displayWeather();
       })
}
