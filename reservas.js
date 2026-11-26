const express = require('express');
const router = express.Router();
const db = require('../db');


/**
 * @swagger
 * /api/reservas:
 *   get:
 *     summary: Obtiene todas las reservas
 *     tags: [Reservas]
 *     responses:
 *       200:
 *         description: Lista de reservas
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query(
            'SELECT * FROM reservas ORDER BY id'
        );

        res.status(200).json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar las reservas'
        });
    }
});


/**
 * @swagger
 * /api/reservas:
 *   post:
 *     summary: Crea una nueva reserva
 *     tags: [Reservas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_entrada:
 *                 type: string
 *                 format: date
 *               fecha_salida:
 *                 type: string
 *                 format: date
 *               habitacion_id:
 *                 type: integer
 *               huesped_id:
 *                 type: integer
 *             required:
 *               - fecha_entrada
 *               - fecha_salida
 *               - habitacion_id
 *               - huesped_id
 *     responses:
 *       201:
 *         description: Reserva creada correctamente
 */
router.post('/', async (req, res) => {
    try {
        const {
            fecha_entrada,
            fecha_salida,
            habitacion_id,
            huesped_id
        } = req.body;

        const query = `
            INSERT INTO reservas
            (fecha_entrada, fecha_salida, habitacion_id, huesped_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;

        const resultado = await db.query(query, [
            fecha_entrada,
            fecha_salida,
            habitacion_id,
            huesped_id
        ]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la reserva'
        });
    }
});

/**
 * @swagger
 * /api/reservas/{id}:
 *   put:
 *     summary: Actualiza una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fecha_entrada:
 *                 type: string
 *                 format: date
 *                 example: 2027-01-11
 *               fecha_salida:
 *                 type: string
 *                 format: date
 *                 example: 2027-01-16
 *               habitacion_id:
 *                 type: integer
 *                 example: 4
 *               huesped_id:
 *                 type: integer
 *                 example: 5
 *     responses:
 *       200:
 *         description: Reserva actualizada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al actualizar la reserva
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            fecha_entrada,
            fecha_salida,
            habitacion_id,
            huesped_id
        } = req.body;

        const query = `
            UPDATE reservas
            SET fecha_entrada = $1,
                fecha_salida = $2,
                habitacion_id = $3,
                huesped_id = $4
            WHERE id = $5
            RETURNING *
        `;

        const resultado = await db.query(query, [
            fecha_entrada,
            fecha_salida,
            habitacion_id,
            huesped_id,
            id
        ]);

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la reserva'
        });
    }
});

/**
 * @swagger
 * /api/reservas/{id}:
 *   delete:
 *     summary: Elimina una reserva
 *     tags: [Reservas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la reserva
 *     responses:
 *       200:
 *         description: Reserva eliminada correctamente
 *       404:
 *         description: Reserva no encontrada
 *       500:
 *         description: Error al eliminar la reserva
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await db.query(
            'DELETE FROM reservas WHERE id = $1 RETURNING *',
            [id]
        );

        res.status(200).json({
            mensaje: 'Reserva eliminada',
            registro: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la reserva'
        });
    }
});


module.exports = router;