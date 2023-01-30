const express = require('express')
const bodyParser = require('body-parser')
const dbConnect = require('./config/dbConnect.js')
const authRouter = require('./routes/authRoute.js')
const productRouter = require('./routes/productRoute.js')
const morgan = require('morgan')
const cookie = require('cookie-parser')
const { notFound, errorHandler } = require('./middlewares/errorHandler.js')
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;

dotenv.config();
dbConnect();


app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookie())
app.use(morgan())


app.use('/api/user',authRouter);
app.use('/api/product',productRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})