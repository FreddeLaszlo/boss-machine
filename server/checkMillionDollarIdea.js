const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue } = req.body;
    const total = Number(numWeeks) * Number(weeklyRevenue);
    if (!numWeeks || !weeklyRevenue || isNaN(total) || total < 1000000) {
      res.status(400).send("Not enough money");
    } else {
      next();
    }
  }

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
