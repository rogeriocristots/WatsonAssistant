var http = require('http');
    var server = http.createServer ( function(request,response){

    response.writeHead(200,{"Content-Type":"text\plain"});
    if(request.method == "GET")
        {
            response.end("received GET request. just a moment ago")
            console.log("received GET request");
        }
    else if(request.method == "POST")
        {
            response.end("received POST request. rigth now");
            console.log("received POST request");
        }
    else
        {
            response.end("Undefined request .");
            console.log("received undefined request");
        }
});

server.listen(8000);
console.log("Server running on port 8000");
