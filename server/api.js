const express = require('express');
const apiRouter = express.Router();
const { getAllFromDatabase, addToDatabase, getFromDatabaseById, updateInstanceInDatabase, deleteFromDatabaseById, createMeeting, deleteAllFromDatabase } = require('./db')
const checkMillionDollarIdea = require('./checkMillionDollarIdea.js');

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
});

const applyTheCheckMillionDollarIdea = (req, res, next) => {
    if (req.option === 'ideas') {
        return checkMillionDollarIdea(req, res, next);
    } else {
        next();
    }
}

apiRouter.get('/:option', (req, res, next) => {
    const newOption = getAllFromDatabase(req.option);
    res.send(newOption)
});


apiRouter.post('/:option', applyTheCheckMillionDollarIdea, (req, res, next) => {
    if (req.option === 'meetings') {
        const newMeeting = createMeeting();
        addToDatabase(req.option, newMeeting)
        res.status(201).send(newMeeting)
    } else {
        const newOption = addToDatabase(req.option, req.body);
        res.status(201).send(newOption)
    }  
});

apiRouter.get('/:option/:id', (req, res, next) => {
    res.send(req.id)
});

apiRouter.put('/:option/:id', applyTheCheckMillionDollarIdea, (req, res, next) => {
    let newThing = req.body;
    newThing.id = req.params.id;
    const createdNewThing = updateInstanceInDatabase(req.option, newThing)
    res.status(200).send(createdNewThing)
});


apiRouter.delete('/:option/:id', (req, res, next) => {
    deleteFromDatabaseById(req.option, req.id.id);
    res.status(204).send(`Deleted ${JSON.stringify(req.id)}`)
});

apiRouter.delete("/:option", (req, res) => {
    if (req.option === "meetings") {
      deleteAllFromDatabase(req.option);
      res.status(204).send("No content");
    }
  });

module.exports = apiRouter;
