const express = require('express')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const organisationRoutes = require('./routes/organisationRoutes')

const app = express()

app.use(bodyParser.json())

const PORT = 8000 || process.env.PORT

app.get('/',(req , res)=>{
    res.send('Welcome to my api Motherfuckers')
})
app.use('/auth' , authRoutes)
app.use('/api/users' , userRoutes)
app.use('/api/organisations' , organisationRoutes)

if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
}

module.exports = app
// clybif81c0001npz084ysk46b