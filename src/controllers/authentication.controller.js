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

        let isPasswordValid = false;

        // Comprobar si la contraseña almacenada está en texto plano
        const isPlainText = storedPassword === contrasena;

            if (isPlainText) {
                console.log("⚠️ Contraseña en texto plano detectada. Hasheando y actualizando...");

                // Hashear contraseña
                const hashedPassword = await bcrypt.hash(contrasena, 10);

                // Actualizar contraseña en la base de datos
                await pool.query(
                    'UPDATE "empleado" SET contrasena = $1 WHERE correo = $2',
                    [hashedPassword, correo]
                );

            isPasswordValid = true; // Ya validamos que coinciden
        } else {
            // Verificar si la contraseña hasheada es válida
            isPasswordValid = await bcrypt.compare(contrasena, storedPassword);
        }

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
            redirect: "/gestionReservas"
        });

    } catch (error) {
        console.error("❌ Error en login:", error.message);
        return res.status(500).json({ error: "Error interno del servidor" });
    }
};

export const methods = {
    login
};
