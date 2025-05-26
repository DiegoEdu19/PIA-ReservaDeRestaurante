import { pool } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const login = async (req, res) => {
    const { correo, contrasena } = req.body;
    console.log("📥 Datos recibidos:", req.body);

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    try {
        // Buscar usuario por correo
        const userResult = await pool.query(
            'SELECT id_empleado, correo, contrasena, id_rol FROM "empleado" WHERE correo = $1',
            [correo]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const user = userResult.rows[0];
        const storedPassword = user.contrasena;

        // Verificar si la contraseña hasheada es válida
        let isPasswordValid = await bcrypt.compare(contrasena, storedPassword);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generar token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.correo,
                rol_id: user.rol_id
            },
            process.env.JWT_SECRET || "mi_secreto",
            { expiresIn: "2h" }
        );

        // Enviar token en cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login exitoso",
            redirect: "/disponibilidad"
        });

    } catch (error) {
        console.error("❌ Error en login:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const methods = {
    login
};
