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
            hr.hora_clerre,
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