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
-- Table structure for table `passes`
--

DROP TABLE IF EXISTS `passes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `passes` (
  `pass_id` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vehicle_ref` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `station_ref` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `charge` numeric(10,2) NOT NULL,
  PRIMARY KEY (`pass_id`),
  KEY `does` (`vehicle_ref`),
  KEY `through` (`station_ref`),
  CONSTRAINT `does` FOREIGN KEY (`vehicle_ref`) REFERENCES `vehicles` (`vehicle_id`),
  CONSTRAINT `through` FOREIGN KEY (`station_ref`) REFERENCES `stations` (`station_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


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
  `amount` numeric(10,2) NOT NULL,
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

DROP VIEW IF EXISTS passes_info;

CREATE VIEW passes_info AS
SELECT passes.pass_id,
       passes.vehicle_ref,
       passes.station_ref,
       passes.timestamp,
       passes.charge,
       stations.station_provider as op1_ID,
       vehicles.tag_provider as op2_ID
FROM passes
INNER JOIN vehicles
ON passes.vehicle_ref=vehicles.vehicle_id
INNER JOIN stations
ON stations.station_id=passes.station_ref;
/*!40101 SET character_set_client = @saved_cs_client */;


/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-01-04 18:44:12
