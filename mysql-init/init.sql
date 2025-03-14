-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 14, 2025 at 07:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ai_talks`
--

-- --------------------------------------------------------

--
-- Table structure for table `comment`
--

CREATE TABLE `comment` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `mode` varchar(128) NOT NULL,
  `botId` int(11) NOT NULL,
  `username` varchar(256) NOT NULL,
  `createdAt` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `id` int(11) NOT NULL,
  `conversationName` varchar(512) NOT NULL,
  `initialPrompt` text NOT NULL,
  `createdAt` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `error` text DEFAULT NULL,
  `label` varchar(256) DEFAULT NULL,
  `tag` varchar(128) DEFAULT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `createdAt` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `author` varchar(32) NOT NULL,
  `content` text NOT NULL,
  `generationTime` bigint(20) NOT NULL,
  `generatingStartTime` bigint(20) NOT NULL,
  `generatingEndTime` bigint(20) NOT NULL,
  `createdAt` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `maxMessagesCount` int(11) DEFAULT NULL,
  `maxContextSize` int(11) DEFAULT NULL,
  `maxAttempts` int(11) DEFAULT NULL,
  `retryAfterTimeInMiliseconds` int(11) DEFAULT NULL,
  `createdAt` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `state`
--

CREATE TABLE `state` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) NOT NULL,
  `shouldContinue` tinyint(4) DEFAULT NULL,
  `shouldSendToTelegram` tinyint(4) DEFAULT NULL,
  `shouldDisplayResponse` tinyint(4) DEFAULT NULL,
  `shouldLog` tinyint(4) DEFAULT NULL,
  `isGeneratingOnAir` tinyint(4) DEFAULT NULL,
  `lastResponderName` varchar(256) DEFAULT NULL,
  `enqueuedMessageContent` text DEFAULT NULL,
  `enqueuedMessageAuthor` varchar(256) DEFAULT NULL,
  `currentMessageIndex` int(11) NOT NULL,
  `createdAt` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comment`
--
ALTER TABLE `comment`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_84d5faee520938f1faffd3363ac` (`conversationId`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7af773c87422ef99cddbcc39067` (`conversationId`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7cf4a4df1f2627f72bf6231635f` (`conversationId`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2f7c413efd45151bf555934514b` (`conversationId`);

--
-- Indexes for table `state`
--
ALTER TABLE `state`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_6e79526e45e88a4edd6da84f694` (`conversationId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comment`
--
ALTER TABLE `comment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `message`
--
ALTER TABLE `message`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `settings`
--
ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `state`
--
ALTER TABLE `state`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comment`
--
ALTER TABLE `comment`
  ADD CONSTRAINT `FK_84d5faee520938f1faffd3363ac` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `logs`
--
ALTER TABLE `logs`
  ADD CONSTRAINT `FK_7af773c87422ef99cddbcc39067` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `FK_7cf4a4df1f2627f72bf6231635f` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `settings`
--
ALTER TABLE `settings`
  ADD CONSTRAINT `FK_2f7c413efd45151bf555934514b` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `state`
--
ALTER TABLE `state`
  ADD CONSTRAINT `FK_6e79526e45e88a4edd6da84f694` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
