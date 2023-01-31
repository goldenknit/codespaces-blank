const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


let mongoose = require('mongoose');

const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'Hello';      // REPLACE WITH YOUR DB NAME
mongoose.set('strictQuery', false);
class Database {
  constructor() {
    this._connect()
  }
_connect() {
     mongoose.connect(`mongodb://${server}/${database}`)
       .then(() => {
         console.log('Database connection successful')
       })
       .catch(err => {
         console.error('Database connection error')
       })
  }
}
const itemsSchema={
    name:String
}

const Item=mongoose.model("Item",itemsSchema);


const item1=new Item({
    name:"Hello there"
  });
  
  const item2=new Item({
    name:"Myself Mahika Yaduvanshi"
  });
  const item3=new Item({
    name:"I am from Ayodhya"
  });
  
  const defultItems=[item1,item2,item3];

  
  const listSchema={
      name:String,
      items:[itemsSchema]
  };
  const List=mongoose.model("List",listSchema);
  
module.exports = new Database()



app.get("/", function(req, res) {
    Item.find({},function(err,foundItems){

      if(foundItems.length===0){
    Item.insertMany(defultItems,function(err){
    if(err)
    {
      console.log(err);
    }
    else{
      console.log("Successfully saved default items to DB");
    }
  });
  res.redirect("/")
      }
      else{

        res.render("list", {listTitle:"Today", newListItems: foundItems});
      }
    });
});


app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName.customListName;

List.findOne({name:customListName},function(err,foundList){
  if(!err){
    if(!foundList){
      //create a new list
      
  const list=new List({
    name:customListName,
    items:defultItems
  });
  list.save();
    }
   
  }else{
    //show existing list
    res.render("list", {listTitle:foundList.name, newListItems: foundItems.items});
  }
});

  const list=new List({
    name:customListName,
    items:defultItems
  });
  list.save();

});


app.post("/", function(req, res){

      const itemName=req.body.newItem;
      
      const item= Item({
        name:itemName
      });
      item.save();
      res.redirect("/");
});


app.post("/delete", function(req, res){
  const checkedItemId=req.body.checkbox;
Item.findByIdAndRemove(checkedItemId,function(err){
  if(!err){
    console.log("Sucessefully deleted checked item.");
  }
});
});






app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
