const express =require('express');
const app = express()
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;



async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/test');
  
    app.get('/', (req, res) => {
        res.send('Welcome ')
      })

     }

     main().then(() => console.log("Mongodb connect successfully")).catch(err => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on ${port}`)
})