exports.middlewareGlobal = (req, res, next) => {
  res.locals.errors = req.flash('errors');
  res.locals.success = req.flash('success');
  next();
};

exports.outromiddleware = (req, res, next) => {
    console.log('sou seu outro middleware');
    next();
};

//codigo do erro
exports.checkCsrfError = (err, req, res, next) => {
    if(err){
      return res.render('404');
    }
    next();
  };
  
  exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  };