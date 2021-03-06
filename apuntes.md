# Para comenzar a configurar el nuevo proyecto:

1) Crear carpeta del proyecto (p.ej en el escritorio), en este caso se llama socketio_server

2) Arrastrar la carpeta al editor (p.ej usando visual studio code)

3) Abrir una terminal o bash, en visual studio code ya esta integrada y abre en la carpeta del proyecto

4) ejecutar el comando:
    `npm init --yes`

   Esto creará el archivo package.json con toda la información del proyecto y sus dependencias.

5) Instalar las dependencias del proyecto utilizando el comando:

    `npm install express socket.io`

    Esto instalará los módulos express y socket.io en la carpeta del proyecto.

6) Creamos el archivo index.js y escribimos tan solo un `console.log('Hello World');`

7) Editamos el archivo package json para colocar un nuevo script llamado `"start": "node index.js"`

8) Instalar el paquete nodemon como una dependencia de desarrollo, este paquete permite una manera mas sencilla de reiniciar la consola y lo instalamos como dependencia de desarrollo y no de producción, de esta forma se instalará en otra sección correspondiente a devDependencies. el comando para instalar es:
    `npm install nodemon -D`

9) Una vez instalado, agregamos un nuevo script al archivo package.json de la siguiente manera:
    `"dev":"nodemon index.js"`
    (puede ser cualquier nombre en lugar de dev)
    luego en la consola, para iniciar el servidor podemos utilizar el comando:
    `npm run dev`
    Esto iniciará la consola con el nuevo paquete y así cuando detecte que hacemos cambios en el código, éste reiniciará automáticamente el servidor.
    
# Para comenzar a desarrollar el código del servidor:

1) Comenzamos por configurar express, para ello requerimos el módulo con require() y lo ejecutamos almacenando el objeto que nos devuelve en una constante llamada app:
    ~~~
    const express = require('express');
    const app = express();
    ~~~

2) Establecemos una sección en nuestro archivo index.js que contendrá las configuraciones (app.set()) y ejecutamos allí la instrucción para configurar el puerto, indicandole que utilice el puerto preconfigurado por el sistema si existe alguno, o de otro modo utilice el puerto 3000:

    `app.set('port', process.env.PORT || 3000);`

    process.env.PORT es una variable del sistema operativo por asi decirlo...

3) Una vez configurado, indicamos la instrucción para escuchar el puerto:
    ~~~
    app.listen(app.get('port'), () => {
        console.log('Server started on port: ', app.get('port'));
    });
    ~~~

4) Observamos en la consola y ya el servidor debe estar iniciado en el puerto correspondiente, al entrar con el navegador a la URL: localhost:3000, se debe mostrar el mensaje 'Cannot GET /'.  Esto es debido a que no hemos configurado las rutas. Para ello creamos dentro del proyecto la carpeta public, que contendrá todos los archivos html, ccs y javascript correspondientes al front end, y dentro de ésta creamos el archivo index.html y tan solo escribimos de momento un sencillo hola mundo.

5) Incluimos un módulo de node.js llamado Path, el cual nos ayuda a facilitar el manejo de las rutas a los archivos.
    `const path = require('path');`

6) Creamos una sección en index.js, incluyendola antes de la instrucción que inicia el servidor; la cual en comentarios podemos llamar static files, para indicar que allí incluiremos instrucciones para enviar los archivos estáticos que el navegador tendrá que solicitar mediante peticiones a nuestro servidor. 
En esta sección colocamos la instrucción:

    `app.use(express.static(path.join(__dirname, 'public')));`

    Dicha instrucción indica que la ruta que express utilizará para los archivos estáticos será la que especificamos, y para ello usamos el módulo path para concatenar la ruta del directorio donde se encuentra nuestro proyecto (__dirname) y la carpeta public.

    Esto se podría hacer sin ocupar el módulo path, sin embargo en windows para especificar una ruta, se utiliza barra invertida, mientras que en otros sistemas se usa la barra sin invertir; entonces el módulo path nos ayuda a manejar estas cosas independientemente del sistema donde se ejecute nuestro servidor.

    Una vez hecho esto si refrescamos la página en el navegador vemos que nos muestra el index.html que habíamos creado previamente.

