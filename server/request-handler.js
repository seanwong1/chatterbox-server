/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
var url = require('url');

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

var body = [];

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  //headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  //response.writeHead(statusCode, headers);

  // response.on()
  // response.write(data);

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.

  //change object that is being stringified
  //response.end(JSON.stringify(body));

  if (request.method === 'OPTIONS') {
    headers = defaultCorsHeaders;
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    statusCode = 200;
    headers['Content-Type'] = 'application/json';
    //response.end(JSON.stringify(body));
  } else if (request.method === 'POST' && request.url === '/classes/messages') {
    statusCode = 201;

    request.on('data', (message) => {
      try {
        var parseMsg = JSON.parse(message);
        if (parseMsg.text === '' || parseMsg.username === '') {
          throw new Error;
        } else {
          body.push(parseMsg);
        }
      } catch (error) {
        console.error('e', error);
      }
    });
    request.on('end', function() {
      // response.end(JSON.stringify(body));
    });
  } else if (request.method === 'DELETE') {
    statusCode = 405;
    //response.end();
  } else {
    statusCode = 404;
    // response.writeHead(404, {'Content-Type': 'application/json'});
    // response.end();
  }
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(body));

};

module.exports = {requestHandler, defaultCorsHeaders};