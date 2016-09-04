# LOC8R: A MEAN STACK APPLICATION
### Built from Tutorial in "Getting MEAN" by Simon Holmes

### Technologies used
- Node/express
- MongoDB
- Mongoose
- Jade (templates)
- Heroku
- AngularJS
- Bootstrap

### STANDALONE API
Loc8r is built as both a standalone API and a full stack application with templated pages. Separating the API provides flexibility, allowing the data to be consumed by multiple applications (web, mobile, third party etc.).

### API CREATE, UPDATE, DELETE WITH MONGOOSE  
Mongoose provides built-in methods to interact with the database via the model including:
- geoNear: accepts a geolocation point and other options plus a callback to push the returned database results onto an array and send it to the browser as JSON.
- findById: Uses a location id parameter sent in the request url.
- create: Takes 1. a data object custom built with request body data and 2. a callback expecting err object or new location doc object as saved in db.

### ANGULARJS OBSERVATIONS
Angular essentially works as MVC on the client side, separating concerns and keeping things organized.
- Views: Define our HTML.
- Controllers: A controller is put in charge of part of our DOM and has code for fetching and attaching data to the variables used by the DOM.
- Directives: Resusable mini-templates, sometimes with their own controllers.
- Services: We use one to get API data and another to fetch locational data using HTML5 geolocation.
- Filters: Some are built in and we wrote one of our own to format distance data. They can sort, format and more.
