const express = require('express');
const router = express.Router();
const db = require('../db');


/**
 * @swagger
 * /api/habitaciones:
 *   get:
 *     summary: Obtiene todas las habitaciones
 *     tags: [Habitaciones]
 *     responses:
 *       200:
 *         description: Lista de habitaciones
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query(
            'SELECT * FROM habitaciones ORDER BY id'
        );

        res.status(200).json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar habitaciones'
        });
    }
});


/**
 * @swagger
 * /api/habitaciones:
 *   post:
 *     summary: Registra una nueva habitación
 *     tags: [Habitaciones]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_cuarto:
 *                 type: string
 *               estado:
 *                 type: string
 *               tipo_habitacion_id:
 *                 type: integer
 *             required:
 *               - numero_cuarto
 *               - estado
 *               - tipo_habitacion_id
 *     responses:
 *       201:
 *         description: Habitación creada
 */
router.post('/', async (req, res) => {
    try {
        const {
            numero_cuarto,
            estado,
            tipo_habitacion_id
        } = req.body;

        const query = `
            INSERT INTO habitaciones
            (numero_cuarto, estado, tipo_habitacion_id)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const resultado = await db.query(query, [
            numero_cuarto,
            estado,
            tipo_habitacion_id
        ]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear la habitación'
        });
    }
});

/**
 * @swagger
 * /api/habitaciones/{id}:
 *   put:
 *     summary: Actualiza una habitación
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la habitación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               numero_cuarto:
 *                 type: string
 *               estado:
 *                 type: string
 *                 example: limpia
 *               tipo_habitacion_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Habitación actualizada correctamente
 *       404:
 *         description: Habitación no encontrada
 *       500:
 *         description: Error al actualizar la habitación
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            numero_cuarto,
            estado,
            tipo_habitacion_id
        } = req.body;

        const query = `
            UPDATE habitaciones
            SET numero_cuarto = $1,
                estado = $2,
                tipo_habitacion_id = $3
            WHERE id = $4
            RETURNING *
        `;

        const resultado = await db.query(query, [
            numero_cuarto,
            estado,
            tipo_habitacion_id,
            id
        ]);

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar la habitación'
        });
    }
});

/**
 * @swagger
 * /api/habitaciones/{id}:
 *   delete:
 *     summary: Elimina una habitación
 *     tags: [Habitaciones]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la habitación
 *     responses:
 *       200:
 *         description: Habitación eliminada correctamente
 *       404:
 *         description: Habitación no encontrada
 *       500:
 *         description: Error al eliminar la habitación
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await db.query(
            'DELETE FROM habitaciones WHERE id = $1 RETURNING *',
            [id]
        );

        res.status(200).json({
            mensaje: 'Habitación eliminada',
            registro: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar la habitación'
        });
    }
});


module.exports = router;