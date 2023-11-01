const express = require('express')
const cors = require ('cors')

const app = express()

app.use(express.json())
app.use(cors())

// Use Routes
app.use('/users' ,require('./users'));
// app.use('/auth', require('./routes/auth'));

//Listener Port 6969 - Because Justin is a Child
const port = 6969
app.listen(port,() => {console.log(`I am listening at ${port}`)})
