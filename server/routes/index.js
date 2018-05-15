const express = require('express'),
      path = require('path'),
      weather = require('yahoo-weather'),
      low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync'),
      adapter = new FileSync('database/database.json'),
      db = low(adapter),
      shortid = require('shortid'),
      router = express.Router()

// get users
router.get('/api/users', (req, res, next) => {

  res.send({users: db.get('users').value()})

})

// get user by id
router.get('/api/user_by_id/:id', (req, res, next) => {

  res.send({user: db.get('users').find({ id: req.params.id }).value()})

})

// create user
router.post('/api/user', (req, res, next) => {

  if(db.get('users')
    .push({
      id: shortid.generate(),
      name: req.body.params.option.name,
      sur_name: req.body.params.option.sur_name,
      city: req.body.params.option.city,
      country: req.body.params.option.country,
      gender: req.body.params.option.gender
    })
    .write()){
      res.send({status: true})
    } else {
      res.send({status: false})
    }

})

// change user by id
router.put('/api/user_by_id/:id', (req, res, next) => {
  var id = req.params.id
  var option = req.body.params.option

  db.get('users')
    .find({ id: id })
    .assign({
      name: option.name,
      sur_name: option.sur_name,
      city: option.city,
      country: option.country,
      gender: option.gender
    })
    .write()

  res.send({status: true})
})

// delete user by id
router.delete('/api/user_by_id/:id', (req, res, next) => {
  var id = req.params.id
  db.get('users').remove({ id: id }).write()
  res.send({status: true})
})

// get weather by user id
router.get('/api/weather_by_id/:id', (req, res, next) => {
  if(db.get('users').find({ id: req.params.id }).value())
    weather(db.get('users').find({ id: req.params.id }).value().city, 'c')
      .then(info => {
        if(info)
          res.send({weather: info.item})
        else
          res.send({weather: null})
      }).catch(err=>{
        console.log(err)
      })
  else
    res.send({weather: null})

})

// Get Index
router.get('*', (req, res, next) => {
  //res.sendFile(path.join(__dirname, '../../app/client/dist/index.html'))
  res.sendFile(path.join(__dirname, '../../client/dist/index.html'))
})

module.exports = router