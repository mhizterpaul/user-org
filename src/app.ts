import dotenv from 'dotenv'
import express from 'express';
dotenv.config()
import api from './routes/api.routes';
import auth from './routes/auth.routes'

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello');
 });

app.use('/auth', auth);
app.use('/api', api);

app.listen(process.env.PORT||'3000', () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

export default app;