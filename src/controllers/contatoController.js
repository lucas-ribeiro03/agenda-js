const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render ('contato', {contato: {}});
}

exports.register = async (req, res) => {
    try{
        const contato = new Contato(req.body);
        await contato.register();
    
        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            console.log('nao salvei')
            req.session.save(function(){
                return res.redirect('/contato/index');
            });
            return;
        }
        console.log('contato salvo')
        req.flash('success', 'Contato cadastrado com sucesso');
                req.session.save(function(){
                    return res.redirect(`/contato/index/${contato.contato._id}`);
                });
                return;

    } catch(e){
        console.log(e)
    }
}

exports.editIndex = async function(req, res) {
    if(!req.params.id) return res.render('404');
    const contato = await Contato.buscaPorId(req.params.id)
    if(!contato) return res.render('404');

    res.render('contato', {contato});
}

exports.edit = async function(req, res) {
    try{
        if(!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        await contato.edit(req.params.id);
    
        if(contato.errors.length > 0){
            req.flash('errors', contato.errors);
            console.log('tem erro ainda');
            console.log(contato.errors);
            req.session.save(function(){
                return res.redirect(`/contato/index/${req.params.id}`);
            });
            return;
        }
        console.log('contato editado')
        req.flash('success', 'Contato editado com sucesso');
                req.session.save(function(){
                    return res.redirect(`/contato/index/${contato.contato._id}`);
                });
                return;
    } catch(e){
        console.log(e);
        res.render('404');
    }
}

exports.delete = async function(req, res){
    if(!req.params.id) return res.render('404');
    const contato = await Contato.delete(req.params.id)
    if(!contato) return res.render('404');

    req.flash('success', 'Contato excluido com sucesso')
    req.session.save(function(){
        return res.redirect('/contato/index');
    })
}

