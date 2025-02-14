import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import userRouter from './routes/userRoutes.js';

// App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/user', userRouter);
app.get('/', (req, res) => res.status(200).send('API Working!!'));

app.listen(port, () => console.log(`Server running on port ${port}`));