const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase } = require('./db')

// apiRouter Params
apiRouter.param("option", (req, res, next, option) => {
    const options = ['minions', 'ideas', 'meetings', 'work'];
    if (!options.includes(option)) {
        res.status(404).send(`${option} is not valid`)
    } else {
        req.option = option;
        next();
    }
});

apiRouter.param('id', (req, res, next, id) => {
    const hasId = getFromDatabaseById(req.option, id);
    if (!hasId) {
        res.status(404).send(`${id} is not valid`)
    } else {
        req.id = hasId;
        next();
    }
})

apiRouter.get('/:option', (req, res, next) => {
    const newOption = getAllFromDatabase(req.option);
    res.send(newOption)
});

apiRouter.post('/:option', (req, res, next) => {
    const newOption = addToDatabase(req.option, req.body);
    res.status(201).send(newOption)
});

apiRouter.get('/:option/:id', (req, res, next) => {
    res.send(req.id)
});

apiRouter.put('/:option/:id', (req, res, next) => {
    let newThing = req.body;
    newThing.id = req.params.id;
    const createdNewThing = updateInstanceInDatabase(req.option, newThing)
    res.status(201).send(createdNewThing)
})

module.exports = apiRouter;
