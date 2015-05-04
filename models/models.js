var path = require('path');

// Cargar modelo ORM
var Sequelize = require('sequelize');

var sequelize = new Sequelize(null, null, null,
                             {dialect: "sqlite", storage: "quiz.sqlite"}
                             );

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; //Exportar definición de la tabla Quiz

// Crear e inicializar la tabla de preguntas en DB
sequelize.sync().success(function() {
    Quiz.count().success(function(count){
        if (count == 0) {
            Quiz.create({ pregunta: 'Capital de Italia',
                          respuesta: 'Roma'
                        })
            .success(function(){ console.log('Base de datos inicializada')});
        };
    });
});