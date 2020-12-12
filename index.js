const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const {pool} = require('./config');

const app = express();

const isProduction = process.env.NODE_ENV === 'production'

const origin = {
    origin: isProduction ? process.env.DOMEN : '*',
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());
app.use(compression());
app.use(helmet());
app.use(cors(origin));

const getBooks = (request, response) => {
    pool.query('SELECT * FROM books', (error, results) => {
        if (error) {
            console.log(error);
            return ;
        }
        response.status(200).json(results.rows);
    });
}

const addBook = (request, response) => {
    const {author, title} = request.body;

    pool.query(
        'INSERT INTO books (author, title) VALUES ($1, $2)',
        [author, title],
        (error) => {
            if (error) {
                console.log(error);
                return ;
            }
            response.status(201).json({status: 'success', message: 'Book added.'});
        },
    );
}

app
    .route('/books')
    // GET endpoint
    .get(getBooks)
    // POST endpoint
    .post(addBook);

// Start server
app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening`);
});