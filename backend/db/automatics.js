/* eslint-disable no-undef */
const bcrypt = require('bcryptjs');

module.exports = async  function automatics(conn) {
    console.log("Asegurando tablas automáticas...");

    var users = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        mobile_no VARCHAR(20),
        nationality VARCHAR(255),
        address VARCHAR(255),
        role VARCHAR(50) NOT NULL DEFAULT 'Customer',
        soft_delete BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(users);
    console.log("Tabla 'users' asegurada.");

     await conn.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255) DEFAULT NULL AFTER nationality`);

    // Insert admin user if not exists
    var [existingUser] = await conn.query('SELECT COUNT(*) as count FROM users WHERE email = ?', ['manuelperez.0000@gmail.com']);
    if (existingUser[0].count === 0) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await conn.query(`
        INSERT INTO users (name, lastname, email, password, mobile_no, nationality, role)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, ['manuel', 'Perez', 'manuelperez.0000@gmail.com', hashedPassword, '04141220527', 'venezolano', 'admin']);
      console.log("Usuario administrador insertado.");
    } else {
      console.log("Usuario administrador ya existe.");
    }

    var vehiculosVenta = `
      CREATE TABLE IF NOT EXISTS vehiculos_venta (
  id int(11) NOT NULL,
  fecha_ingreso date NOT NULL,
  fecha_shaken date DEFAULT NULL,
  origen varchar(255) NOT NULL,
  marca varchar(255) NOT NULL,
  modelo varchar(255) NOT NULL,
  numero_placa varchar(255) NOT NULL,
  anio varchar(255) NOT NULL,
  kilometraje varchar(255) NOT NULL,
  color varchar(255) NOT NULL,
  tipo_vehiculo varchar(255) NOT NULL,
  tamano_motor varchar(255) NOT NULL,
  numero_chasis varchar(255) NOT NULL,
  observaciones varchar(255) DEFAULT NULL,
  trabajos_realizar varchar(255) DEFAULT NULL,
  imagen1 varchar(500) DEFAULT NULL,
  imagen2 varchar(500) DEFAULT NULL,
  status varchar(255) NOT NULL,
  precio decimal(10,2) NOT NULL,
  transmission varchar(255) NOT NULL,
  passengers int NOT NULL,
  ac boolean NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(vehiculosVenta);
    console.log("Tabla 'vehiculos_venta' asegurada.");

    // Add fecha_shaken column to existing vehiculos_venta table
    try {
      await conn.query(`ALTER TABLE vehiculos_venta ADD COLUMN IF NOT EXISTS fecha_shaken DATE DEFAULT NULL AFTER fecha_ingreso`);
      console.log("Columna 'fecha_shaken' agregada a tabla 'vehiculos_venta' si no existía.");
    } catch (error) {
      console.log("Columna 'fecha_shaken' ya existe o error al agregar:", error.message);
    }

    var vicitas = `
      CREATE TABLE IF NOT EXISTS vicitas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        contador INT NOT NULL DEFAULT 0
      )
    `;
    await conn.query(vicitas);
    console.log("Tabla 'vicitas' asegurada.");

    // Insert initial record if table is empty
    var [existing] = await conn.query('SELECT COUNT(*) as count FROM vicitas');
    if (existing[0].count === 0) {
      await conn.query('INSERT INTO vicitas (contador) VALUES (0)');
      console.log("Registro inicial de visitas insertado.");
    }

    var reservasServicio = `
      CREATE TABLE IF NOT EXISTS reservas_servicio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        servicio VARCHAR(255) NOT NULL,
        fecha_reserva DATE NOT NULL,
        hora_reserva TIME NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status INT NOT NULL DEFAULT 0
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(reservasServicio);
    console.log("Tabla 'reservas_servicio' asegurada.");

    // Add hora_reserva column to existing reservas_servicio table
    try {
      await conn.query(`ALTER TABLE reservas_servicio ADD COLUMN IF NOT EXISTS hora_reserva TIME NOT NULL DEFAULT '09:00:00'`);
      console.log("Columna 'hora_reserva' agregada a tabla 'reservas_servicio' si no existía.");
    } catch (error) {
      console.log("Columna 'hora_reserva' ya existe o error al agregar:", error.message);
    }

    var financiamiento = `
      CREATE TABLE IF NOT EXISTS financiamiento (
        id INT AUTO_INCREMENT PRIMARY KEY,
        apellidos_katakana VARCHAR(255) NOT NULL,
        nombres_katakana VARCHAR(255) NOT NULL,
        apellidos_kanji VARCHAR(255) NOT NULL,
        nombres_kanji VARCHAR(255) NOT NULL,
        fecha_nacimiento DATE NOT NULL,
        genero ENUM('hombre', 'mujer') NOT NULL,
        tipo_conyuge VARCHAR(255),
        direccion_actual TEXT NOT NULL,
        personas_viviendo INT NOT NULL,
        tiempo_direccion VARCHAR(255) NOT NULL,
        cantidad_hijos INT DEFAULT 0,
        relacion_jefe_hogar VARCHAR(255),
        cabeza_familia ENUM('si', 'no') NOT NULL,
        pago_hipoteca_alquiler VARCHAR(255) NOT NULL,
        telefono_casa VARCHAR(20),
        telefono_movil VARCHAR(20) NOT NULL,
        nombre_empresa_katakana VARCHAR(255) NOT NULL,
        nombre_empresa_kanji VARCHAR(255) NOT NULL,
        direccion_trabajo TEXT NOT NULL,
        telefono_trabajo VARCHAR(20) NOT NULL,
        tipo_industria VARCHAR(255) NOT NULL,
        tiempo_trabajando VARCHAR(255) NOT NULL,
        ingreso_mensual DECIMAL(15,2) NOT NULL,
        ingreso_anual DECIMAL(15,2) NOT NULL,
        dia_pago VARCHAR(255) NOT NULL,
        nombre_empresa_contratista VARCHAR(255),
        direccion_empresa_contratista TEXT,
        telefono_empresa_contratista VARCHAR(20),
        seiru_cado_frontal VARCHAR(500),
        seiru_cado_trasero VARCHAR(500),
        licencia_conducir_frontal VARCHAR(500),
        licencia_conducir_trasero VARCHAR(500),
        kokumin_shakai_hoken VARCHAR(500),
        libreta_banco VARCHAR(500),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status ENUM('pendiente', 'cancelado', 'en tramite', 'realizado') DEFAULT 'pendiente'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(financiamiento);
    console.log("Tabla 'financiamiento' asegurada.");

    var inventario = `
      CREATE TABLE IF NOT EXISTS inventario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        fabricante VARCHAR(255) NOT NULL,
        precio DECIMAL(10,2),
        cantidad INT DEFAULT 0,
        detalle VARCHAR(500),
        imagenes VARCHAR(1000),
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(inventario);
    console.log("Tabla 'inventario' asegurada.");

    var inspeccionVehicular = `
      CREATE TABLE IF NOT EXISTS inspeccion_vehicular (
        id INT AUTO_INCREMENT PRIMARY KEY,
        cliente_tipo ENUM('registrado', 'nuevo') NOT NULL,
        cliente_id INT NULL,
        cliente_nombre VARCHAR(255) NULL,
        cliente_email VARCHAR(255) NULL,
        cliente_telefono VARCHAR(20) NULL,
        cliente_direccion TEXT NULL,
        vehiculo_marca VARCHAR(255) NOT NULL,
        vehiculo_modelo VARCHAR(255) NOT NULL,
        vehiculo_anio VARCHAR(4) NOT NULL,
        vehiculo_color VARCHAR(255) NOT NULL,
        vehiculo_placa VARCHAR(255) NOT NULL,
        vehiculo_fecha_shaken DATE NULL,
        vehiculo_estado_aceite VARCHAR(255) NOT NULL,
        vehiculo_pastillas_freno INT NOT NULL CHECK (vehiculo_pastillas_freno >= 1 AND vehiculo_pastillas_freno <= 100),
        vehiculo_neumaticos VARCHAR(255) NULL,
        vehiculo_estado_bateria VARCHAR(255) NOT NULL,
        vehiculo_observaciones TEXT NULL,
        vehiculo_trabajos_realizar TEXT NULL,
        vehiculo_detalles_pintura TEXT NULL,
        foto_vehiculo VARCHAR(500) NULL,
        foto_documento VARCHAR(500) NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(inspeccionVehicular);
    console.log("Tabla 'inspeccion_vehicular' asegurada.");

    // Add new column vehiculo_trabajos_realizar if it doesn't exist
    try {
      await conn.query(`ALTER TABLE inspeccion_vehicular ADD COLUMN IF NOT EXISTS vehiculo_trabajos_realizar TEXT NULL AFTER vehiculo_estado_bateria`);
      console.log("Columna 'vehiculo_trabajos_realizar' agregada a tabla 'inspeccion_vehicular' si no existía.");
    } catch (error) {
      console.log("Columna 'vehiculo_trabajos_realizar' ya existe o error al agregar:", error.message);
    }

    var facturas = `
      CREATE TABLE IF NOT EXISTS facturas (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo ENUM('venta', 'alquiler', 'producto', 'servicio') NOT NULL,
        cliente_nombre VARCHAR(255) NOT NULL,
        cliente_apellido VARCHAR(255),
        cliente_genero ENUM('Masculino', 'Femenino', 'Otro'),
        cliente_email VARCHAR(255),
        cliente_telefono VARCHAR(20),
        cliente_cedula VARCHAR(20),
        cliente_direccion VARCHAR(500),
        items JSON NOT NULL,
        total DECIMAL(15,2) NOT NULL,
        datos_pago JSON,
        cuotas JSON,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(facturas);
    console.log("Tabla 'facturas' asegurada.");

    var informeVehiculos = `
      CREATE TABLE IF NOT EXISTS informe_vehiculos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fecha_ingreso DATE NOT NULL,
        cliente_nombre VARCHAR(255) NOT NULL,
        cliente_telefono VARCHAR(20),
        cliente_email VARCHAR(255),
        vehiculo_marca VARCHAR(255) NOT NULL,
        vehiculo_modelo VARCHAR(255) NOT NULL,
        vehiculo_motor VARCHAR(255),
        vehiculo_anio VARCHAR(4) NOT NULL,
        vehiculo_color VARCHAR(255) NOT NULL,
        vehiculo_kilometraje VARCHAR(255),
        vehiculo_fecha_shaken DATE,
        vehiculo_estado_bateria VARCHAR(255) NOT NULL,
        vehiculo_estado_aceite VARCHAR(255) NOT NULL,
        vehiculo_estado_liquido_frenos VARCHAR(255) NOT NULL,
        vehiculo_porcentaje_pastillas_freno INT NOT NULL CHECK (vehiculo_porcentaje_pastillas_freno >= 0 AND vehiculo_porcentaje_pastillas_freno <= 100),
        vehiculo_porcentaje_neumaticos VARCHAR(255) NOT NULL,
        vehiculo_estado_liquido_refrigerante VARCHAR(255) NOT NULL,
        vehiculo_detalles_pintura TEXT,
        vehiculo_observacion_general TEXT,
        vehiculo_imagen VARCHAR(500),
        vehiculo_foto_documentos VARCHAR(500),
        vehiculo_trabajos_realizar TEXT,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(informeVehiculos);
    console.log("Tabla 'informe_vehiculos' asegurada.");

    // Add motor column and modify neumaticos column if needed
    try {
      await conn.query(`ALTER TABLE informe_vehiculos ADD COLUMN IF NOT EXISTS vehiculo_motor VARCHAR(255)`);
      console.log("Columna 'vehiculo_motor' agregada a tabla 'informe_vehiculos' si no existía.");
    } catch (error) {
      console.log("Columna 'vehiculo_motor' ya existe o error al agregar:", error.message);
    }

    try {
      await conn.query(`ALTER TABLE informe_vehiculos MODIFY COLUMN vehiculo_porcentaje_neumaticos VARCHAR(255) NOT NULL`);
      console.log("Columna 'vehiculo_porcentaje_neumaticos' modificada a VARCHAR.");
    } catch (error) {
      console.log("Error al modificar columna 'vehiculo_porcentaje_neumaticos':", error.message);
    }

    // Drop vehiculo_vin column if exists
    try {
      await conn.query(`ALTER TABLE informe_vehiculos DROP COLUMN IF EXISTS vehiculo_vin`);
      console.log("Columna 'vehiculo_vin' eliminada de tabla 'informe_vehiculos' si existía.");
    } catch (error) {
      console.log("Error al eliminar columna 'vehiculo_vin':", error.message);
    }

    var categoriasServicio = `
      CREATE TABLE IF NOT EXISTS categorias_servicio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        imagen VARCHAR(500) NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(categoriasServicio);
    console.log("Tabla 'categorias_servicio' asegurada.");

    var itemServicio = `
      CREATE TABLE IF NOT EXISTS item_servicio (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        idCategoria INT NOT NULL,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (idCategoria) REFERENCES categorias_servicio(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(itemServicio);
    console.log("Tabla 'item_servicio' asegurada.");

    var configuracion = `
      CREATE TABLE IF NOT EXISTS configuracion (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo ENUM('phone', 'email', 'schedule') NOT NULL,
        texto VARCHAR(500) NOT NULL,
        whatsapp BOOLEAN DEFAULT FALSE,
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(configuracion);
    console.log("Tabla 'configuracion' asegurada.");

    var servicios = `
      CREATE TABLE IF NOT EXISTS servicios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre_cliente VARCHAR(255) NOT NULL,
        telefono_cliente VARCHAR(20),
        email_cliente VARCHAR(255),
        direccion_cliente VARCHAR(500),
        marca_vehiculo VARCHAR(255) NOT NULL,
        modelo_vehiculo VARCHAR(255) NOT NULL,
        anio_vehiculo VARCHAR(4),
        placa_vehiculo VARCHAR(20) NOT NULL,
        color_vehiculo VARCHAR(255),
        kilometraje_vehiculo VARCHAR(20),
        detalles JSON,
        subtotal DECIMAL(10,2) DEFAULT 0.00,
        iva DECIMAL(10,2) DEFAULT 0.00,
        total DECIMAL(10,2) DEFAULT 0.00,
        fecha_servicio DATE NOT NULL,
        notas TEXT,
        fotos JSON,
        status ENUM('Pendiente', 'En Progreso', 'Completado', 'Cancelado') DEFAULT 'Pendiente',
        fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(servicios);
    console.log("Tabla 'servicios' asegurada.");

    // Update servicios table: remove cedula_cliente and add direccion_cliente
    try {
      await conn.query(`ALTER TABLE servicios DROP COLUMN IF EXISTS cedula_cliente`);
      console.log("Columna 'cedula_cliente' eliminada de tabla 'servicios' si existía.");
    } catch (error) {
      console.log("Error al eliminar columna 'cedula_cliente' de servicios:", error.message);
    }

    try {
      await conn.query(`ALTER TABLE servicios ADD COLUMN IF NOT EXISTS direccion_cliente VARCHAR(500)`);
      console.log("Columna 'direccion_cliente' agregada a tabla 'servicios' si no existía.");
    } catch (error) {
      console.log("Columna 'direccion_cliente' ya existe o error al agregar:", error.message);
    }

    var venta = `
      CREATE TABLE IF NOT EXISTS venta (
        id INT AUTO_INCREMENT PRIMARY KEY,
        tipo ENUM('vehiculo', 'producto') NOT NULL,
        vehiculo_id INT NULL,
        producto_id INT NULL,
        cliente_nombre VARCHAR(255) NOT NULL,
        cliente_apellido VARCHAR(255),
        cliente_email VARCHAR(255),
        cliente_telefono VARCHAR(20),
        cliente_direccion TEXT,
        precio_venta DECIMAL(10,2) NOT NULL,
        tipo_pago ENUM('contado', 'cuotas') NOT NULL,
        numero_cuotas INT NULL,
        frecuencia_cuotas ENUM('semanal', 'quincenal', 'mensual') NULL,
        monto_inicial DECIMAL(10,2) DEFAULT 0.00,
        tasa_interes DECIMAL(5,2) DEFAULT 0.00,
        total_con_intereses DECIMAL(10,2) NOT NULL,
        fecha_inicial DATE NULL,
        siguientes_pagos JSON,
        datos_pago JSON,
        fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `;
    await conn.query(venta);
    console.log("Tabla 'venta' asegurada.");

    // Update venta table: remove cliente_cedula and add cliente_direccion
    try {
      await conn.query(`ALTER TABLE venta DROP COLUMN IF EXISTS cliente_cedula`);
      console.log("Columna 'cliente_cedula' eliminada de tabla 'venta' si existía.");
    } catch (error) {
      console.log("Error al eliminar columna 'cliente_cedula' de venta:", error.message);
    }

    try {
      await conn.query(`ALTER TABLE venta ADD COLUMN IF NOT EXISTS cliente_direccion TEXT`);
      console.log("Columna 'cliente_direccion' agregada a tabla 'venta' si no existía.");
    } catch (error) {
      console.log("Columna 'cliente_direccion' ya existe o error al agregar:", error.message);
    }

    // Add missing columns to existing venta table
    try {
      await conn.query(`ALTER TABLE venta ADD COLUMN IF NOT EXISTS fecha_inicial DATE NULL`);
      console.log("Columna 'fecha_inicial' agregada a tabla 'venta' si no existía.");
    } catch (error) {
      console.log("Columna 'fecha_inicial' ya existe o error al agregar:", error.message);
    }

    try {
      await conn.query(`ALTER TABLE venta ADD COLUMN IF NOT EXISTS siguientes_pagos JSON`);
      console.log("Columna 'siguientes_pagos' agregada a tabla 'venta' si no existía.");
    } catch (error) {
      console.log("Columna 'siguientes_pagos' ya existe o error al agregar:", error.message);
    }

    try {
      await conn.query(`ALTER TABLE venta ADD COLUMN IF NOT EXISTS datos_pago JSON`);
      console.log("Columna 'datos_pago' agregada a tabla 'venta' si no existía.");
    } catch (error) {
      console.log("Columna 'datos_pago' ya existe o error al agregar:", error.message);
    }
}
