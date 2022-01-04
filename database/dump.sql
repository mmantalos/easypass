-- MariaDB dump 10.19  Distrib 10.6.5-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: easy_pass
-- ------------------------------------------------------
-- Server version	10.6.5-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `user_id` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_type` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `passes`
--

DROP TABLE IF EXISTS `passes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passes` (
  `pass_id` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicle_ref` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `station_ref` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `charge` float NOT NULL,
  PRIMARY KEY (`pass_id`),
  KEY `does` (`vehicle_ref`),
  KEY `through` (`station_ref`),
  CONSTRAINT `does` FOREIGN KEY (`vehicle_ref`) REFERENCES `vehicles` (`vehicle_id`),
  CONSTRAINT `through` FOREIGN KEY (`station_ref`) REFERENCES `stations` (`station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `passes`
--

LOCK TABLES `passes` WRITE;
/*!40000 ALTER TABLE `passes` DISABLE KEYS */;
INSERT INTO `passes` VALUES ('1','v1','AO07','2022-01-02 15:32:00',3.1),('2','v2','AO06','2022-01-02 14:34:00',2.9),('3','v2','AO06','2022-01-02 16:18:02',4.1),('4','v1','AO07','2021-12-11 11:21:59',2.9);
/*!40000 ALTER TABLE `passes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `providers`
--

DROP TABLE IF EXISTS `providers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `providers` (
  `provider_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `provider_abbr` varchar(5) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  PRIMARY KEY (`provider_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `providers`
--

LOCK TABLES `providers` WRITE;
/*!40000 ALTER TABLE `providers` DISABLE KEYS */;
INSERT INTO `providers` VALUES ('aodos','AO',1),('egnatia','EG',1),('kentriki_odos','KO',1);
/*!40000 ALTER TABLE `providers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settlement`
--

DROP TABLE IF EXISTS `settlement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settlement` (
  `settlement_id` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator_debited` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `operator_credited` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `amount` float NOT NULL,
  `is_paid` tinyint(2) NOT NULL,
  `payment_details` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`settlement_id`),
  KEY `owes` (`operator_debited`),
  KEY `receives` (`operator_credited`),
  CONSTRAINT `owes` FOREIGN KEY (`operator_debited`) REFERENCES `providers` (`provider_name`),
  CONSTRAINT `receives` FOREIGN KEY (`operator_credited`) REFERENCES `providers` (`provider_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settlement`
--

LOCK TABLES `settlement` WRITE;
/*!40000 ALTER TABLE `settlement` DISABLE KEYS */;
/*!40000 ALTER TABLE `settlement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stations`
--

DROP TABLE IF EXISTS `stations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `stations` (
  `station_id` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `station_provider` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `station_name` varchar(40) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`station_id`),
  KEY `FKstations561011` (`station_provider`),
  CONSTRAINT `FKstations561011` FOREIGN KEY (`station_provider`) REFERENCES `providers` (`provider_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stations`
--

LOCK TABLES `stations` WRITE;
/*!40000 ALTER TABLE `stations` DISABLE KEYS */;
INSERT INTO `stations` VALUES ('AO05','aodos','aodos tolls station 05'),('AO06','aodos','aodos tolls station 06'),('AO07','aodos','aodos tolls station 07'),('EG01','egnatia','egnatia tolls station 01');
/*!40000 ALTER TABLE `stations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vehicles`
--

DROP TABLE IF EXISTS `vehicles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `vehicles` (
  `vehicle_id` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_provider` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tag_id` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `license_year` year(4) NOT NULL,
  PRIMARY KEY (`vehicle_id`),
  KEY `FKvehicles581378` (`tag_provider`),
  CONSTRAINT `FKvehicles581378` FOREIGN KEY (`tag_provider`) REFERENCES `providers` (`provider_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vehicles`
--

LOCK TABLES `vehicles` WRITE;
/*!40000 ALTER TABLE `vehicles` DISABLE KEYS */;
INSERT INTO `vehicles` VALUES ('v1','egnatia','032',2001),('v2','egnatia','033',2000),('v3','kentriki_odos','034',2000);
/*!40000 ALTER TABLE `vehicles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-04 18:44:12