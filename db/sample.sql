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


-- 图像描述
INSERT INTO `class` (`id`,`user_id`, `value`, `negative`) VALUES
(1, 0,	'观音佛像',	0),
(2, 0,	'佛像描述',	0),
(3, 0,	'手部描述',	0),
(4, 0,	'其他物件',	0),
(5, 0,	'唐卡画派',	0),
(6, 0,	'其他描述',	0),
(7, 0,	'花朵描述',	0),
(8, 0,	'颜色',	0),
(9, 0,	'风格',	0);

-- 负面图像描述
INSERT INTO `class` (`id`,`user_id`, `value`, `negative`) VALUES
(10, 0, '质量',	1),
(11, 0, '构图',	1),
(12, 0, '负面元素',	1);

DROP TABLE IF EXISTS `label`;
CREATE TABLE `label` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `value` varchar(255) NOT NULL,
  `zh_CN` varchar(255),
  `class` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- 观音佛像分类
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'Avalokitesvara', '观音菩萨',	1),
(0,	'Amoghankusa', '不空钩观音',	1),
(0,	'Akasagarbha','虚空蔵菩萨',	1),
(0,	'Amoghapasa','不空羂索观音',	1),
(0,	'Eight Fears', '救八难观音',	1),
(0,	'Ekadasamukha', '十一面观音',	1),
(0,	'Hayagriva', '马头观音',	1),
(0,	'Lotus Mesh', '莲华网目观音',	1),
(0,	'Nilakanta', '蓝喉观音',	1),
(0,	'Open-Eye', '启目观音',	1),
(0,	'Padmapani', '莲华手观音',	1),
(0,	'Red', '红观音',	1),
(0,	'Resting','自在观音',	1),
(0,	'Shristhikantha', '千面千手观音',	1),
(0,	'Simhanada', '狮吼观音',	1),
(0,	'Vajragarbha', '金刚不坏观音',	1), 
(0,	'Yab-Yum', '双生观音',	1);

-- 佛像描述：姿势/手臂数量/皮肤颜色
INSERT INTO `label` (`user_id`, `value`,  `zh_CN`, `class`) VALUES
(0,	'a thangka of Avalokiteshvara', '观音唐卡',	2),
(0,	'Sitting Avalokiteshvara', '坐姿观音像',	2),
(0,	'Standing Avalokiteshvara', '站立观音像',	2),
(0,	'twin Avalokiteshvara', '双人观音像',	2),
(0,	'Chaturbhuja', '四手观音',	2),
(0,	'eight-armed', '八隻手',	2),
(0,	'eighteen-armed', '十八隻手',	2),
(0,	'four-armed', '四隻手',	2),
(0,	'six-armed', '六隻手',	2),
(0,	'ten-armed', '十隻手',	2),
(0,	'Thousand-armed', '千手', 2),
(0,	'Thousand hands and eyes', '千眼千手',	2),
(0,	'twelve-armed', '十二隻手',	2),
(0,	'two-armed', '两隻手',	2),
(0,	'black skin', '黑皮肤',	2),
(0,	'gray blue skin', '灰蓝色皮肤',	2),
(0,	'gray skin', '灰色皮肤',	2),
(0,	'green skin', '绿色皮肤',	2),
(0,	'orange skin', '橘色皮肤',	2),
(0,	'red skin', '红皮肤',	2),
(0,	'Tan skin', '棕色皮肤',	2),
(0,	'white skin', '白皮肤',	2),
(0,	'yellow skin', '黄皮肤',	2);

