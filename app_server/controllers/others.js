// export the index method
module.exports.about = function(req, res) {
    // render (view, data)
    res.render('generic-text', {title: 'About'} );
};
