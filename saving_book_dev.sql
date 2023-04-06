-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Apr 06, 2023 at 06:14 AM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.0.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `saving_book_dev`
--

-- --------------------------------------------------------

--
-- Table structure for table `income`
--

CREATE TABLE `income` (
  `id` int(11) NOT NULL,
  `totalMoney` decimal(15,2) DEFAULT NULL,
  `decNEC` decimal(15,2) DEFAULT NULL,
  `decLTS` decimal(15,2) DEFAULT NULL,
  `decEDU` decimal(15,2) DEFAULT NULL,
  `decPLAY` decimal(15,2) DEFAULT NULL,
  `decFFA` decimal(15,2) DEFAULT NULL,
  `decGIVE` decimal(15,2) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `userID` int(11) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pay`
--

CREATE TABLE `pay` (
  `id` int(11) NOT NULL,
  `totalMoney` decimal(15,2) DEFAULT NULL,
  `decNEC` decimal(15,2) DEFAULT NULL,
  `decLTS` decimal(15,2) DEFAULT NULL,
  `decEDU` decimal(15,2) DEFAULT NULL,
  `decPLAY` decimal(15,2) DEFAULT NULL,
  `decFFA` decimal(15,2) DEFAULT NULL,
  `decGIVE` decimal(15,2) DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `userID` int(11) NOT NULL,
  `createDate` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saving_money`
--

CREATE TABLE `saving_money` (
  `id` int(11) NOT NULL,
  `totalMoney` decimal(15,2) DEFAULT NULL,
  `decNEC` decimal(15,2) DEFAULT NULL,
  `decLTS` decimal(15,2) DEFAULT NULL,
  `decEDU` decimal(15,2) DEFAULT NULL,
  `decPLAY` decimal(15,2) DEFAULT NULL,
  `decFFA` decimal(15,2) DEFAULT NULL,
  `decGIVE` decimal(15,2) DEFAULT NULL,
  `userID` int(11) NOT NULL,
  `createDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_account`
--

CREATE TABLE `user_account` (
  `id` int(11) NOT NULL,
  `phoneNumber` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `BOD` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `income`
--
ALTER TABLE `income`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `pay`
--
ALTER TABLE `pay`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `saving_money`
--
ALTER TABLE `saving_money`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userID` (`userID`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `income`
--
ALTER TABLE `income`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pay`
--
ALTER TABLE `pay`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saving_money`
--
ALTER TABLE `saving_money`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `income`
--
ALTER TABLE `income`
  ADD CONSTRAINT `income_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `pay`
--
ALTER TABLE `pay`
  ADD CONSTRAINT `pay_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user_account` (`id`);

--
-- Constraints for table `saving_money`
--
ALTER TABLE `saving_money`
  ADD CONSTRAINT `saving_money_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user_account` (`id`),
  ADD CONSTRAINT `saving_money_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user_account` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
