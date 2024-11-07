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
  `negative` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `class` (`id`, `user_id`, `value`, `negative`) VALUES
(1,	0,	'顏色',	0),
(2,	0,	'物件',	0),
(3,	0,	'手勢',	0),
(4,	0,	'质量问题',	1),
(5,	0,	'清晰度问题',	1),
(6,	0,	'构图问题',	1),
(7,	0,	'美观和视觉吸引力',	1),
(8,	0,	'不希望出现的元素',	1);

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  `class` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `label` (`id`, `user_id`, `value`, `class`) VALUES
(1,	0,	'light',	1),
(2,	0,	'pale',	1),
(3,	0,	'mild',	1),
(4,	0,	'subdued',	1),
(5,	0,	'bright',	1),
(6,	0,	'vibrant',	1),
(7,	0,	'rich',	1),
(8,	0,	'bow',	2),
(9,	0,	'arrow',	2),
(10,	0,	'Cintamani',	2),
(11,	0,	'utpala',	2),
(12,	0,	'knowledge wheel',	2),
(13,	0,	'Varada Mudra',	3),
(14,	0,	'Bhumyakramana Mudra',	3),
(15,	0,	'Abhaya Mudra',	3),
(16,	0,	'Saranagamana Mudra',	3),
(17,	0,	'Dharmachakra Mudra',	3),
(18,	0,	'Dhyana Mudra',	3),
(19,	0,	'Humkara-Mudra',	3),
(20,	0,	'normal quality',	4),
(21,	0,	'low quality',	4),
(22,	0,	'worst quality',	4),
(23,	0,	'jpeg artifacts',	4),
(24,	0,	'grainy',	4),
(25,	0,	'pixelated',	4),
(26,	0,	'low definition',	4),
(27,	0,	'flat',	4),
(28,	0,	'no detail',	4),
(29,	0,	'blurry',	5),
(30,	0,	'unfocused',	5),
(31,	0,	'poor lighting',	5),
(32,	0,	'washed out',	5),
(33,	0,	'oversaturated',	5),
(34,	0,	'cropped',	6),
(35,	0,	'incomplete',	6),
(36,	0,	'weird angles',	6),
(37,	0,	'distorted',	6),
(38,	0,	'messy',	6),
(39,	0,	'chaotic',	6),
(40,	0,	'oversaturated',	7),
(41,	0,	'washed out',	7),
(42,	0,	'dull colors',	7),
(43,	0,	'bad',	7),
(44,	0,	'ugly',	7),
(45,	0,	'disfigured',	7),
(46,	0,	'unappealing',	7),
(47,	0,	'watermark',	8),
(48,	0,	'artificial look',	8),
(49,	0,	'grainy',	8),
(50,	0,	'low detail',	8),
(51,	0,	'low definition',	8);

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

INSERT INTO `user` (`user_id`, `user_name`) VALUES
(1,	'Mercury'),
(2,	'Venus'),
(3,	'Earth'),
(4,	'Mars'),
(5,	'Jupiter'),
(6,	'Saturn'),
(7,	'Uranus'),
(8,	'Neptune');

-- 2024-11-06 14:49:05
