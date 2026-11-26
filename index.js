const express = require('express');
const cors = require('cors');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const tiposHabitacionRoutes = require('./routes/tiposHabitacion');
const habitacionesRoutes = require('./routes/habitaciones');
const huespedesRoutes = require('./routes/huespedes');
const reservasRoutes = require('./routes/reservas');


const app = express();

app.use(cors());
app.use(express.json());


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'API - Sistema de Reservas de Hotel',
            version: '1.0.0',
            description:
                'API REST para administrar tipos de habitación, habitaciones, huéspedes y reservas de un hotel.'
        },

        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },

    apis: ['./routes/*.js']
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
);


app.use(
    '/api/tipos-habitacion',
    tiposHabitacionRoutes
);

app.use(
    '/api/habitaciones',
    habitacionesRoutes
);

app.use(
    '/api/huespedes',
    huespedesRoutes
);

app.use(
    '/api/reservas',
    reservasRoutes
);


const PUERTO = 3000;

app.listen(PUERTO, () => {
    console.log(
        `Servidor corriendo en http://localhost:${PUERTO}`
    );

    console.log(
        `Swagger disponible en http://localhost:${PUERTO}/api-docs`
    );
});