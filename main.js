let http = require("http");
let path = require("path");
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let portNum = process.argv[2];

app.set("views", path.resolve(__dirname,"html_webpages"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use('/public/',express.static('./public/'));

http.createServer(app).listen(portNum);

process.stdin.setEncoding("utf-8");
require("dotenv").config({path: path.resolve(__dirname, 'credentials/.env')})

const userName = process.env.MONGO_DB_USERNAME;
const password = process.env.MONGO_DB_PASSWORD;

const dataBaseAndCollection = {db: process.env.MONGO_DB_NAME, collection: process.env.MONGO_DB_COLLECTION};

const {MongoClient, ServerApiVersion} = require('mongodb');
const { response } = require("express");

async function main(){
  
    const uri = `mongodb+srv://${userName}:${password}@cluster0.wwfzi7q.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    try{
      await client.connect();
    } catch (e) {
      console.error(e);
    } finally {
      await client.close();
    }
  
    
}
app.get("/", (req, res) => {
    res.render("index")
})

// ^^^^^^^^MAIN FUNCTION^^^^^^^^

async function insert(information){
    const uri = `mongodb+srv://${userName}:${password}@cluster0.wwfzi7q.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    try{
        await client.connect();
        const result = await client.db(dataBaseAndCollection.db).collection(dataBaseAndCollection.collection).insertOne(information);
    } catch (e){
        console.error(e);
    } finally {
        await client.close();
    }
}

app.get("/order_form", (req, res) => {
    res.render("order_form", {portNum: portNum});
});
  
// app.post("/orderFormData", async (req, res) => {
//     let {name, ID, email, shippingNotes} = req.body;
  
//     let information = {
//         name: name,
//         ID:ID,
//         email: email,
//         pickUp:pickUp,
//         ship:ship,
//         shippingAddress: shippingAddress,
//         gearSelection: gearSelection,
//         shippingNotes: shippingNotes,
//         total: total
//     };
//     await insert(information);
//     let variables = {
//         name: name,
//         ID:ID,
//         pickUp:pickUp,
//         ship:ship,
//         email: email,
//         shippingAddress: shippingAddress,
//         gearSelection: gearSelection,
//         shippingNotes: shippingNotes,
//         total:total,
//         portNum: portNum
//     };
  
//     res.render("orderFormData", variables);
//   });
  