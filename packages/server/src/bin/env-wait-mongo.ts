/*
      delay execution in shell until mongo is available
 */

import mongoose from "mongoose";

const { DATABASE_PASSWORD, DATABASE_URL, DATABASE_USER } = process.env;

const attempts = 100;
const verbose = false;
const waitSeconds = 2;

const buildConnection = async () => {
  const connectMongoose = async () => {
    const options = {
      user: DATABASE_USER,
      pass: DATABASE_PASSWORD,
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      poolSize: 10,
      authSource: `admin`,
    };

    console.log(`attempting to connect to mongo :: ${JSON.stringify(options)}`);

    try {
      await mongoose.connect(DATABASE_URL, options);

      console.log(
        `Mongoose database is connected :: ${JSON.stringify(options)}`
      );
      await mongoose.connection.close();
      process.exit();
    } catch (err) {
      console.log(
        `Failed to connect to mongoose database :: err: ${err} :: url: ${DATABASE_URL} :: options: ${JSON.stringify(
          options
        )}`
      );
    }
  };

  await connectMongoose();
};

const repeat = async (fn, seconds) => {
  let i = 0;

  const f = async () => {
    await fn();
    i++;
    setTimeout(() => {
      if (i < attempts) {
        if (verbose) {
          console.log(`Running loop ${i}`);
        }
        f();
      }
    }, seconds * 1000);
  };

  await f();
};

repeat(buildConnection, waitSeconds).catch(error => {
  console.log(`Error when attempting to connect to mongodb :: error: ${error}`);
});
