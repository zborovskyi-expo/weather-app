const express = require('express'),
      path = require('path'),
      port = 8000,
      routes = require('./routes'),
      low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync'),
      adapter = new FileSync('database/database.json'),
      db = low(adapter),
      shortid = require('shortid'),
      bodyParser = require('body-parser'),
      app = express()

class Server {

  constructor(){
    this.initStaticFolder()
    this.initBodyParser()
    this.initRoutes()
    this.initDatabaseConnection()
    this.start()
  }

  initBodyParser(){
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
  }


  start(){
    app.set('port', (process.env.PORT || port));
    app.listen(app.get('port'), ()=>
      console.log('Server listening on port ' + app.get('port')))
  }

  initDatabaseConnection(){
    db.defaults({
      users: [{
        id: shortid.generate(),
        name: 'John',
        sur_name: 'Smith',
        city: 'New York',
        country: 'USA',
        gender: 'male'
      }, {
        id: shortid.generate(),
        name: 'Anna',
        sur_name: 'Smith',
        city: 'Los Angeles',
        country: 'USA',
        gender: 'female'
      }]
    })
    .write()

  }

  initStaticFolder(){
    app.use(express.static(path.join(__dirname, '../client/dist/')))
  }

  initRoutes(){

    app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
      res.setHeader('Access-Control-Allow-Credentials', true)

      next()
    })

    app.use('/', routes)
  }

}

new Server()
