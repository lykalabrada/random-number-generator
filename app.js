const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const requests = require('./routes/requests')

const app = express()

// bodyParser middleware
app.use(bodyParser.json())

// DB config
const db = require('./config').mongoURI

// connect to mongodb
mongoose.connect(db)
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.log(err))

// routes
app.use('/api/requests', requests)

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))
