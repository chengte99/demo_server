# ************************************************************
# Sequel Pro SQL dump
# Version 5428
#
# https://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 8.0.16)
# Database: bycw_center_p
# Generation Time: 2019-12-04 09:52:58 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table uinfo
# ------------------------------------------------------------

DROP TABLE IF EXISTS `uinfo`;

CREATE TABLE `uinfo` (
  `uid` int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'uid，全局唯一',
  `unick` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '暱稱',
  `uname` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '用戶帳號，全局唯一',
  `upwd` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '用戶密碼的md5',
  `usex` int(11) NOT NULL DEFAULT '0' COMMENT '用戶性別，0=女，1=男',
  `uface` int(11) NOT NULL DEFAULT '0' COMMENT '用戶頭像，0=預設，1=自定義',
  `uphone` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '用戶電話',
  `uemail` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '用戶郵箱',
  `ucity` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '用戶城市',
  `guest_key` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '""' COMMENT '遊客key',
  `is_guest` int(11) NOT NULL DEFAULT '1' COMMENT '是否為遊客，0=非遊客，1=遊客',
  `uvip` int(11) NOT NULL DEFAULT '0' COMMENT 'vip等級',
  `vip_endtime` int(11) NOT NULL DEFAULT '0' COMMENT 'vip結束時間戳',
  `status` int(11) NOT NULL DEFAULT '1' COMMENT '用戶狀態，0=停用，1=啟用',
  PRIMARY KEY (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

LOCK TABLES `uinfo` WRITE;
/*!40000 ALTER TABLE `uinfo` DISABLE KEYS */;

INSERT INTO `uinfo` (`uid`, `unick`, `uname`, `upwd`, `usex`, `uface`, `uphone`, `uemail`, `ucity`, `guest_key`, `is_guest`, `uvip`, `vip_endtime`, `status`)
VALUES
	(1,'遊客998919','\"\"','\"\"',0,0,'\"\"','\"\"','\"\"','mcPYQPcNY66HWNBNy8GTdcmAtPGHdMHQ',1,0,0,1),
	(2,'遊客135676','\"\"','\"\"',0,0,'\"\"','\"\"','\"\"','2ZN2MP2kjaQCsGN7esAm4hfMZYne5SC2',1,0,0,1),
	(3,'遊客784528','\"\"','\"\"',0,0,'\"\"','\"\"','\"\"','8FcZ5DAMT8Q55cXQhZaae5X5fFbjAFCC',1,0,0,1),
	(4,'遊客698557','\"\"','\"\"',0,0,'\"\"','\"\"','\"\"','sfDZikdm7EYWEyRYQ27xfAip5tFeDFf3',1,0,0,1),
	(5,'遊客218873','\"\"','\"\"',0,0,'\"\"','\"\"','\"\"','4C86jAtC4NfbGjJE37PxJnAtCFbr8jXR',1,0,0,1),
	(6,'遊客750263','\"\"','\"\"',0,0,'\"\"','\"\"','\"\"','yskZPKGPaGpck6JxSM5sYFCBjmdE5EdJ',1,0,0,1);

/*!40000 ALTER TABLE `uinfo` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
