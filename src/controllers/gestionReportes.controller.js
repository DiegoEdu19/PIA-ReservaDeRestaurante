import {pool} from "../db.js";

export const getDatosReservas = async (req, res) => {
    try {
        const datosReserva = await pool.query(
            "SELECT COUNT(*) FROM reserva"
        );
        console.log(JSON.stringify(result.rows, null, 2));
        res.json(res.rows);
    } catch (error) {
        console.error("Error al obtener empleados:", error);
        res.status(500).send("Error interno del servidor");
    }
};

export const getDatosUsuarios = async (req, res) => {
    try {
        const datosUsuarios = await pool.query(
            "SELECT COUNT(*) FROM empleado"
        );
        console.log(JSON.stringify(result.rows, null, 2));
        res.json(res.rows);
    } catch (error) {}
};

export const getHorarios = async (req, res) => {
    try {
        const datosHorarios = await pool.query(
            "SELECT hora_inicio AND hora_fin FROM reserva"
        );
        console.log(JSON.stringify(result.rows, null, 2));
        res.json(res.rows)
    } catch (error) {}
}