-- Adminer 4.8.1 MySQL 8.3.0 dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `class`;
CREATE TABLE `class` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  `class` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `label` (`id`, `user_id`, `value`, `class`) VALUES
(1,	0,	'light',	'1'),
(2,	0,	'pale',	'1'),
(3,	0,	'mild',	'1'),
(4,	0,	'subdued',	'1'),
(5,	0,	'bright',	'1'),
(6,	0,	'vibrant',	'1'),
(7,	0,	'rich',	'1'),
(8,	0,	'bow',	'2'),
(9,	0,	'arrow',	'2'),
(10,	0,	'Cintamani',	'2'),
(11,	0,	'utpala',	'2'),
(12,	0,	'knowledge wheel',	'2'),
(13,	0,	'Varada Mudra',	'3'),
(14,	0,	'Bhumyakramana Mudra',	'3'),
(15,	0,	'Abhaya Mudra',	'3'),
(16,	0,	'Saranagamana Mudra',	'3'),
(17,	0,	'Dharmachakra Mudra',	'3'),
(18,	0,	'Dhyana Mudra',	'3'),
(19,	0,	'Humkara-Mudra',	'3');

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


-- 2024-10-22 16:05:46
