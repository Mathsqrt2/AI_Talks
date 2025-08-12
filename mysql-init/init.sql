SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `mode` varchar(128) NOT NULL,
  `botId` int(11) NOT NULL,
  `username` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `conversationName` varchar(512) NOT NULL,
  `initialPrompt` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `content` text NOT NULL,
  `error` text DEFAULT NULL,
  `label` varchar(256) DEFAULT NULL,
  `tag` varchar(128) DEFAULT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `author` varchar(32) NOT NULL,
  `content` text NOT NULL,
  `generationTime` bigint(20) NOT NULL,
  `generatingStartTime` datetime NOT NULL,
  `generatingEndTime` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `settings` (
  `id` int(11) NOT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `maxMessagesCount` int(11) DEFAULT NULL,
  `maxContextSize` int(11) DEFAULT NULL,
  `maxAttempts` int(11) DEFAULT NULL,
  `retryAfterTimeInMiliseconds` int(11) DEFAULT NULL,
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `states` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `shouldContinue` tinyint(4) DEFAULT NULL,
  `shouldSendToTelegram` tinyint(4) DEFAULT NULL,
  `shouldDisplayResponse` tinyint(4) DEFAULT NULL,
  `shouldBroadcastOnWebSocket` tinyint(4) DEFAULT NULL,
  `shouldLog` tinyint(4) DEFAULT NULL,
  `isGeneratingOnAir` tinyint(4) DEFAULT NULL,
  `lastResponderName` varchar(256) DEFAULT NULL,
  `enqueuedMessageContent` text DEFAULT NULL,
  `enqueuedMessageAuthor` varchar(256) DEFAULT NULL,
  `currentMessageIndex` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `summaries` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `conversationId` int(11) DEFAULT NULL,
  `content` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `createdAt` datetime(6) NOT NULL DEFAULT current_timestamp(6),
  `updatedAt` datetime(6) DEFAULT current_timestamp(6) ON UPDATE current_timestamp(6),
  `initializationHash` varchar(128) DEFAULT NULL,
  `currentHash` varchar(128) DEFAULT NULL,
  `login` varchar(256) NOT NULL,
  `password` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `createdAt`, `updatedAt`, `initializationHash`, `currentHash`, `login`, `password`) VALUES
(1, '2025-08-12 22:39:15.545191', '2025-08-12 22:44:58.965325', 'b42e56493afdd26cacb4023e0076b44112c2d3d5b1152b67f97dd27e91d420c09b4e5229376a50873d0af4c5baee8384cb596346e23c993ff35cea6a048540b7', 'b42e56493afdd26cacb4023e0076b44112c2d3d5b1152b67f97dd27e91d420c09b4e5229376a50873d0af4c5baee8384cb596346e23c993ff35cea6a048540b7', 'ai_talks', 'e03ebc90-f536-487d-b0a7-04ea821e61e8$022b70b9ba0347c4edde012e1f065fddba6f40a16ccfa8875d057dcd339f2189c0eac8ed7135dfdb5ede29c6d75dff934c1ba377b6321021c3967941f9d9eed2');

ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2ba3f4e3ed6ec82a45bfd008a98` (`conversationId`);

ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_574180ce3486911f2b268b8473` (`conversationName`);

ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_7af773c87422ef99cddbcc39067` (`conversationId`);

ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_e5663ce0c730b2de83445e2fd19` (`conversationId`);

ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_2f7c413efd45151bf555934514b` (`conversationId`);

ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_98d084feeac4c6d13b5eab91760` (`conversationId`);

ALTER TABLE `summaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_49fc33d364036bd554b2693d7d9` (`conversationId`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `IDX_2d443082eccd5198f95f2a36e2` (`login`);

ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `states`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `summaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

ALTER TABLE `comments`
  ADD CONSTRAINT `FK_2ba3f4e3ed6ec82a45bfd008a98` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `logs`
  ADD CONSTRAINT `FK_7af773c87422ef99cddbcc39067` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `messages`
  ADD CONSTRAINT `FK_e5663ce0c730b2de83445e2fd19` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

ALTER TABLE `settings`
  ADD CONSTRAINT `FK_2f7c413efd45151bf555934514b` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `states`
  ADD CONSTRAINT `FK_98d084feeac4c6d13b5eab91760` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `summaries`
  ADD CONSTRAINT `FK_49fc33d364036bd554b2693d7d9` FOREIGN KEY (`conversationId`) REFERENCES `conversations` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;