-- 手部描述
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'Abhaya mudra', '施无畏印',	3),
(0,	'Anjali mudra', '双手合十',	3),
(0,	'Apana mudra', '阿帕那手印',	3),
(0,	'Bhagna', '初割莲合掌',	3),
(0,	'Dharmachakra mudra', '说法印',	3),
(0,	'Fat hands', '手部较胖',	3),
(0,	'finger apart', '手指间分开',	3),
(0,	'fingertips apart', '指尖未相触',	3),
(0,	'hand apart', '双手分开',	3),
(0,	'Nivida', '坚实合掌',	3),
(0,	'Pranama', '归命合掌',	3),
(0,	'Samputa', '虚心合掌',	3),
(0,	'Shuni mudra', '智慧手印',	3),
(0,	'Uttanaja', '显露合掌',	3),
(0,	'Varada Mudra', '与愿印',	3),
(0,	'Bhumyakramana Mudra', '触地印',	3),
(0,	'Saranagamana Mudra', '皈依印',	3),
(0,	'Dhyana Mudra', '禅定印',	3),
(0,	'Humkara Mudra', '殊胜三界印',	3),
(0,	'kudmala', '未敷莲合掌',	3),
(0,	'adhara', '复手合掌',	3),
(0,	'viparita', '反叉合掌',	3),
(0,	'Viparyasta', '反背互相着合掌',	3),
(0,	'tiryak', '横拄指合掌',	3),
(0,	'hold a cintamani', '手持如意宝珠',	3),
(0,	'red palms', '红掌',	3),
(0,	'eye in palm', '掌心眼',	3);

-- 其他物件
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'Arrow', '箭', 4),
(0,	'fletching', '箭羽', 4),
(0,	'arrowhead', '箭头', 4),
(0,	'nock', '箭尾扣弓弦的弧口', 4),
(0,	'bow riser', '弓把', 4),
(0,	'bow limbs', '弓身', 4),
(0,	'Axe', '斧头',	4),
(0,	'Bell', '铃',	4),
(0,	'Bow', '弓',	4),
(0,	'bowl', '碗',	4),
(0,	'bowstring', '弓弦', 4),
(0,	'Buddhism item', '宗教物品',	4),
(0,	'Chain', '链条',	4),
(0,	'Cintamani Orb', '如意宝珠',	4),
(0,	'a pile of orbs', '一堆如意宝珠',	4),
(0,	'with orbs', '和宝珠',	4),
(0,	'cymbals', '钹',	4),
(0,	'ribbon', '缎带',	4),
(0,	'bowl of rice', '盛米的碗',	4),
(0,	'fangs', '尖牙',	4),
(0,	'Lotus Terrace', '莲花臺',	4),
(0,	'classic Lotus Terrace', '经典色彩的莲花臺',	4),
(0,	'part of Lotus Terrace', '部分莲花臺',	4),
(0,	'coral', '珊瑚',	4),
(0,	'deerskin', '鹿皮',	4),
(0,	'Dhaja', '幢',	4),
(0,	'Drum', '鼓',	4),
(0,	'Elephant', '大象',	4),
(0,	'Fire', '火',	4),
(0,	'Ghost', '鬼魂',	4),
(0,	'Hossu', '拂尘',	4),
(0,	'knowledge wheel', '知识之轮',	4),
(0,	'wheel', '轮子',	4),
(0,	'Lotus', '荷花',	4),
(0,	'lute', '琵琶',	4),
(0,	'mirror', '镜子',	4),
(0,	'Nectar Bottle', '甘露瓶',	4),
(0,	'Nectar Bowl', '甘露碗',	4),
(0,	'Pants', '裤子',	4),
(0,	'Person', '人类',	4),
(0,	'Purity Vase', '淨瓶',	4),
(0,	'religious offerings', '供品',	4),
(0,	'Scripture', '经书',	4),
(0,	'Skull wand', '头骨木杖',	4),
(0,	'Snake', '蛇',	4),
(0,	'Staff', '旗杆/棍棒',	4),
(0,	'Stamp', '印章',	4),
(0,	'Sword', '剑',	4),
(0,	'Temple', '寺庙',	4),
(0,	'Token', '令牌',	4),
(0,	'Utpala', '莲花',	4),
(0,	'Water', '水',	4),
(0,	'flames', '火焰',	4),
(0,	'handle', '把手',	4),
(0,	'streamers', '飘带',	4);

