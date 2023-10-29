# Update vite.config with 
# export default defineConfig({
#  plugins: [react()],
#  server: {
#    watch: {
#      usePolling: true,
#    },
#    host: true, // needed for the Docker Container port mapping to work
#    strictPort: true,
#    port: 5173, // you can replace this port with any port
#  }
#})

# create a node environment in the container
FROM node 
# create a directory app and switch to that directory
WORKDIR /app 
# Copies package.json file to /app directory
COPY package.json . 
# Runs npm install to create node_modules for your app
RUN npm i 
# Copies the source code to /app directory
COPY . .
# Exposes the port to access the app from outside the container i.e from the browser
EXPOSE 5173 
# Executes npm run dev to start the server
CMD ["npm", "run", "dev"]