7) Una vez hecho esto ya podemos agregar un archivo css con nuestros estilos, por ejemplo main.css y relacionarlo a nuestra página web con la etiqueta `<link>` de html.
Igualmente podemos agregar un archivo de javascript e incluirlo a través de la etiqueta `<script>` de html.  Llamamos este archivo chat.js.

    Hasta este punto ya hemos configurado nuestro servidor para funcionar con los archivos html, css y javascript necesarios para el front end, así que comenzamos a desarrollar el código de nuestra aplicación usando el módulo socketio.

# Para comenzar a utilizar el módulo socket.io:

1) Empezamos por requerir el módulo con:
    `const SocketIo = require('socket.io');`

2) En la línea que inicia nuestro servidor, almacenamos nuestro servidor en una constante llamada server, así:
    ~~~
    const server = app.listen(app.get('port'), () => {
        console.log('Server started on port: ', app.get('port'));
    });
    ~~~

    luego, para configurar el módulo socket.io, necesitamos pasarle la configuración de nuestro servidor ya creado; para ello definimos despues de iniciar el servidor, lo siguiente:
    
    `const io = SocketIo(server);`

3) Hasta este punto el objeto io contiene toda la información acerca de la conexion con websockets, necesitamos ahora comenzar a definir los eventos que manejarán dicha conexión:
    Para el evento generado cuando un cliente se conecta:

    ~~~
    io.on('connection', () => {
        console.log('Client connected!');
    })
    ~~~

4) Ahora, podemos acceder a toda la configuración del socket a través del navegador utilizando la URL:
    localhost:3000/socket.io/socket.io.js
    Podemos ver que se trata de todo el código javascript necesario para que funcione la conexión por websocket, entonces necesitamos incluir este archivo en nuestro index.html a través de la etiqueta `<script>`, así:

        `<script type="text/javascript" src="socket.io/socket.io.js"></script>`

    NOTA!!: Esta etiqueta debe aparecer antes de solicitar el archivo chat.js

    Hecho esto, una vez que entremos al navegador, si observamos en las opciones de desarrollador de chrome, vemos que el servidor ha enviado el archivo sockets.io que contiene todo este código.  Podemos utilizarlo ahora, colocando en el archivo chat.js:

        io();

    Esta variable está disponible en todo nuestro html, así que al ejecutar esta instrucción podemos ver en la consola del servidor que se ha producido el evento de una nueva conexion y se ha mostrado el mensaje 'Client connected!'.

5) Cuando el cliente se conecta y se ejecuta en el servidor el evento 'connection', también se recibe la información del socket del cliente, entonces, recuperamos esa información agregando al evento lo siguiente:
    ~~~
    io.on('connection', (socket) => {
        console.log('Client connected!', socket.id);
    })
    ~~~

    De esta manera recibimos la información del socket del cliente en el parámetro socket de la función que se ejecuta al conectar, entonces la podemos usar para mostrar la información por consola en el servidor, por ejemplo con socket.id mostramos el id del socket del cliente y entonces para cada nueva ventana que abramos en el navegador con la URL del servidor, se creará una nueva conexion con un id diferente, y cada ventana podrá intercambiar datos con el servidor.

6) El objeto io() que ejecutamos recientemente en el archivo chat.js, podemos guardarlo en una constante llamada socket, para poder acceder a él desde el javascript que enviamos al cliente, así:

    `const socket = io();`

# Para escribir el código del chat:

1) Agregamos la interfaz del chat al archivo html con las secciones siguientes:

    ~~~
    <div id="chat-container">
        <div id="chat-window">
            <div id="output"></div>
            <div id="actions"></div>
        </div>
        <input type="text" id="userName" placeholder="User Name">
        <input type="text" id="message" placeholder="Message">
        <button id="send">Send</button>
    </div>
    ~~~

    La sección outputs se encargará de mostrar todos los mensajes que se vayan recibiendo, mientras que la sección de actions se encargará de mostrar algunos mensajes especiales, por ejemplo cuando un usuario está escribiendo un mensaje.

2) Definimos las variables siguientes en el javascript del cliente (chat.js)
    ~~~
    let message = document.getElementById('message');
    let username = document.getElementById('username');
    let btn = document.getElementById('send');
    let outputs = document.getElementById('outputs');
    let actions = document.getElementById('actions');
    ~~~

    (let en javascript define una variable de alcance local).

3) Continuamos creando un evento para el boton Send que se dispare al hacer click y que envíe los datos al servidor, así:
    ~~~
    btn.addEventListener('click', () => {
        socket.emit('chat:message', {
            username: username.value, 
            message: message.value
        });
    })
    ~~~

    socket.emit() envía a través del socket un nombre de evento (en este caso se ha colocado chat:message, aunque podría ser cualquier otro nombre para el evento) y además envia los datos en este caso a través de un objeto json; el cual contiene la información de los inputs username y message.

