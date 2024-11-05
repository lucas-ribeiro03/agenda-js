require('dotenv').config();

const express = require("express");
const app = express();

//Modelador de base de dados
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
.then(() => {
  console.log('Conectei a base de dados')
  app.emit('pronto');
}).catch(e => console.log(e));

//serve para salvar os dados do cliente
const session = require('express-session');

//Salva as sessões na base de dados
const MongoStore = require('connect-mongo');

//Mensagens de erro (salvas em sessão)
const flash = require('connect-flash');

// Rotas da aplicação
const routes = require('./routes');

const path = require('path');


const helmet = require('helmet');

//Proteção/Segurança 
const csrf = require('csurf');

//Funções executadas na rota (entre a execução de outras 2 funções)
const {middlewareGlobal, checkCsrfError, csrfMiddleware} = require('./src/middlewares/middleware');


app.use(helmet());


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Usado para acessar arquivos estáticos (css, imagens, bundle)
app.use(express.static(path.resolve(__dirname, 'public')))


app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' https://cdn.jsdelivr.net;");
  next();
});


//Configurações da sessão
const sessionOptions = session({
  secret: 'fwefwef',
  store: MongoStore.create({mongoUrl: process.env.CONNECTIONSTRING}),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 dias;
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flash());


app.set('views', './src/views');
// app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs')

// CSRF MIDDLEWARES
app.use(csrf());
app.use(checkCsrfError);
app.use(csrfMiddleware);


// MIDDLEWARES PROPRIOS
app.use(middlewareGlobal);
app.use(routes);


app.on('pronto', () => {
  app.listen(3000, () => {
    console.log("Acessar http://localhost:3000");
    console.log("Servidor executando na porta 3000");
  });
})