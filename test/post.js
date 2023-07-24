const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index.js');

chai.use(chaiHttp);

describe('Probando Respuesta de Servidor para método POST /anime', () => {
    it('Comprueba que el método POST responde con código 200', (done) => {

        chai
            .request(servidor)
            .post('/anime')
            .send({
                "nombre": "NUEVO ANIME",
                "genero": "Shonen",
                "año": "2023",
                "autor": "Alexis Ugalde"
            })
            .end((error, respuesta) => {
                chai.expect(respuesta).to.have.status(200);
                done();
            })
    })
})