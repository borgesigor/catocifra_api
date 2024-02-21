
import express from 'express';
import cors from 'cors';
import { AvatarService } from './Services/AvatarService';

const app = express();

app.use(cors());

app.get('/', (req, res)=>{
  
})

app.listen(3000, () => {
  console.log('Server initialized');
});


