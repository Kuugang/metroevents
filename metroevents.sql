-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 12, 2023 at 12:34 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `metroevents`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `createdAt`) VALUES
(2, 'kuugang', '$2a$10$ZVhqMr0H/yjbUXVkkWzXMOvoRtgfbZAdJAuUEom0RlyFybSAHg4QK', '2023-11-11 12:19:58');

-- --------------------------------------------------------

--
-- Table structure for table `blacklist`
--

CREATE TABLE `blacklist` (
  `id` int(11) NOT NULL,
  `token` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blacklist`
--

INSERT INTO `blacklist` (`id`, `token`) VALUES
(24, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMTk5NjEsImV4cCI6MTcwMjEwNjM2MX0.LlOCphx_s6plNYtvrqv9hINPBnsyRKVmJTMOS5IwpIQ'),
(25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjA2NDYsImV4cCI6MTcwMjEwNzA0Nn0.6ijFyOaImGDdEwdaUQJDusaofzERFqa5hrr7nIvvgu4'),
(26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjIyNTgsImV4cCI6MTcwMjEwODY1OH0.H-vpfD8gnhj_l-6CoJ-_zbYxTjHrbckyWdzoMC4nezU'),
(27, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjIzMjQsImV4cCI6MTcwMjEwODcyNH0.ewBdZPnwd20Jea6_s7f_5StGuim5buXLdhdpL4O3fAI'),
(28, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjpmYWxzZSwiaWF0IjoxNzAyMDIyMzQ2LCJleHAiOjE3MDIxMDg3NDZ9.B99KfvPilIGabpzRJKHO6CEsbTgHsSbae3AdY_yFX1Q'),
(29, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjIzNTYsImV4cCI6MTcwMjEwODc1Nn0.gBqt9WjZOkLNK4UXyOw8ZIr7kREDXjT-XSsdMPiiG5A'),
(30, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInVzZXJuYW1lIjoiamFrZTIiLCJmaXJzdE5hbWUiOiJhc2QiLCJsYXN0TmFtZSI6ImFzZCIsImlzT3JnYW5pemVyIjpmYWxzZSwiaWF0IjoxNzAyMDIzMTQ1LCJleHAiOjE3MDIxMDk1NDV9.nbpbWhVgSveQ4ZnkPBfQkGPbGi9rJd_9LsBOBambOOE'),
(31, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjQ1ODcsImV4cCI6MTcwMjExMDk4N30.hvXCemPdwcmEYTR3KnOgDDa_wqBfPLU12JZggvHtqHU'),
(32, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjQ2NjQsImV4cCI6MTcwMjExMTA2NH0.QBDo5ZUvdiLk3DoMweWyo4p6yZ2q1DILy_87cQUbK54'),
(33, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjQ2NzUsImV4cCI6MTcwMjExMTA3NX0.au8ar_vM_5WbPTB_53b0XYttxrtepFDGCJkGTo4_H1M'),
(34, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjQ3NTEsImV4cCI6MTcwMjExMTE1MX0.rorLFtuAiUu73797_p3tX-MPfyAinczQS3skxv3SLJo'),
(35, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjQ4MDIsImV4cCI6MTcwMjExMTIwMn0.SPN2hqL3wIgyyXhrNpA9hwOSCJT_CG5lNpBdMqV6xwI'),
(36, 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjQ4NDMsImV4cCI6MTcwMjExMTI0M30.X546HF2SASvxk7y7zuLU4xoPI7gxskrF9n7U8dFekyo'),
(37, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjU4ODgsImV4cCI6MTcwMjExMjI4OH0.WW5K6e6G3joPH8n6AZlJ4XqKPXw-09bkNYpFasBOD7U'),
(38, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInVzZXJuYW1lIjoiamFrZTIiLCJmaXJzdE5hbWUiOiJhc2QiLCJsYXN0TmFtZSI6ImFzZCIsImlzT3JnYW5pemVyIjpmYWxzZSwiaWF0IjoxNzAyMDI2MTM2LCJleHAiOjE3MDIxMTI1MzZ9.8efcCmIVwC5ZjfAkxqo_ssNPOXVwGFhChxfbdptJ2E8'),
(39, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjY0NjksImV4cCI6MTcwMjExMjg2OX0.W49I6yYzzjU3_O6zL_BLfDsInuWykk5aXVEabnbLr5o'),
(40, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTMsInVzZXJuYW1lIjoiamFrZTIiLCJmaXJzdE5hbWUiOiJhc2QiLCJsYXN0TmFtZSI6ImFzZCIsImlzT3JnYW5pemVyIjpmYWxzZSwiaWF0IjoxNzAyMDI2NjM2LCJleHAiOjE3MDIxMTMwMzZ9.5zd9MTuMM-VF0zyJqWiZ1TFGMSYkhydsvQ-Fop1aSzQ'),
(41, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwMjcyNTEsImV4cCI6MTcwMjExMzY1MX0.1uCB9ao9mLdKAynRMmlLzMOh_e4lvDp71bb-JmqNHuk'),
(42, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwNTMzODUsImV4cCI6MTcwMjEzOTc4NX0.6BGNDG7J8_YrJMdb2L8suhDuqhLcldIy1lVZY9YR9AI'),
(43, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwNTM1MTQsImV4cCI6MTcwMjEzOTkxNH0.4d_Fm-cfio184cpCEPf1M90O1JS0GNRz2pJnBUR_fqk'),
(44, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwNTM2MjIsImV4cCI6MTcwMjE0MDAyMn0.EqrJ7TsAmYjdV76jAlYlw5bPMJNlqc3Qso2_qbJOAas'),
(45, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwNTM2MzEsImV4cCI6MTcwMjE0MDAzMX0.90KeL67nFTg6RNCG23hqBoMS_yF71bR1vAtOG3l06XI'),
(46, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIwNTQwOTQsImV4cCI6MTcwMjE0MDQ5NH0.vHnyQBWkqjgxP3R_1ycUQFphkJlusW7_XdgwAQMDMZI'),
(47, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywidXNlcm5hbWUiOiJqYWtlIiwiZmlyc3ROYW1lIjoiIiwibGFzdE5hbWUiOiIiLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjA1NDIyNiwiZXhwIjoxNzAyMTQwNjI2fQ.i8jRY_FU4QhVIDDSIX7ySRe5MZmbwyHg8ZsBRvfFmtQ'),
(48, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjEzNTEzMSwiZXhwIjoxNzAyMjIxNTMxfQ.dWh-DXIwpuuAEtOl9xXJwFWfSkUo5IBmkhIFcSeePk8'),
(49, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIxNDMzNTcsImV4cCI6MTcwMjIyOTc1N30.KNOcMqwtLWR7CmbeUt5rsi1V9fl-oFBXWhaZeG4Rlvs'),
(50, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjE0Njc5MywiZXhwIjoxNzAyMjMzMTkzfQ.Rx3IfpkAojNKotHr3sjcCWSclq-rb9JXC7Z9YuLoOJE'),
(51, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIxNDcyMzksImV4cCI6MTcwMjIzMzYzOX0.s84ilys_SD1i0NhRYJNyuZLBwnkiJ9e-lLad5UOvrkY'),
(52, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjE0NzM3OSwiZXhwIjoxNzAyMjMzNzc5fQ.tTVA8djodTgYJs450iSN7krlzMi8m7pofr_ORXtZk5A'),
(53, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIxNDc0MDcsImV4cCI6MTcwMjIzMzgwN30.75iYxwjcHOwDypoAyW-lVvPQNb6Jn9Ic89vkkocWC64'),
(54, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIxNTE1NjksImV4cCI6MTcwMjIzNzk2OX0.xzXW5fTG81znRX37GapDH1r1EXXTp9hIizIDE73I3Ug'),
(55, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIxNTE4MzAsImV4cCI6MTcwMjIzODIzMH0.ly3LkkEAB-O45TwVbYMuKSuEEimAXMs1pRVEGRlKYQA'),
(56, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjE5ODY4MSwiZXhwIjoxNzAyMjg1MDgxfQ.tMJ_mrCLGP1c2fg4bW_oqQUIRZMm5o7yRqCtsVBPtCI'),
(57, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjE5ODcwOCwiZXhwIjoxNzAyMjg1MTA4fQ.ovOHmI-ChDtomIoQL1_8a9OATMGQ1yETDioseM--PNY'),
(58, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjIwMDEyNywiZXhwIjoxNzAyMjg2NTI3fQ.287xa9TD8vWzS-gZ21F_pnqjBwKR-iZbeOJYwxj4wGc'),
(59, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIyMDAxNTgsImV4cCI6MTcwMjI4NjU1OH0.xCYh9Ylk_nQl2Wwz8n_a7a98aO0Uc6YDaZcxdfDTi6E'),
(60, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIyMDE5NjIsImV4cCI6MTcwMjI4ODM2Mn0.HXJeikaGWQpAKlibBxHWKcKNkS3wIobgNqF9bxzF_so'),
(61, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjIwODUyMiwiZXhwIjoxNzAyMjk0OTIyfQ.fA1TEkmYjxKEUbLNcXXqajqdkFJTt2Dton2LRS9gL7Y'),
(62, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIyMDkwNjEsImV4cCI6MTcwMjI5NTQ2MX0.citXx75O-xjehUwDfoRJi71FDCLVFxjQ6FbAxrgPcFs'),
(63, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imt1dWdhbmciLCJpZCI6MiwiaXNBZG1pbiI6dHJ1ZSwiaWF0IjoxNzAyMjExMjUzLCJleHAiOjE3MDIyOTc2NTN9.fzP-JRu-cppMDCIRbYBJ9AGAycvdBiGLaazA-G6UT4k'),
(64, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjIyMjcxNywiZXhwIjoxNzAyMzA5MTE3fQ.8wNtNxiPCn-cMhlcY_POdX7ILqCp2nAw3Ne1s3YB42s'),
(65, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6dHJ1ZSwiaWF0IjoxNzAyMjIyNzM4LCJleHAiOjE3MDIzMDkxMzh9.N5VhgTGVUQiAlrg4oHQIJvavku1nzmbQVmkTF7MEa_M'),
(66, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIyMzExMjQsImV4cCI6MTcwMjMxNzUyNH0.uBDdYcl4Ys7biC8P3KwkMQ9NOb1HCZADotBcYgWI_8c'),
(67, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIyNjU5ODksImV4cCI6MTcwMjM1MjM4OX0.uFO4PURkGgJ0Xedhrjg6NmTMcWf2cnVsxzn5n_Pe62A'),
(68, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIyNzAzNDYsImV4cCI6MTcwMjM1Njc0Nn0.sWIo-ng8pDh8WKZLrHhPTcckXK9SIw1ihJdbxLseoH8'),
(69, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJrdXVnYW5nIiwiZmlyc3ROYW1lIjoiSmFrZSIsImxhc3ROYW1lIjoiQmFqbyIsImlzT3JnYW5pemVyIjp0cnVlLCJpYXQiOjE3MDIzMDEzMDksImV4cCI6MTcwMjM4NzcwOX0.CTEz81bTJcV4iSz-iqNDFUgfQuOa9Zxm0IjzCj4P_Ho'),
(70, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoiamFrZTEyMyIsImZpcnN0TmFtZSI6Ikpha2UiLCJsYXN0TmFtZSI6IkJham8iLCJpc09yZ2FuaXplciI6ZmFsc2UsImlhdCI6MTcwMjI3MDUyOCwiZXhwIjoxNzAyMzU2OTI4fQ.J7mLwGS5e3meYVTpF9Sm2KPca6fCQ9WGL1yuTlIpLaQ');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `organizer_id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `venue` varchar(255) NOT NULL,
  `event_type` varchar(64) NOT NULL,
  `image` varchar(255) NOT NULL,
  `event_type_id` int(11) NOT NULL,
  `event_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_cancelled` tinyint(1) DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `organizer_id`, `title`, `description`, `venue`, `event_type`, `image`, `event_type_id`, `event_date`, `is_cancelled`, `cancellation_reason`, `createdAt`, `updatedAt`) VALUES
