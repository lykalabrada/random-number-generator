const express = require('express')
const router = express.Router()

const Requests = require('../models/requests')
const maxAllowedRequest = require('../config').maxAllowedRequest
const reqInterval = require('../config').interval

router.get('/generate', async (req, res) => {
  try {
    const random_number = Math.floor( Math.random() * 10000  + 1 )
    let IPAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    if(IPAddress == '::1') IPAddress = '127.0.0.1'

    const allowed = await checkRequestLimit(IPAddress)
    Requests.create({IPAddress, allowed})
    if(!allowed) {
      return res.status(400).send(JSON.stringify({error: 'exceeded_maximum_allowed_requests'}))
    }
    return res.status(200).send(JSON.stringify({random_number}))
  } catch (e) {
    res.status(400).send(JSON.stringify({error:'something_went_wrong'}))
  }
})

router.get('/', async (req, res) => {
  try {
    const data = await Requests.find().sort({date: -1}).lean()
    res.status(200).send(JSON.stringify(data))
  } catch (e) {
    res.status(400).send(JSON.stringify({error:'something_went_wrong'}))
  }
})

const checkRequestLimit = async(IPAddress) => {
  try {
    const reqCount = await Requests.find(
      {
        IPAddress,
        allowed:true,
        date:{ $gt: new Date(new Date().getTime() - 1000 * 60 * reqInterval) }
      }
    ).count()
    if(reqCount >= maxAllowedRequest)
      return false
    else
      return true
  } catch (e) {
    console.log(e)
    throw new Error('something_went_wrong')
  }
}

module.exports = router
