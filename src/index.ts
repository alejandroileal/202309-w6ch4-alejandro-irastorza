import { createServer } from 'http';
import { program } from 'commander';

program.option('-p, --port <value>');

program.parse();
const options = program.opts();

const PORT = options.port || process.env.PORT || 3500;

const server = createServer((request, response) => {
  const url = new URL(request.url as string, `http://${request.headers.host}`);

  if (url.pathname !== '/calculator') {
    response.statusCode = 404;
    response.statusMessage = 'Error 404';
    response.write('Ups... Error 404');
    response.end();
    return;
  }

  const a = url.searchParams.get('a');
  const b = url.searchParams.get('b');

  if (!a || !b || isNaN(Number(a)) || isNaN(Number(b))) {
    response.statusCode = 400;
    response.statusMessage = 'Request not compatible';
    response.setHeader('Content-type', 'text/html');
    response.write(
      '<h1>Error... Verifica que has ingresado solo datos numericos</h1>'
    );
    response.end();
    return;
  }

  response.statusCode = 200;
  response.setHeader('Content-type', 'text/html');
  response.write(`
    <h1>Calculadora</h1>
    <p>${a} + ${b} = ${Number(a) + Number(b)}</p>
    <p>${a} - ${b} = ${Number(a) - Number(b)}</p>
    <p>${a} * ${b} = ${Number(a) * Number(b)}</p>
    <p>${a} / ${b} = ${Number(a) / Number(b)}</p>
  `);
  response.end();
});

server.listen(PORT);

server.on('listening', () => {
  console.log('Listening on port', PORT);
});

server.on('error', (error) => {
  console.log(error.message);
});
