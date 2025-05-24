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
    console.error('Error al obtener reservas:', error); // ¡Lee esto en tu terminal!
    res.status(500).json({ mensaje: 'Error al obtener reservas' });
  }
};