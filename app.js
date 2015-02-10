var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var async = require('async');
var nforce = require('nforce');

var app = express();
app.set('port', process.env.PORT || 3000);

// use the nforce package to create a connection to salesforce.com
var org = nforce.createConnection({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: 'http://localhost:' + app.get('port') + '/oauth/_callback',
  mode: 'single'
});

// authenticate using username-password oauth flow
org.authenticate({ username: process.env.USERNAME, password: process.env.PASSWORD }, function(err, resp){
  if(err) {
    console.log('Error: ' + err.message);
  } else {
    console.log('Successfully connected to salesforce');
    console.log('Access Token: ' + resp.access_token);
    oauth = resp;
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

// display a list of 10 accounts
app.get('/accounts', function(req, res) {
  var q = 'select id, name from account limit 10';
  org.query({ query: q }, function(err, resp){
    res.render("accounts", { title: 'Accounts', data: resp.records } );
  });
});

// display form to create a new account
app.get('/accounts/new', function(req, res) {
  // call describe to dynamically generate the form fields
  org.getDescribe({type: 'Account'}, function(err, resp) {
    res.render('new', { title: 'New Account', data: resp });
  });
});

// create the account in salesforce
app.post('/accounts/create', function(req, res) {
  var obj = nforce.createSObject('Account', req.body);
  org.insert({sobject: obj}, function(err, resp){
    if (err) {
      console.log(err);
    } else {
      if (resp.success === true) {
        res.redirect('/accounts/'+resp.id);
        res.end();
      }
    }
  });
});

// display the account
app.get('/accounts/:id', function(req, res) {
  var async = require('async');
  var obj = nforce.createSObject('Account', {id: req.params.id});

  async.parallel([
      function(callback){
        var q = "select count() from contact where accountid = '" + req.params.id + "'";
        org.query({query: q}, function(err, resp){
          callback(null, resp);
        });
      },
      function(callback){
        org.getRecord({sobject: obj}, function(err, resp) {
          callback(null, resp);
        });
      },
  ],
  // optional callback
  function(err, results){
    // returns the responses in an array
    res.render('show', { title: 'Account Details', data: results });
  });

});

// display form to update an existing account
app.get('/accounts/:id/edit', function(req, res) {
  var obj = nforce.createSObject('Account', {id: req.params.id});
  org.getRecord({sobject: obj}, function(err, resp) {
    res.render('edit', { title: 'Edit Account', data: resp });
  });
});

// update the account in salesforce
app.post('/accounts/:id/update', function(req, res) {
  var obj = nforce.createSObject('Account', req.body);
  org.update({sobject: obj}, function(results) {
    res.redirect('/accounts/'+req.params.id);
    res.end();
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
