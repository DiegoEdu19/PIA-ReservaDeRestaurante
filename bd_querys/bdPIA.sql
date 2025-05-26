-- Procedimiento #1 (Cursor)  Corregir correos inválidos de empleados
CREATE TABLE IF NOT EXISTS correos_corregidos (
    id_empleado INTEGER,
    correo_anterior VARCHAR(255),
    correo_nuevo VARCHAR(255)
);
CREATE OR REPLACE PROCEDURE corregir_correos_invalidos_web()
LANGUAGE plpgsql
AS $$
DECLARE
    cur_empleado CURSOR FOR
        SELECT id_empleado, nombre, apellidos, correo
        FROM empleado;

    fila RECORD;
    nuevo_correo VARCHAR;
BEGIN
    TRUNCATE TABLE correos_corregidos;

    OPEN cur_empleado;

    LOOP
        FETCH cur_empleado INTO fila;
        EXIT WHEN NOT FOUND;

        IF POSITION('@' IN fila.correo) = 0 THEN
            nuevo_correo := LOWER(REPLACE(fila.nombre, ' ', '')) || '.' ||
                            LOWER(REPLACE(fila.apellidos, ' ', '')) || '@restaurante.com';

            UPDATE empleado
            SET correo = nuevo_correo
            WHERE id_empleado = fila.id_empleado;

            INSERT INTO correos_corregidos (id_empleado, correo_anterior, correo_nuevo)
            VALUES (fila.id_empleado, fila.correo, nuevo_correo);
        END IF;
    END LOOP;

    CLOSE cur_empleado;
END;
$$;
CALL corregir_correos_invalidos_web();
SELECT * FROM correos_corregidos;


-- Procedimiento #2 (Cursor) Para definir la demanda de los restaurantes
-- Crear tabla para demanda de restaurante
CREATE TABLE demanda_restaurante (
    id_restaurante INTEGER PRIMARY KEY,
    nombre VARCHAR(255),
    cantidad_reservas INTEGER,
    clasificacion VARCHAR(50)
);
-- Crear el procedimiento
CREATE OR REPLACE PROCEDURE analizar_demanda_restaurantes()
LANGUAGE plpgsql
AS $$
DECLARE
    restaurante_cursor CURSOR FOR
        SELECT id_restaurante, nombre FROM restaurante;

    rec RECORD;
    cantidad_reservas INTEGER;
    clasificacion TEXT;
BEGIN
    -- Limpiar la tabla auxiliar antes de llenarla
    TRUNCATE TABLE demanda_restaurante;

    -- Abrimos el cursor
    OPEN restaurante_cursor;

    LOOP
        FETCH restaurante_cursor INTO rec;
        EXIT WHEN NOT FOUND;

        -- Contar las reservas del restaurante actual
        SELECT COUNT(*) INTO cantidad_reservas
        FROM reserva
        WHERE id_restaurante = rec.id_restaurante;

        -- Decisión según la cantidad de reservas
        IF cantidad_reservas = 0 THEN
            clasificacion := 'Sin demanda';
        ELSIF cantidad_reservas BETWEEN 1 AND 10 THEN
            clasificacion := 'Demanda media';
        ELSE
            clasificacion := 'Alta demanda';
        END IF;

        -- Insertar en la tabla auxiliar
        INSERT INTO demanda_restaurante (
            id_restaurante, nombre, cantidad_reservas, clasificacion
        ) VALUES (
            rec.id_restaurante, rec.nombre, cantidad_reservas, clasificacion
        );
    END LOOP;

    -- Cerrar el cursor
    CLOSE restaurante_cursor;
END;
$$;

CALL analizar_demanda_restaurantes();


-- Procedimiento #3 
CREATE TABLE IF NOT EXISTS resumen_reservas (
    nombre VARCHAR(100),
    apellido VARCHAR(100),
    cantidad_personas INTEGER,
    tipo_reserva VARCHAR(20)
);
CREATE OR REPLACE PROCEDURE revisar_reservas_grandes_web()
LANGUAGE plpgsql
AS $$
DECLARE
    cur_reserva CURSOR FOR 
        SELECT cantidad_personas, nombre, apellido FROM reserva;

    r RECORD;
    tipo TEXT;
BEGIN
    TRUNCATE TABLE resumen_reservas;

    OPEN cur_reserva;

    LOOP
        FETCH cur_reserva INTO r;
        EXIT WHEN NOT FOUND;

        IF r.cantidad_personas > 8 THEN
            tipo := 'Importante';
        ELSE
            tipo := 'Regular';
        END IF;

        INSERT INTO resumen_reservas(nombre, apellido, cantidad_personas, tipo_reserva)
        VALUES (r.nombre, r.apellido, r.cantidad_personas, tipo);
    END LOOP;

    CLOSE cur_reserva;
END;
$$;
CALL revisar_reservas_grandes_web();
SELECT * FROM resumen_reservas;


