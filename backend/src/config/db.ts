import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

import 'dotenv/config'

export const db = new Sequelize(process.env.DATABASE_URL, {
  models: [__dirname + '/../models/**/*'],
  dialectOptions: {
    ssl: {
      require: false,
    },
  },
});
