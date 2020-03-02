<img src="https://github.com/TheKiniela/thekiniela/blob/master/public/images/kiniela-logo.png">
                                                        
Kiniela es una web de apuestas deportivas desarrollada en Node.js, utilizando Express.js y Mongo DB. Cada viernes a las 21:00 la web se actualiza con los partidos de la jornada de Liga y, a su vez, termina el período de apuestas para esa jornada.

La actualización de los partidos se realiza gracias al package cron, de npm, el cual permite programas acciones en el servicor de forma sencilla.

```
let jobCreateGame = new CronJob('00 21 * * 5', function() {
    // Execute this every friday at 21,00h
    createGame();  
  });
  jobCreateGame.start();
```
