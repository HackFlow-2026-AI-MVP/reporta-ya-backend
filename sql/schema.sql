-- Reporta Ya! MySQL schema (MySQL 8+)
CREATE DATABASE IF NOT EXISTS `reporta_ya` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `reporta_ya`;

CREATE TABLE IF NOT EXISTS `evidence_types` (
  `id` VARCHAR(50) PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `description` VARCHAR(300) NOT NULL,
  `icon` VARCHAR(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) PRIMARY KEY,
  `email` VARCHAR(255) UNIQUE,
  `name` VARCHAR(150),
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cases` (
  `id` CHAR(36) PRIMARY KEY,
  `case_number` VARCHAR(50) UNIQUE NOT NULL,
  `title` VARCHAR(200) NOT NULL,
  `user_id` CHAR(36) NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_cases_user` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `evidences` (
  `id` CHAR(36) PRIMARY KEY,
  `case_id` CHAR(36) NOT NULL,
  `type_id` VARCHAR(50) NOT NULL,
  `incident_date` DATE NOT NULL,
  `description` VARCHAR(2000) NOT NULL,
  `person_involved` VARCHAR(150),
  `priority` ENUM('Bajo','Medio','Alto') NOT NULL,
  `file_name` VARCHAR(255),
  `file_mime` VARCHAR(100),
  `file_data` LONGBLOB,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_evidences_case` FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_evidences_type` FOREIGN KEY (`type_id`) REFERENCES `evidence_types`(`id`) ON DELETE RESTRICT,
  INDEX `idx_evidences_case_timeline` (`case_id`,`incident_date`,`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `evidence_types` (`id`,`name`,`description`,`icon`) VALUES
('screenshot','Captura de pantalla','Captura de conversación o publicación','🖼️'),
('whatsapp','Mensaje WhatsApp','Mensaje recibido por WhatsApp','💬'),
('email','Correo electrónico','Correo relacionado con el incidente','✉️'),
('photo','Fotografía','Fotografía relacionada con el incidente','📷'),
('sms','SMS','Mensaje de texto recibido','📱'),
('audio','Audio','Audio o nota de voz','🎙️'),
('document','Documento','Documento relacionado con el incidente','📄'),
('other','Otro','Otro tipo de evidencia','📌')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`),`description`=VALUES(`description`),`icon`=VALUES(`icon`);
