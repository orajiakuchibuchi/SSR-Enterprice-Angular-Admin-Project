// Server Side Rendering 
// An express nodejs server by Orajiaku Chibuchi Somto https://www.linkedin.com/in/orajiaku-c-0a051815a/
// Lunch node server.js to start server 

const express = require('express');
const path = require('path');
const fs = require('fs');
const compression = require('compression');
const app = express();

const SEC_PORT = '5001';
// where '/dist/admin' is the final built directory
const staticRoot = __dirname + '/dist/Sparklingv2/';


const env = process.env.NODE_ENV || SEC_PORT;

app.set('port', env);

// Compression middleware
app.use(compression());

/* other middleware */

/* place any backend routes you have here */

app.use(function(req, res, next) {
  
    //if the request is not html then move along
    var accept = req.accepts('html', 'json', 'xml');
    if (accept !== 'html') {
        return next();
    }

    // if the request has a '.' assume that it's for a file, move along
    var ext = path.extname(req.path);
    if (ext !== '') {
        return next();
    }

    fs.createReadStream(staticRoot + 'index.html').pipe(res);

});

app.use(express.static(staticRoot));

app.listen(app.get('port'), function() {
    console.log('app running on port', app.get('port'));
});
