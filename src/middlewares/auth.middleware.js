import jwt from 'jsonwebtoken';

export function verifyToken(req, res, next) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Acceso denegado. No hay token' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mi_secreto');
        console.log("🔐 Usuario autenticado:", decoded); // 🔍 TEMPORAL
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido' });
    }
}
export function isAdmin(req, res, next) {
    if (req.user?.id_rol === 1) return next();
    return res.status(403).json({ error: 'Solo administradores pueden acceder' });
}
