-- MySQL dump 10.13  Distrib 9.5.0, for macos26.1 (arm64)
--
-- Host: localhost    Database: spine
-- ------------------------------------------------------
-- Server version	9.5.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '6d61c55a-e255-11f0-a913-51b391be02cf:1-355';

--
-- Table structure for table `employee_projects`
--

DROP TABLE IF EXISTS `employee_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `employee_id` bigint NOT NULL,
  `project_id` bigint NOT NULL,
  `allocation_percentage` decimal(5,2) DEFAULT '100.00',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_primary` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_project` (`employee_id`,`project_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `employee_projects_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE,
  CONSTRAINT `employee_projects_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_projects`
--

LOCK TABLES `employee_projects` WRITE;
/*!40000 ALTER TABLE `employee_projects` DISABLE KEYS */;
INSERT INTO `employee_projects` VALUES (56,10,2,100.00,'2020-05-05',NULL,1,'2026-01-19 02:07:42','2026-01-19 02:07:42'),(57,10,20,100.00,'2020-05-05',NULL,0,'2026-01-19 02:07:42','2026-01-19 02:07:42'),(58,1,2,100.00,'2023-01-15',NULL,1,'2026-01-19 02:07:47','2026-01-19 02:07:47'),(59,11,20,100.00,NULL,NULL,1,'2026-01-19 02:07:51','2026-01-19 02:07:51'),(60,12,21,100.00,NULL,NULL,1,'2026-01-19 02:07:56','2026-01-19 02:07:56'),(61,13,21,100.00,NULL,NULL,1,'2026-01-19 02:08:01','2026-01-19 02:08:01'),(62,14,3,100.00,'2025-01-01',NULL,1,'2026-01-19 02:08:05','2026-01-19 02:08:05'),(63,14,2,100.00,'2025-01-01',NULL,0,'2026-01-19 02:08:05','2026-01-19 02:08:05'),(66,9,2,100.00,'2020-01-01',NULL,1,'2026-01-21 02:39:45','2026-01-21 02:39:45');
/*!40000 ALTER TABLE `employee_projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employee_roles`
--

DROP TABLE IF EXISTS `employee_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(100) NOT NULL,
  `role_description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`),
  KEY `idx_role_name` (`role_name`),
  KEY `idx_role_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employee_roles`
--

