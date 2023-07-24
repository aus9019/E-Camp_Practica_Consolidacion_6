const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index.js');

chai.use(chaiHttp);

describe('Probando Respuesta de Servidor para método PUT /anime/', () => {
    it('Comprueba que el método PUT responde con código 200', (done) => {

        chai
            .request(servidor)
            .put('/anime/3')
            .send({
                "nombre": "Sailor Moon Crystal VERSIÓN NUEVA",
                "genero": "Shojo",
                "año": "2021",
                "autor": "Naoko Takeuchi"
            })
            .end((error, respuesta) => {
                chai.expect(respuesta).to.have.status(200);
                done();
            })
    })
})