-- 金银珠宝
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'sapphire', '蓝宝石',	4),
(0,	'ruby', '红宝石',	4),
(0,	'emerald', '绿宝石',	4),
(0,	'obsidian', '黑曜石',	4),
(0,	'crystal', '水晶',	4),
(0,	'diamond', '鑽石',	4),
(0,	'gold', '黄金',	4),
(0,	'bronze', '青铜',	4),
(0,	'brass', '黄铜',	4),
(0,	'silverware', '银器',	4),
(0,	'porcelain', '瓷器',	4),
(0,	'pottery', '陶器',	4),
(0,	'iron', '铁的',	4);

-- 唐卡画派/作家/传统
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'KarmaGadri style', '噶玛迦德里',	5),
(0,	'Miansa style', '勉萨',	5),
(0,	'MianTang style', '勉唐',	5),
(0,	'Nepali style', '尼泊尔',	5),
(0,	'Qinzi style', '钦则',	5),
(0,	'Qiwugang style', '齐乌岗',	5),
(0,	'Kalsang', '格桑画师',	5),
(0,	'Karma Tenzin', '嘎玛旦增画师',	5),
(0,	'Tsultrim Norbu','次成诺布画师',	5),
(0,	'new thangka','创新唐卡',	5),
(0,	'Atisa Heritage', '阿底峡传承',	5),
(0,	'Dalai Lama Heritage', '达赖源流相',	5),
(0,	'Mindroling Tradition', '敏珠林寺传承',	5),
(0,	'Ocean of Conquerors', '大悲胜海',	5),
(0,	'tradition of Mitra-yogin', '无能胜友秘传',	5),
(0,	'tradition of the Great Pandita of Kashmir', '克什米尔班智达传承',	5),
(0,	'Uppalavanna Heritage', '莲花色比丘尼传承',	5);

-- 画作其他描述
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0, 'A drawing of', '一幅画', 6),
(0, 'A thangka of', '一幅唐卡', 6),
(0, 'circular halo', '圆形光环', 6),
(0, 'classic color', '经典色彩', 6),
(0, 'drop shape', '水滴形状', 6),
(0, 'rhombic shape', '菱形', 6),
(0, 'bottle shape', '瓶形', 6),
(0, 'square shape', '方形', 6),
(0, 'long', '长的', 6),
(0, 'thin', '细的', 6),
(0, 'thick', '厚的', 6),
(0, 'short', '短的', 6),
(0, 'like a ship rudder', '像船舵', 6),
(0, 'in the left middle hand', '在左侧手中', 6),
(0, 'gorgeous', '华丽的', 6),
(0, 'exquisite', '精致的', 6),
(0, 'simple', '简单的', 6),
(0, 'mandorla with golden line', '带金线的光轮', 6),
(0, 'wavy line pattern', '波浪线图案', 6),
(0, 'wooden', '木质的', 6),
(0, 'exquisite mandorla', '精致的光轮', 6),
(0, 'Exquisite patterns', '精美的图案', 6),
(0, 'golden thread embroidery', '金线刺绣', 6),
(0, 'no halo', '无光环', 6),
(0, 'silver embroidery', '银线刺绣', 6),
(0, 'Upper body', '上半身', 6),
(0, 'lower body', '下半身', 6),
(0, 'body light', '身周的光轮', 6),
(0, 'mandorla', '光轮', 6),
(0, 'halo', '光环', 6),
(0, 'head', '头部', 6),
(0, 'shadow', '阴影', 6),
(0, 'vertical', '竖直的', 6),
(0, 'slanting', '倾斜的', 6),
(0, 'horizontal', '水平的', 6),
(0, 'lying down', '躺倒的', 6),
(0, 'Thousand-armed background', '千手背景', 6),
(0, 'in a bowl', '在碗里', 6),
(0, 'on utpala', '在莲花上', 6),
(0, 'on the sea', '在海上', 6),
(0, 'dark sea', '深色的海面', 6),
(0, 'on the ground', '在地面上', 6),
(0, 'on the grassland', '在草原上', 6),
(0, 'on the river bank', '在河岸上', 6),
(0, 'rough waves', '汹涌的波浪', 6),
(0, 'at the peak', '在山顶', 6),
(0, 'leftside', '左侧', 6),
(0, 'rightside', '右侧', 6),
(0, 'stand on both sides', '站在两侧', 6),
(0, 'at the top', '在顶部', 6),
(0, 'above', '上方', 6),
(0, 'behind', '在后面', 6),
(0, 'in front', '在前面', 6),
(0, 'higher face are smaller', '上面的脸更小', 6),
(0, 'consists of white and green and red faces', '由白色、绿色和红色的脸组成', 6),
(0, 'oval tattoo', '椭圆形的纹身', 6),
(0, 'mole between eyebrows', '眉间的痣', 6),
(0, 'mole on forehead', '额头上的痣', 6),
(0, 'wear hoop earrings', '戴环形耳环', 6),
(0, 'wear leaves tiara', '戴叶子形冠冕', 6),
(0, 'wear tiara', '戴冠冕', 6),
(0, 'wear crown', '戴皇冠', 6),
(0, 'wear jewelry', '佩戴珠宝', 6),
(0, 'wear double bracelet', '佩戴双层手链', 6),
(0, 'with pendant', '带吊坠', 6),
(0, 'black hair down on shoulders', '黑发披肩', 6),
(0, 'dark blue three-eyed head', '深蓝色有三隻眼的脸', 6),
(0, 'angry head', '愤怒的脸', 6),
(0, 'colorful Mandorla', '五彩的光轮', 6),
(0, 'yellow background', '黄色背景', 6);

