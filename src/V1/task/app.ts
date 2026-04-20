import express from 'express';
import cors from 'cors';
import taskRoutes from './task.router';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/task', taskRoutes);
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});