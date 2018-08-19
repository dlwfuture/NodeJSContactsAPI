const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser').json()
const crypto = require("crypto")

const port = 3001
const app = express()
app.use(session({ secret: '3cb736e4-9064-4ffa-9bc0-88a96499d9fb', cookie: { maxAge: 600000000 }}));

app.get('/getall', (req, res) => {
    const sessionData = req.session
    return res.json(sessionData.Contacts || [])
})

app.post('/add', bodyParser, (req, res) => {
  const contact = req.body
  contact.Id = crypto.randomBytes(16).toString("hex")
  let sessionData = req.session
  sessionData.Contacts = sessionData.Contacts || []
  sessionData.Contacts.push(contact)
  return res.json(sessionData.Contacts)
})

app.put('/edit', bodyParser, (req, res) => {
  let sessionData = req.session
  const index = sessionData.Contacts.findIndex(c => c.Id === req.body.Id)
  sessionData.Contacts[index] = req.body
  return res.json(sessionData.Contacts)
})

app.delete('/delete', bodyParser, (req, res) => {
  let sessionData = req.session
  sessionData.Contacts = sessionData.Contacts.filter(c => c.Id !== req.body.Id)
  return res.json(sessionData.Contacts)
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
  console.log('To shutdown the server: ctrl + c')
})