var models = require('../models/models.js');

exports.load = function(req, res, next, quizId) {
    models.Quiz.find(quizId).then(
        function(quiz) {
            if (quiz) {
                req.quiz = quiz;
                next();    
            } else {
                next(new Error('No existe quizId=' + quizId));
            }
        }
    ).catch(function(error) { 
        next(error);
    });
};

exports.index = function(req, res) {
    models.Quiz.findAll().then(function(quizes) {
        res.render('quizes/index', {quizes: quizes, errors: []});
    }).catch(function(error) { 
        next(error);
    })
};

exports.show = function(req, res) {
    res.render('quizes/show', { quiz: req.quiz, errors: []});
};

exports.answer = function(req, res) {
    var resultado = 'Incorrecto';
        if (req.query.respuesta === req.quiz.respuesta){
            resultado = 'Correcto'
        }
        res.render('quizes/answer', {   quiz: req.quiz, 
                                        respuesta: resultado,
                                        erros: []
                                    });
};

exports.search = function(req, res, next) {

    var busq = req.query.search;
    if(busq != null){
        busq = '%'+busq.replace(/\s/g,"%")+'%';
    }

    models.Quiz.findAll({where: ["pregunta like ?", busq]})
        .then(function(quizes) {
            res.render('quizes/search', {quizes : quizes});
        }).catch(function(error) {
            next(error);
        });
};

exports.new = function(req, res) {
    var quiz = models.Quiz.build(
        {pregunta: "Pregunta", respuesta: "Respuesta"}
    );

    res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res){
    var quiz = models.Quiz.build( req.body.quiz);

    quiz.validate().then(function(error) {
        if (error) {
            res.render('quizes/new', {quiz: quiz, errors: error.errors});
        }else{
            quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
                res.redirect('/quizes');
            })
        }
    });
};

