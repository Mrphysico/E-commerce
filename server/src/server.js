import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[TechNova API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`[TechNova API] URL: http://localhost:${PORT}`);
    console.log(`[TechNova API] Default Admin: admin@technova.com / Admin@12345`);
    console.log(`[TechNova API] Demo Customer: customer@technova.com / Customer@12345`);
  });
});
