require('dotenv').config(); // conexão

const express = require('express');
const app = express();

// conexão
const mongoose = require('mongoose');

mongoose.connect(process.env.CONNECTIONSTRING, {useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => {
    app.emit('pronto');
})
  .catch(e => console.log(e)); // em caso de erro
  
//Session e flash messages

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware'); // recebe;

// helmet
const helmet = require('helmet');
const csurf = require('csurf');

app.use(helmet());

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// front-end

//public
app.use(express.static(path.resolve(__dirname, 'public')));

//Session
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

app.use(session({
  secret: 'doo',
  resave: false,
  store: sessionStore,
  saveUninitialized: true
  }));

 app.use(flash()); // para mensagens

//views
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// previne o ataque
app.use(csurf());
// Nossos próprios middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
//app.use(outromiddleware);
app.use(routes);


app.on('pronto', () => {
  app.listen(3009, () => {
    console.log('Acessar http://localhost:3009');
    console.log('Servidor executando na porta 3009');
  });
  
})
