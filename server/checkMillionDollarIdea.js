const checkMillionDollarIdea = (req, res, next) => {
    const { numWeeks, weeklyRevenue} = req.body;
    const totalAmount = Number(numWeeks) * Number(weeklyRevenue);
    if (totalAmount >= 1000000) {
        next();
    } else {
        res.status(400).send('Idea value should be greater than 1 million USD')
    }
};

// Leave this exports assignment so that the function can be used elsewhere
module.exports = checkMillionDollarIdea;
