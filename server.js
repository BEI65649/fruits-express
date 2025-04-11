//dependency imports

//module is any javascript file 

const express = require ("express")
const dotenv = require('dotenv')
dotenv.config() // create the process.env object, and puts all of our ..env file key:value pairs into that process.env object
const mongoose = require('mongoose')
const app = express ()
const PORT = process.env.PORT || 4000
const Fruit = require('./models/fruit') // Import the Fruit model from the fruit.js server
const methodOverride = require ("method-override")
const morgan = require("morgan")
const path = require("path");

//database connection 

mongoose.connect(process.env.MONGODB_URI) // this takes that connecttion string that we are hiding in our .env file and connects it into object so that we can have access to. 
mongoose.connection.on("connected", () => {
    console.log(`connected to mongodb ${mongoose.connection.name}`)
}) //all it does is tell your server terminal that you are connected. 


//Middleware
app.use(express.urlencoded({ extended: false }));// Gets inserted data between every request from the browser to the server. Need middleware in order to go through CRUD functions.
app.use(methodOverride("_method")) 
app.use(morgan("dev"))

//I.N.D.U.C.E.S

// new code below this line
app.use(express.static(path.join(__dirname, "public")));
//root home


//root home- 
app.get('/', async(req, res) => {
    res.render('home.ejs')
})


//Index- this is on the fruits/new page
app.get("/fruits", async (req, res) => {//you need a async function if you going to use await fruit.find() and etc
    const allFruits = await Fruit.find();
    res.render('fruits/index.ejs', {allFruits: allFruits});// you need to specificy what you are trying to find.
    console.log(allFruits)
  });//index 

// server.js

// GET /fruits/new
//NEW
app.get("/fruits/new", (req, res) => {
    res.render('fruits/new.ejs');
  });
  
//DELETE

app.delete("/fruits/:fruitId", async (req, res) => {
    await Fruit.findByIdAndDelete(req.params.fruitId);
    res.redirect("/fruits");
  });
  
  

//UPDATE- rendering a form to update



app.put("/fruits/:fruitId", async (req, res) => {
    // Handle the 'isReadyToEat' checkbox data
    if (req.body.isReadyToEat === "on") {
      req.body.isReadyToEat = true;
    } else {
      req.body.isReadyToEat = false;
    }
    
    // Update the fruit in the database
    await Fruit.findByIdAndUpdate(req.params.fruitId, req.body);
  
    // Redirect to the fruit's show page to see the updates
    res.redirect(`/fruits/${req.params.fruitId}`);
  });
  


  //CREATE
  app.post('/fruits', async (req, res) => {
    if (req.body.isReadyToEat === "on") {// this if else code converted the HTML object to a string so that it follows the schema
        req.body.isReadyToEat = true;
      } else {
        req.body.isReadyToEat = false;
      }
      await Fruit.create(req.body);
      res.redirect("/fruits"); // redirect to index fruits. change this to redirect after the index page is created
    })
 //edit- rednering a form to update

 /
app.get("/fruits/:fruitId/edit", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/edit.ejs", {fruit: foundFruit, });
  });
  

 //show
 app.get("/fruits/:fruitId", async (req, res) => {
    const foundFruit = await Fruit.findById(req.params.fruitId);
    res.render("fruits/show.ejs", { foundFruit: foundFruit });//make changes in the index.ejs to make the fruits a hyperlink and access the information by grabbing the id. create a show.ejs to render the data in the object ID. we need to add some display code(output tags)
  });
  
  
  

app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`)
})

//Here’s how the two processes compare:/Process	Form Route	Processing RouteCreate a fruit	New (GET /fruits/new)	Create (POST /fruits)Update a fruit	Edit (GET /fruits/:fruitId/edit)	Update (PUT /fruits/:fruitId) In this section, we’ll focus on the edit route.

//Reviewing the Technology and MVC Architecture of Our Web Application

//In this section, we’ll combine an overview of the technologies used in our web application and how they fit into the Model-View-Controller (MVC) architecture.

//Technologies Employed

//JavaScript: The backbone programming language used in this tech stack.

//Node.js: Executes JavaScript code outside of a browser, in a terminal environment.

//Express: A web framework managing the request-response cycle within the application.

//EJS (Embedded JavaScript): The template engine for rendering dynamic HTML pages based on data.

//MongoDB: A document-based database for storing data persistently.

//Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js, simplifying interactions with the database and enforcing data structure through schemas.

//MVC Architecture in Context

//Client: The browser or application initiating HTTP requests.

//Server: Listens for and processes incoming HTTP requests.

//server.js: The core of the application, orchestrating routes, middleware, database connections, and Express server setup.

//Controllers (in server.js): Handle specific request routes, interact with Mongoose models, and coordinate data flow between the model and view.

//Model (Mongoose): Interfaces with MongoDB, ensuring data adheres to predefined schemas.

//Database (MongoDB): Stores and manages data persistently, accessed via cloud-based MongoDB Atlas in this application.

//View (EJS): Utilizes templating to generate dynamic HTML pages. By integrating JavaScript into templates, EJS produces HTML that changes based on the data provided.

//If our routes are defined in server.js, is this structure really considered MVC?

//Yes, even if the routes and controller functions are defined within the server file, your application can still be considered to follow the Model-View-Controller (MVC) structure. The key aspect of MVC is the separation of concerns—structuring your application so that the data management (Model), user interface (View), and the application logic (Controller) are handled independently. How these components are physically organized in your codebase can vary.

//In many applications, especially larger and more complex ones, it’s common to see routes and controller logic separated into their own directories and files for better organization and maintainability. However, in smaller applications or in projects where simplicity is preferred, keeping the controller logic within the main server file is perfectly acceptable and still adheres to the MVC principles.

//The key point is that your server is handling the Controller part of the MVC—managing the request-response cycle, interacting with the Model for data, and rendering the View. As long as these responsibilities are clearly defined and separated from each other within your application, it aligns with the MVC architecture.

//Common properties on the req object

//req.body: Object holding the form data a user has submitted. The keys on this object will match the name attributes of the inputs in the form and should conform with a model’s schema if it is to be saved to a database. The values will match what the user provided in the form.

//req.params: Object holding the URL parameters of a URL. The keys on this object will match the string provided after the : in the route. The value of each key will match the data from that segment in the URL.

//Common methods on the res object

//res.render(): Always provided a string as the first argument. That string should be a file path and will never start with a /.

//res.redirect(): - Always provided a string as the first argument. That string should be a valid route and will always start with a /.