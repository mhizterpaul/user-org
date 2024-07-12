import dotenv from 'dotenv'
import express from 'express';
dotenv.config()
import api from './routes/api.routes';
import auth from './routes/auth.routes'
import createTables from './db/createTables';
import bcrypt from 'bcrypt';
import fs from 'fs';

const app = express();
app.use(express.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.send('Hello');
 });


app.use('/auth', auth);
app.use('/api', api);



createTables()
.then( () => {
  if(!process.env.SALT){
    const salt = bcrypt.genSaltSync(16);
    //read .env file and add SALT to it
    fs.appendFile('.env', `\nSALT = ${salt}`, function(err) {
        if (err) {
            return console.error(err);
        }
        console.log('The string was appended to the file!');
    });
    dotenv.config()
  }
  app.listen(process.env.PORT||'3000', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
}).catch(error => {
    console.error('Error from creating database table', error);
})


export default app;