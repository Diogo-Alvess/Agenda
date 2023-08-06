const Login = require('../models/loginModel');

exports.index = (req, res) => {
    res.render('login');
};

exports.register = async function(req, res) {
   //res.send(login.errors);
    try{
    const login = new Login(req.body);
    await login.register(); // espera o register resolver

    if(login.errors.length > 0)
    {
        req.flash('errors', login.errors);
        req.session.save(function()
        {
            return res.redirect('http://localhost:3009/login/index'); // redireciona a pagina de volta
        });
        return;
    }

    req.flash('success', 'Seu usuario foi criado com sucesso.');
    req.session.save(function()
    {
      return res.redirect('http://localhost:3009/login/index'); // redireciona a pagina de volta
    });  
    


    } catch(e){
        console.log(e);
        return res.render('404');
    }
    
};

