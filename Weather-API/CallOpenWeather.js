let rp = require("request-promise");
function main(params) {
  const options = {
    uri:
      "http://api.openweathermap.org/data/2.5/weather?q=" +
      encodeURIComponent(params.object_of_interest) +
      "&units=imperial&APPID=here_you_add_your_openweather_api_id",
    json: true,
  };
  return rp(options).then((res) => {
    let WeatherReport =
      "Current Temperature : " +
      res.main.temp +
      ",</br>Pressure : " +
      res.main.pressure +
      ",</br>Humidity : " +
      res.main.humidity +
      ",</br>Temp min : " +
      res.main.temp_min +
      " ,</br>Temp max : " +
      res.main.temp_max;
    return { message: WeatherReport };
  });
}
