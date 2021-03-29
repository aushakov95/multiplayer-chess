import { Sequelize, DataTypes } from "sequelize";
import game from "./game";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  ssl: true,
  protocol: "postgres",

  logging: true,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

testDatabaseConnection();

const models = {
  Game: game(sequelize, DataTypes),
};

export { sequelize };

export default models;
