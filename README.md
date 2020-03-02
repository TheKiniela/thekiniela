<img src="https://github.com/TheKiniela/thekiniela/blob/master/public/images/kiniela-logo.png">
                                                        
Kiniela es una web de apuestas deportivas desarrollada en Node.js, utilizando Express.js y Mongo DB. Cada viernes a las 21:00 la web se actualiza con los partidos de la jornada de Liga y, a su vez, termina el período de apuestas para esa jornada.

La actualización de los partidos se realiza gracias al package cron, de npm, el cual permite programar acciones en el servidor para que se ejecuten de forma periódica.

```
let jobCreateGame = new CronJob('00 21 * * 5', function() {
    // Execute this every friday at 21,00h
    createGame();  
  });
  jobCreateGame.start();
```
Para cotejar resultados de usuarios, Kiniela se sirve de la API APIfootball. Al cargar la página, ejecuta una función que compara los datos del usuario con los resultados reales y suma 1 punto si son iguales.

## Dashboard

El dashboard de Kiniela se divide en tres:

- Primera columna: muestra los la Kiniela de la semana y permite al usuario hacer sus apuestas mediante un form con radio buttons que guardarán en la base de datos un array compuesto por 10 valores entre 1, X o 2.

- Segunda columna: muestra datos de la API APIfootball para ayudar al ususario a tomar decisiones relativas a las apuestas.

- Tercera columna: muestra información relativa al histórico de kinielas. Permite conmutar entre la puntuación del usuario en la última kiniela y el ranking de la última jornada.
