The server requires MongoDB, Redis, and Bcrypt.

Consult the following links to install the required tools:
https://docs.mongodb.com/manual/installation/
https://redis.io/topics/quickstart
https://www.npmjs.com/package/bcrypt

To install:
1. CD into the server root directory and run 'npm install' to install all of the dependencies.
2. Make sure that mongoDB and Redis is running.
2. Make sure the settings for MONGO_DB_URI and REDIS_CONFIG in the config/config.js file is correctly set to your local versions.
3. To start the server, run 'node server.js'

The server will run on localhost:5000 while the client runs on localhost:3000 but is set to proxy to port 5000.

If you want to serve the client through the server:
1. CD into the client root directory, run 'npm run build'.
2. Copy/Move the build folder from the client directory to the server directory.
3. Restart the server.
4. Go to localhost:5000. 

To run the server's tests:
1. Run 'npm test' on the server root directory.

During production:
1. You can use the NODE_ENV variables to set the mongoDB URI, the session secret, and the redis config.
2. These variables are procces.env.MONGO, process.env.SESSION, and process.env.REDIS. They can be found in the config/config.js file.
