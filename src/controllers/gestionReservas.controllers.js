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
        er.descripcion AS estado_nombre 
      FROM reserva r
      JOIN estado_reserva er ON r.id_estado = er.id_estado
      ORDER BY r.fecha, r.hora_inicio
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};

export const crearReservas = async (req, res) => {
    const { nombre, personas, fecha, hora, hora_fin, telefono, estado_id, id_restaurante } = req.body;
    if (!hora_fin) {
        return res.status(400).json({ error: "Debe proporcionar la hora de fin." });
    }
    if (!id_restaurante) {
        return res.status(400).json({ error: "Debe seleccionar restaurante." });
    }
    try {
        await pool.query(
            'INSERT INTO reserva (nombre, cantidad_personas, fecha, hora_inicio, hora_fin, telefono, id_estado, id_restaurante) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [nombre, personas, fecha, hora, hora_fin, telefono, estado_id, id_restaurante]
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
