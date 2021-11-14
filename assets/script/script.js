const apiKey = "443ca5186866a70d54e25c4442078beb"
var cityEl = document.getElementById("input-city")
var fiveDayEl=document.getElementById("five-day-forecast");
var searchButton=document.getElementById("get-weather");
var searchHistory = JSON.parse(localStorage.getItem("prevSearch")) || [];
var prevSearchEl = document.getElementById("prev-button-area");
var cityDate = document.getElementById("city-date");
var fiveDayH3 = document.getElementById("five-day");
var modal1 = document.getElementById('input-error')
var modal1Close=document.getElementById("modal1-close")
var modal2 = document.getElementById('data-error')
var modal2Close=document.getElementById("modal2-close")



onload = displayPrevSearches

searchButton.addEventListener("click", function(){
    
    if (cityEl.value == ""){
        modal1.setAttribute("class","display-modal")
    }else{
   displayWeather()
    }
})

    modal1Close.addEventListener("click", function(){
        modal1.setAttribute("class", "close-modal");
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
            
        currTemp.textContent= "Tempreture: "+ response1.main.temp + "\u00B0 F";
        currWind.textContent= "Wind: "+ response1.wind.speed + " MPH";
        currHumid.textContent= "Humidity: "+ response1.main.humidity + "%";

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
        currUVIli.textContent="UV Index: "
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
        .catch((error) => {
            console.error("Error:", error);
        });

        cityDate.textContent = "Current Weather For: " + city.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }) + " - " + moment().format('MMMM Do YYYY');
        fiveDayH3.textContent= "Five-Day Forecast";
        
    
        storeCity()
        console.log(response1);
    }).catch(error => alert(error.message));
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
        
        cardEl.setAttribute("class","forecast-card bg-info");
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

                prevItemEl.textContent = prevItem.replace(/\w\S*/g, function(txt){
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
                prevItemEl.setAttribute("value", prevItem)
                prevItemEl.setAttribute("class", "btn btn-primary prev-btn")
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
    lastItemEl.setAttribute("class", "btn btn-primary")
    lastItemEl.textContent=lastItem.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
    prevSearchEl.appendChild(lastItemEl);

    lastItemEl.addEventListener("click", function(event){
        var lastSearch=event.target.value;
       cityEl.value = lastSearch;
       displayWeather();
       })
}
