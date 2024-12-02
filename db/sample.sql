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


-- 圖像描述
INSERT INTO `class` (`id`,`user_id`, `value`, `negative`) VALUES
(1, 0,	'觀音佛像',	0),
(2, 0,	'佛像描述',	0),
(3, 0,	'手部描述',	0),
(4, 0,	'其他物件',	0),
(5, 0,	'唐卡畫派',	0),
(6, 0,	'其他描述',	0),
(7, 0,	'花朵描述',	0),
(8, 0,	'顏色',	0),
(9, 0,	'風格',	0);

-- 負面圖像描述
INSERT INTO `class` (`id`,`user_id`, `value`, `negative`) VALUES
(10, 0,	'质量',	1),
(11, 0,	'构图',	1),
(12, 0,	'負面元素',	1);

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  `class` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 觀音佛像分類
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'Avalokitesvara',	1),
(0,	'Akasagarbha',	1),
(0,	'Amoghankusalight',	1),
(0,	'Amoghapasa',	1),
(0,	'Eight Fears',	1),
(0,	'Ekadasamukha',	1),
(0,	'Hayagriva',	1),
(0,	'Lotus Mesh',	1),
(0,	'Nilakanta',	1),
(0,	'Open-Eye',	1),
(0,	'Padmapani',	1),
(0,	'Red',	1),
(0,	'Resting',	1),
(0,	'Shristhikantha',	1),
(0,	'Simhanada',	1),
(0,	'Vajragarbha',	1),
(0,	'Yab-Yum',	1);

-- 佛像描述：姿勢/手臂數量/皮膚顏色
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'a thangka of Avalokiteshvara',	2),
(0,	'Sitting Avalokiteshvara',	2),
(0,	'Standing Avalokiteshvara',	2),
(0,	'twin Avalokiteshvara',	2),
(0,	'Chaturbhuja',	2),
(0,	'eight-armed',	2),
(0,	'eighteen-armed',	2),
(0,	'four-armed',	2),
(0,	'six-armed',	2),
(0,	'ten-armed',	2),
(0,	'Thousand-armed',	2),
(0,	'Thousand hands and eyes',	2),
(0,	'twelve-armed',	2),
(0,	'two-armed',	2),
(0,	'black skin',	2),
(0,	'gray blue skin',	2),
(0,	'gray skin',	2),
(0,	'green skin',	2),
(0,	'orange skin',	2),
(0,	'red skin',	2),
(0,	'Tan skin',	2),
(0,	'white skin',	2),
(0,	'yellow skin',	2);

-- 手部描述
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'Abhaya mudra',	3),
(0,	'Anjali mudra',	3),
(0,	'Apana mudra',	3),
(0,	'Bhagna',	3),
(0,	'Dharmachakra mudra',	3),
(0,	'Fat hands',	3),
(0,	'finger apart',	3),
(0,	'fingertips apart',	3),
(0,	'hand apart',	3),
(0,	'Nivida',	3),
(0,	'Pranama',	3),
(0,	'Samputa',	3),
(0,	'Shuni mudra',	3),
(0,	'Uttanaja',	3),
(0,	'Varada Mudra',	3),
(0,	'Bhumyakramana Mudra',	3),
(0,	'Saranagamana Mudra',	3),
(0,	'Dhyana Mudra',	3),
(0,	'Humkara Mudra',	3),
(0,	'kudmala',	3),
(0,	'adhara',	3),
(0,	'viparita',	3),
(0,	'Viparyasta',	3),
(0,	'tiryak',	3),
(0,	'viparita',	3),
(0,	'hold a cintamani',	3),
(0,	'red palms',	3),
(0,	'eye in palm',	3);

