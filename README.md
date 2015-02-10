# node-nforce-demo

Simple node.js application for CRUDing salesforce.com Accounts using nforce and async.

## Installation Instructions

From the command line type in:

```
npm install
```


### Node Module Dependencies

These will be automatically installed when you use any of the above *npm* installation methods above.

1. [express](http://expressjs.com/) - framework
2. [nforce](https://github.com/kevinohara80/nforce) - REST wrapper for force.com
3. [async](https://github.com/caolan/async/) - asynchronous utility module
4. [jade](http://jade-lang.com/) - the view engine

### Running the Application Locally

1. Open terminal and change directory to node-nforce-demo root
2. `node app.js`
3. Point your browser to: [http://localhost:3001](http://localhost:3001)

### Deploying to Heroku

```
heroku create
heroku config:add CLIENT_ID=YOUR-SALESFORCE-CLIENT-ID
heroku config:add CLIENT_SECRET=YOUR-SALESFORCE-SECRET
heroku config:add USERNAME=YOUR-SALESFORCE-USERNAME
heroku config:add PASSWORD=YOUR-SALESFORCE-PASSWORD-AND-TOKEN
heroku open
```

### Demo on Heroku

This application is running on heroku at: [http://node-nforce-demo.herokuapp.com/](http://node-nforce-demo.herokuapp.com/)

## Contributors
* Jeff Douglas -> [jeffdonthemic](https://github.com/jeffdonthemic)