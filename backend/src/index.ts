import express from 'express';
import cors from 'cors';
import contentRoutes from './routes/content.routes';
import queueRoutes from './routes/queue.routes';
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());
app.use('/api/contents', contentRoutes);
app.use('/api/queue', queueRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
