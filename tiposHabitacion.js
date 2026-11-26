const express = require('express');
const router = express.Router();
const db = require('../db');


/**
 * @swagger
 * /api/tipos-habitacion:
 *   get:
 *     summary: Obtiene todos los tipos de habitación
 *     tags: [Tipos de Habitación]
 *     responses:
 *       200:
 *         description: Lista obtenida correctamente
 */
router.get('/', async (req, res) => {
    try {
        const resultado = await db.query(
            'SELECT * FROM tipos_habitacion ORDER BY id'
        );

        res.status(200).json(resultado.rows);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al consultar los tipos de habitación'
        });
    }
});


/**
 * @swagger
 * /api/tipos-habitacion:
 *   post:
 *     summary: Crea un nuevo tipo de habitación
 *     tags: [Tipos de Habitación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio_noche:
 *                 type: number
 *               capacidad_maxima:
 *                 type: integer
 *             required:
 *               - nombre
 *               - precio_noche
 *               - capacidad_maxima
 *     responses:
 *       201:
 *         description: Tipo de habitación creado
 */
router.post('/', async (req, res) => {
    try {
        const {
            nombre,
            precio_noche,
            capacidad_maxima
        } = req.body;

        const query = `
            INSERT INTO tipos_habitacion
            (nombre, precio_noche, capacidad_maxima)
            VALUES ($1, $2, $3)
            RETURNING *
        `;

        const resultado = await db.query(query, [
            nombre,
            precio_noche,
            capacidad_maxima
        ]);

        res.status(201).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al crear el tipo de habitación'
        });
    }
});

/**
 * @swagger
 * /api/tipos-habitacion/{id}:
 *   put:
 *     summary: Actualiza un tipo de habitación
 *     tags: [Tipos de Habitación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de habitación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               precio_noche:
 *                 type: number
 *               capacidad_maxima:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Tipo de habitación actualizado correctamente
 *       404:
 *         description: Tipo de habitación no encontrado
 *       500:
 *         description: Error al actualizar el tipo de habitación
 */
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const {
            nombre,
            precio_noche,
            capacidad_maxima
        } = req.body;

        const query = `
            UPDATE tipos_habitacion
            SET nombre = $1,
                precio_noche = $2,
                capacidad_maxima = $3
            WHERE id = $4
            RETURNING *
        `;

        const resultado = await db.query(query, [
            nombre,
            precio_noche,
            capacidad_maxima,
            id
        ]);

        res.status(200).json(resultado.rows[0]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al actualizar'
        });
    }
});

/**
 * @swagger
 * /api/tipos-habitacion/{id}:
 *   delete:
 *     summary: Elimina un tipo de habitación
 *     tags: [Tipos de Habitación]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del tipo de habitación
 *     responses:
 *       200:
 *         description: Tipo de habitación eliminado correctamente
 *       404:
 *         description: Tipo de habitación no encontrado
 *       500:
 *         description: Error al eliminar el tipo de habitación
 */
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await db.query(
            'DELETE FROM tipos_habitacion WHERE id = $1 RETURNING *',
            [id]
        );

        res.status(200).json({
            mensaje: 'Tipo de habitación eliminado',
            registro: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al eliminar'
        });
    }
});


module.exports = router;