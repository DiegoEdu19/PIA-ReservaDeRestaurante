import { pool } from '../db.js';
import { menuUpload } from '../multerConfig.js';

export const uploadMenuHandler = (req, res) => {
    menuUpload(req, res, async (err) => {
        try {
            // 1. Manejo de errores de Multer
            if (err) {
                console.error('Error en Multer:', err);
                return res.status(400).json({
                    success: false,
                    message: err.message.includes('PDF') ?
                        'Solo se permiten archivos PDF' :
                        'Error al procesar el archivo'
                });
            }
            // 2. Verificar que el archivo existe
            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: 'No se seleccionó ningún archivo'
                });
            }

            // 3. Verificación adicional del path
            if (!req.file.path) {
                throw new Error('Multer no generó la ruta del archivo');
            }

            // 4. Insertar en la base de datos (con ruta relativa)
            const relativePath = `menu/${req.file.filename}`;
            const dbResult = await pool.query(
                `INSERT INTO menu (archivo, id_restaurante)
                 VALUES ($1, $2)
                 RETURNING *`,
                [relativePath, 1]
            );

            res.json({
                success: true,
                data: dbResult.rows[0],
                fileInfo: {
                    originalName: req.file.originalname,
                    storedName: req.file.filename,
                    size: req.file.size
                }
            });

        } catch (error) {
            console.error('Error en el controlador:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    });
};