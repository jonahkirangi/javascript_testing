'use strict';

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.about = function(req, res){
  res.render('about', { title: 'About' });
};

exports.blog = function(req, res){
  res.render('blog', { title: 'Blog' });
};

exports.userlist = function(db) {
    return function(req, res) {
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
            res.render('userlist', {
                'userlist' : docs
              });
          });
      };
  };

exports.newuser = function(req, res){
  res.render('newuser', { title: 'Add New User' });
};

exports.adduser = function(db) {
    return function(req, res) {

        // Get our form values. These rely on the 'name' attributes
        var userName = req.body.username;
        var userEmail = req.body.useremail;

        // Set our collection
        var collection = db.get('usercollection');

        // Submit to the DB
        collection.insert({
            'username' : userName,
            'email' : userEmail
          }, function (err, doc) {
            if (err) {
                // If it failed, return errorJ
              res.send('There was a problem adding the information to the database.');
            }
            else {
                // If it worked, set the header so the address bar doesn't still say /adduser
              res.location('userlist');
                  // And forward to success page
              res.redirect('userlist');
            }
          });

      };
  };