-- 其他物件
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'Arrow', 4),
(0,	'fletching', 4),
(0,	'arrowhead', 4),
(0,	'nock', 4),
(0,	'bow riser', 4),
(0,	'bow limbs', 4),
(0,	'Axe',	4),
(0,	'Bell',	4),
(0,	'Bow',	4),
(0,	'bowl',	4),
(0,	'bowstring', 4),
(0,	'Buddhism item',	4),
(0,	'Chain',	4),
(0,	'Cintamani Orb',	4),
(0,	'a pile of orbs',	4),
(0,	'with orbs',	4),
(0,	'cymbals',	4),
(0,	'ribbon',	4),
(0,	'bowl of rice',	4),
(0,	'fangs',	4),
(0,	'Lotus Terrace',	4),
(0,	'classic Lotus Terrace',	4),
(0,	'part of Lotus Terrace',	4),
(0,	'coral',	4),
(0,	'deerskin',	4),
(0,	'Dhaja',	4),
(0,	'Drum',	4),
(0,	'Elephant',	4),
(0,	'Fire',	4),
(0,	'Ghost',	4),
(0,	'Hossu',	4),
(0,	'knowledge wheel',	4),
(0,	'wheel',	4),
(0,	'Lotus',	4),
(0,	'lute',	4),
(0,	'mirror',	4),
(0,	'Nectar Bottle',	4),
(0,	'Nectar Bowl',	4),
(0,	'Pants',	4),
(0,	'Person',	4),
(0,	'Purity Vase',	4),
(0,	'religious offerings',	4),
(0,	'Scripture',	4),
(0,	'Skull wand',	4),
(0,	'Snake',	4),
(0,	'Staff',	4),
(0,	'Stamp',	4),
(0,	'Sword',	4),
(0,	'Temple',	4),
(0,	'Token',	4),
(0,	'Utpala',	4),
(0,	'Water',	4),
(0,	'flames',	4),
(0,	'handle',	4),
(0,	'streamers',	4);

-- 金銀珠寶
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'sapphire',	4),
(0,	'ruby',	4),
(0,	'emerald',	4),
(0,	'obsidian',	4),
(0,	'crystal',	4),
(0,	'diamond',	4),
(0,	'gold',	4),
(0,	'bronze',	4),
(0,	'brass',	4),
(0,	'silverware',	4),
(0,	'porcelain',	4),
(0,	'pottery',	4),
(0,	'iron',	4);

-- 唐卡畫派/作家/傳統
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'KarmaGadri style',	5),
(0,	'Miansa style',	5),
(0,	'MianTang style',	5),
(0,	'Nepali style',	5),
(0,	'Qinzi style',	5),
(0,	'Qiwugang style',	5),
(0,	'Kalsang',	5),
(0,	'Karma Tenzin',	5),
(0,	'Tsultrim Norbu',	5),
(0,	'Atisa Heritage',	5),
(0,	'Dalai Lama Heritage',	5),
(0,	'Mindroling Tradition',	5),
(0,	'Ocean of Conquerors',	5),
(0,	'tradition of Mitra-yogin',	5),
(0,	'tradition of the Great Pandita of Kashmir',	5),
(0,	'Uppalavanna Heritage',	5);

-- 其他描述
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'A drawing of',	6),
(0,	'A thangka of',	6),
(0,	'circular halo',	6),
(0,	'classic color',	6),
(0,	'drop shape',	6),
(0,	'rhombic shape',	6),
(0,	'bottle shape',	6),
(0,	'square shape',	6),
(0,	'long',	6),
(0,	'thin',	6),
(0,	'thick',6),
(0,	'short',6),
(0,	'like a ship rudder',6),
(0,	'in the left middle hand',	6),
(0,	'gorgeous',	6),
(0,	'exquisite',	6),
(0,	'simple',	6),
(0,	'mandorla with golden line',	6),
(0,	'wavy line pattern',	6),
(0,	'wooden',	6),
(0,	'exquisite mandorla',	6),
(0,	'Exquisite patterns',	6),
(0,	'golden thread embroidery',	6),
(0,	'no halo',	6),
(0,	'silver embroidery',	6),
(0,	'Upper body',	6),
(0,	'lower body',	6),
(0,	'body light',	6),
(0,	'mandorla',	6),
(0,	'halo',	6),
(0,	'head',	6),
(0,	'shadow',	6),
(0,	'vertical',	6),
(0,	'slanting',	6),
(0,	'horizontal',	6),
(0,	'lying down',	6),
(0,	'Thousand-armed background',	6),
(0,	'in a bowl',	6),
(0,	'on utpala',	6),
(0,	'on the sea',	6),
(0,	'dark sea',	6),
(0,	'on the ground',	6),
(0,	'on the grassland',	6),
(0,	'on the river bank',	6),
(0,	'rough waves',	6),
(0,	'at the peak',	6),
(0,	'leftside',	6),
(0,	'rightside',	6),
(0,	'stand on both sides',	6),
(0,	'at the top',	6),
(0,	'above',	6),
(0,	'behind',	6),
(0,	'in front',	6),
(0,	'higher face are smaller',	6),
(0,	'consists of white and green and red faces',	6),
(0,	'oval tattoo',	6),
(0,	'mole between eyebrows ',	6),
(0,	'mole on forehead',	6),
(0,	'wear hoop earrings',	6),
(0,	'wear leaves tiara',	6),
(0,	'wear tiara',	6),
(0,	'wear crown',	6),
(0,	'wear jewelry',	6),
(0,	'wear double bracelet',	6),
(0,	'with pendant',	6),
(0,	'black hair down on shoulders',	6),
(0,	'dark blue three-eyed head',	6),
(0,	'angry head',	6),
(0,	'colorful Mandorla', 6),
(0,	'yellow background', 6);

