import { pool } from '../db.js';

export const getEmpleados = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM empleado JOIN rol ON empleado.id_rol = rol.id_rol"
    );
    console.log(JSON.stringify(result, null, 2));
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const agregarEmpleado = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Error al agregar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const editarEmpleado = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Error al editar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};

export const eliminarEmpleado = async (req, res) => {
  try {
    
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).send("Error interno del servidor");
  }
};
