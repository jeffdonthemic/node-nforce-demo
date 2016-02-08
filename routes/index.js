var express = require('express');
var router = express.Router();

var Promise = require("bluebird");

var nforce = require('nforce');
var org = require('../lib/connection');

/* home page. */
router.get('/', function(req, res, next) {

  org.query({ query: "Select Id, Name, Type, Industry, Rating From Account Order By LastModifiedDate DESC" })
    .then(function(results){
      res.render('index', { records: results.records });
    });

});

/* Display new account form */
router.get('/new', function(req, res, next) {
  res.render('new');
});

/* Creates a new the record */
router.post('/', function(req, res, next) {

  var acc = nforce.createSObject('Account');
  acc.set('Name', req.body.name);
  acc.set('Industry', req.body.industry);
  acc.set('Type', req.body.type);
  acc.set('AccountNumber', req.body.accountNumber);
  acc.set('Description', req.body.description);

  org.insert({ sobject: acc })
    .then(function(account){
      res.redirect('/' + account.id);
    })
});


/* Record detail page */
router.get('/:id', function(req, res, next) {
  // query for record, contacts and opportunities
  Promise.join(
    org.getRecord({ type: 'account', id: req.params.id }),
    org.query({ query: "Select Id, Name, Email, Title, Phone From Contact where AccountId = '" + req.params.id + "'"}),
    org.query({ query: "Select Id, Name, StageName, Amount, Probability From Opportunity where AccountId = '" + req.params.id + "'"}),
    org.query({ query: "SELECT Id, Name, CreatedDate, ContentType From Attachment where ParentId = '" + req.params.id + "'"}),
    org.query({ query: "SELECT Id, Name, CreatedDate, ContentType From Attachment where ParentId IN (Select Id FROM Contact WHERE AccountId = '" + req.params.id + "')"}),
    function(account, contacts, opportunities, attAcc, attCon) {
        res.render('show', { record: account, contacts: contacts.records, opps: opportunities.records, atts: Object.assign({}, attAcc.records, attCon.records)});
    });
});

/* display attachment in browser if supported, otherwise download */
router.get('/attachment/:id', function(req, res){
  Promise.join(
    org.getRecord({type: 'Attachment', id: req.params.id, fields: ['Id', 'ContentType', 'Name'], raw: true}),
    org.getBody({id: req.params.id, type: 'Attachment'}),
    function(attachment, body){
      res.set('Content-Type', attachment.ContentType);
      res.set('Content-Disposition', "inline; filename='" + attachment.Name + "'");
      res.send(body);
    });
});

/* Display record update form */
router.get('/:id/edit', function(req, res, next) {
  org.getRecord({ id: req.params.id, type: 'Account'})
    .then(function(account){
      res.render('edit', { record: account });
    });
});

/* Display record update form */
router.get('/:id/delete', function(req, res, next) {

  var acc = nforce.createSObject('Account');
  acc.set('Id', req.params.id);

  org.delete({ sobject: acc })
    .then(function(account){
      res.redirect('/');
    });
});

/* Updates the record */
router.post('/:id', function(req, res, next) {

  var acc = nforce.createSObject('Account');
  acc.set('Id', req.params.id);
  acc.set('Name', req.body.name);
  acc.set('Industry', req.body.industry);
  acc.set('Type', req.body.type);
  acc.set('AccountNumber', req.body.accountNumber);
  acc.set('Description', req.body.description);

  org.update({ sobject: acc })
    .then(function(){
      res.redirect('/' + req.params.id);
    })
});

module.exports = router;
