const express = require("express");
const {
    getAllFromDatabase,
    getFromDatabaseById,
    deleteFromDatabasebyId,
    addToDatabase,
    updateInstanceInDatabase
} = require('./db');

const worksRouter = require('./works')

const minionsRouter = express.Router({ mergeParams: true });

minionsRouter.param('minionId', (req, res, next, minionId) => {
    const minion = getFromDatabaseById('minions', minionId);
    if (!minion) {
        res.status(404).send();
    }
    req.minion = minion;
    next();
});

minionsRouter.get('/', (req, res, next) => {
    const data = getAllFromDatabase('minions');
    if (data) {
        res.status(200).send(data);
    }
});

minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minion);
})

minionsRouter.delete('/:minionId', (req, res, next) => {
    const result = deleteFromDatabasebyId('minions', req.minion.id);
    if (!result) {
        res.status(500).send();
    } else {
        res.status(204).send();
    }
});

const checkData = ((minionData, res) => {
    let responseMessage = [];
    if (!minionData.hasOwnProperty('name') || minionData.name.length === 0) {
        responseMessage.push('Minion requires a name');
    }
    if (!minionData.hasOwnProperty('title')) {
        responseMessage.push('Minion requires a title (can be empty)');
    }
    if (!minionData.hasOwnProperty('weaknesses')) {
        responseMessage.push('Minion requires a weaknesses field (can be empty)');
    }
    if (!minionData.hasOwnProperty('salary') || minionData.salary.length === 0 || !Number.isFinite(+minionData.salary) || Number(minionData.salary) < 0) {
        responseMessage.push('Minion requires a salary of at least 0');
    }
    if (responseMessage.length > 0) {
        res.status(404).send(responseMessage);
        return false;
    } else {
        return true;
    }
});

minionsRouter.post('/', (req, res, next) => {
    const minionData = req.body;
    if (checkData(minionData, res)) {
        const newMinion = addToDatabase('minions', minionData);
        if (newMinion) {
            res.status(201).send(newMinion);
        } else {
            res.status(500).send("Unable to create new minion");
        }
    }
});

minionsRouter.put('/:minionId', (req, res, next) => {
    const minionData = req.body;
    if (checkData(minionData, res)) {
        const updatedMinion = updateInstanceInDatabase('minions', minionData);
        if (updatedMinion) {
            res.status(201).send(updatedMinion);
        } else {
            res.status(404).send(updatedMinion);
        }
    } else {
        res.status(500).send("Could not update minion");
    }
});

minionsRouter.use('/:minionId/work', worksRouter);

module.exports = minionsRouter;
