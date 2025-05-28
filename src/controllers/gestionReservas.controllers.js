import { pool } from '../db.js';

export const obtenerReservas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        r.id_reserva,
        r.nombre,
        r.apellido,
        r.cantidad_personas,  
        r.fecha,
        r.hora_inicio,        
        r.hora_fin,
        r.telefono,
        r.ocasion,            
        er.descripcion AS estado_nombre,
        rest.nombre AS restaurante_nombre
      FROM reserva r
      JOIN estado_reserva er ON r.id_estado = er.id_estado
      JOIN restaurante rest ON r.id_restaurante = rest.id_restaurante
      ORDER BY r.fecha, r.hora_inicio
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

export const crearReservas = async (req, res) => {
    const { nombre, cantidad_personas, fecha, hora_inicio, hora_fin, telefono, estado_id, id_restaurante } = req.body;
    if (!hora_fin) {
        return res.status(400).json({ error: "Debe proporcionar la hora de fin." });
    }
    if (!id_restaurante) {
        return res.status(400).json({ error: "Debe seleccionar restaurante." });
    }
    try {
        await pool.query(
            'INSERT INTO reserva (nombre, cantidad_personas, fecha, hora_inicio, hora_fin, telefono, id_estado, id_restaurante) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [nombre, cantidad_personas, fecha, hora_inicio, hora_fin, telefono, estado_id, id_restaurante]
        );
        res.status(201).json({ message: 'Reserva creada' });
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error al crear la reserva' });
    }
};

export const traerEstados = async (req, res) => {
    try {
        const resultado = await pool.query('SELECT id_estado, descripcion FROM estado_reserva');
        res.json(resultado.rows);
    } catch (error) {
        console.error('Error al obtener estados de reserva:', error);
        res.status(500).json({ message: 'Error al obtener estados de reserva' });
    }
};

export const eliminarReserva = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM reserva WHERE id_reserva = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        console.error('Error al eliminar reserva:', error);
        res.status(500).json({ message: 'Error al eliminar la reserva' });
    }
};

export const traerPorId = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM reserva WHERE id_reserva = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al obtener la reserva:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

export const editarReserva = async (req, res) => {
    const id = req.params.id;
    const {
        nombre,
        cantidad_personas,
        fecha,
        hora_inicio,
        hora_fin,
        telefono,
        estado_id,
        id_restaurante
    } = req.body;

    try {
        await pool.query(`
            UPDATE reserva
            SET nombre = $1,
                cantidad_personas = $2,
                fecha = $3,
                hora_inicio = $4,
                hora_fin = $5,
                telefono = $6,
                id_estado = $7,
                id_restaurante = $8
            WHERE id_reserva = $9
        `, [nombre, cantidad_personas, fecha, hora_inicio, hora_fin, telefono, estado_id, id_restaurante, id]);

        res.json({ message: 'Reserva actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({ error: 'Error al actualizar la reserva' });
    }
};
