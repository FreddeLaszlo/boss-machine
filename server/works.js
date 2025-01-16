const express = require('express');
const worksRouter = express.Router({ mergeParams: true });

const {
    getAllFromDatabase,
    getFromDatabaseById,
    deleteFromDatabasebyId,
    addToDatabase,
    updateInstanceInDatabase
} = require('./db');

worksRouter.param('workId', (req, res, next, workId) => {
    const work = getFromDatabaseById('work', workId);
    if(!work) {
        res.status(404).send();
    } else if (work.minionId !== req.minion.id) {
        res.status(400).send();
    } else {
        req.work = work;
        next();
    }
});

worksRouter.get('/', (req, res, next) => {
    const allWork = getAllFromDatabase('work', req.minion.id);
    const arrayAllWork = Array.from(allWork);
    const minionWork = arrayAllWork.filter((w) => w.minionId === req.minion.id);
    res.send(minionWork);
});

worksRouter.delete('/:workId', (req, res, next) => {
    if(deleteFromDatabasebyId('work', req.work.id)) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
})

const checkWork = (req, res, next) => {
    const workData = req.body;
    let responseMessage = [];
    if (!workData.hasOwnProperty('title') || workData.title.length === 0) {
        responseMessage.push('Work requires a title');
    }
    if (!workData.hasOwnProperty('description')) {
        responseMessage.push('Work requires a description (can be empty');
    }
    if (!workData.hasOwnProperty('hours') || workData.hours.length === 0 || !Number.isFinite(+workData.hours) || Number(workData.hours) < 0) {
        responseMessage.push('Work requires hours of at least 0');
    }    
    if (responseMessage.length > 0) {
        res.status(400).send(responseMessage);
    } else {
        next();
    }
}

worksRouter.put('/:workId', checkWork, (req, res, next) => {
    const workData = req.body;
    const updatedWork = updateInstanceInDatabase('work', workData);
    if(updatedWork) {
        res.status(201).send(updatedWork);
    } else {
        res.status(500).send();
    }
});

worksRouter.post('/', checkWork, (req, res, next) => {
    const workData = req.body;
    console.log(workData);
    const newWork = addToDatabase('work', workData);
    if(newWork) {
        res.status(201).send(newWork);
    } else {
        res.status(500).send();
    }
});

module.exports = worksRouter;