-- 花朵描述
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0, 'bud type', '花苞型', 7),
(0, 'flat type', '平展型', 7),
(0, 'flore pleno type', '重瓣型', 7),
(0, 'jagged petals', '锯齿形花瓣', 7),
(0, 'long peduncle', '长花梗', 7),
(0, 'one layer type', '单层型', 7),
(0, 'petals closed', '花瓣闭合', 7),
(0, 'pointed petals', '尖形花瓣', 7),
(0, 'round petals', '圆形花瓣', 7),
(0, 'round type', '圆型', 7),
(0, 'skirt type', '裙型', 7),
(0, 'small flower', '小型花', 7),
(0, 'tongue-shaped petals', '舌状花瓣', 7),
(0, 'two layers type', '双层型', 7),
(0, 'whole hand', '露出整隻手', 7),
(0, 'flower stem', '花茎', 7),
(0, 'anther', '雄蕊', 7),
(0, 'filament', '花丝', 7),
(0, 'stigma', '柱头', 7),
(0, 'flower style', '花朵形状', 7),
(0, 'carpel', '雌蕊叶', 7),
(0, 'petal', '花瓣', 7),
(0, 'sepal', '萼片', 7),
(0, 'receptacle', '花托', 7),
(0, 'peduncle', '花梗', 7),
(0, 'pistil', '雌蕊', 7),
(0, 'bushy leaves', '茂密的叶子', 7),
(0, 'jagged leaves', '锯齿状叶子', 7),
(0, 'seedpod at the center', '中央的种荚', 7),
(0, 'cloud-shaped petals', '云朵形花瓣', 7),
(0, 'with white outline', '带白色轮廓', 7),
(0, 'hand hold', '手持', 7);

