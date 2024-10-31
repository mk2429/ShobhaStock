const express = require('express');
const cors = require('cors');
const mongodb = require('./mongooseConnect');

const app = express();
mongodb();
app.use(cors());
app.use(express.json());



app.use("/api", require("./routes/getBrands"));
app.use("/api", require("./routes/getCategories"));
app.use("/api", require("./routes/getProducts"));
app.use("/api", require("./routes/sales"));
app.use("/api", require("./routes/editProduct"));
app.use("/api", require("./routes/addProduct"));
app.use("/api", require("./routes/getPname"));







app.listen(5000, () => {
    console.log("Backend Server Started");
});