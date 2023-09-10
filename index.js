const express = require('express');
const connectDB = require("./db");
const cors = require('cors');
const port = 5000

connectDB();
const app = express()

app.use(cors({
    origin: 'https://taskmanger-kappa.vercel.app',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}))
app.use(express.json())

app.use('/api/auth',require('./routes/auth'))
app.use('/api/', require('./routes/test'))
app.use("/api/notes", require("./routes/notes"));

app.listen(port,()=>{
    console.log(`notebook server is running on : ${port}`);
})

module.exports=app