const dotenv = require('dotenv');
const app = require('./index');
const connectDB = require('./db');
dotenv.config();

connectDB();


app.listen(process.env.PORT, () => {
console.log('Server is running on port 3001');
});
