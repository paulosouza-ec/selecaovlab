import express from 'express';
import cors from 'cors';
import authRouter from './routes/authRoutes';
import marathonRouter from './routes/marathonRoutes';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/marathons', marathonRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});