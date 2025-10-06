const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    console.log('Hello!');
    console.log('Req query: ', req.query);

    res.status(200).send({ message: 'Hi' })
});

const peopleRouter = require('./routes/people/people');
app.use('/people', peopleRouter);

app.listen(8080, async () => {
    console.log('Server started on port 8080');
})