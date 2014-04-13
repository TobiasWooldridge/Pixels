var color = require('../lib/color')

exports.index = function(req, res){
    res.render('index', { title: 'Pixels' });
};
