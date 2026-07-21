import express from "express";
import colors from "colors";
import morgan from "morgan";
import { db } from "./config/db";
import budgetRouter from './routes/budgetRoutes'
import authRouter from './routes/authRoutes'

export async function connectDB() {
  try {
    await db.authenticate();
    db.sync();
    console.log(colors.green.bold("Conectados con la BD"));
  } catch (error) {
    console.log(error);
    console.log(colors.red.bold("Fallo de conexión a la BD"));
  }
}

connectDB();

const app = express();
app.use(morgan("dev"));

app.use(express.json());
//si queremos limitar peticiones en toda la app app.use(limiter)



app.use('/api/budgets', budgetRouter)
app.use('/api/auth', authRouter)
app.use('/', (req, res) => {
  res.send('TODO OK')
})
// console.log(process.env.NODE_ENV)
export default app;