(148, 4, 'Genshin Fest', 'genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win genshin pay 2 win ', 'Didto', 'Genshin', 'uploads/imgfile-1702226215380.jpeg', 47, '2023-12-11 17:58:58', 1, 'Cancelled because of rain', '2023-12-10 16:36:55', '2023-12-10 16:36:55'),
(149, 4, 'Randy', 'Dako', 'Dira', 'Segs', 'uploads/imgfile-1702266053895.webp', 65, '2023-12-11 18:18:06', 1, 'Because of a certain reason', '2023-12-11 03:40:53', '2023-12-11 03:40:53'),
(151, 4, 'Genshin Pay 2 Win', 'Genshin Pay 2 WinGenshin Pay 2 Win', 'Diha', 'Genshin', 'uploads/imgfile-1702307883171.jpeg', 47, '2023-12-11 15:25:21', NULL, NULL, '2023-12-11 15:18:03', '2023-12-11 15:18:03'),
(152, 4, 'PARA d malimtan', 'ang mga passwords\r\n\r\n\r\n\r\njake2\r\nasd\r\n\r\nadmin\r\nkuugang\r\nmaotka12369', 'Dira dapita gud', 'Basketball', 'uploads/imgfile-1702314498828.webp', 63, '2023-12-14 17:08:00', NULL, NULL, '2023-12-11 17:08:18', '2023-12-11 17:08:18'),
(153, 4, 'Test Event', 'Event ni didto sa CITU', 'CITU', 'Hiking', 'uploads/imgfile-1702318785406.gif', 62, '2023-12-11 18:21:00', 1, 'Na cancel kay gi bagyo ang cit', '2023-12-11 18:19:45', '2023-12-11 18:19:45'),
(155, 4, 'Adrian', 'Secret', 'neighbor', 'Segs', 'uploads/imgfile-1702370022935.webp', 65, '2023-12-28 08:33:00', NULL, NULL, '2023-12-12 08:33:42', '2023-12-12 08:33:42');

