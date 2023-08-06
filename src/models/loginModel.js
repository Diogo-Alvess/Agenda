const mongoose = require('mongoose');  // importa
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }  // componentes do model
  
});

const LoginModel = mongoose.model('Login', LoginSchema); // cria o model

class Login{

  constructor(body) {
    this.body = body; //body disponivel em todos os metodos da classe
    this.errors = [];// flag de erros
    this.user = null;
  }

  async register () // quem chamou não precisa esperar por sua execução e ela pode continuar normalmente sem bloquear a aplicação
  {
    this.valida();
    if(this.errors.length > 0) return; // nao loga o usuario se tiver um erro

    await this.userExists();

    if(this.errors.length > 0) return; // tem que checar de nivo se existe algum erro

    /// criptografia
    const salt = bcryptjs.genSaltSync();
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    try{
    
    this.user =  await LoginModel.create(this.body); // registra na base dados

    } catch(e) {
      console.log(e);
    }
  }

  async userExists(){

    const user = await LoginModel.findOne({email: this.body.email}); // encontra um registro na base de dados 

    if(user) this.errors.push('Usuário ja existe.'); // se o usuario for preenchido
  }

  valida()
  {
    this.cleanUp();
    // valida dos campos
    // O email precisa ser valido
    if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido'); // se o email nao for valido

    // a senha precisa ter entre 3 e 50 caracteres
    if(this.body.password.length < 3 || this.body.password.length >= 50)
    {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }

  }

  cleanUp() {
    for(const key in this.body)
    {
      if (typeof this.body[key] !== 'string')  //checa
        {this.body[key] = '';}
    }

    this.body = {
      email: this.body.email,
      password: this.body.password  // garante que o objeto ira ter somente os campos que eu quero 
    };
  }
}

module.exports = Login;

