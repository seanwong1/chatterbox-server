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
// Another way to get around this restriction is to serve your chat
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

  var statusCode = 200;

  var headers = defaultCorsHeaders;
  if (!(headers in request)) {
    headers['User-Agent'] = 'test';
  }
  if (request.method === 'OPTIONS') {
    statusCode = 204;
  } else if (request.method === 'GET' && request.url === '/classes/messages') {
    statusCode = 200;
    headers['Content-Type'] = 'application/json';
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
    });
  } else if (request.method === 'DELETE') {
    statusCode = 405;
  } else {
    statusCode = 404;
  }
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(body));
};

module.exports = {requestHandler, defaultCorsHeaders};