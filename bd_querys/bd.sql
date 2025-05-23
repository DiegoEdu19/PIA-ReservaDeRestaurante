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
