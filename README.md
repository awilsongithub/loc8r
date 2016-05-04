<!-- MVC NOTES  -->

<!-- routes -->
<!-- require express, invoke Router(), require controllers -->
var express = require('express');
var router = express.Router();
var aboutCtrlr = require('../controllers/locations.js');
<!-- use router.get with path and controller -->
router.get('/about', aboutCtrlr);

<!-- controllers
export function taking req and res containing render taking view and data  -->
module.exports.homelist = function(req, res) {
  res.render('homepageView', {
    title: 'Home Page',
    tagline: 'Welcome to the home page!'
    });
};

<!-- views -->
extends layout
include _includes/___
block content
  begin jade html
    +nameOfMixin(mixinParameter)
      each item in items
        h4= item.name
          p This item is rated #{item.rating}





          
