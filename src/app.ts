import dotenv from 'dotenv'
import express from 'express';
dotenv.config()
import api from './routes/api.routes';
import auth from './routes/auth.routes'
import createTables from './db/createTables';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
 });

app.use('/auth', auth);
app.use('/api', api);


createTables()
.then( () =>
  app.listen(process.env.PORT||'3000', () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  })
).catch(error => {
    console.error('Error from creating database table', error);
})


export default app;