4) en nuestro servidor, en index.js ahora colocamos el código para que reaccione a este evento, para esto, dentro del evento 'connection'; donde ya tenemos definido el socket del cliente como socket, colocamos:
    ~~~
    io.on('connection', (socket) => {
        console.log('Client connected!', socket.id);
        socket.on('chat:message', (data) => {
            console.log(data);
        })
    })
    ~~~

    De esta manera, al recibir los datos que hemos enviado desde el navegador, el servidor dispara el evento 'chat:message' que hemos creado y muestra por consola los datos obtenidos, en este caso muestra el objeto json que contiene el username y el message.

5) En lugar de mostrar estos datos en la consola del servidor, queremos poder enviarlos a todos los usuarios que esten conectados, para esto, utilizamos el siguiente código:
    ~~~
    io.on('connection', (socket) => {
        console.log('Client connected!', socket.id);
        socket.on('chat:message', (data) => {
            io.socket.emit('chat:message', data);
        })
    })
    ~~~

    Observamos que se utiliza io.socket.emit(), ya que tomamos el objeto io, es decir la conexión completa y de esta manera enviamos a todos los clientes conectados.  También hemos utilizado el mismo nombre de evento 'chat:message' para emitir el mensaje de vuelta al cliente, aunque se pudo haber utilizado un nombre diferente, en todo caso en el cliente debemos recibirlo con el mismo nombre que se envió.

6) En el lado del cliente, para recibir estos datos y mostrarlos en la sección de outputs que hemos creado, utilizamos lo siguiente para definir un nuevo evento 'chat:message' (aunque se puede usar otro diferente)
    ~~~
    socket.on('chat:message', (data) => {  
        console.log(data);
        output.innerHTML += `<p><strong>${data.username}</strong>: ${data.message}</p>`
    });
    ~~~
    Las comillas invertidas se utilizan para colocar javascript dentro del texto con ${}.
    Si probamos este código en al menos dos ventanas del chat, podemos ver que los mensajes que enviemos desde cualquiera de las ventanas, aparecerán en todas las demás ventanas de los clientes conectados.

7) Podemos agregar otros eventos, por ejemplo cuando un usuario esté escribiendo un mensaje, agregamos el siguiente código en el javascript del cliente chat.js:
    ~~~
    message.addEventListener('keypress', () => {
        socket.emit('chat:typing' username.value);
    });
    ~~~
    De esta manera al tipear texto dentro del input del mensaje se estará disparando el evento keypress y se estará enviando el nombre del usuario que está escribiendo, etiquetado con el evento 'chat:typing'.  Entonces a través de este nombre podemos recibirlo en el servidor.

    7.1) En el evento 'keypress' del input del mensaje, también podemos chequear si se ha pulsado la tecla enter, de esta forma enviamos el mensaje al servidor al detectar esta tecla:
        
        message.addEventListener('keypress', (e) => {
            socket.emit('chat:typing', username.value);
            if (e.code=='Enter'){
                socket.emit('chat:message', {
                    username: username.value, 
                    message: message.value
                });
            }
        });
       

8) En el servidor, en index.js; agregamos la escucha al evento 'chat:typing', entonces:


        socket.on('chat:typing', (data) => {
            socket.broadcast.emit('chat:typing', data);
        })


    Al colocar socket.broadcast.emit() en lugar de solamente socket.emit(), estaremos emitiendo el mensaje a todos los clientes excepto al que envió el evento inicialmente. Esto es útil, ya que queremos que la información acerca de quien está escribiendo se envíe a todos los clientes excepto al que está escribiendo, ya que no es necesaria.  Nótese que de nuevo se utiliza el mismo nombre para el evento 'chat:typing', aunque pudo utilizarse un nombre distinto.

9) Ahora agregamos la escucha del evento 'chat:typing' en el lado del cliente en el archivo chat.js, así:

        socket.on('chat:typing', (data) => {  
            actions.innerHTML = `<p><em>${data} is typing a message...</em></p>`;
        });

10) Para que el mensaje de que el usuario está tipeando un mensaje no se quede en la sección de actions, podemos colocarlo en blanco al recibir el mensaje en el cliente, en el evento 'chat:message'

        actions.innerHTML = '';

