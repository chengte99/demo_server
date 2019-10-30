# ************************************************************
# Sequel Pro SQL dump
# Version 5428
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.16)
# Database: bycw_game_p
# Generation Time: 2019-10-30 04:36:17 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table ugame
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ugame`;

CREATE TABLE `ugame` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL DEFAULT '0' COMMENT '用戶id',
  `uexp` int(11) NOT NULL DEFAULT '0' COMMENT '經驗值',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '0-非法，1-正常',
  `uchip` int(11) NOT NULL DEFAULT '0' COMMENT '金幣',
  `udata` int(11) NOT NULL DEFAULT '0' COMMENT '用戶數據',
  `uvip` int(11) NOT NULL DEFAULT '0' COMMENT '等級',
  `uvip_endtime` int(11) NOT NULL DEFAULT '0' COMMENT '等級到期時間',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `ugame` WRITE;
/*!40000 ALTER TABLE `ugame` DISABLE KEYS */;

INSERT INTO `ugame` (`id`, `uid`, `uexp`, `status`, `uchip`, `udata`, `uvip`, `uvip_endtime`)
VALUES
	(1,6,1000,1,1000,0,0,0);

/*!40000 ALTER TABLE `ugame` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