-- 花朵描述
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'bud type',	7),
(0,	'cloud shaped petals',	7),
(0,	'flat type',	7),
(0,	'flore pleno type',	7),
(0,	'jagged petals',	7),
(0,	'long peduncle',	7),
(0,	'one layer type',	7),
(0,	'petals closed',	7),
(0,	'pointed petals',	7),
(0,	'round petals',	7),
(0,	'round type',	7),
(0,	'skirt type',	7),
(0,	'small flower',	7),
(0,	'tongue-shaped petals',	7),
(0,	'two layers type',	7),
(0,	'whole hand',	7),
(0,	'flower stem',	7),
(0,	'anther',	7),
(0,	'filament',	7),
(0,	'stigma',	7),
(0,	'flower style',	7),
(0,	'carpel',	7),
(0,	'petal',	7),
(0,	'sepal',	7),
(0,	'receptacle',	7),
(0,	'peduncle',	7),
(0,	'pistil',	7),
(0,	'bushy leaves',	7),
(0,	'jagged leaves',	7),
(0,	'seedpod at the center',	7),
(0,	'cloud-shaped petals',	7),
(0,	'with white outline',	7),
(0,	'hand hold',	7);

-- Colors
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'achromatic colors',	8),
(0,	'bright colors',	8),
(0,	'color peeling',	8),
(0,	'color scratched',	8),
(0,	'cool colors',	8),
(0,	'dark colors',	8),
(0,	'deep colors',	8),
(0,	'dim colors',	8),
(0,	'dusky colors',	8),
(0,	'faded colors',	8),
(0,	'light colors',	8),
(0,	'low brightness',	8),
(0,	'mild colors',	8),
(0,	'murky colors',	8),
(0,	'pale colors',	8),
(0,	'pastel colors',	8),
(0,	'rich colors',	8),
(0,	'strong colors',	8),
(0,	'subdued colors',	8),
(0,	'vibrant colors',	8),
(0,	'warm colors',	8),
(0,	'highlight',	8),
(0,	'pied',	8),
(0,	'faded and dim',	8);

-- 畫作風格
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'masterpiece',	9),
(0,	'creased painting',	9),
(0,	'detailed painting',	9),
(0,	'engraving painting',	9),
(0,	'Exquisite painting',	9),
(0,	'folded painting',	9),
(0,	'line drawing',	9),
(0,	'new thangka',	9),
(0,	'non-realistic',	9),
(0,	'old painting',	9),
(0,	'painting on cotton',	9),
(0,	'painting on cotton scroll',	9),
(0,	'painting on silk',	9),
(0,	'painting on yellow canvas',	9),
(0,	'pure gold',	9),
(0,	'Realistic',	9),
(0,	'rough drawing',	9),
(0,	'Silk Embroidery',	9),
(0,	'simple drawing',	9),
(0,	'simple painting',	9),
(0,	'watercolor painting',	9),
(0,	'yellowing painting',	9);

-- Negative: 质量
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'blurry',	10),
(0,	'blurry painting',	10),
(0,	'normal quality',	10),
(0,	'low quality',	10),
(0,	'worst quality', 10),
(0,	'jpeg artifacts',	10),
(0,	'grainy',	10),
(0,	'pixelated',	10);

-- Negative: 构图
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'flat',	11),
(0,	'no detail',	11),
(0,	'unfocused',	11),
(0,	'poor lighting',	11),
(0,	'washed out',	11),
(0,	'oversaturated',	11),
(0,	'cropped',	11),
(0,	'incomplete',	11),
(0,	'weird angles',	11),
(0,	'distorted',	11),
(0,	'messy',	11),
(0,	'chaotic',	11),
(0,	'oversaturated',	11),
(0,	'dull colors',	11),
(0,	'low detail',	11),
(0,	'low definition',	11),
(0,	'lost edges',	11),
(0,	'rough',	11);

-- Negative: 負面元素
INSERT INTO `label` (`user_id`, `value`, `class`) VALUES
(0,	'bad',	12),
(0,	'ugly',	12),
(0,	'disfigured',	12),
(0,	'unappealing',	12),
(0,	'watermark',	12),
(0,	'artificial look',	12),
(0,	'grainy',	12),
(0,	'stained painting',	12),
(0,	'worn painting',	12),
(0,	'wrinkled painting',	12);


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
