const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

var corsOptions = {
    origin: "http://localhost:8001"
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require('./app/models');
const Role = db.role;

db.mongoose
    .connect(`mongodb+srv://vp:12345@cluster0.nhqdc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: false
    })
    .then(() => {
        console.log('MongoDB has connected successfully')
        initial()
    })
    .catch((error) => {
        console.error('Connection error ', error);
        process.exit();
    })

function initial() {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Role({
                name: "user"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'user' to roles collection");
            });

            new Role({
                name: "admin"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'admin' to roles collection");
            });
        }
    });
}

app.get('/', (req, res) => {
    res.json('Hello World')
})

require('./app/routes/auth.routes')(app)
require('./app/routes/user.routes')(app)

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on the port ${port}`)
})