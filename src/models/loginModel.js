const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    senha: {type: String, required: true}
})

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body
        this.errors = [];
        this.user = null;
    }

    async register(){
        this.valida();
        if(this.errors.length > 0) return;

        await this.userExists();
        if(this.errors.length > 0) return;
        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt)
        try{

            this.user = await LoginModel.create(this.body);
        } catch(e){
            console.log(e);
        }

    }

    async userExists(){
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(this.user) this.errors.push('Email já cadastrado');

    }

    async login(){
        this.valida();
        if(this.errors.length > 0) return;
        this.user = await LoginModel.findOne({ email: this.body.email });
        if(!this.user){
             this.errors.push('Email não está cadastrado, faça o cadastro acima.');
             return;
        }
        if(!bcryptjs.compareSync(this.body.senha, this.user.senha)){
            this.user = null;
            this.errors.push('Senha inválida');
            return;
        }
    }

    valida() {
        this.cleanUp();
        //Validação
        //O email precisa ser válido
        if (!validator.isEmail(this.body.email)){
            this.errors.push("Email inválido");
    }
        //Senha precisa ter entre 6 e 15 caractéres
        if(this.body.senha.length < 3 || this.body.senha.length > 16){
            this.errors.push('A senha deve ter entre 3 e 15 caractéres');

        } 
    }

    cleanUp(){
        for(let key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }
}

module.exports = Login;