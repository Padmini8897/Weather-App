var weatherInfoObj={};
window.addEventListener('load',()=>{
    // alert('window loaded!!!');
    //logic to read the coordinates
    var apikey='ZaXOMniLfvIGJx7lsEJF8Dpmfwddzm6H';
    var lat,long
    var country,locationkey,timeZone,locationName
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position);
        lat=position['coords']['latitude'];
        long=position['coords']['longitude'];
        console.log(lat+" "+long);
        var geolocationUrl=`http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apikey}&q=${lat},${long}`;
        console.log(geolocationUrl);
        axios.get(geolocationUrl)
        .then((response)=>{
            // console.log(response);
            // country=response.data.Country.EnglishName;
            // locationkey=response.data.Key;
            // timeZone=response.data.TimeZone;
            // locationName=response.data.LocalizedName;
            weatherInfoObj['country']=response.data.Country.EnglishName;
            weatherInfoObj['locationkey']=response.data.Key;
            weatherInfoObj['timeZone']=response.data.TimeZone;
            weatherInfoObj['currentLocation']=response.data.LocalizedName;
            console.log('@2@@@',weatherInfoObj);
            // console.log('Country',country);
            // console.log('locationkey',locationkey);
            // console.log('timeZone',timeZone);
            // console.log('locationName',locationName);
            getWeatherData(apikey,weatherInfoObj.locationkey);
        })
    })
})
function getWeatherData(apikey,locationkey){
    var weatherUrl=`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationkey}?apikey=${apikey}`;
    console.log(weatherUrl);
    axios.get(weatherUrl).then((response)=>{
        console.log('Weather response',response);
        weatherInfoObj['today']=response.data.DailyForecasts[0].Date;
        weatherInfoObj['day']=response.data.DailyForecasts[0].Day;
        weatherInfoObj['night']=response.data.DailyForecasts[0].Night;
        weatherInfoObj['temperature']=response.data.DailyForecasts[0].Temperature;

        var today=new Date(weatherInfoObj['today']);
        

        console.log('weatherInfoObj',weatherInfoObj);
        returnId('country').textContent=weatherInfoObj['country'];
        returnId('currentLocation').textContent= weatherInfoObj['currentLocation'];
        returnId('date').textContent=today.getDate()+"-"+(today.getMonth()+1)+"-"+today.getFullYear()+" "+weatherInfoObj.timeZone.Code;
        if(weatherInfoObj.day.Icon<10){
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.day.Icon}-s.png`);
        }
        else{
            returnId('morning').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.day.Icon}-s.png`);
        }
        if(weatherInfoObj.night.Icon<10){
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/0${weatherInfoObj.night.Icon}-s.png`);
        }
        else{
            returnId('night').setAttribute('src',`https://developer.accuweather.com/sites/default/files/${weatherInfoObj.night.Icon}-s.png`);
        }
        returnId('morning-desc').textContent=weatherInfoObj.day.IconPhrase;
        returnId('night-desc').textContent=weatherInfoObj.night.IconPhrase;
        var morningTemp = ((weatherInfoObj.temperature.Minimum.Value - 32) * 5) / 9; // Convert from Fahrenheit to Celsius
        var nightTemp = ((weatherInfoObj.temperature.Maximum.Value - 32) * 5) / 9;
        returnId('morning-temp').textContent = `Morning Temp: ${morningTemp.toFixed(1)}°C`;
        returnId('night-temp').textContent = `Night Temp: ${nightTemp.toFixed(1)}°C`;
    });


    // return {};
}
function returnId(id){
    return document.getElementById(id);
}