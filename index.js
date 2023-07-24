const http = require('http');
const { readFile, writeFile } = require('fs/promises');

const archivoAnime = './anime.json';

//* Función para LEER el contenido del archivo anime.json y devolverlo como un objeto:
async function leerAnime() {
    try {
        const contenido = await readFile(archivoAnime, 'utf8');
        return JSON.parse(contenido);
    } catch (error) {
        console.error('Error al intentar LEER el archivo', error);
        throw error;
    }
}

//* Función para GUARDAR el objeto anime en el archivo anime.json:
async function guardarAnime(anime) {
    try {
        await writeFile(archivoAnime, JSON.stringify(anime, null, 2), 'utf8');
    } catch (error) {
        console.error('Error al intentar GUARDAR el archivo', error);
        throw error;
    }
}

//* Creación del Servidor:
const servidor = http.createServer(async (req, res) => {
    const { method, url } = req;

    //* Método GET para lista completa de Animes:
    if (method === 'GET' && url === '/anime') {
        try {
            const anime = await leerAnime();

            res.statusCode = 200;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(anime, null, 2));
        } catch (error) {
            res.writeHead(500);
            res.end('Error del Servidor');
        }
    }

    //* Método GET para encontrar un Anime por nombre o Id:
    else if (method === 'GET' && url.startsWith('/anime/')) {
        try {
            const anime = await leerAnime();
            const parametro = decodeURIComponent(url.split('/')[2]);

            let resultado;
            if (isNaN(parametro)) {
                resultado = Object.values(anime).find((a) => a.nombre === parametro);
            } else {
                resultado = anime[parametro];
            }

            if (resultado) {
                res.statusCode = 200;
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(resultado, null, 2));
            } else {
                res.writeHead(404);
                res.end('Anime no encontrado');
            }
        } catch (error) {
            res.writeHead(500);
            res.end('Error del Servidor');
        }
    }

    //* Método POST para crear un nuevo Anime:
    else if (method === 'POST' && url === '/anime') {
        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', async () => {
            try {
                const nuevoAnime = JSON.parse(body);
                const anime = await leerAnime();
                const nuevoId = Object.keys(anime).length + 1;
                anime[nuevoId] = nuevoAnime;
                await guardarAnime(anime);

                res.statusCode = 200;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Anime creado con id ${nuevoId}`);
            } catch (error) {
                res.writeHead(500);
                res.end('Error del Servidor');
            }
        });
    }

    //* Método PUT para actualizar un Anime:
    else if (method === 'PUT' && url.startsWith('/anime/')) {
        const id = url.split('/')[2];

        let body = '';
        req.on('data', (data) => {
            body += data;
        });
        req.on('end', async () => {
            try {
                const animeActualizado = JSON.parse(body);
                const anime = await leerAnime();
                if (anime[id]) {
                    anime[id] = animeActualizado;
                    await guardarAnime(anime);
                    res.statusCode = 200;
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(`Anime con id ${id} actualizado`);
                } else {
                    res.end('Anime no encontrado');
                }
            } catch (error) {
                res.writeHead(500);
                res.end('Error del Servidor');
            }
        });
    }

    //* Método DELETE para eliminar un Anime:
    else if (method === 'DELETE' && url.startsWith('/anime/')) {
        const id = url.split('/')[2];

        try {
            const anime = await leerAnime();
            if (anime[id]) {
                delete anime[id];
                await guardarAnime(anime);
                res.statusCode = 200;
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(`Anime con id ${id} eliminado`);
            } else {
                res.writeHead(404);
                res.end('Anime no encontrado');
            }
        } catch (error) {
            res.writeHead(500);
            res.end('Error del Servidor');
        }
    }

    //* Si no coincide la ruta, se envía un Mensaje de Error:
    else {
        res.writeHead(404);
        res.end('Error al encontrar la Ruta');
    }
});

const PUERTO = 3000;
servidor.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el PUERTO: ${PUERTO}`);
});

module.exports = { servidor };
