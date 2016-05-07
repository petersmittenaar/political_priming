// --- LOADING MODULES
var express = require('express'),
	mongoose = require('mongoose'),
	body_parser = require('body-parser'),
    pg = require('pg');


// --- INSTANTIATE THE APP
var app = express();

// // --- set up mongoDB stuff
// var emptySchema = new mongoose.Schema({}, {strict: false});
// var Entry = mongoose.model('Entry', emptySchema);
// // requires CONNECTION to be set through heroku (a URL with username and pwd)
// mongoose.connect(process.env.CONNECTION);
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error'));
// db.once('open', function callback() {
// 	console.log('database opened');
// })

// set up postgres stuff
pg.defaults.ssl = true;
console.log('process.env.DATABASE_URL = ' + process.env.DATABASE_URL)
pg.connect(process.env.DATABASE_URL, function(err, client) {
    if (err) throw err;
    console.log('Connected to postgres! Getting schemas...');
    client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
})

// --- STATIC MIDDLEWARE 
app.use(express.static(__dirname + '/public'));
app.use('/jsPsych', express.static(__dirname + "/jspsych-5.0.3"));
app.use(body_parser.json());

// --- VIEW LOCATION, SET UP SERVING STATIC HTML
app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// --- ROUTING
app.get('/', function(request, response) {
    response.render('index.html');
});

app.get('/experiment', function(request, response) {
    response.render('experiment.html');
});

app.get('/finish', function(request, response) {
    response.render('finish.html');
});

app.post('/experiment-data', function(request, response) {
    Entry.create({
    	"data":request.body
    });
    response.end();
});

// --- START THE SERVER 
var server = app.listen(process.env.PORT, function(){
    console.log("Listening on port %d", server.address().port);
});