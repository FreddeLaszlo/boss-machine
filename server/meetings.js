const express = require("express");
const { getAllFromDatabase, deleteAllFromDatabase, createMeeting, addToDatabase } = require('./db');

const meetingsRouter = express.Router({ mergeParams: true });

meetingsRouter.get('/', (req, res, next) => {
    const data = getAllFromDatabase('meetings');
    res.send(data);
});

meetingsRouter.delete('/', (req, res, next) => {
    deleteAllFromDatabase('meetings');
    res.status(204).send();
})

meetingsRouter.post('/', (req, res, next) => {
    const newMeeting = createMeeting();
    if(addToDatabase('meetings', newMeeting)) {
        res.status(201).send(newMeeting);
    } else {
        res.status(500).send();
    }
})



module.exports = meetingsRouter;
