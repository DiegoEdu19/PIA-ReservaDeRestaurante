import {pool} from "../db.js";

export const crearReserva = async (req, res) => {
    const {
        nombre,
        apellido,
        cantidad_personas,
        fecha,
        hora_inicio,
        telefono,
        ocasion,
        id_estado,
        id_restaurante
    } = req.body;

    if (!id_restaurante) {
        return res.status(400).json({ error: "Debe seleccionar restaurante." });
    }

    try {
        await pool.query(
            `INSERT INTO reserva (nombre, apellido, cantidad_personas, fecha, hora_inicio, telefono, ocasion, id_estado, id_restaurante)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [nombre, apellido, cantidad_personas, fecha, hora_inicio, telefono, ocasion, id_estado, id_restaurante]
        );
        res.status(201).json({ message: 'Reserva creada' });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error al crear la reserva' });
    }
};
