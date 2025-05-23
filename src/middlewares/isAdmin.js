export function isAdmin(req, res, next) {
    const user = req.session?.empleado || req.user  // para sesiones o JWT

    if (!user || user.rol_id !== 1) {
        return res.status(403).render('unauthorized') // o redirect o JSON
    }

    next()
}