-- --------------------------------------------------------

--
-- Table structure for table `event_participants`
--

CREATE TABLE `event_participants` (
  `participant_id` int(11) NOT NULL,
  `event_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','rejected','') NOT NULL DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_participants`
--

INSERT INTO `event_participants` (`participant_id`, `event_id`, `user_id`, `status`) VALUES
(357, 148, 4, 'accepted'),
(359, 149, 4, 'pending'),
(365, 151, 4, 'accepted'),
(389, 148, 14, 'accepted'),
(390, 152, 4, 'accepted'),
(391, 152, 14, 'accepted'),
(393, 153, 4, 'accepted'),
(394, 153, 14, 'rejected'),
(398, 155, 4, 'accepted'),
(399, 155, 14, 'accepted');

-- --------------------------------------------------------

--
-- Table structure for table `event_types`
--

CREATE TABLE `event_types` (
  `id` int(11) NOT NULL,
  `event_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_types`
--

INSERT INTO `event_types` (`id`, `event_name`) VALUES
(63, 'Basketball'),
(47, 'Genshin'),
(62, 'Hiking'),
(61, 'Noche Buena'),
(65, 'Segs'),
(64, 'Trail');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `notification` varchar(512) NOT NULL,
  `notification_type` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `notification`, `notification_type`, `event_id`, `status`) VALUES
(8, 14, 'Your registration request for Genshin Fest was accepted', 1, 148, 1),
(32, 14, 'Genshin Fest has been cancelled', 3, 148, 1),
(33, 14, 'Your registration request for Test Event was accepted', 1, 153, 1),
(34, 14, 'Test Event has been cancelled', 3, 153, 1),
(36, 14, 'Your registration request for PARA d malimtan was accepted', 1, 152, 1),
(38, 14, 'Your registration request for Adrian was accepted', 1, 155, 1);

-- --------------------------------------------------------

--
-- Table structure for table `notification_types`
--

CREATE TABLE `notification_types` (
  `id` int(11) NOT NULL,
  `notification` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification_types`
--

INSERT INTO `notification_types` (`id`, `notification`) VALUES
(1, 'Event registration'),
(2, 'Organizer request'),
(3, 'Event cancelled');

-- --------------------------------------------------------

--
-- Table structure for table `organizers`
--

CREATE TABLE `organizers` (
  `user_id` int(11) NOT NULL,
  `accepted` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `organizers`
--

INSERT INTO `organizers` (`user_id`, `accepted`) VALUES
(4, 1),
(13, 1),
(14, 0);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `review` varchar(512) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `event_id`, `review`) VALUES
(84, 4, 148, '2'),
(85, 4, 148, '2'),
(86, 4, 148, '2'),
(87, 4, 148, '2'),
(88, 4, 148, '123'),
(90, 14, 148, 'MAOT KA 123'),
(91, 4, 149, 'Randy baog'),
(92, 4, 151, 'Test Review'),
(93, 4, 151, 'James baong');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firstName` varchar(255) NOT NULL,
  `lastName` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `username`, `password`, `createdAt`, `updatedAt`) VALUES
(4, 'Jake', 'Bajo', 'kuugang', '$2a$10$G30lDBXhMiy0KiL.xkUNXu0VCnXjCkgPd1CmEe3C30Wk/Ovl/PANW', '2023-11-12 10:35:17', '2023-11-12 10:35:17'),
(5, 'asd', 'asd', 'asd', '$2a$10$BBJLhPegX7FphOj0g/9jA.e/rP9X9ic8WLDOUCvUEKDH1Fb2fu1mG', '2023-11-14 11:14:18', '2023-11-14 11:14:18'),
(6, 'asdd', 'dasdasd', 'dsadasd', '$2a$10$BL.L9BgvCLkOjnbG3k.QPu5qHXTxwYWGU9wS6Fq04MF2txDF3KtuG', '2023-11-14 12:06:14', '2023-11-14 12:06:14'),
(7, 'asda', 'dasdasdasd', 'username', '$2a$10$b762LDZFw46VY0mKrqSJmOHl3/2i1is1GIu0lWMGcwJjO/OiLr4sy', '2023-11-14 12:10:16', '2023-11-14 12:10:16'),
(8, 'username2', 'username2', 'username2', '$2a$10$GnORwyhH36JaOAm1vFv1kuv2P9YgtlWvaXmq.apubJd/6eFRu68kK', '2023-11-14 12:10:53', '2023-11-14 12:10:53'),
(9, 'username3', 'username3', 'username3', '$2a$10$5miItmZes.0d6yioSkZYjOYl9qNj5G9Y6me7NFYUjPQt/ZmCcOHzC', '2023-11-14 12:11:45', '2023-11-14 12:11:45'),
(10, 'username4', 'username4', 'username4', '$2a$10$Cdwb2Z2k6w9j8MlyfM0X/OrgJoNXbQW3zum74G2EVHqSWOONxLxcy', '2023-11-14 12:12:34', '2023-11-14 12:12:34'),
(11, 'username5', 'username5', 'username5', '$2a$10$rjqpextkxMTMF1//hOY6XeszEvrGwg3fbjdQQKkKiKiDrziC9k6XC', '2023-11-14 12:13:17', '2023-11-14 12:13:17'),
(12, 'username6', 'username6', 'username6', '$2a$10$XtBmhC3qnrqE2k7/G.OlpOxu0p2c8MQUQOE.nkiUI4DVKjckUREXW', '2023-11-14 12:14:06', '2023-11-14 12:14:06'),
(13, 'asd', 'asd', 'jake2', '$2a$10$0hFZUoGhj2fquD0b.F/viOYtAj5kNrUT/WY32s2Rx2CJ.giwoO4HS', '2023-12-08 08:12:19', '2023-12-08 08:12:19'),
(14, 'Jake', 'Bajo', 'jake123', '$2a$10$ZKr.1V50cIdSN2MjN.apYuTAsUIFN2FA6GrY34Dr8Lr.Mr4pigpcq', '2023-12-09 15:18:46', '2023-12-09 15:18:46');

-- --------------------------------------------------------

--
-- Table structure for table `votes`
--

CREATE TABLE `votes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `vote` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `votes`
--

INSERT INTO `votes` (`id`, `user_id`, `event_id`, `vote`) VALUES
(71, 4, 148, 1),
(77, 4, 152, 1),
(78, 14, 152, 1),
(87, 14, 153, 0),
(88, 4, 153, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blacklist`
--
ALTER TABLE `blacklist`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `organizer_id` (`organizer_id`),
  ADD KEY `event_type` (`event_type_id`),
  ADD KEY `event_type_2` (`event_type`);

--
-- Indexes for table `event_participants`
--
ALTER TABLE `event_participants`
  ADD PRIMARY KEY (`participant_id`),
  ADD UNIQUE KEY `unique_event_participant` (`event_id`,`participant_id`),
  ADD UNIQUE KEY `unique_user_event` (`user_id`,`event_id`);

--
-- Indexes for table `event_types`
--
ALTER TABLE `event_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_constraint_name` (`event_name`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_notification_type_for_each_user_and_event_id` (`user_id`,`notification_type`,`event_id`),
  ADD KEY `notification_type` (`notification_type`),
  ADD KEY `event_id` (`event_id`);

--
-- Indexes for table `notification_types`
--
ALTER TABLE `notification_types`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organizers`
--
ALTER TABLE `organizers`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `votes`
--
ALTER TABLE `votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique upvote` (`event_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `blacklist`
--
ALTER TABLE `blacklist`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=71;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=156;

--
-- AUTO_INCREMENT for table `event_participants`
--
ALTER TABLE `event_participants`
  MODIFY `participant_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=400;

--
-- AUTO_INCREMENT for table `event_types`
--
ALTER TABLE `event_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `notification_types`
--
ALTER TABLE `notification_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `votes`
--
ALTER TABLE `votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`organizer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`event_type_id`) REFERENCES `event_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`event_type`) REFERENCES `event_types` (`event_name`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `event_participants`
--
ALTER TABLE `event_participants`
  ADD CONSTRAINT `event_participants_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `event_participants_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`notification_type`) REFERENCES `notification_types` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `organizers`
--
ALTER TABLE `organizers`
  ADD CONSTRAINT `organizers_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `votes`
--
ALTER TABLE `votes`
  ADD CONSTRAINT `votes_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
