const apiKey = "443ca5186866a70d54e25c4442078beb"
var city = $("#input-city").val();
var fiveDayEl=document.getElementById("five-day-forecast");

$("#get-weather").click(function(){
    displayCurrent()
  //   fiveDayForecast()
})

function displayCurrent(){
   
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
        console.log(response1);

        fetch(request2URL)

        .then(function(response2) {
            return response2.json();
          })
        
        .then(function(response2){
        var currUVI=document.createElement("li");
        currUVI.textContent= "Current UV Index: "+ response2.current.uvi;
        currWethEl.appendChild(currUVI);
        console.log(response2);

        fiveDayForecast(response2.daily)
        })
    })
}

function fiveDayForecast(forecast){
    // var fiveDayArr=[];
    // console.log("this is 5 day forecast", forecast)
    for(i=1; i<6; i++){
        console.log(forecast[i]);
        var unixDate=forecast[i].dt;
        var currDate=moment.unix(unixDate).format("MM/DD/YYYY");
        console.log(currDate);

        var cardEl=document.createElement("div");
        var dateEl=document.createElement("h2");
        var imgEl=document.createElement("img");
        var icon=forecast[i].weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
        imgEl.src=iconurl;
        dateEl.textContent=currDate;
        cardEl.appendChild(dateEl);
        cardEl.appendChild(imgEl);
        fiveDayEl.appendChild(cardEl);


    }
}