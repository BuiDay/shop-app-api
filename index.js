const express = require('express')
const bodyParser = require('body-parser')
const dbConnect = require('./config/dbConnect.js')
const authRouter = require('./routes/authRoute.js')
const productRouter = require('./routes/productRoute.js')
const blogRouter = require('./routes/blogRoute.js')
const categoryRouter = require('./routes/categoryRoute.js')
const brandRouter = require('./routes/brandRoute.js')
const blogCategoryRouter = require('./routes/blogCategoryRoute.js')
const couponRouter = require('./routes/couponRoute.js')
const uploadRouter = require('./routes/uploadingRoute.js')
const enquiryRouter = require('./routes/enqRouter.js')
const morgan = require('morgan')
const cookie = require('cookie-parser')
const cors = require('cors')
const { notFound, errorHandler } = require('./middlewares/errorHandler.js')
const app = express();
const dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;

dotenv.config();
dbConnect();
app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookie())
app.use(morgan())


app.use('/api/user',authRouter);
app.use('/api/product',productRouter);
app.use('/api/blog',blogRouter);
app.use('/api/category',categoryRouter);
app.use('/api/brand',brandRouter);
app.use('/api/blog-category',blogCategoryRouter);
app.use('/api/coupon',couponRouter);
app.use('/api/upload',uploadRouter);
app.use('/api/enquiry',enquiryRouter);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`)
})