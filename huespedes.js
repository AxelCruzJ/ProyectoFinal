const express = require('express');
const router = express.Router();
const db = require('../db');


/**
 * @swagger
 * /api/huespedes:
 *   get:
 *     summary: Obtiene todos los huéspedes
 *     tags: [Huéspedes]
 *     responses:
 *       200:
 *         description: Lista de huéspedes
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query(
            'SELECT * FROM huespedes ORDER BY id'
        );

        res.status(200).json(resultado.rows);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar huéspedes'
        });
    }
});


/**
 * @swagger
 * /api/huespedes:
 *   post:
 *     summary: Registra un huésped
 *     tags: [Huéspedes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               identificacion:
 *                 type: string
 *               telefono:
 *                 type: string
 *             required:
 *               - nombre
 *               - identificacion
 *               - telefono
 *     responses:
 *       201:
 *         description: Huésped creado
 */
router.post('/', async (req, res) => {
    try {
        const {
            nombre,
            identificacion,
            telefono
        } = req.body;

        const query = `
            INSERT INTO huespedes
            (nombre, identificacion, telefono)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const resultado = await db.query(query, [
            nombre,
            identificacion,
            telefono
        ]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al registrar huésped'
        });
    }
});

/**
 * @swagger
 * /api/huespedes/{id}:
 *   put:
 *     summary: Actualiza un huésped
 *     tags: [Huéspedes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del huésped
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               identificacion:
 *                 type: string
 *               telefono:
 *                 type: string
 *     responses:
 *       200:
 *         description: Huésped actualizado correctamente
 *       404:
 *         description: Huésped no encontrado
 *       500:
 *         description: Error al actualizar el huésped
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            identificacion,
            telefono
        } = req.body;

        const query = `
            UPDATE huespedes
            SET nombre = $1,
                identificacion = $2,
                telefono = $3
            WHERE id = $4
            RETURNING *
        `;

        const resultado = await db.query(query, [
            nombre,
            identificacion,
            telefono,
            id
        ]);

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar huésped'
        });
    }
});

/**
 * @swagger
 * /api/huespedes/{id}:
 *   delete:
 *     summary: Elimina un huésped
 *     tags: [Huéspedes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del huésped
 *     responses:
 *       200:
 *         description: Huésped eliminado correctamente
 *       404:
 *         description: Huésped no encontrado
 *       500:
 *         description: Error al eliminar el huésped
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await db.query(
            'DELETE FROM huespedes WHERE id = $1 RETURNING *',
            [id]
        );

        res.status(200).json({
            mensaje: 'Huésped eliminado',
            registro: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar huésped'
        });
    }
});


module.exports = router;