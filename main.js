let http = require("http");
let path = require("path");
let express = require("express");
let app = express();
let bodyParser = require("body-parser");
let portNum = process.argv[2];

app.set("views", path.resolve(__dirname,"html_webpages"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use('/images/',express.static('./images/'));

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

app.get("/yonex_page", (req, res) => {
    res.render("yonex_page", {portNum: portNum});
  });

app.get("/victor_page", (req, res) => {
    res.render("victor_page", {portNum: portNum});
});

app.get("/order_form", (req, res) => {
    res.render("order_form", {portNum: portNum});
});

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


app.post("/order_form_entry", async (req, res) => {
    const jsonData = req.body;
    
    var phoneNumber = "";
    var result =  {};
    var items = "";
    
    for(let i in jsonData) { 
        result[i] = jsonData[i];
    };

    await insert(result);
    phoneNumber = jsonData["phone_number"][0] + "-" + jsonData["phone_number"][1] + "-" + jsonData["phone_number"][2];
    result["phoneNumber"] = phoneNumber;

    if (Array.isArray(jsonData["product"]) ){
        for (let j = 0; j < jsonData["product"].length; j++){
            items = items + "[" + jsonData["product"][j] + "]";
        }
    }else{
        items = jsonData["product"];
    }
    
    
    result["items"] = items;
    result["portNum"] = portNum;
    
    res.render("order_form_entry", result);
  });


async function remove() {
    const uri = `mongodb+srv://${userName}:${password}@cluster0.wwfzi7q.mongodb.net/?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  
    try{
        await client.connect();
        const result = await client.db(dataBaseAndCollection.db).collection(dataBaseAndCollection.collection).deleteMany({});
        return result.deletedCount;
    } catch (e){
        console.error(e);
    } finally {
        await client.close();
    }
}

  app.post("/data_removed", async (req, res) => {
    let removedNumber = await remove();
    res.render("data_removed", {portNum: portNum, removedNumber: removedNumber});
  });


console.log(`Web server started and running at http://localhost:${portNum}`);
process.stdout.write("Type stop to shutdown the server: ");

process.stdin.on("readable", function(){
    let userInput = process.stdin.read();

    if (userInput != null){
        if (userInput === "stop\n") {
            process.stdout.write("Shutting down the server\n");
            process.exit(0);
        }
        else {
            process.stdout.write(`Invalid command: ${userInput}`);
            process.stdout.write("Type stop to shutdown the server: ");
            process.stdin.read();
        }
    }
})

main().catch(console.error);
  