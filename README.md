# node-nforce-demo

This is a sample account CRUD application using the [Lightning Design System](https://www.lightningdesignsystem.com) enabling you to easily build applications with the look and feel that is consistent with Salesforce Experience core features.

Demo: [http://node-nforce-demo.herokuapp.com/](http://node-nforce-demo.herokuapp.com/)

If you are not familiar with Lightning Design System, please see our [Trailhead module](https://developer.salesforce.com/trailhead/module/lightning_design_system) to get started with Visualforce. There is also a [tutorial](https://github.com/ForceDotComLabs/sldsx/blob/master/tutorial/tutorial.md) for using LDS with Lightning apps and components.

The application uses [nforce](https://github.com/kevinohara80/nforce) for the Salesforce REST API, [handlebars](http://handlebarsjs.com/) for logic-less templating and [bluebird](https://github.com/petkaantonov/bluebird) for Promises.

## Deploy to Heroku

Deploy this app to Heroku for free and have it up and running in a matter of minutes.  You'll need the `Consumer Key` and `Consumer Secret` from your org's Connected App for the setup process.

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/jeffdonthemic/node-nforce-demo)

## Local Installation Instructions

From the command line type in:

```
git clone git@github.com:jeffdonthemic/node-nforce-demo.git
cd nforce-node-demo
npm install
```
Enter your Connected App settings and login credentials into `.env-sample` and rename the file to `.env`.

```
source .env
npm start
```

Point your browser to: [http://localhost:3001](http://localhost:3001) and experience the magic.

## Contributors
* Jeff Douglas -> [jeffdonthemic](https://github.com/jeffdonthemic)
