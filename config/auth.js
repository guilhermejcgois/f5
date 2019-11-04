export default {
  ensureAuthenticated: function(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'You do not have permission to view this page. Please log in.');
    res.redirect('/users/login');
  }
}