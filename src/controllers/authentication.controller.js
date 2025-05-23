import { pool } from "../db.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const login = async (req, res) => {
    const { correo, contrasena } = req.body
    console.log("📥 Datos recibidos:", req.body)

    if (!correo || !contrasena) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" })
    }

    try {
        const userResult = await pool.query(
            'SELECT * FROM "empleado" WHERE correo = $1 AND contrasena = $2'
            [correo, contrasena]
        )

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" })
        }

        const user = userResult.rows[0]
        console.log(" Usuario encontrado:", user.correo, user.contrasena)

        console.log(" Hash en DB:", user.contrasena)

        const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena)
        console.log(" ¿Contraseña válida?", isPasswordValid)

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Contraseña incorrecta" })
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.correo,
                rol_id: user.rol_id
            },
            process.env.JWT_SECRET || "mi_secreto",
            { expiresIn: "2h" }
        )

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 2 * 60 * 60 * 1000 
        })

        const redirectUrl =  "/disponibilidad"

        return res.status(200).json({
            message: "Login exitoso",
            redirect: redirectUrl
        })

    } catch (error) {
        console.error(" Error en login:", error.message)
        return res.status(500).json({ error: "Error interno del servidor" })
    }
}

export const methods = {
    login
}
