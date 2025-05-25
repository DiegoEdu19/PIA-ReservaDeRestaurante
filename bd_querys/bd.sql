INSERT INTO restaurante (nombre, direccion, ciudad, estado, codigo_postal)
VALUES ('BigFish',
        'Dalea 821, El Sabino Cerrada Residencial',
        'Monterrey',
        'Nuevo León',
        '64984');

INSERT INTO rol (descripcion)
VALUES ('admin');

INSERT INTO empleado (nombre, apellidos, correo,
                      telefono, contrasena, id_rol,
                      id_restaurante)
VALUES ('martinix', 'pecesuelix',
        'metp360@gmail.com', '8119903780',
        'poyoyounles3243', '1', '1');

--Funciones

CREATE OR REPLACE FUNCTION verificar_disponibilidad(
    p_fecha DATE,
    p_hora_inicio TIME,
    p_hora_fin TIME,
    p_cantidad_personas INTEGER
) RETURNS BOOLEAN AS $$
DECLARE
    capacidad_disponible INTEGER;
    reservas_existentes INTEGER;
    dia_semana TEXT;
BEGIN
    dia_semana := TO_CHAR(p_fecha, 'Day');

    -- Obtener capacidad del restaurante para ese día
    SELECT capacidad INTO capacidad_disponible
    FROM horario_restaurante
    WHERE dia = dia_semana
      AND abierto = true;

    -- Calcular personas ya reservadas en ese horario
    SELECT COALESCE(SUM(cantidad_personas), 0) INTO reservas_existentes
    FROM reserva
    WHERE fecha = p_fecha
      AND (
        (hora_inicio BETWEEN p_hora_inicio AND p_hora_fin)
            OR (hora_fin BETWEEN p_hora_inicio AND p_hora_fin)
            OR (p_hora_inicio BETWEEN hora_inicio AND hora_fin)
        )
      AND id_estado != 3; -- Excluir reservas canceladas

    -- Verificar disponibilidad
    RETURN (capacidad_disponible - reservas_existentes) >= p_cantidad_personas;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION contar_reservas_por_estado(
    p_id_estado INTEGER DEFAULT NULL
) RETURNS INTEGER AS $$
BEGIN
    IF p_id_estado IS NULL THEN
        RETURN (SELECT COUNT(*) FROM reserva);
    ELSE
        RETURN (
            SELECT COUNT(*)
            FROM reserva
            WHERE id_estado = p_id_estado
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION obtener_horario_por_día()
    RETURNS TABLE (
                      dia_semana VARCHAR(15),
                      abierto BOOLEAN,
                      hora_apertura TIME,
                      hora_cierre TIME,
                      capacidad INTEGER
                  ) AS $$
BEGIN
    RETURN QUERY
        SELECT
            hr.dia,
            hr.abierto,
            hr.hora_apertura,
            hr.hora_cierre,
            hr.capacidad
        FROM
            horario_restaurante hr
        ORDER BY
            CASE hr.dia
                WHEN 'Lunes' THEN 1
                WHEN 'Martes' THEN 2
                WHEN 'Miércoles' THEN 3
                WHEN 'Jueves' THEN 4
                WHEN 'Viernes' THEN 5
                WHEN 'Sábado' THEN 6
                WHEN 'Domingo' THEN 7
                END;
END;
$$ LANGUAGE plpgsql;

--vistas

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

CREATE VIEW vista_disponibilidad AS
SELECT
    hr.dia,
    hr.hora_apertura,
    hr.hora_cierre,
    hr.capacidad,
    (hr.capacidad - COALESCE((
                                 SELECT SUM(r.cantidad_personas)
                                 FROM reserva r
                                 WHERE r.fecha = CURRENT_DATE + (CASE hr.dia
                                                                     WHEN 'Lunes' THEN 0 WHEN 'Martes' THEN 1
                                                                     WHEN 'Miércoles' THEN 2 WHEN 'Jueves' THEN 3
                                                                     WHEN 'Viernes' THEN 4 WHEN 'Sábado' THEN 5
                                                                     WHEN 'Domingo' THEN 6 ELSE 0 END)
                                   AND r.id_estado != 2 -- No contar canceladas
                             ), 0)) AS capacidad_disponible
FROM
    horario_restaurante hr
WHERE
    hr.abierto = true;

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

--triggers
CREATE OR REPLACE FUNCTION validar_horario_reserva()
    RETURNS TRIGGER AS $$
DECLARE
    horario_valido BOOLEAN;
    dia_semana TEXT;
    capacidad_disponible INTEGER;
BEGIN
    -- Obtener día de la semana
    dia_semana := TO_CHAR(NEW.fecha, 'Day');

    -- Verificar si el restaurante está abierto a esa hora
    SELECT EXISTS (
        SELECT 1
        FROM horario_restaurante
        WHERE dia = dia_semana
          AND abierto = true
          AND NEW.hora_inicio >= hora_apertura
          AND NEW.hora_fin <= hora_cierre
    ) INTO horario_valido;

    IF NOT horario_valido THEN
        RAISE EXCEPTION 'El restaurante no está abierto en el horario seleccionado';
    END IF;

    -- Verificar disponibilidad de capacidad
    IF NOT verificar_disponibilidad(NEW.fecha, NEW.hora_inicio, NEW.hora_fin, NEW.cantidad_personas) THEN
        RAISE EXCEPTION 'No hay suficiente capacidad para la reserva solicitada';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_validar_horario_reserva
    BEFORE INSERT OR UPDATE ON reserva
    FOR EACH ROW
EXECUTE FUNCTION validar_horario_reserva();