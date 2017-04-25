var db = require('../models');
var passwordHash = require('password-hash');
var jwt = require('jsonwebtoken');

module.exports = {
  getall: (req, res, next) => {
    db.User.findAll().then(ArrResult => {
      res.json(ArrResult);
    })
  },
  getone: (req, res, next) => {
    let id = req.params.id;
    db.User.findById(id).then(Result => {
      res.json(Result);
    })
  },
  create: (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;
    let email = req.body.email;
    console.log(`username ${username}, password ${password}, role ${role}, email ${email}`);
    db.User.create({
      username: username,
      password: password,
      role: role,
      email: email
    }).then(Result => {
      res.json(Result);
    }).catch(err => {
      res.send(err);
    })
  },
  delete: (req, res, next) => {
    let id = req.params.id;
    db.User.destroy({
      where: {
        id: id
      }
    }).then(Result => {
      res.json(Result);
    }).catch(err => {
      res.json(err);
    })
  },
  update: (req, res, next) => {
    let id = req.params.id;
    let username = req.body.username;
    let password = req.body.password;
    let role = req.body.role;
    let email = req.body.email;
    db.User.update({
      username: username,
      password: password,
      role: role,
      email: email
    }, {
      where: {
        id: id
      }
    }).then(Result => {
      res.json(Result);
    }).catch(err => {
      res.json(err);
    })
  },
  signup: (req, res, next) => {
    let username = req.body.username;
    var password = passwordHash.generate(req.body.password);
    let role = req.body.role;
    let email = req.body.email;
    console.log(`username ${username}, password ${password}, role ${role}, email ${email}`);
    db.User.create({
      username: username,
      password: password,
      role: role,
      email: email
    }).then(Result => {
      res.json(Result);
    }).catch(err => {
      res.send(err);
    })
  },
  signin: (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(`username ${username}`);
    db.User.findOne({
      username: username
    }).then(user => {
      if (!user) {
        res.json({
          success: false,
          message: 'Authentication failed. User not found.'
        });
      } else if (user) {
        if (passwordHash.verify(password, user.password)) {
          var token = jwt.sign(JSON.stringify(user), 'secret');
          res.json({
            success: true,
            message: 'Enjoy your token!',
            token: token
          });
        } else {
          res.send({
            message: 'Authentication failed. Wrong password.'
          });
        }
      }
    })
  }
}
