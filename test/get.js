const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index.js');

chai.use(chaiHttp);

describe('Probando Respuesta de Servidor para método GET /anime', () => {
    it('Comprueba que el método GET responde con código 200', (done) => {

        chai
            .request(servidor)
            .get('/anime')
            .end((error, respuesta) => {
                chai.expect(respuesta).to.have.status(200);
                done();
            })
    })
})
