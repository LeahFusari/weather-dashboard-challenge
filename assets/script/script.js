const apiKey = "443ca5186866a70d54e25c4442078beb"









$("#get-weather").click(function(){
  var city = $("#input-city").val();
  var request1URL = "https://api.openweathermap.org/data/2.5/weather?q="+ city + ",us&units=imperial&appid=" + apiKey;
//   var request2URL = "https://api.openweathermap.org/data/2.5/onecall?lat={lat}&lon={lon}&exclude={part}&units=imperial&appid=" + apiKey;
  
  fetch(request1URL)

    .then(function(response1){
        return response1.json();
    })

    .then(function(response1){
        var currWethEl= document.querySelector("#curr-weather-ul");
        var lat=response1.coord.lat;
        var long=response1.coord.lon;
        var request2URL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey;
        console.log(lat);
        console.log(long);
        
        currWethEl.innerHTML=" ";
        var currTemp=document.createElement("li");
        var currWind=document.createElement("li");
        var currHumid=document.createElement("li");
        // var currUVI=document.createElement("li");
            
        currTemp.textContent= "Current Tempreture: "+ response1.main.temp + "\u00B0 F";
        currWind.textContent= "Current Wind: "+ response1.wind.speed + " MPH";
        currHumid.textContent= "Current Humidity: "+ response1.main.humidity + "%";

        currWethEl.appendChild(currTemp);
        currWethEl.appendChild(currWind);
        currWethEl.appendChild(currHumid);
        console.log(response1);

        return fetch(request2URL)

        .then(function(response2) {
            return response2.json();
          })
        
          .then(function(response2){
            var currUVI=document.createElement("li");

            currUVI.textContent= "Current UV Index: "+ response2.current.uvi;

            currWethEl.appendChild(currUVI);
          console.log(response2);
          })
        
    })

})
