const chai = require('chai');
const chaiHttp = require('chai-http');
const { servidor } = require('../index.js');

chai.use(chaiHttp);

describe('Probando Respuesta de Servidor para método DELETE /anime/', () => {
    it('Comprueba que el método DELETE responde con código 200', (done) => {

        chai
            .request(servidor)
            .delete('/anime/5')
            .end((error, respuesta) => {
                chai.expect(respuesta).to.have.status(200);
                done();
            })
    })
})