LOCK TABLES `employee_roles` WRITE;
/*!40000 ALTER TABLE `employee_roles` DISABLE KEYS */;
INSERT INTO `employee_roles` VALUES (1,'Account Receivable','Updated description',1,'2026-01-02 11:17:54','2026-01-15 05:50:31'),(2,'Billing Posting','Posting and processing billing entries',1,'2026-01-02 11:17:54','2026-01-02 11:17:54'),(3,'Coding','Medical coding and procedure documentation',1,'2026-01-02 11:17:54','2026-01-02 11:17:54'),(4,'Patient Calling','Patient communication and follow-up',1,'2026-01-02 11:17:54','2026-01-02 11:17:54'),(5,'Authorization','Insurance authorization and verification',1,'2026-01-02 11:17:54','2026-01-02 11:17:54'),(6,'Manager','Team management role',1,'2026-01-02 06:00:57','2026-01-02 06:00:57'),(7,'Trainee','',1,'2026-01-02 06:10:04','2026-01-02 06:10:04');
/*!40000 ALTER TABLE `employee_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `emp_id` varchar(50) NOT NULL,
  `name` varchar(200) NOT NULL,
  `project` varchar(200) DEFAULT NULL,
  `agency` varchar(255) DEFAULT NULL,
  `employee_role` varchar(100) DEFAULT NULL,
  `billable_status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `billing_type` varchar(20) DEFAULT 'Non-Billable',
  `start_date` date DEFAULT NULL,
  `tenure` varchar(50) DEFAULT NULL,
  `project_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `emp_id` (`emp_id`),
  KEY `idx_emp_id` (`emp_id`),
  KEY `idx_project` (`project`),
  KEY `idx_employee_role` (`employee_role`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `employees`
--

LOCK TABLES `employees` WRITE;
/*!40000 ALTER TABLE `employees` DISABLE KEYS */;
INSERT INTO `employees` VALUES (1,'EMP001','John Doe','Precision Medical Billing',NULL,'Manager',1,'2026-01-02 09:44:43','2026-01-19 07:37:47','Billable','2023-01-15','2 years 11 months',NULL),(9,'1234','Saurabh','Precision Medical Billing','ewer3','Patient Calling',1,'2026-01-10 14:11:19','2026-01-21 08:09:45','Billable','2020-01-01','6 years 14 days',NULL),(10,'12345','demo','Precision Medical Billing, Project Gamma',NULL,'Account Receivable',1,'2026-01-10 14:30:12','2026-01-19 07:37:42','Billable','2020-05-05','N/A',NULL),(11,'EMP12346','acfdasfds','Project Gamma',NULL,'Manager',1,'2026-01-13 06:47:21','2026-01-19 07:37:51','Billable',NULL,'N/A',NULL),(12,'EMP12347','John Doe','Project Delta',NULL,'Billing Posting',1,'2026-01-15 11:31:41','2026-01-19 07:37:56','Billable',NULL,'N/A',NULL),(13,'EMP12348','demo01','Project Delta',NULL,'Coding',1,'2026-01-15 11:32:17','2026-01-19 07:38:01','Billable',NULL,'N/A',NULL),(14,'EMP12349','xxzx xz','Demo project, Precision Medical Billing',NULL,'Account Receivable',1,'2026-01-15 15:56:02','2026-01-19 07:38:05','Billable','2025-01-01','1 year 14 days',NULL),(15,'TEST1768977649','API Test User - Agency Verification','Test Project',NULL,'Developer',1,'2026-01-21 06:40:49','2026-01-21 06:40:56',NULL,'2024-01-01','2 years 20 days',NULL),(16,'VERIFY1768977649','Verification Test User','Verification Project','Updated Agency - SUCCESS','Tester',1,'2026-01-21 06:43:44','2026-01-21 06:43:52',NULL,'2024-01-01','2 years 20 days',NULL);
/*!40000 ALTER TABLE `employees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `finance_roles`
--

DROP TABLE IF EXISTS `finance_roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `finance_roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `role_name` varchar(50) NOT NULL,
  `role_description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `role_name` (`role_name`),
  KEY `idx_role_name` (`role_name`),
  KEY `idx_role_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `finance_roles`
--

LOCK TABLES `finance_roles` WRITE;
/*!40000 ALTER TABLE `finance_roles` DISABLE KEYS */;
INSERT INTO `finance_roles` VALUES (1,'USER','Regular user with basic access',1,'2025-12-30 08:47:17','2025-12-30 08:47:17'),(2,'ADMIN','Administrator with full access',1,'2025-12-30 08:47:17','2025-12-30 08:47:17'),(3,'MANAGER','Manager with elevated permissions',1,'2025-12-30 08:47:17','2025-12-30 08:47:17'),(4,'FINANCE','Finance department user',1,'2025-12-30 08:47:17','2025-12-30 08:47:17');
/*!40000 ALTER TABLE `finance_roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `action` varchar(50) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `permission_description` varchar(255) DEFAULT NULL,
  `permission_name` varchar(100) NOT NULL,
  `resource` varchar(100) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_nry1f3jmc4abb5yvkftlvn6vg` (`permission_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_category`
--

DROP TABLE IF EXISTS `project_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `project_category` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `category_name` varchar(100) NOT NULL,
  `category_description` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_name` (`category_name`),
  KEY `idx_category_name` (`category_name`),
  KEY `idx_category_active` (`is_active`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_category`
--

LOCK TABLES `project_category` WRITE;
/*!40000 ALTER TABLE `project_category` DISABLE KEYS */;
INSERT INTO `project_category` VALUES (6,'Contingency-Based','Contingency-based projects',1,'2026-01-02 08:34:16','2026-01-02 08:34:16'),(7,'FTE Based','Full-Time Equivalent based projects',1,'2026-01-02 08:34:16','2026-01-02 08:34:16'),(8,'Infrastructure','Infrastructure and maintenance projects',1,'2026-01-02 12:20:24','2026-01-02 12:20:24'),(9,'Development','Software development projects',1,'2026-01-02 12:20:24','2026-01-02 12:20:24'),(10,'Research','Research and innovation projects',1,'2026-01-02 12:20:24','2026-01-02 12:20:24'),(11,'Operations','Operational improvement projects',1,'2026-01-02 12:20:24','2026-01-02 12:20:24'),(12,'Training','Training and development initiatives',1,'2026-01-02 12:20:24','2026-01-02 12:20:24');
/*!40000 ALTER TABLE `project_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `project_name` varchar(200) NOT NULL,
  `project_description` text,
  `project_code` varchar(50) DEFAULT NULL,
  `category_id` bigint DEFAULT NULL,
  `project_type` varchar(50) DEFAULT 'FTE',
  `status` varchar(50) DEFAULT 'ACTIVE',
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `budget` decimal(15,2) DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `created_by` bigint DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `project_code` (`project_code`),
  KEY `idx_project_code` (`project_code`),
  KEY `idx_project_category` (`category_id`),
  KEY `idx_project_status` (`status`),
  KEY `idx_project_department` (`department`),
  KEY `idx_project_created_by` (`created_by`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `project_category` (`id`) ON DELETE SET NULL,
  CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (2,'Precision Medical Billing','','PRJ-1767344360616',7,'FTE','ACTIVE','2020-01-01',NULL,NULL,'Pune','Operations',NULL,'2026-01-02 08:59:21','2026-01-02 08:59:21'),(3,'Demo project','','PRJ-1767344616921',6,'FTE','ACTIVE','2021-01-01',NULL,NULL,'Pune','Operations',NULL,'2026-01-02 09:03:37','2026-01-02 09:03:37'),(4,'demo fjdhgfks','',NULL,6,'FTE',NULL,'2025-12-29',NULL,NULL,'','Operations',NULL,'2026-01-02 10:14:30','2026-01-07 12:18:52'),(14,'Project Alpha','Main corporate project','PRJ-ALPHA',7,'FTE','ACTIVE','2025-01-01','2025-12-31',500000.00,'New York','Finance',NULL,'2026-01-02 12:06:54','2026-01-02 12:06:54'),(20,'Project Gamma','Internal development','PRJ-GAMMA',7,'FTE','ACTIVE','2025-03-01','2025-10-31',150000.00,'Austin','IT',4,'2026-01-02 12:07:32','2026-01-02 12:07:32'),(21,'Project Delta','Research initiative','PRJ-DELTA',6,'Contingency','ACTIVE','2025-04-01','2025-09-30',75000.00,'Boston','Finance',4,'2026-01-02 12:07:32','2026-01-02 12:07:32');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role_permissions` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  PRIMARY KEY (`role_id`,`permission_id`),
  KEY `FKegdk29eiy7mdtefy5c7eirr6e` (`permission_id`),
  CONSTRAINT `FK3t31gy2jw3uk3t7d73b0gq6qr` FOREIGN KEY (`role_id`) REFERENCES `finance_roles` (`id`),
  CONSTRAINT `FKegdk29eiy7mdtefy5c7eirr6e` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `role_permissions`
--

LOCK TABLES `role_permissions` WRITE;
/*!40000 ALTER TABLE `role_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `role_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `created_at` datetime(6) DEFAULT NULL,
  `id` bigint NOT NULL AUTO_INCREMENT,
  `updated_at` datetime(6) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `employee_number` varchar(255) DEFAULT NULL,
  `role_id` bigint DEFAULT '1',
  `linked_accounts` json DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('2025-12-30 12:40:18.584425',4,'2026-01-15 23:24:57.829069','Finance','saurabhbode@3genconsulting.com','1234',2,NULL,'Pune','admin','$2a$10$EyWiXc9hN/Z5BPqlABWwYOuIHk/t6PrxqMdYtb6Jeb7WUP37CsA82','admin'),('2025-12-30 13:09:01.501156',5,'2026-01-04 14:18:57.954860','Finance','saurabhbode222.sb@gmail.com','1235',4,NULL,'Pune','admin1','$2a$10$qhqh6VLyTgXZIjUM5ide9.hZNyvEEAzx4EAhu8XJOUtrzKUFciuWy','admin1');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-23  0:38:41
