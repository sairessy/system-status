// CONSTANTS
const PORT = process.env.PORT || 3000

// NODE MODULES
const collections = require('./src/database/database')
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.static('public'))
app.use(express.json())
app.use(cookieParser())

app.listen(PORT, () => {
  console.log(`App listening to port ${PORT}.`)
})

// PAGES ROUTES
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html')
})

app.get('/register', (req, res) => {
  if (req.cookies.user !== undefined) {
    res.sendFile(__dirname + '/public/profile.html')
  } else {
    res.sendFile(__dirname + '/public/register.html')
  }
})

app.get('/login', (req, res) => {
  if (req.cookies.user !== undefined) {
    res.sendFile(__dirname + '/public/profile.html')
  } else {
    res.sendFile(__dirname + '/public/login.html')
  }
})

app.get('/profile', (req, res) => {
  if (req.cookies.user !== undefined) {
    res.sendFile(__dirname + '/public/profile.html')
  } else {
    res.sendFile(__dirname + '/public/login.html')
  }
})

app.get('/recovery', (req, res) => {
  if (req.cookies.user !== undefined) {
    res.sendFile(__dirname + '/public/profile.html')
  } else {
    res.sendFile(__dirname + '/public/recovery.html')
  }
})

// API ROUTES
// Register the user
app.post('/register', (req, res) => {
  const data = req.body
  collections.users.insert(data, (err, doc) => {
    // console.log(doc)
  })
  res.json({ status: true })
})

// Authenticate the user
app.post('/login', async (req, res) => {
  const data = req.body
  const result = await new Promise((resolve, reject) => {
    collections.users.find({ email: data.email, pass: data.pass }, (err, d) => {
      resolve(d)
    })
  })

  if (result.length > 0) {
    res.cookie('user', result[0]._id, {})
  }

  res.json({ status: result.length > 0 })
})


// Add an user service
app.post('/addservice', (req, res) => {
  const data = {
    label: req.body.label,
    user: req.cookies.user,
    disponible: true
  }

  collections.services.insert(data, (err, doc) => {
    // console.log(doc);
  })

  res.json({ status: true })
})

// Remove an user service
app.post('/removeservice', (req, res) => {
  collections.services.remove({ _id: req.body.id })
  res.json({ status: true })
})

// Change the disponibility status of an user service
app.post('/changedisponibility', (req, res) => {
  const data = req.body
  collections.services.update({ _id: data.id }, {
    $set: {
      disponible: data.disponible, expectedTime: data.expectedTime,
      time: data.disponible ? '0' : Date.now().toString()
    }
  }, { multi: true },
    function (err, numReplaced) {
      // console.log(numReplaced)
    });

  res.json({ status: true })
})

// Destroy user session
app.get('/user/logout', (req, res) => {
  res.clearCookie('user', {})
  res.redirect('/login')
})

// Get user services
app.get('/userservices', async (req, res) => {
  const result = await new Promise((resolve, reject) => {
    collections.services.find({ user: req.cookies.user }, (err, data) => {
      resolve(data)
    })
  })

  res.json(result);
})

// Get systems
app.get('/systems', async (req, res) => {
  const result = await new Promise((resolve, reject) => {
    collections.users.find({}, (err, data) => {
      resolve(data)
    })
  })

  result.forEach(element => {
    element.services = []
  });

  const s = await new Promise((resolve, reject) => {
    collections.services.find({}, (err, data) => {
      resolve(data)
    })
  })

  for (let i = 0; i < result.length; i++) {
    const r = result[i];
    for (let j = 0; j < s.length; j++) {
      const srv = s[j];
      if (r._id === srv.user) {
        result[i].services.push(srv);
      }
    }
  }

  res.json(result);
})

// Get services from a specific bank
app.get('/services/bank/:id', async (req, res) => {
  const id = req.params.id;
  const result = await new Promise((resolve, reject) => {
    collections.users.find({ bank: id }, (err, data) => {
      resolve(data)
    })
  })

  result.forEach(element => {
    element.services = []
  });

  const s = await new Promise((resolve, reject) => {
    collections.services.find({}, (err, data) => {
      resolve(data)
    })
  })

  for (let i = 0; i < result.length; i++) {
    const r = result[i];
    for (let j = 0; j < s.length; j++) {
      const srv = s[j];
      if (r._id === srv.user) {
        result[i].services.push(srv);
      }
    }
  }

  res.json(result);
})

// Chek if user has session
app.get('/checksession', (req, res) => {
  res.json({ status: req.cookies.user !== undefined })
})