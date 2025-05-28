import {pool} from "../db.js";

export const getReporteReservas = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT fecha, COUNT(*) AS cantidad
            FROM reserva
            GROUP BY fecha
            ORDER BY fecha
        `);
        res.json(result.rows);
    } catch (error) {
        console.error("Error al generar reporte:", error);
        res.status(500).send("Error interno del servidor");
    }
};