-- Vista #1 Muestra el número de reservas de cada restaurante organizada por estados
CREATE VIEW vista_reservas_por_estado AS
SELECT 
    r.nombre AS nombre_restaurante,
    er.descripcion AS estado_reserva,
    COUNT(res.id_reserva) AS total_reservas
FROM reserva res
JOIN restaurante r ON res.id_restaurante = r.id_restaurante
JOIN estado_reserva er ON res.id_estado = er.id_estado
GROUP BY r.nombre, er.descripcion
ORDER BY r.nombre, total_reservas DESC;


-- Vista #2 Vista general de reservas, se utiliza en el CRUD directamente
CREATE VIEW vista_reservas AS
SELECT
    r.id_reserva,
    r.fecha,
    r.hora_inicio,
    r.hora_fin,
    r.cantidad_personas,
    r.nombre || ' ' || r.apellido AS cliente,
    r.telefono,
    r.ocasion,
    er.descripcion AS estado,
    (r.hora_fin - r.hora_inicio) AS duracion,
    CASE
        WHEN r.fecha < CURRENT_DATE THEN 'Pasada'
        WHEN r.fecha = CURRENT_DATE AND r.hora_fin < CURRENT_TIME THEN 'Pasada'
        ELSE 'Pendiente'
        END AS situacion
FROM
    reserva r
        JOIN
    estado_reserva er ON r.id_estado = er.id_estado;


-- Vista #3 
CREATE VIEW vista_empleados AS
SELECT
    e.id_empleado,
    e.nombre || ' ' || e.apellidos AS nombre_completo,
    e.correo,
    e.telefono,
    r.descripcion AS rol
FROM
    empleado e
        JOIN
    rol r ON e.id_rol = r.id_rol;


-- Trigger #1 
-- Crear tabla de historial:
CREATE TABLE auditar_reserva (
    id_historial SERIAL PRIMARY KEY,
    id_reserva INTEGER NOT NULL,
    estado_anterior INTEGER NOT NULL,
    estado_nuevo INTEGER NOT NULL,
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_reserva) REFERENCES reserva(id_reserva),
    FOREIGN KEY (estado_anterior) REFERENCES estado_reserva(id_estado),
    FOREIGN KEY (estado_nuevo) REFERENCES estado_reserva(id_estado)
);
-- Crear función del trigger:
CREATE OR REPLACE FUNCTION registrar_cambio_estado_reserva()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.id_estado IS DISTINCT FROM OLD.id_estado THEN
        INSERT INTO auditar_reserva (id_reserva, estado_anterior, estado_nuevo)
        VALUES (OLD.id_reserva, OLD.id_estado, NEW.id_estado);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Crear el trigger:
CREATE TRIGGER trigger_historial_estado_reserva
AFTER UPDATE ON reserva
FOR EACH ROW
WHEN (OLD.id_estado IS DISTINCT FROM NEW.id_estado)
EXECUTE FUNCTION registrar_cambio_estado_reserva();


-- Trigger #2 Para encriptar la contraseña del empleado antes de insertar
-- Habilitar pgcrypto si no lo has hecho
CREATE EXTENSION IF NOT EXISTS pgcrypto;
-- Crear función del trigger:
CREATE OR REPLACE FUNCTION encriptar_contrasena()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR NEW.contrasena IS DISTINCT FROM OLD.contrasena THEN
        NEW.contrasena := crypt(NEW.contrasena, gen_salt('bf'));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Crear el trigger:
CREATE TRIGGER trigger_encriptar_contrasena
BEFORE INSERT OR UPDATE ON empleado
FOR EACH ROW
EXECUTE FUNCTION encriptar_contrasena();


-- Trigger #3 Para evitar que se hagan reservas fuera del horario del restaurante
-- Crear función del trigger:
CREATE OR REPLACE FUNCTION validar_reserva_en_horario()
RETURNS TRIGGER AS $$
DECLARE
    dia_semana VARCHAR(15);
    horario RECORD;
BEGIN
    -- Obtener el día de la semana de la fecha de la reserva (ej. 'Lunes')
    SELECT TO_CHAR(NEW.fecha, 'Day') INTO dia_semana;
    dia_semana := INITCAP(TRIM(dia_semana));  -- Normaliza el formato

    -- Buscar el horario del restaurante para ese día
    SELECT * INTO horario
    FROM horario_restaurante
    WHERE id_restaurante = NEW.id_restaurante AND dia = dia_semana;

    IF NOT FOUND OR horario.abierto = FALSE THEN
        RAISE EXCEPTION 'El restaurante está cerrado el día %.', dia_semana;
    END IF;

    IF NEW.hora_inicio < horario.hora_apertura OR NEW.hora_fin > horario.hora_cierre THEN
        RAISE EXCEPTION 'La hora de la reserva debe estar entre % y %.', horario.hora_apertura, horario.hora_cierre;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Crear el trigger:
CREATE TRIGGER trigger_validar_horario_reserva
BEFORE INSERT OR UPDATE ON reserva
FOR EACH ROW
EXECUTE FUNCTION validar_reserva_en_horario();