-- Colors
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'achromatic colors', '黑白灰单色调',	8),
(0,	'bright colors', '明亮的色彩',	8),
(0,	'color peeling', '颜色剥落',	8),
(0,	'color scratched', '颜色刮擦',	8),
(0,	'cool colors', '冷色系',	8),
(0,	'dark colors', '深色',	8),
(0,	'deep colors', '更深的颜色',	8),
(0,	'dim colors', '饱和度低的暗色',	8),
(0,	'dusky colors', '饱和度高的暗色',	8),
(0,	'faded colors', '褪色的',	8),
(0,	'light colors', '浅色 ',	8),
(0,	'low brightness', '低亮度',	8),
(0,	'mild colors', '温和的色彩',	8),
(0,	'murky colors', '混浊的色彩',	8),
(0,	'pale colors', '苍白的',	8),
(0,	'pastel colors', '粉彩',	8),
(0,	'rich colors', '丰富的色彩',	8),
(0,	'strong colors', '强烈的色彩',	8),
(0,	'subdued colors', '黯淡的色彩',	8),
(0,	'vibrant colors', '鲜豔的色彩',	8),
(0,	'warm colors', '暖色系',	8),
(0,	'highlight', '高光',	8),
(0,	'pied', '斑驳的杂色',	8),
(0,	'faded and dim', '褪色无光',	8);

-- 画作风格
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'masterpiece', '杰作',	9),
(0,	'creased painting', '有摺痕的',	9),
(0,	'detailed painting', '细节清楚',	9),
(0,	'engraving painting', '凋刻版画',	9),
(0,	'Exquisite painting', '精緻的画作',	9),
(0,	'folded painting', '被折迭的画作',	9),
(0,	'line drawing', '线条图',	9),
(0,	'non-realistic', '超现实风格',	9),
(0,	'old painting', '老旧的画作',	9),
(0,	'painting on cotton', '画在棉布上',	9),
(0,	'painting on cotton scroll', '画在棉卷轴上',	9),
(0,	'painting on silk', '丝绸画',	9),
(0,	'painting on yellow canvas', '黄色画布',	9),
(0,	'pure gold', '纯金',	9),
(0,	'Realistic', '现实风格',	9),
(0,	'rough drawing', '粗糙的画作',	9),
(0,	'Silk Embroidery', '丝绸镶嵌',	9),
(0,	'simple drawing', '简单的涂鸦',	9),
(0,	'simple painting', '简单的画作',	9),
(0,	'watercolor painting', '水彩画',	9),
(0,	'yellowing painting', '泛黄的画作',	9);

-- Negative: 质量
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'blurry', '模糊的', 10),
(0,	'blurry painting', '模糊的画作', 10),
(0,	'normal quality', '普通质量',	10),
(0,	'low quality', '低质量',	10),
(0,	'low res', '低解析度',	10),
(0,	'worst quality', '质量很差', 10),
(0,	'jpeg artifacts', '不自然的',	10),
(0,	'grainy', '有颗粒感',	10),
(0,	'pixelated', '像素化',	10);

-- Negative: 构图
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'flat', '平坦', 11),
(0,	'no detail', '没有细节', 11),
(0,	'unfocused', '焦点不清', 11),
(0,	'poor lighting', '光线不足', 11),
(0,	'washed out', '褪色', 11),
(0,	'oversaturated', '过度饱和', 11),
(0,	'cropped', '裁剪', 11),
(0,	'incomplete', '不完整', 11),
(0,	'weird angles', '奇怪的角度', 11),
(0,	'distorted', '扭曲', 11),
(0,	'messy', '杂乱', 11),
(0,	'chaotic', '混乱', 11),
(0,	'oversaturated', '过度饱和', 11),
(0,	'dull colors', '暗淡的色彩', 11),
(0,	'low detail', '低细节', 11),
(0,	'low definition', '低清晰度', 11),
(0,	'lost edges', '丢失边缘', 11),
(0,	'rough', '粗糙', 11);

-- Negative: 负面元素
INSERT INTO `label` (`user_id`, `value`, `zh_CN`, `class`) VALUES
(0,	'bad', '糟糕', 12),
(0,	'ugly', '丑陋', 12),
(0,	'disfigured', '毁容', 12),
(0,	'unappealing', '不吸引人', 12),
(0,	'watermark', '水印', 12),
(0,	'artificial look', '人造外观', 12),
(0,	'stained painting', '有汙渍的画作', 12),
(0,	'worn painting', '磨损的画作', 12),
(0,	'wrinkled painting', '有皱折的画作', 12);


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
