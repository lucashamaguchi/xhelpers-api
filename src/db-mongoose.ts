import * as mongoose from "mongoose";

export interface options {
  uri: string;
  connectionOptions: mongoose.ConnectionOptions;
}

export const connect = async (
  options?:
    | options
    | undefined
) => {
  const envIsNotTest = process.env.NODE_ENV !== "TEST";

  if (!options) {
    if (envIsNotTest) console.log("Settings API: Mongoose disabled;");
    return;
  }
  if (envIsNotTest) console.log("Settings API: Mongoose enabled;");
  try {
    const defaultOptions: mongoose.ConnectionOptions = {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      ...options.connectionOptions,
    };
    return await mongoose.connect(options.uri, defaultOptions).then(
      () => {
        //mongoose.Promise = global.Promise;
        console.log(
          `🆙  Connected to mongodb: ${mongoose.version}/${options.uri}`
        );
      },
      (err) => {
        console.error(
          `📴 Failed to connect on mongodb: ${mongoose.version}/${options.uri}\nErr: ${err}`
        );
        setTimeout(async () => {
          await connect(options);
        }, 5000);
      }
    );
  } catch (err) {
    console.error(
      `📴 Failed to connect on mongodb: ${mongoose.version}/${options.uri}\nErr: ${err}`
    );
    setTimeout(async () => {
      await connect(options);
    }, 5000);
  }
  return null;
}
