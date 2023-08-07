const Login = require('../models/loginModel');

exports.index = (req, res) => {
    //console.log(req.session.user);
    if(req.session.user) return res.render('login-logado');
    res.render('login');
};

exports.register = async function(req, res) {
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


exports.login = async function(req, res) {
    //res.send(login.errors);
     try{
     const login = new Login(req.body);
     await login.login(); // espera o register resolver
 
     if(login.errors.length > 0)
     {
         req.flash('errors', login.errors);
         req.session.save(function()
         {
             return res.redirect('http://localhost:3009/login/index'); // redireciona a pagina de volta
         });
         return;
     }
 
     req.flash('success', 'Você entrou no sistema.');
     req.session.user = login.user;
     req.session.save(function()
     {
       return res.redirect('http://localhost:3009/login/index'); // redireciona a pagina de volta
     });  
     
 
 
     } catch(e){
         console.log(e);
         return res.render('404');
     }
     
 };

exports.logout = function(req, res)
{
    req.session.destroy();
    res.redirect('/');
}