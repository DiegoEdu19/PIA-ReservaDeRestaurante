import { pool } from '../db.js';

export const actualizarCapacidad = async (req, res) => {
   try {
    const { id_restaurante, capacidad_por_reserva } = req.body;

    // Validaciones simples
    if (!id_restaurante || !capacidad_por_reserva) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }

    // Convertir a número para evitar errores de tipo si vienen como string
    const capacidad = Number(capacidad_por_reserva);
    const restauranteId = Number(id_restaurante);

    // Verificar que sean números válidos
    if (isNaN(capacidad) || isNaN(restauranteId)) {
      return res.status(400).json({ mensaje: 'Datos inválidos (no numéricos)' });
    }

    // Actualizar la capacidad en todos los días del restaurante
    const resultado = await pool.query(
      `UPDATE horario_restaurante 
       SET capacidad = $1 
       WHERE id_restaurante = $2`,
      [capacidad, restauranteId]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({ mensaje: 'No se encontró el restaurante para actualizar' });
    }

    res.json({ mensaje: 'Capacidad actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar capacidad:', error);
    res.status(500).json({ mensaje: 'Error al actualizar capacidad', error: error.message });
  }
};