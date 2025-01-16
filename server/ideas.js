const express = require("express");
const {
    getAllFromDatabase,
    getFromDatabaseById,
    deleteFromDatabasebyId,
    addToDatabase,
    updateInstanceInDatabase
} = require('./db');

const ideasRouter = express.Router({ mergeParams: true });

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

ideasRouter.param('ideaId', (req, res, next, ideaId) => {
    const idea = getFromDatabaseById('ideas', ideaId);
    if (!idea) {
        res.status(404).send();
    } else {
        req.idea = idea;
        next();
    }
});

ideasRouter.get('/', (req, res, next) => {
    const data = getAllFromDatabase('ideas');
    res.send(data);
});

ideasRouter.get('/:ideaId', (req, res, next) => {
    res.send(req.idea);
})

ideasRouter.delete('/:ideaId', (req, res, next) => {
    const result = deleteFromDatabasebyId('ideas', req.idea.id);
    if (!result) {
        res.status(500).send();
    } else {
        res.status(204).send();
    }
});

const checkIdea = ((req, res, next) => {
    let responseMessage = [];
    const ideaData = req.body;
    if (!ideaData.hasOwnProperty('name') || ideaData.name.length === 0) {
        responseMessage.push('Idea requires a name');
    }
    if (!ideaData.hasOwnProperty('description')) {
        responseMessage.push('Idea requires a description');
    }
    if (!ideaData.hasOwnProperty('numWeeks') || ideaData.numWeeks.length === 0 || !Number.isFinite(+ideaData.numWeeks) || Number(ideaData.numWeeks) <= 0) {
        responseMessage.push('Idea requires number of weeks of at least 1');
    }
    if (!ideaData.hasOwnProperty('weeklyRevenue') || ideaData.weeklyRevenue.length === 0 || !Number.isFinite(+ideaData.weeklyRevenue) || Number(ideaData.weeklyRevenue) <= 0) {
        responseMessage.push('Idea requires number of weeks of at least 0');
    }
    if (responseMessage.length > 0) {
        res.status(400).send(responseMessage);
    } else {
        next();
    }
});

ideasRouter.post('/', checkIdea, checkMillionDollarIdea, (req, res, next) => {
    const ideaData = req.body;
    const newIdea = addToDatabase('ideas', ideaData);
    if (newIdea) {
        res.status(201).send(newIdea);
    } else {
        res.status(500).send("Unable to create new idea");
    }
});

ideasRouter.put('/:ideaId', checkIdea, checkMillionDollarIdea, (req, res, next) => {
    const ideaData = req.body;
    ideaData.id = req.idea.id;
    const updatedIdea = updateInstanceInDatabase('ideas', ideaData);
    if (updatedIdea) {
        res.status(201).send(updatedIdea);
    } else {
        res.status(404).send();
    }
});

module.exports = ideasRouter;
