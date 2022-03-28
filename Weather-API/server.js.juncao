const http = require('http');
const options = {
    uri:
      "https://api.openweathermap.org/data/2.5/weather?lat=38.736946&lon=-9.142685&appid=0f2eb9a2feb9bbc47282ab9340253b05",
    json: true,
  };

let rp = require("request-promise");

rp(options).then((res) => {
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

http.createServer(function (request, response) {
   target = process.env.TARGET ? process.env.TARGET : 'World' ;
   msg = process.env.MSG ? process.env.MSG : 'Weather from server.js\n' + WeatherReport + '\n';
   response.writeHead(200, {'Content-Type': 'text/plain'});
   response.end(msg);
}).listen(8080);

console.log('Server running at http://0.0.0.0:8080/');
