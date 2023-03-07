-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 07, 2023 at 10:20 AM
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

--
-- Dumping data for table `saving_money`
--

INSERT INTO `saving_money` (`id`, `totalMoney`, `decNEC`, `decLTS`, `decEDU`, `decPLAY`, `decFFA`, `decGIVE`, `userID`, `createDate`) VALUES
(1, '7000000.00', '3850000.00', '700000.00', '700000.00', '700000.00', '700000.00', '350000.00', 1, '2023-03-07');

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
-- Dumping data for table `user_account`
--

INSERT INTO `user_account` (`id`, `phoneNumber`, `password`, `firstName`, `lastName`, `BOD`, `email`, `image`, `status`) VALUES
(1, '0853081205', 'Um9vbmV5MTBA', 'Dương', 'Trọng Nhân', '2001-03-08', 'kenduongi.v.v.v.i@gmail.com', NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `saving_money`
--
ALTER TABLE `saving_money`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `saving_money`
--
ALTER TABLE `saving_money`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user_account`
--
ALTER TABLE `user_account`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
