

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `categorias_servicio` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `imagen` varchar(500) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `configuracion` (
  `id` int(11) NOT NULL,
  `tipo` enum('phone','email','schedule') NOT NULL,
  `texto` varchar(500) NOT NULL,
  `whatsapp` tinyint(1) DEFAULT 0,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `currencies` (
  `id` int(11) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `currency` varchar(100) DEFAULT NULL,
  `code` varchar(25) DEFAULT NULL,
  `symbol` varchar(25) DEFAULT NULL,
  `thousand_separator` varchar(10) DEFAULT NULL,
  `decimal_separator` varchar(10) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `facturas` (
  `id` int(11) NOT NULL,
  `tipo` enum('venta','alquiler','producto','servicio') NOT NULL,
  `cliente_nombre` varchar(255) NOT NULL,
  `cliente_apellido` varchar(255) DEFAULT NULL,
  `cliente_genero` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `cliente_email` varchar(255) DEFAULT NULL,
  `cliente_telefono` varchar(20) DEFAULT NULL,
  `cliente_direccion` varchar(500) DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `total` decimal(15,2) NOT NULL,
  `datos_pago` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_pago`)),
  `cuotas` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`cuotas`)),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `financiamiento` (
  `id` int(11) NOT NULL,
  `apellidos_katakana` varchar(255) NOT NULL,
  `nombres_katakana` varchar(255) NOT NULL,
  `apellidos_kanji` varchar(255) NOT NULL,
  `nombres_kanji` varchar(255) NOT NULL,
  `fecha_nacimiento` date NOT NULL,
  `genero` enum('hombre','mujer') NOT NULL,
  `tipo_conyuge` varchar(255) DEFAULT NULL,
  `direccion_actual` text NOT NULL,
  `personas_viviendo` int(11) NOT NULL,
  `tiempo_direccion` varchar(255) NOT NULL,
  `cantidad_hijos` int(11) DEFAULT 0,
  `relacion_jefe_hogar` varchar(255) DEFAULT NULL,
  `cabeza_familia` enum('si','no') NOT NULL,
  `pago_hipoteca_alquiler` varchar(255) NOT NULL,
  `telefono_casa` varchar(20) DEFAULT NULL,
  `telefono_movil` varchar(20) NOT NULL,
  `nombre_empresa_katakana` varchar(255) NOT NULL,
  `nombre_empresa_kanji` varchar(255) NOT NULL,
  `direccion_trabajo` text NOT NULL,
  `telefono_trabajo` varchar(20) NOT NULL,
  `tipo_industria` varchar(255) NOT NULL,
  `tiempo_trabajando` varchar(255) NOT NULL,
  `ingreso_mensual` decimal(15,2) NOT NULL,
  `ingreso_anual` decimal(15,2) NOT NULL,
  `dia_pago` varchar(255) NOT NULL,
  `nombre_empresa_contratista` varchar(255) DEFAULT NULL,
  `direccion_empresa_contratista` text DEFAULT NULL,
  `telefono_empresa_contratista` varchar(20) DEFAULT NULL,
  `seiru_cado_frontal` varchar(500) DEFAULT NULL,
  `seiru_cado_trasero` varchar(500) DEFAULT NULL,
  `licencia_conducir_frontal` varchar(500) DEFAULT NULL,
  `licencia_conducir_trasero` varchar(500) DEFAULT NULL,
  `kokumin_shakai_hoken` varchar(500) DEFAULT NULL,
  `libreta_banco` varchar(500) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `financing` (
  `id` int(11) NOT NULL,
  `cliente_nombre` varchar(255) NOT NULL,
  `cliente_apellido` varchar(255) DEFAULT NULL,
  `cliente_email` varchar(255) DEFAULT NULL,
  `cliente_telefono` varchar(50) DEFAULT NULL,
  `cliente_direccion` text DEFAULT NULL,
  `vehiculo_id` int(11) DEFAULT NULL,
  `monto_solicitado` decimal(10,2) DEFAULT NULL,
  `plazo_meses` int(11) DEFAULT NULL,
  `ingresos_mensuales` decimal(10,2) DEFAULT NULL,
  `status` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `informe_vehiculos` (
  `id` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `cliente_nombre` varchar(255) NOT NULL,
  `cliente_telefono` varchar(20) DEFAULT NULL,
  `cliente_email` varchar(255) DEFAULT NULL,
  `vehiculo_marca` varchar(255) NOT NULL,
  `vehiculo_modelo` varchar(255) NOT NULL,
  `vehiculo_anio` varchar(4) NOT NULL,
  `vehiculo_color` varchar(255) NOT NULL,
  `vehiculo_kilometraje` varchar(255) DEFAULT NULL,
  `vehiculo_fecha_shaken` date DEFAULT NULL,
  `vehiculo_estado_bateria` varchar(255) NOT NULL,
  `vehiculo_estado_aceite` varchar(255) NOT NULL,
  `vehiculo_estado_liquido_frenos` varchar(255) NOT NULL,
  `vehiculo_porcentaje_pastillas_freno` int(11) NOT NULL CHECK (`vehiculo_porcentaje_pastillas_freno` >= 0 and `vehiculo_porcentaje_pastillas_freno` <= 100),
  `vehiculo_porcentaje_neumaticos` varchar(255) NOT NULL,
  `vehiculo_estado_liquido_refrigerante` varchar(255) NOT NULL,
  `vehiculo_detalles_pintura` text DEFAULT NULL,
  `vehiculo_observacion_general` text DEFAULT NULL,
  `vehiculo_imagen` varchar(500) DEFAULT NULL,
  `vehiculo_foto_documentos` varchar(500) DEFAULT NULL,
  `vehiculo_trabajos_realizar` text DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `vehiculo_motor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `inspeccion_vehicular` (
  `id` int(11) NOT NULL,
  `cliente_tipo` enum('registrado','nuevo') NOT NULL,
  `cliente_id` int(11) DEFAULT NULL,
  `cliente_nombre` varchar(255) DEFAULT NULL,
  `cliente_email` varchar(255) DEFAULT NULL,
  `cliente_telefono` varchar(20) DEFAULT NULL,
  `cliente_direccion` text DEFAULT NULL,
  `vehiculo_marca` varchar(255) NOT NULL,
  `vehiculo_modelo` varchar(255) NOT NULL,
  `vehiculo_anio` varchar(4) NOT NULL,
  `vehiculo_color` varchar(255) NOT NULL,
  `vehiculo_placa` varchar(255) NOT NULL,
  `vehiculo_fecha_shaken` date DEFAULT NULL,
  `vehiculo_estado_aceite` varchar(255) NOT NULL,
  `vehiculo_pastillas_freno` int(11) NOT NULL CHECK (`vehiculo_pastillas_freno` >= 1 and `vehiculo_pastillas_freno` <= 100),
  `vehiculo_neumaticos` text NOT NULL,
  `vehiculo_estado_bateria` varchar(255) NOT NULL,
  `vehiculo_trabajos_realizar` text DEFAULT NULL,
  `vehiculo_detalles_pintura` text DEFAULT NULL,
  `vehiculo_observaciones` text DEFAULT NULL,
  `foto_vehiculo` varchar(500) DEFAULT NULL,
  `foto_documento` varchar(500) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `inventario` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `fabricante` varchar(255) NOT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `cantidad` int(11) DEFAULT 0,
  `detalle` varchar(500) DEFAULT NULL,
  `imagenes` varchar(1000) DEFAULT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `categoria` varchar(100) DEFAULT NULL,
  `cantidad` int(11) DEFAULT 0,
  `precio_unitario` decimal(10,2) DEFAULT NULL,
  `precio_venta` decimal(10,2) DEFAULT NULL,
  `proveedor` varchar(255) DEFAULT NULL,
  `ubicacion` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `item_servicio` (
  `id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `idCategoria` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `reservas_servicio` (
  `id` int(11) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `servicio` varchar(255) NOT NULL,
  `fecha_reserva` date NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` int(11) NOT NULL,
  `hora_reserva` time NOT NULL DEFAULT '09:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `seguimiento` (
  `id` int(11) NOT NULL,
  `tipo` enum('venta','servicio','financiamiento') NOT NULL,
  `referencia_id` int(11) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `status_anterior` varchar(50) DEFAULT NULL,
  `status_nuevo` varchar(50) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `vehiculo_id` int(11) DEFAULT NULL,
  `cliente_nombre` varchar(255) DEFAULT NULL,
  `cliente_telefono` varchar(50) DEFAULT NULL,
  `tipo_servicio` varchar(100) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `costo` decimal(10,2) DEFAULT NULL,
  `status` enum('pendiente','en_progreso','completado','cancelado') DEFAULT 'pendiente',
  `fecha_ingreso` date DEFAULT NULL,
  `fecha_entrega` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `servicios` (
  `id` int(11) NOT NULL,
  `nombre_cliente` varchar(255) NOT NULL,
  `telefono_cliente` varchar(20) DEFAULT NULL,
  `email_cliente` varchar(255) DEFAULT NULL,
  `marca_vehiculo` varchar(255) NOT NULL,
  `modelo_vehiculo` varchar(255) NOT NULL,
  `anio_vehiculo` varchar(4) DEFAULT NULL,
  `placa_vehiculo` varchar(20) NOT NULL,
  `color_vehiculo` varchar(255) DEFAULT NULL,
  `kilometraje_vehiculo` varchar(20) DEFAULT NULL,
  `detalles` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`detalles`)),
  `subtotal` decimal(10,2) DEFAULT 0.00,
  `iva` decimal(10,2) DEFAULT 0.00,
  `total` decimal(10,2) DEFAULT 0.00,
  `fecha_servicio` date NOT NULL,
  `notas` text DEFAULT NULL,
  `fotos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`fotos`)),
  `status` enum('Pendiente','En Progreso','Completado','Cancelado') DEFAULT 'Pendiente',
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `direccion_cliente` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `lastname` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `mobile_no` varchar(20) DEFAULT NULL,
  `nationality` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'Customer',
  `soft_delete` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `name`, `lastname`, `email`, `password`, `mobile_no`, `nationality`, `address`, `role`, `soft_delete`, `created_at`, `updated_at`) VALUES
(1, 'manuel', 'Perez', 'manuelperez.0000@gmail.com', '$2b$10$aW4N564LjJDvs6sffFgAaud.E3Z4kw9IU7MTXnPUqbWWaACv7SDIu', '04141220527', 'venezolano', 'av la rivera tucuputa da venezuela', 'admin', 1, '2025-11-24 19:55:47', '2025-11-26 19:17:42'),
(2, 'David', 'Perez', 'david@gmail.com', '$2b$10$MrvXPvcY4Gjw549zVYMTUuryGd4j7GyAsYF2aUOllo7tHZoTvIjNm', '0412444555', 'chileno', NULL, 'Customer', 1, '2025-11-24 20:15:21', '2025-11-24 20:15:40'),
(3, 'asas', 'asas', 'sasas@asas', '$2b$10$OmdtTfCoQXi0O/73jqGq7OPiXwHMofyr7sd6MBip4elJvuyMyKGSq', '2323', 'asas', NULL, 'Customer', 1, '2025-11-24 20:19:03', '2025-11-24 20:19:03'),
(4, 'sd', 'sd', 'sdsd@sdsd', '$2b$10$HysVln3V4jO2OxtmTAXz4ehoDwM/xoJV8H/Mmz/k5vW1tt/hoptru', 'sdsd', 'sd', NULL, 'Customer', 1, '2025-11-24 20:19:30', '2025-11-24 20:19:30'),
(5, 'asdasd', 'asdasd', 'asdad23@sdasd', '$2b$10$cgnHWVbQco/OLsAZ.j/8zOGH70XBEMGkY.xX.KbcKA2NVBH0cR9Bi', 'sdfsdf', 'asasd', NULL, 'employe', 1, '2025-11-24 20:22:56', '2025-11-24 20:22:56'),
(6, 'Juana', 'N/A', 'juana@gmail.com', '$2b$10$CS/nrHrEGncIlK10JZGs6.NauHSC8TLV87r.1vHTjkCAQWVyfCm/6', '04141220527', 'Japon', NULL, 'customer', 1, '2025-11-25 23:34:38', '2025-11-26 18:17:20'),
(7, 'asd123123', 'asdasd', 'asdasd@asdasd', '$2b$10$mWV24rdPSkLwN1Jf6Nfxcu3nBYfRfQzMT4LHjBVBEj5zsW73.yOaq', 'asdasd', 'asdasd', 'qweqwe123123', 'Customer', 1, '2025-11-26 18:18:00', '2025-11-26 18:18:30'),
(8, 'papanoel', 'N/A', 'dfgdfg@sdfsdf', '$2b$10$Z0t.3Ow57C8RsvgSRnId5.XTCO0N0a0wp5VCoLzeyVGrxZ3Stt4km', 'dfgdfg', 'Japon', NULL, 'customer', 1, '2025-11-26 18:44:44', '2025-11-26 18:44:44');

CREATE TABLE `vehicles` (
  `id` int(11) NOT NULL,
  `marca` varchar(100) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `anio` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL,
  `kilometraje` int(11) DEFAULT NULL,
  `tipo_vehiculo` varchar(50) DEFAULT NULL,
  `tamano_motor` varchar(50) DEFAULT NULL,
  `numero_placa` varchar(50) DEFAULT NULL,
  `numero_chasis` varchar(100) DEFAULT NULL,
  `color` varchar(50) DEFAULT NULL,
  `status` enum('En Venta','En alquiler','vendido','eliminado') DEFAULT 'En Venta',
  `imagen1` text DEFAULT NULL,
  `imagen2` text DEFAULT NULL,
  `observaciones` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehiculos_venta`
--

CREATE TABLE `vehiculos_venta` (
  `id` int(11) NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `fecha_shaken` date DEFAULT NULL,
  `origen` varchar(255) NOT NULL,
  `marca` varchar(255) NOT NULL,
  `modelo` varchar(255) NOT NULL,
  `numero_placa` varchar(255) NOT NULL,
  `anio` varchar(255) NOT NULL,
  `kilometraje` varchar(255) NOT NULL,
  `color` varchar(255) NOT NULL,
  `tipo_vehiculo` varchar(255) NOT NULL,
  `tamano_motor` varchar(255) NOT NULL,
  `numero_chasis` varchar(255) NOT NULL,
  `observaciones` varchar(255) DEFAULT NULL,
  `trabajos_realizar` varchar(255) DEFAULT NULL,
  `imagen1` varchar(500) DEFAULT NULL,
  `imagen2` varchar(500) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `precio` decimal(10,0) NOT NULL,
  `transmission` varchar(255) NOT NULL,
  `passengers` int(11) NOT NULL,
  `ac` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `venta` (
  `id` int(11) NOT NULL,
  `tipo` enum('vehiculo','producto') NOT NULL,
  `vehiculo_id` int(11) DEFAULT NULL,
  `producto_id` int(11) DEFAULT NULL,
  `cliente_nombre` varchar(255) NOT NULL,
  `cliente_apellido` varchar(255) DEFAULT NULL,
  `cliente_email` varchar(255) DEFAULT NULL,
  `cliente_telefono` varchar(20) DEFAULT NULL,
  `precio_venta` decimal(10,2) NOT NULL,
  `tipo_pago` enum('contado','cuotas') NOT NULL,
  `numero_cuotas` int(11) DEFAULT NULL,
  `frecuencia_cuotas` enum('semanal','quincenal','mensual') DEFAULT NULL,
  `monto_inicial` decimal(10,2) DEFAULT 0.00,
  `tasa_interes` decimal(5,2) DEFAULT 0.00,
  `total_con_intereses` decimal(10,2) NOT NULL,
  `datos_pago` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`datos_pago`)),
  `fecha_venta` timestamp NOT NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `fecha_inicial` date DEFAULT NULL,
  `siguientes_pagos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`siguientes_pagos`)),
  `cliente_direccion` text DEFAULT NULL,
  `informacion_garantia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `vicitas` (
  `contador` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `vicitas` (`contador`) VALUES
(182);


CREATE TABLE `visits` (
  `id` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `page_visited` varchar(255) DEFAULT NULL,
  `referrer` varchar(255) DEFAULT NULL,
  `visit_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `categorias_servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `facturas`
--
ALTER TABLE `facturas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `financiamiento`
--
ALTER TABLE `financiamiento`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `financing`
--
ALTER TABLE `financing`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehiculo_id` (`vehiculo_id`);

--
-- Indices de la tabla `informe_vehiculos`
--
ALTER TABLE `informe_vehiculos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inspeccion_vehicular`
--
ALTER TABLE `inspeccion_vehicular`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `item_servicio`
--
ALTER TABLE `item_servicio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idCategoria` (`idCategoria`);

--
-- Indices de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `reservas_servicio`
--
ALTER TABLE `reservas_servicio`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehiculo_id` (`vehiculo_id`);

--
-- Indices de la tabla `servicios`
--
ALTER TABLE `servicios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `vehiculos_venta`
--
ALTER TABLE `vehiculos_venta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `venta`
--
ALTER TABLE `venta`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `visits`
--
ALTER TABLE `visits`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_servicio`
--
ALTER TABLE `categorias_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `configuracion`
--
ALTER TABLE `configuracion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `facturas`
--
ALTER TABLE `facturas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `financiamiento`
--
ALTER TABLE `financiamiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `financing`
--
ALTER TABLE `financing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `informe_vehiculos`
--
ALTER TABLE `informe_vehiculos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inspeccion_vehicular`
--
ALTER TABLE `inspeccion_vehicular`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `item_servicio`
--
ALTER TABLE `item_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `mascotas`
--
ALTER TABLE `mascotas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reservas_servicio`
--
ALTER TABLE `reservas_servicio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `servicios`
--
ALTER TABLE `servicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `vehiculos_venta`
--
ALTER TABLE `vehiculos_venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `venta`
--
ALTER TABLE `venta`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `visits`
--
ALTER TABLE `visits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `financing`
--
ALTER TABLE `financing`
  ADD CONSTRAINT `financing_ibfk_1` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `item_servicio`
--
ALTER TABLE `item_servicio`
  ADD CONSTRAINT `item_servicio_ibfk_1` FOREIGN KEY (`idCategoria`) REFERENCES `categorias_servicio` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `seguimiento`
--
ALTER TABLE `seguimiento`
  ADD CONSTRAINT `seguimiento_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Filtros para la tabla `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `services_ibfk_1` FOREIGN KEY (`vehiculo_id`) REFERENCES `vehicles` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
