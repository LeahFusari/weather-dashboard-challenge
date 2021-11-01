const apiKey = "443ca5186866a70d54e25c4442078beb"
var city = document.getElementById("#iptCurrCity")


var requestURL = "https://api.openweathermap.org/data/2.5/weather?q=Springfield,MA,us&units=imperial&appid=443ca5186866a70d54e25c4442078beb"


$("#get-weather").click(function(){
    fetch(requestURL)

    .then(function(response){
        return response.json();
    })

    .then(function(response){
        var currWethEl= document.querySelector("#curr-weather-ul");
        currWethEl.innerHTML=" ";
        var currTemp=document.createElement("li");
        var currWind=document.createElement("li");
            
        currTemp.textContent= "Current Tempreture: "+ response.main.temp + "\u00B0 F";
        currWind.textContent= "Current Wind: "+ response.wind.speed + " MPH";

        currWethEl.appendChild(currTemp);
        currWethEl.appendChild(currWind);
        console.log(response);
        console.log(currWind);
    })
})
