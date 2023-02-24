const express = require('express');
const exphdbs = require('express-handlebars');
const Config = require('./Config/Config');
const Route = require('./routers/Route');
const app = express();
const Import = require("./db/import")
const connect = require("./models/database")



Config.Engine(app);
Route.Route(app);
const userConnection = require('./models/user')
async function tt() {

    await Import.importAndUpload()
   
    
}
tt().then((resolve) => {
    console.log("Server is ready")
    app.listen(20565);
})