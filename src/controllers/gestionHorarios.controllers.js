import { pool } from '../db.js';

export const actualizarHorarios = async (req, res) => {
  const client = await pool.connect();
  try {
    const id_restaurante = parseInt(req.params.id, 10);
    const horarios = req.body;

    if (!Array.isArray(horarios) || horarios.length === 0) {
      return res.status(400).json({ mensaje: 'No se enviaron horarios para actualizar.' });
    }

    await client.query('BEGIN');

    await client.query('DELETE FROM horario_restaurante WHERE id_restaurante = $1', [id_restaurante]);

    for (const horario of horarios) {
      const { dia, abierto, hora_apertura, hora_cierre } = horario;

      if (abierto) {
        if (!hora_apertura || !hora_cierre) {
          throw new Error(`Faltan horas para el día ${dia}`);
        }
        await client.query(
          `INSERT INTO horario_restaurante 
            (dia, abierto, hora_apertura, hora_cierre, id_restaurante) 
            VALUES ($1, $2, $3, $4, $5)`,
          [dia, abierto, hora_apertura, hora_cierre, id_restaurante]
        );
      } else {
        await client.query(
          `INSERT INTO horario_restaurante 
            (dia, abierto, hora_apertura, hora_cierre, id_restaurante) 
            VALUES ($1, $2, $3, $4, $5)`,
          [dia, abierto, null, null, id_restaurante]
        );
      }
    }

    await client.query('COMMIT');
    res.json({ mensaje: 'Horarios actualizados correctamente' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al actualizar horarios:', error);
    res.status(500).json({ mensaje: 'Error actualizando horarios', error: error.message });
  } finally {
    client.release();
  }
};

export const obtenerHorarios = async (req, res) => {
  try {
    const id_restaurante = parseInt(req.params.id, 10);
    const result = await pool.query(
      'SELECT dia, abierto, hora_apertura, hora_cierre FROM horario_restaurante WHERE id_restaurante = $1 ORDER BY dia',
      [id_restaurante]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener horarios', error: error.message });
  }
};