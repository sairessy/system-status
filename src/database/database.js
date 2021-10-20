const Datastore = require('nedb')

const collections = {
  users: new Datastore('./src/database/collections/users.db'),
  services: new Datastore('./src/database/collections/services.db')
}

collections.users.loadDatabase()
collections.services.loadDatabase()

module.exports = collections