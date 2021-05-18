var express = require('express');
// var router = express.Router();
var dbConnection = require('../database');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

module.exports = function (router) {



  router.get('/', (req, res) => {
    res.redirect('/home');
  });

  /* GET home page. */
  router.get('/home', function (req, res) {
    res.render('pages/home', { title: 'Express' });
  });

  /* GET about page. */
  router.get('/about', function (req, res) {
    res.render('pages/about');
  });

  /* GET contact page. */
  router.get('/contact', function (req, res) {
    res.render('pages/contact');
  });

  /* GET projects page. */
  router.get('/projects', function (req, res) {
    res.render('pages/projects');
  });

  /* GET services page. */
  router.get('/services', function (req, res) {
    res.render('pages/services');
  });

  // DECLARING CUSTOM MIDDLEWARE
  const ifNotLoggedin = (req, res, next) => {
    if (!req.session.isLoggedIn) {
      return res.render('pages/login');
    }
    next();
  }

  const ifLoggedin = (req, res, next) => {
    if (req.session.isLoggedIn) {
      return res.redirect('/secure/business_contacts/list');
    }
    next();
  }
  // END OF CUSTOM MIDDLEWARE

  function compare(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }

  /* GET services page. */
  router.get('/secure/business_contacts/list', ifNotLoggedin, function (req, res) {
    dbConnection.execute("SELECT * FROM `bussiness_contacts`")
      .then(([rows]) => {
        res.render('pages/secured/business_contacts', {
          title: 'All contacts',
          data: rows.sort(compare)
        });
      });
  });

  /* Edit services page. */
  router.get('/secure/business_contacts/edit/(:id)', ifNotLoggedin, function (req, res) {
    dbConnection.execute('SELECT * FROM bussiness_contacts WHERE id = ' + req.params.id)
      .then(([rows]) => {
        res.render('pages/secured/business_contacts_edit', {
          title: 'Edit Country',
          id: rows[0].id,
          name: rows[0].name,
          email: rows[0].email,
          contact_number: rows[0].contact_number
        });
      });
  });

  /* Edit services page. */
  router.post('/secure/business_contacts/edit/(:id)', ifNotLoggedin, function (req, res) {
    dbConnection.execute('UPDATE `bussiness_contacts` SET `name`=?,`email`=?,`contact_number`=? where `id`=?', [req.body.name, req.body.email, req.body.contact_number, req.params.id])
      .then(([rows]) => {
        return res.redirect('/secure/business_contacts/list');
      });
  });

  /* DELETE services page. */
  router.post('/secure/business_contacts/delete/(:id)', ifNotLoggedin, function (req, res) {
    var contact = { id: req.params.id };
    dbConnection.execute('DELETE FROM bussiness_contacts WHERE id = ' + req.params.id, [req.params.id])
      .then(([rows]) => {
        console.log('deletee', rows)
        return res.redirect('/secure/business_contacts/list');
      });
  });


}
