-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th10 03, 2026 lúc 06:24 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `barber_shop`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `addresses`
--

CREATE TABLE `addresses` (
  `id` bigint(20) NOT NULL,
  `address` text NOT NULL,
  `is_default` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `user_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `addresses`
--

INSERT INTO `addresses` (`id`, `address`, `is_default`, `name`, `phone`, `user_id`) VALUES
(1, 'đường 1, phố 1, tphcm', b'1', 'timtim', '0907654321', 5),
(2, 'dfsdfs', b'1', 'eoiioroewr', '0333333333', 8),
(3, 'ẻererere', b'1', 'ed1', '1231231231', 7),
(4, '123hcm', b'1', 'mot mot', '0907654321', 25);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `advance_salaries`
--

CREATE TABLE `advance_salaries` (
  `id` int(11) NOT NULL,
  `advance_date` date DEFAULT NULL,
  `amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `advance_salaries`
--

INSERT INTO `advance_salaries` (`id`, `advance_date`, `amount`, `created_at`, `notes`, `staff_id`) VALUES
(1, '2026-07-01', 5000000, '2026-07-01 21:25:57.000000', 'sdsdsd', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `bookings`
--

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `booking_date` date DEFAULT NULL,
  `booking_time` time DEFAULT NULL,
  `status` varchar(20) DEFAULT 'PENDING',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `customer_email` varchar(100) DEFAULT NULL,
  `customer_name` varchar(100) DEFAULT NULL,
  `customer_phone` varchar(20) DEFAULT NULL,
  `note` text DEFAULT NULL,
  `payment_method` varchar(20) DEFAULT NULL,
  `total_price` decimal(38,2) DEFAULT NULL,
  `transaction_no` varchar(100) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `end_time` time(6) DEFAULT NULL,
  `cancel_reason` varchar(50) DEFAULT NULL,
  `cancelled_at` datetime(6) DEFAULT NULL,
  `cancelled_by` varchar(50) DEFAULT NULL,
  `refund_status` varchar(50) DEFAULT NULL,
  `created_by_editor` varchar(100) DEFAULT NULL,
  `lock_reason` varchar(50) DEFAULT NULL,
  `locked` bit(1) DEFAULT NULL,
  `locked_at` datetime(6) DEFAULT NULL,
  `refund_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `bookings`
--

INSERT INTO `bookings` (`id`, `user_id`, `service_id`, `booking_date`, `booking_time`, `status`, `created_at`, `customer_email`, `customer_name`, `customer_phone`, `note`, `payment_method`, `total_price`, `transaction_no`, `staff_id`, `duration`, `end_time`, `cancel_reason`, `cancelled_at`, `cancelled_by`, `refund_status`, `created_by_editor`, `lock_reason`, `locked`, `locked_at`, `refund_at`) VALUES
(2, NULL, 1, '2026-05-21', '14:30:00', 'COMPLETED', '2026-05-19 14:04:17', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 70000.00, NULL, 30, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(6, NULL, 3, '2026-05-19', '16:30:00', 'CANCELLED', '2026-05-19 14:26:40', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 200000.00, '4750571949', 15, NULL, NULL, 'late_customer', '2026-06-09 19:24:26.000000', 'Admin Boss', 'no_refund', NULL, NULL, NULL, NULL, NULL),
(7, NULL, 5, '2026-05-20', '11:00:00', 'COMPLETED', '2026-05-19 14:34:22', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'VNPAY', 100000.00, NULL, 27, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(8, NULL, 5, '2026-05-20', '11:00:00', 'CANCELLED', '2026-05-19 14:34:28', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'VNPAY', 100000.00, '15546918', 27, NULL, NULL, 'late_customer', '2026-06-09 19:24:29.000000', 'Admin Boss', 'no_refund', NULL, NULL, NULL, NULL, NULL),
(11, NULL, 6, '2026-06-06', '09:00:00', 'COMPLETED', '2026-05-19 14:48:43', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 100000.00, NULL, 29, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, NULL, 6, '2026-06-14', '19:00:00', 'CANCELLED', '2026-05-19 14:49:30', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', 'okkeke', 'MOMO', 100000.00, '4750573718', 11, NULL, NULL, 'late_customer', '2026-06-09 19:24:32.000000', 'Admin Boss', 'no_refund', NULL, NULL, NULL, NULL, NULL),
(14, NULL, 4, '2026-06-14', '11:45:00', 'CANCELLED', '2026-05-19 15:01:06', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', 'lalalalalalala', 'VNPAY', 30000.00, '15546952', 17, NULL, NULL, 'late_customer', '2026-06-09 19:24:39.000000', 'Admin Boss', 'no_refund', NULL, NULL, NULL, NULL, NULL),
(15, NULL, 1, '2026-05-20', '18:00:00', 'COMPLETED', '2026-05-20 12:24:14', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 70000.00, NULL, 17, 30, '18:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(17, NULL, 2, '2026-05-20', '09:00:00', 'COMPLETED', '2026-05-20 14:22:32', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', 'test bạn', 'VNPAY', 170000.00, NULL, 17, 60, '10:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, NULL, 5, '2026-05-20', '10:00:00', 'COMPLETED', '2026-05-20 14:32:37', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'VNPAY', 100000.00, NULL, 17, 30, '10:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(19, NULL, 3, '2026-05-20', '12:00:00', 'CANCELLED', '2026-05-20 14:33:41', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'VNPAY', 200000.00, NULL, 17, 60, '13:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, NULL, 1, '2026-05-20', '08:00:00', 'CANCELLED', '2026-05-20 14:49:50', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'VNPAY', 70000.00, NULL, 17, 30, '08:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, NULL, 2, '2026-05-20', '08:00:00', 'CANCELLED', '2026-05-20 14:50:35', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', 'fgfdgdfgdg', 'MOMO', 170000.00, NULL, 18, 60, '09:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, NULL, 6, '2026-05-23', '08:00:00', 'CANCELLED', '2026-05-23 11:55:40', 'timtim2835@gmail.com', 'hom nay', '0907654321', '', 'VNPAY', 100000.00, NULL, 1, 30, '08:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, NULL, 5, '2026-05-23', '08:00:00', 'CANCELLED', '2026-05-23 12:44:52', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 100000.00, '4752218725', 1, 30, '08:30:00.000000', 'admin_cancel', '2026-05-26 20:36:27.000000', 'Admin Boss', 'success', NULL, NULL, NULL, NULL, NULL),
(26, NULL, 2, '2026-05-23', '08:00:00', 'CANCELLED', '2026-05-23 12:47:24', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 170000.00, '4752208772', 26, 60, '09:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, NULL, 1, '2026-05-23', '08:00:00', 'CANCELLED', '2026-05-23 12:49:16', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 70000.00, '4752208805', 17, 30, '08:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, NULL, 1, '2026-06-20', '08:00:00', 'CANCELLED', '2026-06-20 10:47:45', 'timtim2835@gmail.com', 'tim', '0907654321', '', 'MOMO', 63000.00, '4765626365', 1, 30, '08:30:00.000000', 'admin_cancel', '2026-06-20 19:31:32.000000', 'Admin Boss', 'success', NULL, NULL, NULL, NULL, NULL),
(34, NULL, 1, '2026-06-21', '08:00:00', 'COMPLETED', '2026-06-21 11:37:01', 'timtim2835@gmail.com', 'hhh', '0907654321', 'okeke', 'MOMO', 440000.00, '4766630860', 1, 150, '10:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(35, NULL, 1, '2026-06-21', '12:00:00', 'COMPLETED', '2026-06-21 11:58:27', 'timtim2835@gmail.com', 'hhh', '0907654321', 'nnddjsdsadoladlamd,amm', 'MOMO', 910000.00, '4766643592', 1, 300, '17:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(36, NULL, 1, '2026-06-21', '19:45:00', 'COMPLETED', '2026-06-21 12:28:55', 'timtim2835@gmail.com', 'hhh', '0907654321', 'nbggggb', 'MOMO', 440000.00, '4766650354', 1, 150, '22:15:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(37, NULL, 8, '2026-06-21', '19:45:00', 'COMPLETED', '2026-06-21 12:40:29', 'timtim2835@gmail.com', 'hhh', '0907654321', 'iuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhhiuiyhhhhhhhhhhhhhhhhhhhhhhhhh', 'MOMO', 50000.00, '4766680500', 6, 15, '20:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(38, NULL, 2, '2026-06-23', '19:00:00', 'COMPLETED', '2026-06-23 11:55:13', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 170000.00, '4767450769', 1, 60, '20:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(39, NULL, 1, '2026-06-23', '20:00:00', 'COMPLETED', '2026-06-23 11:58:33', 'timtim2835@gmail.com', 'Tim Tim', '0907654321', '', 'MOMO', 70000.00, '4767500088', 1, 30, '20:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(40, NULL, 2, '2026-06-23', '20:30:00', 'COMPLETED', '2026-06-23 11:59:53', 'timtim2835@gmail.com', 'tim', '0907654321', '', 'MOMO', 170000.00, '4767450819', 1, 60, '21:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(41, NULL, 3, '2026-06-25', '20:00:00', 'COMPLETED', '2026-06-25 12:58:51', 'ngochai@gmail.com', 'ngocchai', '0907654321', '', 'MOMO', 160000.00, '4768073368', 1, 60, '21:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(42, NULL, 1, '2026-06-25', '21:00:00', 'CANCELLED', '2026-06-25 13:19:57', 'timtim2835@gmail.com', 'ngocchai', '0907654321', '', 'MOMO', 59500.00, '4768044850', 1, 30, '21:30:00.000000', 'admin_cancel', '2026-06-25 20:28:29.000000', 'Admin Boss', 'success', NULL, NULL, NULL, NULL, NULL),
(43, NULL, 1, '2026-06-25', '21:00:00', 'COMPLETED', '2026-06-25 13:34:56', 'timtim2835@gmail.com', 'ngocchai', '0907654321', '', 'MOMO', 59500.00, '4768063837', 1, 30, '21:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(44, 25, 3, '2026-06-27', '16:45:00', 'COMPLETED', '2026-06-27 09:42:30', 'timtim2835@gmail.com', 'btrhai', '0907654321', 'yutffuyjyg', 'MOMO', 180000.00, '4768780993', 1, 60, '17:45:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(46, 25, 8, '2026-06-28', '15:15:00', 'COMPLETED', '2026-06-28 08:05:38', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 42500.00, '4769214455', 1, 15, '15:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(47, 25, 1, '2026-06-30', '20:15:00', 'COMPLETED', '2026-06-30 13:09:44', 'timtim2835@gmail.com', 'btrhai', '0907654321', 'cũng đc', 'MOMO', 1570000.00, '4771054105', 1, 240, '00:15:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(48, 25, 1, '2026-07-01', '08:00:00', 'COMPLETED', '2026-06-30 13:28:43', 'timtim2835@gmail.com', 'btrhai', '0907654321', 'okkkkkkkkkkkkkkkk', 'MOMO', 1150000.00, '4771079712', 1, 180, '11:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(49, 25, 1, '2026-06-30', '21:00:00', 'COMPLETED', '2026-06-30 13:40:37', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 1170000.00, '4771073161', 6, 270, '01:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(50, 25, 1, '2026-06-30', '20:45:00', 'COMPLETED', '2026-06-30 13:41:38', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 1350000.00, '4771082870', 7, 315, '02:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(51, 25, 19, '2026-07-05', '14:30:00', 'COMPLETED', '2026-07-05 07:23:11', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'VNPAY', 20000.00, NULL, NULL, 15, '14:45:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(52, 25, 19, '2026-07-05', '14:30:00', 'COMPLETED', '2026-07-05 07:23:45', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'VNPAY', 20000.00, NULL, NULL, 15, '14:45:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(53, 25, 19, '2026-07-05', '15:00:00', 'COMPLETED', '2026-07-05 07:56:32', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'VNPAY', 16000.00, '15610471', 11, 15, '15:15:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(54, 25, 19, '2026-07-05', '15:30:00', 'COMPLETED', '2026-07-05 08:19:18', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'VNPAY', 16000.00, '15610482', 2, 15, '15:45:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(55, 25, 4, '2026-07-05', '15:30:00', 'COMPLETED', '2026-07-05 08:21:19', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 30000.00, '4773029299', 3, 15, '15:45:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(56, 25, 19, '2026-07-05', '15:30:00', 'COMPLETED', '2026-07-05 08:22:37', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 20000.00, '4773048458', 4, 15, '15:45:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(57, 25, 8, '2026-07-05', '15:45:00', 'COMPLETED', '2026-07-05 08:23:48', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 50000.00, '4773029333', 2, 15, '16:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(58, 25, 4, '2026-07-05', '15:45:00', 'COMPLETED', '2026-07-05 08:25:09', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 74555.00, '4773029361', 3, 15, '16:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(59, 25, 19, '2026-07-05', '15:45:00', 'COMPLETED', '2026-07-05 08:26:47', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 20000.00, '4773038793', 4, 15, '16:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(60, 25, 19, '2026-07-05', '16:15:00', 'COMPLETED', '2026-07-05 09:12:55', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 20000.00, '4773039395', 5, 15, '16:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(61, 25, 19, '2026-07-05', '16:15:00', 'COMPLETED', '2026-07-05 09:14:42', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 20000.00, '4773030039', 1, 15, '16:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(62, 25, 19, '2026-07-06', '20:15:00', 'CANCELLED', '2026-07-06 13:04:25', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 20000.00, '4773268579', 11, 15, '20:30:00.000000', 'STAFF_ON_LEAVE', '2026-07-06 20:06:27.000000', 'SYSTEM', 'REFUNDED', NULL, 'STAFF_ON_LEAVE', b'1', '2026-07-06 20:06:26.000000', '2026-07-06 20:06:27.000000'),
(63, 25, 19, '2026-07-06', '20:30:00', 'CANCELLED', '2026-07-06 13:15:23', 'timtim2835@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 20000.00, '4773268741', 12, 15, '20:45:00.000000', 'STAFF_ON_LEAVE', '2026-07-06 20:17:22.000000', 'SYSTEM', 'REFUNDED', NULL, 'STAFF_ON_LEAVE', b'1', '2026-07-06 20:17:22.000000', '2026-07-06 20:17:22.000000'),
(64, 25, 19, '2026-07-07', '08:00:00', 'CANCELLED', '2026-07-06 13:55:47', 'timtim2835@gmail.com', 'btrhai', '0907654321', 'okee nè', 'MOMO', 20000.00, '4773271356', 6, 15, '08:15:00.000000', 'STAFF_ON_LEAVE', '2026-07-06 20:59:57.000000', 'SYSTEM', 'REFUNDED', NULL, 'STAFF_ON_LEAVE', b'1', '2026-07-06 20:59:57.000000', '2026-07-06 20:59:57.000000'),
(65, 25, 1, '2026-07-12', '08:00:00', 'COMPLETED', '2026-07-10 10:03:07', 'btrhai@gmail.com', 'btrhai', '0907654321', 'fade thấp', 'MOMO', 70000.00, '4775572076', 2, 30, '08:30:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL),
(66, 25, 4, '2026-07-12', '08:00:00', 'COMPLETED', '2026-07-11 11:41:35', 'btrhai@gmail.com', 'btrhai', '0907654321', '', 'VNPAY', 40000.00, '15617354', 6, 15, '08:15:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL),
(67, 25, 1, '2026-07-12', '21:00:00', 'CANCELLED', '2026-07-12 02:01:01', 'btrhai@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 140000.00, '4776948428', 11, 60, '22:00:00.000000', 'admin_cancel', '2026-07-12 09:02:09.000000', 'Admin Boss', 'success', NULL, NULL, b'0', NULL, NULL),
(68, 25, 1, '2026-07-12', '09:45:00', 'CANCELLED', '2026-07-12 02:30:41', 'haingoctran288@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 1292000.00, '4776671812', 1, 210, '13:15:00.000000', 'admin_cancel', '2026-07-12 09:32:17.000000', 'Admin Boss', 'success', NULL, NULL, b'0', NULL, NULL),
(69, 25, 4, '2026-07-12', '09:45:00', 'COMPLETED', '2026-07-12 02:41:55', 'haingoctran288@gmail.com', 'btrhai', '0907654321', '', 'MOMO', 50000.00, '4776950999', 1, 15, '10:00:00.000000', NULL, NULL, NULL, NULL, NULL, NULL, b'0', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `booking_services`
--

CREATE TABLE `booking_services` (
  `booking_id` int(11) NOT NULL,
  `service_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `booking_services`
--

INSERT INTO `booking_services` (`booking_id`, `service_id`) VALUES
(33, 1),
(34, 1),
(34, 2),
(34, 3),
(35, 1),
(35, 2),
(35, 3),
(35, 4),
(35, 5),
(35, 6),
(35, 7),
(35, 8),
(35, 9),
(36, 1),
(36, 2),
(36, 3),
(37, 8),
(38, 2),
(39, 1),
(40, 2),
(41, 3),
(42, 1),
(43, 1),
(44, 3),
(46, 8),
(47, 1),
(47, 2),
(47, 7),
(47, 16),
(48, 1),
(48, 2),
(48, 4),
(48, 6),
(48, 7),
(48, 8),
(49, 1),
(49, 7),
(49, 8),
(49, 9),
(49, 16),
(49, 18),
(50, 1),
(50, 4),
(50, 5),
(50, 7),
(50, 8),
(50, 9),
(50, 16),
(50, 17),
(51, 19),
(52, 19),
(53, 19),
(54, 19),
(55, 4),
(56, 19),
(57, 8),
(58, 4),
(59, 19),
(60, 19),
(61, 19),
(62, 19),
(63, 19),
(64, 19),
(65, 1),
(66, 4),
(67, 1),
(67, 4),
(67, 19),
(68, 1),
(68, 2),
(68, 16),
(69, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer_chats`
--

CREATE TABLE `customer_chats` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_contact` varchar(255) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_recalled` bit(1) DEFAULT NULL,
  `message` text NOT NULL,
  `replied_at` datetime(6) DEFAULT NULL,
  `reply` text DEFAULT NULL,
  `report_details` text DEFAULT NULL,
  `report_reason` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `barber_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `reported_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customer_chats`
--

INSERT INTO `customer_chats` (`id`, `created_at`, `customer_contact`, `customer_name`, `image_url`, `is_recalled`, `message`, `replied_at`, `reply`, `report_details`, `report_reason`, `status`, `barber_id`, `user_id`, `reported_at`) VALUES
(1, '2026-06-28 17:28:57.000000', '0907654321', 'TEST', NULL, b'0', 'VÍ DỤ NÈ', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(2, '2026-06-28 17:38:52.000000', 'Khách hàng', 'test', '/uploads/chats/0c88d3ca-dc40-4527-865e-6ad72319df15.jpg', b'0', 'test thử nè', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(3, '2026-06-28 17:40:25.000000', 'Khách hàng', 'dfdsfd', '/uploads/chats/9b72caaa-8caf-47a8-bf9a-3d547a6f5dbd.jpg', b'0', 'dfdfdsf', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(4, '2026-06-28 17:43:47.000000', 'Khách hàng', 'test', '/uploads/chats/59d474be-b199-4d46-9241-fac0e923350c.jpeg', b'0', 'hello bùm', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(5, '2026-06-28 17:47:10.000000', 'Khách hàng', 'test', '/uploads/chats/5f0734d1-a5a3-4d94-a83e-49cfa5ca2afa.jpg', b'0', 'test lần nữa', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(6, '2026-06-28 17:52:04.000000', 'Khách hàng', 'test', '/uploads/chats/5b712584-64b9-4169-9049-c3fbb273b930.jpg', b'0', 'test lần nx', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(7, '2026-06-28 17:53:56.000000', 'Khách hàng', 'thư cía n', '/uploads/chats/e1df1222-10ca-4a3b-a6d8-70b4e1b601da.jpg', b'0', 'thư cía nsddasfsdfdsfds', '2026-06-28 18:03:38.000000', 'được phết đấy.', NULL, NULL, 'REPLIED', 1, 25, NULL),
(8, '2026-06-28 18:04:48.000000', 'Khách hàng', 'hả hả', '/uploads/chats/5781d941-785a-47ae-8b58-b540ba71523a.jpg', b'0', 'ạdakdjkasdklajkdjkakjdlakW', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(9, '2026-06-30 16:41:53.000000', 'Khách hàng', 'alo', '/uploads/chats/3320fb63-f96b-4f11-96bf-89a5e1359e6b.jpg', b'0', 'What is Lorem Ipsum?\nLorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset\'s Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL),
(10, '2026-07-04 19:19:25.000000', 'Khách hàng', 'test thông báo', '/uploads/chats/88909c43-cc27-4cee-b794-0187b9024575.png', b'0', 'thử nghiệm coi sao', '2026-07-04 19:20:35.000000', 'oke được', 'thử', 'Không phản hồi', 'REPORTED', 1, 25, NULL),
(11, '2026-07-04 19:52:22.000000', 'Khách hàng', 'thử lại', '/uploads/chats/c64f9fc2-f240-4c51-a8a1-323646e6222d.jpg', b'0', 'thử lại thử lại thử lại', '2026-07-04 19:53:25.000000', 'láo', '', 'Nói tục', 'REPORTED', 1, 25, '2026-07-04 19:53:54.000000'),
(12, '2026-07-04 19:56:17.000000', 'Khách hàng', 'lallsflalf', '/uploads/chats/2c2ed27e-ad1c-402c-b5e5-4ebcfa7d1340.jpeg', b'0', 'lallsflalf lallsflalf lallsflalf', '2026-07-04 19:56:26.000000', 'biến', '', 'Nói tục', 'REPORTED', 1, 25, '2026-07-04 19:56:35.000000'),
(13, '2026-07-04 20:04:55.000000', 'Khách hàng', 'kndfkdnfnjaf', '/uploads/chats/af917115-1949-4442-ab10-4e516be9f7a0.jpg', b'0', 'ádjadnwiodawk', '2026-07-04 20:05:29.000000', 'thua', '', 'Thái độ không tốt - Thiếu chuyên nghiệp', 'REPORTED', 1, 25, '2026-07-04 20:05:38.000000'),
(14, '2026-07-04 20:10:31.000000', 'Khách hàng', 'kakjsdkaklda', '/uploads/chats/e6a18ce0-58d3-462f-bbc9-60219a8b3265.jpg', b'0', 'sauhiwudnwdjjakwd', '2026-07-04 20:10:41.000000', 'sdefefesfefsefef', 'eewrefsfefefefef', 'Khác (Nhập lý do chi tiết)', 'REPORTED', 1, 25, '2026-07-04 20:10:50.000000'),
(15, '2026-07-12 09:40:24.000000', 'Khách hàng', 'dggfg', '/uploads/chats/cdbd8e1e-cc55-4a83-962f-0b6c727d0aed.jpg', b'0', 'gfgggg', NULL, NULL, NULL, NULL, 'PENDING', 1, 25, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `customer_vouchers`
--

CREATE TABLE `customer_vouchers` (
  `id` int(11) NOT NULL,
  `booking_id` bigint(20) DEFAULT NULL,
  `claimed_at` datetime(6) DEFAULT NULL,
  `code` varchar(100) NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `voucher_id` int(11) NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `used_count` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `customer_vouchers`
--

INSERT INTO `customer_vouchers` (`id`, `booking_id`, `claimed_at`, `code`, `note`, `order_id`, `status`, `used_at`, `user_id`, `voucher_id`, `end_date`, `start_date`, `used_count`) VALUES
(53, NULL, '2026-06-27 15:46:53.000000', 'HBDJUN', 'Chúc mừng sinh nhật tháng 6! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!', NULL, 'EXPIRED', NULL, 25, 19, '2026-06-30 00:00:00.000000', '2026-06-27 00:00:00.000000', NULL),
(54, NULL, '2026-06-27 16:00:03.000000', 'GFGGFGFGG', '', NULL, 'EXPIRED', NULL, 25, 20, '2026-06-30 00:00:00.000000', '2026-06-30 00:00:00.000000', NULL),
(55, NULL, '2026-06-27 16:18:45.000000', 'TEST', 'Chúc mừng sinh nhật tháng 6! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!', NULL, 'EXPIRED', NULL, 25, 21, '2026-06-27 16:19:00.000000', '2026-06-27 00:00:00.000000', NULL),
(56, NULL, '2026-06-27 16:21:24.000000', 'GIAM', 'Chúc mừng sinh nhật tháng 6! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!', NULL, 'EXPIRED', NULL, 25, 22, '2026-06-27 16:22:00.000000', '2026-06-27 00:00:00.000000', NULL),
(57, NULL, '2026-06-27 16:31:50.000000', 'TEST1', 'Chúc mừng sinh nhật tháng 6! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!', NULL, 'EXPIRED', NULL, 25, 23, '2026-06-27 16:32:00.000000', '2026-06-27 00:00:00.000000', NULL),
(58, NULL, '2026-06-27 16:36:28.000000', 'TEST2', 'Chúc mừng sinh nhật tháng 6! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!', NULL, 'EXPIRED', NULL, 25, 24, '2026-06-27 16:37:00.000000', '2026-06-27 00:00:00.000000', NULL),
(59, 44, '2026-06-27 16:41:31.000000', 'TEST3', 'Chúc mừng sinh nhật tháng 6! Hornet Royale kính chúc bạn tuổi mới ngập tràn niềm vui!', NULL, 'USED', '2026-06-27 16:42:30.000000', 25, 25, '2026-06-30 00:00:00.000000', '2026-06-27 00:00:00.000000', NULL),
(60, NULL, '2026-06-28 14:19:35.000000', 'THU', NULL, NULL, 'EXPIRED', NULL, 25, 27, '2026-06-30 00:00:00.000000', '2026-06-27 00:00:00.000000', 0),
(61, NULL, '2026-06-28 14:35:49.000000', 'TEST123', NULL, 19, 'EXPIRED', '2026-06-28 15:39:36.000000', 25, 28, '2026-06-30 00:00:00.000000', '2026-06-28 00:00:00.000000', 1),
(62, NULL, '2026-06-28 14:52:05.000000', 'TEST111', NULL, NULL, 'EXPIRED', NULL, 25, 29, '2026-06-30 00:00:00.000000', '2026-06-28 00:00:00.000000', 0),
(63, 46, '2026-06-28 15:03:05.000000', 'TEST222', NULL, NULL, 'EXPIRED', '2026-06-28 15:05:38.000000', 25, 30, '2026-06-30 00:00:00.000000', '2026-06-28 00:00:00.000000', 1),
(64, 66, '2026-07-05 14:55:26.000000', 'TESTWWW', 'Chúc mừng thành viên hạng Người Của Công Chúng nhận được ưu đãi riêng!', NULL, 'USED', '2026-07-11 18:41:36.000000', 25, 31, '2026-07-30 00:00:00.000000', '2026-07-05 00:00:00.000000', 3),
(65, NULL, '2026-07-12 09:09:32.000000', 'GIAMGIAM', 'Phát hành toàn bộ khách hàng', NULL, 'EXPIRED', NULL, 25, 32, '2026-07-31 00:00:00.000000', '2026-07-12 00:00:00.000000', 0),
(66, 68, '2026-07-12 09:21:45.000000', 'GIAMLUON', 'Phát hành toàn bộ khách hàng', NULL, 'EXPIRED', '2026-07-12 09:30:41.000000', 25, 33, '2026-07-31 00:00:00.000000', '2026-07-12 00:00:00.000000', 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `experience_salaries`
--

CREATE TABLE `experience_salaries` (
  `id` int(11) NOT NULL,
  `base_salary` double DEFAULT NULL,
  `years_of_experience` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `experience_salaries`
--

INSERT INTO `experience_salaries` (`id`, `base_salary`, `years_of_experience`) VALUES
(2, 5800000, 1),
(3, 6000000, 2),
(4, 6500000, 3),
(5, 7000000, 4),
(6, 8000000, 5),
(7, 8500000, 6),
(8, 9000000, 7),
(9, 9500000, 8),
(10, 10000000, 9),
(11, 10500000, 10);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `knowledge_articles`
--

CREATE TABLE `knowledge_articles` (
  `id` bigint(20) NOT NULL,
  `category` varchar(100) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `short_description` varchar(500) DEFAULT NULL,
  `slug` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL,
  `thumbnail_image` varchar(500) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `view_count` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `knowledge_articles`
--

INSERT INTO `knowledge_articles` (`id`, `category`, `content`, `created_at`, `created_by`, `short_description`, `slug`, `status`, `thumbnail_image`, `title`, `updated_at`, `view_count`) VALUES
(1, 'Dịch vụ Nam', '<p><span class=\"text-big\"><i><mark class=\"marker-yellow\"><strong>1. Khái niệm kiểu tóc Mullet</strong></mark></i></span></p><p>Kiểu tóc Mullet (hay còn gọi là tóc cá đối) có đặc điểm là phần tóc hai bên mai được cắt ngắn hoặc cạo sát, phần mái có độ dài trung bình và phần tóc gáy được nuôi dài hẳn về phía sau. Đây là kiểu tóc mang phong cách cá tính, nổi bật và có phần nổi loạn.</p><p>&nbsp;</p><figure class=\"image\"><img style=\"aspect-ratio:600/606;\" src=\"http://localhost:8080/uploads/knowledge/b9a775d2-e85f-4f3b-ae79-751a604a796f.jpg\" width=\"600\" height=\"606\"></figure><p>&nbsp;</p><p><span class=\"text-big\"><i><mark class=\"marker-yellow\"><strong>2. Sự phù hợp với các dáng khuôn mặt</strong></mark></i></span></p><ul><li data-list-item-id=\"eecde272ccb0b85d500e6fa5184017882\"><strong>Mặt trái xoan và mặt dài: </strong>Đây là những dáng mặt phù hợp nhất với Mullet, giúp tôn lên các đường nét cân đối.</li><li data-list-item-id=\"e61cc6c38be3eafd1eba34868f108515b\"><strong>Mặt tròn và mặt vuông: </strong>Vẫn có thể để được kiểu tóc này nếu thợ cắt biến tấu bằng cách cạo sát hai bên mai (Fade/Undercut) và tạo độ phồng cho phần mái để kéo dài khuôn mặt.<br>&nbsp;</li></ul><figure class=\"image\"><img style=\"aspect-ratio:800/600;\" src=\"http://localhost:8080/uploads/knowledge/f3309856-944d-454d-8e1d-ea2614598eee.jpg\" width=\"800\" height=\"600\"></figure><p>&nbsp;</p><p><span class=\"text-big\"><i><mark class=\"marker-yellow\"><strong>3. Các biến tấu phổ biến hiện nay</strong></mark></i></span></p><ul><li data-list-item-id=\"ea1c6358283c2a695e584a6716b98cc78\"><strong>Modern Mullet:</strong><i><strong> </strong></i>Phần gáy được tiết chế lại, cắt ngắn vừa phải và không quá dài so với bản truyền thống, phù hợp cho môi trường học tập và làm việc.</li><li data-list-item-id=\"e9e0c4f14ce6259920f1c35d5d0e749c7\"><strong>Mullet Layer:</strong> Kết hợp kỹ thuật tỉa tầng xếp lớp, tạo hiệu ứng bồng bềnh và chuyển tiếp tự nhiên giữa các phần tóc.</li><li data-list-item-id=\"ea9f776e156b3e484ec162ebed8d88d64\"><strong>Mullet Undercut:</strong> Phần hai bên mai được cạo sát hoàn toàn, làm nổi bật đường nét nam tính và phần gáy dài phía sau.</li><li data-list-item-id=\"e804546c8d7de57c7070dbe63618d3b38\"><strong>Mullet uốn:</strong> Phần mái và gáy được uốn xoăn nhẹ hoặc uốn phồng để tạo độ lãng tử và giúp tóc dễ vào nếp hơn.<br>&nbsp;</li></ul><figure class=\"image\"><img style=\"aspect-ratio:800/994;\" src=\"http://localhost:8080/uploads/knowledge/961e2cee-a179-45e7-a371-58a6371e1e5a.jpg\" width=\"800\" height=\"994\"></figure><p>&nbsp;</p><p><span class=\"text-big\"><i><mark class=\"marker-yellow\"><strong>4. Những lưu ý trước khi cắt</strong></mark></i></span></p><ul><li data-list-item-id=\"e0284310d5e352a6b6a64bf044c5dd3a7\"><strong>Độ dài của tóc:</strong> Cần nuôi tóc gáy đạt độ dài tối thiểu chạm đến cổ và tóc mái dài qua mắt trước khi ra tiệm.</li><li data-list-item-id=\"e67c2776fb8922a9c2a9bece16dae0710\"><strong>Đặc điểm chất tóc:</strong> Tóc rễ tre hoặc tóc cứng thường dễ bị chỉa ở phần mai và vểnh ở phần gáy, cần cân nhắc việc ép side (downperm) hoặc uốn. Tóc mỏng cần tỉa layer để tạo độ dày dặn.</li><li data-list-item-id=\"e235a95f93c047c1a48cb2bc2d535482d\"><strong>Lựa chọn thợ cắt:</strong> Kiểu tóc này phụ thuộc nhiều vào kỹ năng xử lý độ dốc và liên kết giữa phần mai, mái và gáy của người thợ.</li></ul>', '2026-07-06 19:00:45.000000', 'adminql', '1. Khái niệm kiểu tóc MulletKiểu tóc Mullet (hay còn gọi là tóc cá đối) có đặc điểm là phần tóc hai bên mai được cắt ngắn hoặc cạo sát, phần mái có độ dài trung bình và phần tóc gáy được nuôi dài hẳn về phía sau. Đây là kiểu tóc mang phong cách cá tí...', 'kien-thuc-toan-dien-ve-kieu-toc-mullet-cho-nam', 'Hiển thị', '/uploads/knowledge/12e5308f-1f35-477b-8206-c537ce91dd77.jpg', 'Kiến Thức Toàn Diện Về Kiểu Tóc Mullet Cho Nam', '2026-11-02 18:25:24.000000', 8),
(2, 'Dịch vụ Nam', '<p>Kiểu tóc <strong>layer bồng (layer phồng)</strong> là một trong những biến thể được phái mạnh săn đón nhiều nhất nhờ mang lại vẻ ngoài lãng tử, trẻ trung và cực kỳ lịch lãm. Khác với layer thẳng truyền thống, phong cách này chú trọng tạo độ phồng tự nhiên ở phần đỉnh và thân tóc, giúp gương mặt trở nên hài hòa và có chiều sâu hơn.</p><p>Dưới đây là cẩm nang toàn diện về kiểu tóc layer bồng nam để bạn tham khảo trước khi tân trang diện mạo:</p><h3>1. Đặc Điểm Nổi Bật Của Layer Bồng Nam</h3><ul><li data-list-item-id=\"e64806f0596a02fe165d5fa103056708d\"><strong>Kỹ thuật tỉa layer kết hợp uốn phồng:</strong> Tóc được cắt tỉa các lớp (layer) đan xen kết hợp với kỹ thuật uốn chân tóc hoặc uốn sóng lơi nhẹ nhàng. Điều này giúp các lọn tóc có độ phồng tối đa, ôm nhẹ vào khuôn mặt mà không bị bết dính.</li><li data-list-item-id=\"ea70ff10b0e370116259c998a4751662b\"><strong>Texture (Kết cấu) rõ nét:</strong> Tạo hiệu ứng các lớp tóc xếp tầng bồng bềnh, mang lại cảm giác mái tóc dày dặn và có sức sống hơn hẳn.</li><li data-list-item-id=\"e6268e869c27d8b0e555a9a5492b7afe2\"><strong>Tính ứng dụng cao:</strong> Dễ dàng biến tấu với nhiều phong cách khác nhau từ thanh lịch, công sở cho đến năng động, đường phố.</li></ul><h3>2. Các Biến Thể Layer Bồng Phổ Biến Nhất</h3><ul><li data-list-item-id=\"eb6ac81e63573c908a9cce328c49d9aad\"><strong>Layer Bồng Rẽ Ngôi (Middle Part Layer / 7/3):</strong> Kiểu tóc kinh điển giúp tôn lên đường nét góc cạnh của gương mặt, cực kỳ hợp với các bạn nam theo đuổi phong cách Hàn Quốc.</li><li data-list-item-id=\"e921883f38464055a01d2e75320efd5ea\"><strong>Layer Bồng Quiff (Quiff Layer):</strong> Phần mái được sấy phồng và vuốt nhẹ hướng lên trên, giúp ăn gian chiều cao tối đa và tạo vẻ nam tính, sắc sảo.</li><li data-list-item-id=\"e6ebbea29c11214fa101417328b9dd1f5\"><strong>Layer Bồng Tự Nhiên (Natural Volume Layer):</strong> Giữ độ phồng hoàn toàn bằng kỹ thuật sấy tạo kiểu mà không cần uốn quá nhiều, mang lại sự thoải mái và dễ chăm sóc tại nhà.</li></ul><h3>3. Kiểu Tóc Này Phù Hợp Với Ai?</h3><ul><li data-list-item-id=\"e1d77b8b402b36b97435664fd134140ca\"><strong>Khuôn mặt:</strong> Phù hợp với hầu hết mọi dáng mặt, đặc biệt là <strong>mặt tròn, mặt dài hoặc mặt trái xoan (oval)</strong>. Độ phồng của tóc sẽ giúp cân đối tỷ lệ gương mặt rất tốt.</li><li data-list-item-id=\"ec066db10d2a9feac86736338735071cd\"><strong>Chất tóc:</strong> Rất lý tưởng cho những bạn có chất tóc mỏng, xẹp hoặc dễ bết. Đối với tóc dày, thợ cắt sẽ tiến hành tỉa bớt trọng lượng để mái tóc có độ bay tự nhiên.</li></ul><h3>4. Bí Quyết Chăm Sóc &amp; Tạo Kiểu Tại Nhà</h3><p>Để mái tóc layer bồng luôn giữ được form dáng chuẩn salon cả ngày dài, bạn hãy lưu ý:</p><ol><li data-list-item-id=\"edac9eaf631978142873358d401738e05\"><strong>Sấy tóc ngược chiều:</strong> Khi sấy khô, hãy cúi đầu hoặc sấy ngược chiều tóc mọc để kích hoạt độ phồng tối đa cho chân tóc.</li><li data-list-item-id=\"e7f5cfd49b94dfd52980e7fd6ee089870\"><strong>Sản phẩm tạo kiểu chuyên dụng:</strong> Sử dụng <strong>Pre-styling (xịt tạo phồng)</strong> trước khi sấy, kết hợp với một chút <strong>sáp (wax) mềm</strong> hoặc <strong>clay có độ giữ nếp vừa phải</strong> để định hình từng lọn layer mà không làm cứng tóc.</li></ol>', '2026-11-03 12:13:59.000000', 'adminql', 'Kiểu tóc layer bồng (layer phồng) là một trong những biến thể được phái mạnh săn đón nhiều nhất nhờ mang lại vẻ ngoài lãng tử, trẻ trung và cực kỳ lịch lãm. Khác với layer thẳng truyền thống, phong cách này chú trọng tạo độ phồng tự nhiên ở phần đỉnh...', 'kham-pha-kieu-toc-layer-bong-layer-phong-cho-nam-phong-cach-banh-bao-phong-khoang-tai-hornet-royale', 'Hiển thị', '/uploads/knowledge/0cf545cc-7f4a-4128-9b61-c05a647d0f7b.jpg', 'Khám Phá Kiểu Tóc Layer Bồng (Layer Phồng) Cho Nam – Phong Cách Bảnh Bao, Phóng Khoáng Tại Hornet Royale', '2026-11-03 12:14:07.000000', 1),
(3, 'Dịch vụ Nữ', '<p>Mái tóc xoăn bồng bềnh luôn là niềm ao ước của phái đẹp bởi sự nữ tính, cuốn hút và khả năng hack tuổi cực đỉnh. Nếu như các kiểu uốn lọn nhỏ cổ điển đôi khi mang lại cảm giác trưởng thành hoặc khó chăm sóc, thì <strong>uốn sóng lơi</strong> lại xuất hiện như một làn gió mới – tự nhiên, mềm mại, thanh lịch và không bao giờ lỗi mốt.</p><p>Dưới đây là cẩm nang toàn diện về kiểu tóc uốn sóng lơi nữ giúp bạn hiểu rõ từng chi tiết trước khi quyết định \"F5\" diện mạo tại <strong>Hornet Royale</strong>.</p><h3>1. Uốn Sóng Lơi Nữ Là Gì? Đặc Điểm Nhận Biết</h3><ul><li data-list-item-id=\"eea7b025e010535ebf5a90f72f58a1cb1\"><strong>Kỹ thuật tạo kiểu:</strong> Khác với những lọn xoăn tít cứng nhắc, uốn sóng lơi sử dụng các trục cuốn cỡ lớn kết hợp với phương pháp định hình phom tóc đa tầng. Thợ cắt sẽ khéo léo tạo ra những đường sóng lượn vô cùng nhẹ nhàng, ngẫu hứng và uyển chuyển ôm trọn lấy gương mặt.</li><li data-list-item-id=\"ebfdeb107a14785aa7732dbe57aa9fb06\"><strong>Hiệu ứng thẩm mỹ:</strong> Các lọn tóc buông lơi tự nhiên tạo cảm giác bồng bềnh, dày dặn nhưng không hề bị nặng nề hay già dặn. Đây là lựa chọn hoàn hảo cho những ai yêu thích phong cách nhẹ nhàng, phóng khoáng mang hơi hướng Hàn Quốc.</li></ul><h3>2. Ưu Điểm Vượt Trội Của Kiểu Tóc Uốn Sóng Lơi</h3><ul><li data-list-item-id=\"ef3811a69bce9c823c4b850b8ed6b84a1\"><strong>Che khuyết điểm hoàn hảo:</strong> Những đường sóng mềm mại hai bên má giúp làm mềm các đường nét góc cạnh, giấu đi gò má cao hoặc phần xương hàm thô, mang lại sự cân đối và thanh thoát cho gương mặt.</li><li data-list-item-id=\"e84d9277be53da671df51b35265a5ee81\"><strong>Phù hợp với nhiều độ dài:</strong> Dù bạn để tóc ngang vai năng động hay tóc dài thướt tha, uốn sóng lơi đều có thể biến hóa linh hoạt để tôn lên nét đẹp riêng.</li><li data-list-item-id=\"ebc85e3d984c871d4b3e7f9ea016fe41b\"><strong>Ít tốn công chăm sóc:</strong> Do nếp tóc được làm lơi tự nhiên, bạn không cần phải quá kỳ công sấy tạo kiểu cầu kỳ mỗi ngày mà tóc vẫn giữ được độ vào nếp ổn định.</li></ul><h3>3. Kiểu Tóc Này Phù Hợp Với Ai?</h3><ul><li data-list-item-id=\"e80ac5ab3f3f355be20b55004384c5f17\"><strong>Khuôn mặt:</strong> Sóng lơi là \"vị cứu tinh\" đa năng, cực kỳ phù hợp với <strong>mặt tròn, mặt dài, mặt trái xoan (oval)</strong> và cả mặt vuông chữ điền.</li><li data-list-item-id=\"ebebc1fca60351a598092e64992fec258\"><strong>Chất tóc:</strong> Rất lý tưởng cho những bạn có mái tóc mỏng, xẹp hoặc thưa. Kỹ thuật uốn phồng chân tóc kết hợp sóng lơi sẽ giúp tổng thể mái tóc trông dày dặn và có sức sống hơn hẳn.</li></ul><h3>4. Bí Quyết Chăm Sóc &amp; Giữ Sóng Tóc Bền Đẹp Tại Nhà</h3><p>Để mái tóc uốn sóng lơi luôn giữ được độ bồng bềnh, bóng mượt như ngoài salon, bạn hãy ghi nhớ những mẹo nhỏ sau:</p><ol><li data-list-item-id=\"e91395a58b6178782fe4a8586d0ddff3e\"><strong>Gội và xả cấp ẩm:</strong> Ưu tiên các dòng sản phẩm chứa nhiều dưỡng chất, keratin hoặc tinh dầu dưỡng ẩm để nuôi dưỡng lõi tóc, tránh tình trạng đuôi tóc bị khô xơ do tác động nhiệt.</li><li data-list-item-id=\"e8d1d7abc227f009ac654d8790f210b9e\"><strong>Kỹ thuật sấy tóc:</strong> Khi sấy tóc, hãy chia nhỏ từng lọn, vừa sấy vừa dùng tay xoắn nhẹ theo chiều kim đồng hồ (hoặc ngược lại) để định hình nếp sóng cong tự nhiên. Tránh sấy bừa bãi làm tóc bị xù mất form.</li><li data-list-item-id=\"e2493458a5e7d2e59a731494eea0596ac\"><strong>Sử dụng tinh dầu dưỡng:</strong> Sau khi tóc khô khoảng 80%, thoa một chút dầu dưỡng hoặc kem giữ sóng (styling cream) để các lọn tóc thêm phần bóng bẩy, mềm mại và vào nếp chuẩn xác.</li></ol>', '2026-11-03 12:16:20.000000', 'adminql', 'Mái tóc xoăn bồng bềnh luôn là niềm ao ước của phái đẹp bởi sự nữ tính, cuốn hút và khả năng hack tuổi cực đỉnh. Nếu như các kiểu uốn lọn nhỏ cổ điển đôi khi mang lại cảm giác trưởng thành hoặc khó chăm sóc, thì uốn sóng lơi lại xuất hiện như một làn...', 'kham-pha-nghe-thuat-uon-song-loi-nu-tuyen-ngon-dinh-cao-cua-ve-dep-thanh-lich-day-chat-tho', 'Hiển thị', '/uploads/knowledge/8fd60d69-10bc-423c-9de2-975d80fe7e84.jpg', 'Khám Phá Nghệ Thuật Uốn Sóng Lơi Nữ – Tuyên Ngôn Đỉnh Cao Của Vẻ Đẹp Thanh Lịch & Đầy Chất Thơ', '2026-11-03 12:16:36.000000', 1),
(4, 'Dịch vụ Nữ', '<p style=\"margin-left:0px !important;\">Màu tóc bạch kim từ lâu đã trở thành biểu tượng kinh điển của sự thời thượng, đẳng cấp và phong cách phá cách dành riêng cho phái đẹp. Nếu bạn muốn lột xác hoàn toàn, tạm biệt những gam màu truyền thống để bước vào một không gian rực rỡ và cuốn hút hơn, <strong>nhuộm bạch kim</strong> chính là sự lựa chọn không thể bỏ qua.</p><p style=\"margin-left:0px !important;\">Dưới đây là cẩm nang toàn diện về dịch vụ nhuộm bạch kim nữ tại <strong>Hornet Royale</strong> giúp bạn nắm rõ quy trình và bí quyết chăm sóc:</p><h3 style=\"margin-left:0px !important;\">1. Nhuộm Bạch Kim Nữ Là Gì? Đặc Điểm Nhận Biết</h3><ul style=\"margin-left:0px !important;\"><li style=\"margin-left:0px !important;\" data-list-item-id=\"ed0a22c933c5b8f3f82965b9561d69c3f\"><p style=\"margin-left:0px !important;\"><strong>Kỹ thuật chuyên sâu:</strong> Để đạt được sắc bạch kim trong trẻo, đạt độ sáng hoàn hảo và sạch ánh vàng như ý muốn, mái tóc sẽ được trải qua quy trình bóc tách sắc tố và khử vàng chuyên sâu bằng công nghệ hạt màu phân tử siêu nhỏ.</p></li><li style=\"margin-left:0px !important;\" data-list-item-id=\"e3ec0120f107ea1e85aa113c961587bbc\"><p style=\"margin-left:0px !important;\"><strong>Bảo vệ cấu trúc tóc:</strong> Tại Hornet Royale, chúng tôi sử dụng dòng thuốc tẩy và thuốc nhuộm organic thế hệ mới chứa màng bảo vệ lipid, kết hợp tinh chất phục hồi liên kết lõi tóc, giúp hạt màu bạch kim bám chặt, bóng bẩy mà vẫn giữ được độ đàn hồi, hạn chế tối đa tình trạng khô sơ hay đứt gãy sợi tóc.</p></li><li style=\"margin-left:0px !important;\" data-list-item-id=\"edc76d68da9c5be050ecfe36bc1736615\"><p style=\"margin-left:0px !important;\"><strong>Thời gian thực hiện:</strong> Khoảng 180 phút dưới sự tỉ mỉ của đội ngũ thợ lành nghề.</p></li></ul><h3 style=\"margin-left:0px !important;\">2. Ưu Điểm Vượt Trội Của Kiểu Tóc Bạch Kim Nữ</h3><ul style=\"margin-left:0px !important;\"><li style=\"margin-left:0px !important;\" data-list-item-id=\"e56c6b40d53d57371ecc201cdc284a0e8\"><p style=\"margin-left:0px !important;\"><strong>Tôn da và định hình phong cách:</strong> Sắc trắng bạc hoặc ánh kim sáng giúp tôn lên làn da sáng hồng, mang lại diện mạo cực kỳ sang chảnh, sắc nét và thu hút mọi ánh nhìn ở bất cứ đâu.</p></li><li style=\"margin-left:0px !important;\" data-list-item-id=\"ef1fb748f579fa66e76174d7879e79451\"><p style=\"margin-left:0px !important;\"><strong>Biến hóa đa dạng:</strong> Dễ dàng kết hợp với nhiều phong cách thời trang khác nhau từ cá tính, street style cho đến thanh lịch, hiện đại.</p></li></ul><h3 style=\"margin-left:0px !important;\">3. Bí Quyết Chăm Sóc Tóc Bạch Kim Bền Màu Tại Nhà</h3><p style=\"margin-left:0px !important;\">Tóc tẩy sáng màu đòi hỏi chế độ chăm sóc kỹ lưỡng để giữ độ óng ả và tránh bị ngả màu vàng:</p><ol style=\"margin-left:0px !important;\"><li style=\"margin-left:0px !important;\" data-list-item-id=\"e039de0f5e9fa672f9f976f0f3a78cf67\"><p style=\"margin-left:0px !important;\"><strong>Sử dụng dầu gội khử vàng (Purple Shampoo):</strong> Giúp trung hòa các sắc tố vàng và giữ cho mái tóc luôn chuẩn tone bạch kim lạnh.</p></li><li style=\"margin-left:0px !important;\" data-list-item-id=\"e7b914a02132874ffdad6b20e0388f9a9\"><p style=\"margin-left:0px !important;\"><strong>Cấp ẩm và phục hồi sâu:</strong> Thường xuyên sử dụng mặt nạ tóc, tinh dầu dưỡng hoặc hấp phục hồi định kỳ để bù đắp độ ẩm đã mất cho sợi tóc.</p></li><li style=\"margin-left:0px !important;\" data-list-item-id=\"e523c5fb0fbe8d620c529e1eda7f928f9\"><p style=\"margin-left:0px !important;\"><strong>Hạn chế nhiệt độ cao:</strong> Khi sấy tóc, nên chọn chế độ gió mát hoặc ấm nhẹ và dùng xịt bảo vệ nhiệt trước khi tạo kiểu.</p></li></ol>', '2026-11-03 12:23:23.000000', 'adminql', 'Màu tóc bạch kim từ lâu đã trở thành biểu tượng kinh điển của sự thời thượng, đẳng cấp và phong cách phá cách dành riêng cho phái đẹp. Nếu bạn muốn lột xác hoàn toàn, tạm biệt những gam màu truyền thống để bước vào một không gian rực rỡ và cuốn hút h...', 'kham-pha-nghe-thuat-nhuom-bach-kim-nu-tuyen-ngon-dinh-cao-cua-su-sang-chanh-ca-tinh-dot-pha', 'Hiển thị', '/uploads/knowledge/31bf2110-07a5-4be6-8e8f-25db5a7de943.jpg', 'Khám Phá Nghệ Thuật Nhuộm Bạch Kim Nữ – Tuyên Ngôn Đỉnh Cao Của Sự Sang Chảnh & Cá Tính Đột Phá', '2026-11-03 12:23:32.000000', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `model_types`
--

CREATE TABLE `model_types` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `model_types`
--

INSERT INTO `model_types` (`id`, `name`, `category_id`) VALUES
(4, 'Cắt tóc - Chăm sóc da & Râu', 1),
(5, 'Nhuộm tóc', 1),
(6, 'Uốn tóc', 1),
(7, 'Dịch vụ khác', 1),
(8, 'Cắt - tỉa tóc', 2),
(9, 'Uốn tóc', 2),
(10, 'Nhuộm tóc', 2),
(11, 'Phục hồi tóc', 2),
(12, 'Chăm sóc da', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `news`
--

CREATE TABLE `news` (
  `id` bigint(20) NOT NULL,
  `author` varchar(255) DEFAULT NULL,
  `category_slug` varchar(255) DEFAULT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `thumbnail` varchar(255) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `voucher_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `news`
--

INSERT INTO `news` (`id`, `author`, `category_slug`, `content`, `created_at`, `sort_order`, `thumbnail`, `title`, `type`, `voucher_id`) VALUES
(9, NULL, 'nam', '<p>Bạn đã nhàm chán với những màu tóc đen truyền thống và muốn tìm kiếm một diện mạo hoàn toàn khác biệt, nổi bật và đậm chất Tây? <strong>Nhuộm bạch kim</strong> chính là tuyên ngôn phong cách dành riêng cho bạn!</p><p>🔥 <strong>Điểm nhấn của dịch vụ tại Hornet Royale:</strong></p><ul><li data-list-item-id=\"e9819184c9a59a62feabee95ecf7357fa\"><strong>Kỹ thuật tẩy chuyên sâu (2 - 3 lần):</strong> Giúp loại bỏ hoàn toàn sắc tố vàng/cam, đưa tóc về tone nền trắng sáng chuẩn mực nhất mà vẫn bảo vệ cấu trúc tóc tối đa.</li><li data-list-item-id=\"e4b9099b4e057a749fadb1a8be299ae4c\"><strong>Tông màu thời thượng:</strong> Mang lại vẻ ngoài cực kỳ sang chảnh, sắc nét và thu hút mọi ánh nhìn ở bất cứ đâu.</li><li data-list-item-id=\"e18942f393ce0aaac243ba12f8c36c695\"><strong>Thời gian thực hiện:</strong> Khoảng 60 phút với đội ngũ thợ lành nghề, tỉ mỉ trong từng công đoạn.</li></ul>', '2026-11-03 12:01:06.000000', 0, '/uploads/news/dad8de62-a662-4af1-bf0e-a1ea0eb59b9d.jpg', '✨ Nhuộm Bạch Kim Cho Nam – Đỉnh Cao Cuốn Hút & Bứt Phá Phong Cách Tại Hornet Royale ✨', 'SERVICE', NULL),
(10, NULL, 'nam', '<p>Bạn đã sẵn sàng lột xác với một diện mạo hoàn toàn mới, mang đậm chất đường phố và cực kỳ cá tính chưa? <strong>Uốn con sâu</strong> chính là lựa chọn hoàn hảo giúp bạn khẳng định chất riêng!</p><p>🔥 <strong>Điểm nhấn dịch vụ tại Hornet Royale:</strong></p><ul><li data-list-item-id=\"e4f7d64b9665d3a29a94feea5112d34b6\"><strong>Kỹ thuật chuyên nghiệp:</strong> Sử dụng phương pháp xoắn tóc và quấn giấy bạc tỉ mỉ, tạo ra các lọn xoăn nhỏ, nhọn và bồng bềnh chuẩn form.</li><li data-list-item-id=\"eef67155554ce9d66fa94a01a8dc35f83\"><strong>Phong cách đỉnh cao:</strong> Mang lại vẻ ngoài nam tính, phóng khoáng và cực kỳ thu hút ánh nhìn.</li><li data-list-item-id=\"e6cb4c7a1ccf73514cb0f4d19bd7ed8d0\"><strong>Thời gian thực hiện:</strong> Khoảng 120 phút với sự chăm chút từ đội ngũ thợ lành nghề.</li></ul>', '2026-11-03 12:06:52.000000', 0, '/uploads/news/e5d40711-8210-45ca-b6ad-b36f1512a4c2.jpg', '✨ Uốn Con Sâu Nam – Chất Chơi, Bụi Bặm & Bứt Phá Phong Cách Tại Hornet Royale ✨', 'SERVICE', NULL),
(11, NULL, 'nu', '<p>Bạn đang tìm kiếm một diện mạo hoàn toàn bứt phá, hoài cổ nhưng đầy cuốn hút? <strong>Uốn Hippie</strong> chính là tuyên ngôn phong cách đỉnh cao dành riêng cho bạn!</p><p>🔥 <strong>Điểm nhấn dịch vụ tại Hornet Royale:</strong></p><ul><li data-list-item-id=\"e7ae636468024d2ea882e6540c5c1c579\"><strong>Kỹ thuật chuyên sâu:</strong> Đi trục size nhỏ sát chân tóc, tạo nên các lọn xoăn tít bồng bềnh từ gốc đến ngọn, giúp mái tóc dày dặn gấp 3 lần.</li><li data-list-item-id=\"e7c32d16ba570d8e5c7015eb2ddbb40c6\"><strong>Chất lượng vượt trội:</strong> Sử dụng thuốc uốn định hình phân tử cao cấp kết hợp cốt dưỡng chuyên sâu, giữ sóng xoăn nảy, mềm mại mà không bị xơ xác.</li><li data-list-item-id=\"ef9a10248e9befbf8cc0394b191be8a62\"><strong>Thời gian thực hiện:</strong> Khoảng 150 phút dưới bàn tay tỉ mỉ của đội ngũ thợ lành nghề.</li></ul>', '2026-11-03 12:09:02.000000', 0, '/uploads/news/6b46260a-7b93-4691-88d8-a49632e8c5dc.jpg', '✨ Uốn Hippie Cho Nữ – Phóng Khoáng, Bồng Bềnh & Cực Kỳ Cá Tính Tại Hornet Royale ✨', 'SERVICE', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `data_json` text DEFAULT NULL,
  `is_read` bit(1) NOT NULL,
  `message` text NOT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(50) NOT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `notifications`
--

INSERT INTO `notifications` (`id`, `created_at`, `data_json`, `is_read`, `message`, `title`, `type`, `user_id`) VALUES
(19, '2026-06-17 19:44:26.000000', '{\"total_price\":150000.0,\"order_id\":12}', b'1', 'Đơn hàng mã số #12 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #12 đã được duyệt', 'approve', 8),
(20, '2026-06-17 19:44:34.000000', '{\"total_price\":150000.0,\"order_id\":12}', b'1', 'Đơn hàng mã số #12 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #12 đã giao thành công', 'approve', 8),
(21, '2026-06-17 20:16:55.000000', '{\"total_price\":216000.0,\"order_id\":15}', b'1', 'Đơn hàng mã số #15 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #15 đã được duyệt', 'approve', 7),
(23, '2026-06-17 20:53:03.000000', '{\"total_price\":216000.0,\"order_id\":15}', b'1', 'Đơn hàng mã số #15 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #15 đã giao thành công', 'approve', 7),
(24, '2026-06-17 20:54:03.000000', '{\"total_price\":2.498E7,\"order_id\":17}', b'1', 'Đơn hàng mã số #17 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #17 đã được duyệt', 'approve', 7),
(25, '2026-06-17 20:54:05.000000', '{\"total_price\":2.498E7,\"order_id\":17}', b'1', 'Đơn hàng mã số #17 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #17 đã giao thành công', 'approve', 7),
(91, '2026-06-27 15:46:53.000000', NULL, b'1', 'Nhân dịp tháng sinh nhật (Tháng 6), chúng tôi gửi tặng bạn voucher đặc biệt: HBDJUN\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: Quà Sinh Nhật Từ HORNET ROYALE\n🎟️ Mã voucher: HBDJUN\n📅 Sự kiện: Sinh Nhật\n🎯 Áp dụng: Dịch Vụ\n💰 Giảm giá: 15.0%\n⏰ Hạn dùng: 30/06/2026 00:00\n\nℹ️ Chi tiết: Quà tặng sinh nhật tháng 6', '🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!', 'system', 25),
(92, '2026-06-27 16:00:03.000000', NULL, b'1', 'Cửa hàng đã gửi tặng riêng cho bạn 1 voucher: GFGGFGFGG\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: gfgfg\n🎟️ Mã voucher: GFGGFGFGG\n📅 Sự kiện: Tặng Riêng\n🎯 Áp dụng: Dịch Vụ\n💰 Giảm giá: 10.0%\n⏰ Hạn dùng: 30/06/2026 00:00\n', '🎁 Bạn vừa nhận được voucher đặc biệt từ HORNET ROYALE.', 'system', 25),
(93, '2026-06-27 16:18:45.000000', NULL, b'1', 'Nhân dịp tháng sinh nhật (Tháng 6), chúng tôi gửi tặng bạn voucher đặc biệt: TEST\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: test\n🎟️ Mã voucher: TEST\n📅 Sự kiện: Sinh Nhật\n🎯 Áp dụng: Dịch Vụ\n💰 Giảm giá: 10.0%\n⏰ Hạn dùng: 27/06/2026 16:19\n\nℹ️ Chi tiết: Quà tặng sinh nhật tháng 6', '🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!', 'system', 25),
(94, '2026-06-27 16:21:24.000000', NULL, b'1', 'Nhân dịp tháng sinh nhật (Tháng 6), chúng tôi gửi tặng bạn voucher đặc biệt: GIAM\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: Ép side\n🎟️ Mã voucher: GIAM\n📅 Sự kiện: Sinh Nhật\n🎯 Áp dụng: Dịch Vụ\n💰 Giảm giá: 10.0%\n⏰ Hạn dùng: 27/06/2026 16:22\n\nℹ️ Chi tiết: Quà tặng sinh nhật tháng 6', '🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!', 'system', 25),
(95, '2026-06-27 16:31:50.000000', NULL, b'1', 'Nhân dịp tháng sinh nhật (Tháng 6), chúng tôi gửi tặng bạn voucher đặc biệt: TEST1\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: test1\n🎟️ Mã voucher: TEST1\n📅 Sự kiện: Sinh Nhật\n🎯 Áp dụng: Dịch Vụ + Sản Phẩm\n💰 Giảm giá: 10.0%\n⏰ Hạn dùng: 27/06/2026 16:32\n\nℹ️ Chi tiết: Quà tặng sinh nhật tháng 6', '🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!', 'system', 25),
(96, '2026-06-27 16:36:28.000000', NULL, b'1', 'Nhân dịp tháng sinh nhật (Tháng 6), chúng tôi gửi tặng bạn voucher đặc biệt: TEST2\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: test2\n🎟️ Mã voucher: TEST2\n📅 Sự kiện: Sinh Nhật\n🎯 Áp dụng: Dịch Vụ\n💰 Giảm giá: 10.0%\n⏰ Hạn dùng: 27/06/2026 16:37\n\nℹ️ Chi tiết: Quà tặng sinh nhật tháng 6', '🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!', 'system', 25),
(97, '2026-06-27 16:41:31.000000', NULL, b'1', 'Nhân dịp tháng sinh nhật (Tháng 6), chúng tôi gửi tặng bạn voucher đặc biệt: TEST3\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: testt3\n🎟️ Mã voucher: TEST3\n📅 Sự kiện: Sinh Nhật\n🎯 Áp dụng: Dịch Vụ + Sản Phẩm\n💰 Giảm giá: 10.0%\n⏰ Hạn dùng: 30/06/2026 00:00\n\nℹ️ Chi tiết: Quà tặng sinh nhật tháng 6', '🎂 HORNET ROYALE chúc bạn sinh nhật vui vẻ!', 'system', 25),
(98, '2026-06-28 15:42:10.000000', '{\"total_price\":4016000.0,\"order_id\":19}', b'1', 'Đơn hàng mã số #19 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #19 đã được duyệt', 'approve', 25),
(99, '2026-06-28 15:42:30.000000', '{\"total_price\":4016000.0,\"order_id\":19}', b'1', 'Đơn hàng mã số #19 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #19 đã giao thành công', 'approve', 25),
(100, '2026-06-28 15:43:11.000000', '{\"cancel_reason\":\"Hủy bởi Admin\",\"total_price\":1.5E7,\"order_id\":18}', b'1', 'Chúng tôi vô cùng xin lỗi quý khách vì sự bất tiện này. Đơn hàng mã số #18 của bạn đã bị hủy.', '❌ Đơn hàng #18 đã bị hủy', 'cancel', 8),
(101, '2026-06-28 18:03:38.000000', '{\"chatId\": 7, \"replyMessage\": \"được phết đấy.\"}', b'1', 'Thợ Lê Trí đã trả lời tin nhắn của bạn.', 'Phản hồi từ thợ Lê Trí', 'chat_reply', 25),
(102, '2026-07-04 19:19:25.000000', '{\"chatId\": 10}', b'1', 'Khách hàng test thông báo vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 14),
(103, '2026-07-04 19:19:25.000000', '{\"chatId\": 10}', b'1', 'Khách hàng test thông báo vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 7),
(104, '2026-07-04 19:19:25.000000', '{\"chatId\": 10}', b'1', 'Khách hàng test thông báo vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 6),
(105, '2026-07-04 19:20:35.000000', '{\"chatId\": 10, \"replyMessage\": \"oke được\"}', b'1', 'Thợ Lê Trí đã trả lời tin nhắn của bạn.', 'Phản hồi từ thợ Lê Trí', 'chat_reply', 25),
(106, '2026-07-04 19:52:22.000000', '{\"chatId\": 11}', b'1', 'Khách hàng thử lại vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 14),
(107, '2026-07-04 19:52:22.000000', '{\"chatId\": 11}', b'1', 'Khách hàng thử lại vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 7),
(108, '2026-07-04 19:52:22.000000', '{\"chatId\": 11}', b'1', 'Khách hàng thử lại vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 6),
(109, '2026-07-04 19:53:25.000000', '{\"chatId\": 11, \"replyMessage\": \"láo\"}', b'1', 'Thợ Lê Trí đã trả lời tin nhắn của bạn.', 'Phản hồi từ thợ Lê Trí', 'chat_reply', 25),
(110, '2026-07-04 19:56:17.000000', '{\"chatId\": 12}', b'1', 'Khách hàng lallsflalf vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 14),
(111, '2026-07-04 19:56:17.000000', '{\"chatId\": 12}', b'1', 'Khách hàng lallsflalf vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 7),
(112, '2026-07-04 19:56:17.000000', '{\"chatId\": 12}', b'1', 'Khách hàng lallsflalf vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 6),
(113, '2026-07-04 19:56:26.000000', '{\"chatId\": 12, \"replyMessage\": \"biến\"}', b'1', 'Thợ Lê Trí đã trả lời tin nhắn của bạn.', 'Phản hồi từ thợ Lê Trí', 'chat_reply', 25),
(114, '2026-07-04 20:04:55.000000', '{\"chatId\": 13}', b'1', 'Khách hàng kndfkdnfnjaf vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 14),
(115, '2026-07-04 20:04:55.000000', '{\"chatId\": 13}', b'1', 'Khách hàng kndfkdnfnjaf vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 7),
(116, '2026-07-04 20:04:55.000000', '{\"chatId\": 13}', b'1', 'Khách hàng kndfkdnfnjaf vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 6),
(117, '2026-07-04 20:05:29.000000', '{\"chatId\": 13, \"replyMessage\": \"thua\"}', b'1', 'Thợ Lê Trí đã trả lời tin nhắn của bạn.', 'Phản hồi từ thợ Lê Trí', 'chat_reply', 25),
(118, '2026-07-04 20:05:38.000000', '{\"chatId\": 13}', b'1', 'Khách hàng kndfkdnfnjaf vừa báo cáo tin nhắn của thợ Lê Trí', 'Khách hàng báo cáo vi phạm', 'system', 7),
(119, '2026-07-04 20:05:38.000000', '{\"chatId\": 13}', b'1', 'Khách hàng kndfkdnfnjaf vừa báo cáo tin nhắn của thợ Lê Trí', 'Khách hàng báo cáo vi phạm', 'system', 6),
(120, '2026-07-04 20:10:31.000000', '{\"chatId\": 14}', b'1', 'Khách hàng kakjsdkaklda vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 14),
(121, '2026-07-04 20:10:31.000000', '{\"chatId\": 14}', b'1', 'Khách hàng kakjsdkaklda vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 7),
(122, '2026-07-04 20:10:31.000000', '{\"chatId\": 14}', b'1', 'Khách hàng kakjsdkaklda vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 6),
(123, '2026-07-04 20:10:41.000000', '{\"chatId\": 14, \"replyMessage\": \"sdefefesfefsefef\"}', b'1', 'Thợ Lê Trí đã trả lời tin nhắn của bạn.', 'Phản hồi từ thợ Lê Trí', 'chat_reply', 25),
(124, '2026-07-04 20:10:50.000000', '{\"chatId\": 14}', b'1', 'Khách hàng kakjsdkaklda vừa báo cáo tin nhắn của thợ Lê Trí', 'Khách hàng báo cáo vi phạm', 'system', 14),
(125, '2026-07-04 20:10:50.000000', '{\"chatId\": 14}', b'1', 'Khách hàng kakjsdkaklda vừa báo cáo tin nhắn của thợ Lê Trí', 'Khách hàng báo cáo vi phạm', 'system', 7),
(126, '2026-07-04 20:10:50.000000', '{\"chatId\": 14}', b'1', 'Khách hàng kakjsdkaklda vừa báo cáo tin nhắn của thợ Lê Trí', 'Khách hàng báo cáo vi phạm', 'system', 6),
(127, '2026-07-05 14:55:26.000000', NULL, b'1', 'Bạn vừa nhận được voucher đặc quyền hội viên: TESTWWW\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: testwww\n🎟️ Mã voucher: TESTWWW\n📅 Sự kiện: Hội Viên\n🎯 Áp dụng: Dịch Vụ + Sản Phẩm\n💰 Giảm giá: 20.0%\n⏰ Hạn dùng: 30/07/2026 00:00\n\nℹ️ Chi tiết: Chúc mừng thành viên hạng Người Của Công Chúng nhận được ưu đãi riêng!', '⭐ Chúc mừng bạn đã đạt cấp: Người Của Công Chúng', 'system', 25),
(128, '2026-07-05 16:11:55.000000', '{\"total_price\":5020000.0,\"order_id\":20}', b'1', 'Đơn hàng mã số #20 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #20 đã được duyệt', 'approve', 7),
(129, '2026-07-05 16:11:58.000000', '{\"total_price\":5020000.0,\"order_id\":20}', b'1', 'Đơn hàng mã số #20 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #20 đã giao thành công', 'approve', 7),
(130, '2026-07-06 20:06:27.000000', NULL, b'1', 'Rất tiếc! Lịch hẹn ngày 2026-07-06 với nhân viên Hoàng Minh đã bị hủy. Lý do: Nhân viên nghỉ làm.\nHệ thống đã hoàn tiền 100% cho bạn. Xin lỗi vì sự bất tiện này!', '❌ Lịch hẹn đã bị hủy', 'cancel', 25),
(131, '2026-07-06 20:06:27.000000', NULL, b'1', 'Kỳ nghỉ từ 2026-07-06 đến 2026-07-08.\nĐã đổi thợ: 0 lịch hẹn.\nĐã hủy/hoàn tiền: 1 lịch hẹn.', '🔴 Nhân viên Hoàng Minh đã được đăng ký nghỉ', 'admin_leave_summary', 6),
(132, '2026-07-06 20:17:22.000000', '{\"cancelled_at\":\"2026-07-06T20:17:22.605655100\",\"refund_status\":\"success\",\"service_price\":20000.00,\"cancelled_by\":\"SYSTEM\",\"service_name\":\"Sấy vuốt tạo kiểu\",\"booking_date\":\"06-07-2026\",\"booking_time\":\"20:30\",\"service_duration\":15,\"booking_id\":63,\"cancel_reason\":\"STAFF_ON_LEAVE\",\"phone\":\"0907654321\",\"barber_name\":\"Khang Trần\",\"branch_name\":\"Quận 3\",\"payment_method\":\"MOMO\",\"email\":\"timtim2835@gmail.com\"}', b'1', 'Rất tiếc! Lịch hẹn ngày 2026-07-06 với nhân viên Khang Trần đã bị hủy. Lý do: Nhân viên nghỉ làm.\nHệ thống đã hoàn tiền 100% cho bạn. Xin lỗi vì sự bất tiện này!', '❌ Lịch hẹn đã bị hủy', 'cancel', 25),
(133, '2026-07-06 20:17:22.000000', NULL, b'1', 'Kỳ nghỉ từ 2026-07-06 đến 2026-07-07.\nĐã đổi thợ: 0 lịch hẹn.\nĐã hủy/hoàn tiền: 1 lịch hẹn.', '🔴 Nhân viên Khang Trần đã được đăng ký nghỉ', 'admin_leave_summary', 6),
(134, '2026-07-06 20:59:57.000000', '{\"cancelled_at\":\"2026-07-06T20:59:57.510198100\",\"refund_status\":\"success\",\"service_price\":20000.00,\"cancelled_by\":\"SYSTEM\",\"service_name\":\"Sấy vuốt tạo kiểu\",\"booking_date\":\"07-07-2026\",\"booking_time\":\"08:00\",\"service_duration\":15,\"booking_id\":64,\"cancel_reason\":\"STAFF_ON_LEAVE\",\"phone\":\"0907654321\",\"barber_name\":\"Đình Hoàng\",\"branch_name\":\"Quận 2\",\"payment_method\":\"MOMO\",\"email\":\"timtim2835@gmail.com\"}', b'1', 'Rất tiếc! Lịch hẹn ngày 2026-07-07 với nhân viên Đình Hoàng đã bị hủy. Lý do: Nhân viên nghỉ làm.\nHệ thống đã hoàn tiền 100% cho bạn. Xin lỗi vì sự bất tiện này!', '❌ Lịch hẹn đã bị hủy', 'cancel', 25),
(135, '2026-07-06 20:59:57.000000', NULL, b'1', 'Kỳ nghỉ từ 2026-07-06 đến 2026-07-10.\nĐã đổi thợ: 0 lịch hẹn.\nĐã hủy/hoàn tiền: 1 lịch hẹn.', '🔴 Nhân viên Đình Hoàng đã được đăng ký nghỉ', 'admin_leave_summary', 6),
(136, '2026-07-10 17:29:24.000000', NULL, b'1', 'Khách hàng btrhai vừa gửi tin nhắn liên hệ mới.', 'Tin nhắn mới từ btrhai', 'chat', 6),
(137, '2026-07-10 17:37:27.000000', NULL, b'1', 'Ban quản lý vừa trả lời tin nhắn của bạn. Vui lòng kiểm tra mục Liên hệ chủ tiệm.', 'Phản hồi từ Ban Quản Lý', 'chat', 25),
(138, '2026-07-10 17:39:04.000000', NULL, b'1', 'Ban quản lý vừa trả lời tin nhắn của bạn. Vui lòng kiểm tra mục Liên hệ chủ tiệm.', 'Phản hồi từ Ban Quản Lý', 'chat', 25),
(139, '2026-07-10 18:07:45.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(140, '2026-07-10 18:08:05.000000', '{\"total_price\":3130000.0,\"order_id\":21}', b'1', 'Đơn hàng mã số #21 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #21 đã được duyệt', 'approve', 25),
(141, '2026-07-10 18:08:16.000000', '{\"total_price\":3130000.0,\"order_id\":21}', b'1', 'Đơn hàng mã số #21 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #21 đã giao thành công', 'approve', 25),
(142, '2026-07-11 13:49:39.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(143, '2026-07-11 13:49:54.000000', '{\"total_price\":1.5E7,\"order_id\":22}', b'1', 'Đơn hàng mã số #22 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #22 đã được duyệt', 'approve', 25),
(144, '2026-07-11 13:49:59.000000', '{\"total_price\":1.5E7,\"order_id\":22}', b'1', 'Đơn hàng mã số #22 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #22 đã giao thành công', 'approve', 25),
(145, '2026-07-11 18:41:36.000000', NULL, b'1', 'Khách hàng btrhai vừa đặt lịch mới.', 'Đơn đặt lịch mới', 'booking', 6),
(146, '2026-07-11 18:43:13.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(147, '2026-07-11 18:43:36.000000', '{\"total_price\":9330000.0,\"order_id\":23}', b'1', 'Đơn hàng mã số #23 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #23 đã được duyệt', 'approve', 25),
(148, '2026-07-11 18:43:38.000000', '{\"total_price\":9330000.0,\"order_id\":23}', b'1', 'Đơn hàng mã số #23 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #23 đã giao thành công', 'approve', 25),
(149, '2026-07-11 18:48:01.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(150, '2026-07-11 18:49:43.000000', '{\"total_price\":1890000.0,\"order_id\":24}', b'1', 'Đơn hàng mã số #24 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #24 đã được duyệt', 'approve', 25),
(151, '2026-07-11 18:49:46.000000', '{\"total_price\":1890000.0,\"order_id\":24}', b'1', 'Đơn hàng mã số #24 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #24 đã giao thành công', 'approve', 25),
(152, '2026-07-11 18:50:14.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(153, '2026-07-11 18:56:03.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(154, '2026-07-11 18:56:08.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(155, '2026-07-11 18:58:39.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(156, '2026-07-11 19:05:26.000000', '{\"total_price\":3.193E7,\"order_id\":28}', b'1', 'Đơn hàng mã số #28 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #28 đã được duyệt', 'approve', 25),
(157, '2026-07-11 19:05:32.000000', '{\"total_price\":3.193E7,\"order_id\":28}', b'1', 'Đơn hàng mã số #28 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #28 đã giao thành công', 'approve', 25),
(158, '2026-07-11 19:06:11.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(159, '2026-07-11 19:06:24.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(160, '2026-07-11 19:09:00.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(161, '2026-07-11 19:10:10.000000', '{\"total_price\":774000.0,\"order_id\":31}', b'1', 'Đơn hàng mã số #31 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #31 đã được duyệt', 'approve', 25),
(162, '2026-07-11 19:10:16.000000', '{\"total_price\":774000.0,\"order_id\":31}', b'1', 'Đơn hàng mã số #31 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #31 đã giao thành công', 'approve', 25),
(163, '2026-07-11 19:13:59.000000', '{\"total_price\":9600000.0,\"order_id\":30}', b'1', 'Đơn hàng mã số #30 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #30 đã được duyệt', 'approve', 25),
(164, '2026-07-11 19:14:01.000000', '{\"total_price\":9600000.0,\"order_id\":30}', b'1', 'Đơn hàng mã số #30 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #30 đã giao thành công', 'approve', 25),
(165, '2026-07-11 19:14:04.000000', '{\"total_price\":9600000.0,\"order_id\":29}', b'1', 'Đơn hàng mã số #29 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #29 đã được duyệt', 'approve', 25),
(166, '2026-07-11 19:14:05.000000', '{\"total_price\":9600000.0,\"order_id\":29}', b'1', 'Đơn hàng mã số #29 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #29 đã giao thành công', 'approve', 25),
(167, '2026-07-11 19:14:08.000000', '{\"total_price\":6.383E7,\"order_id\":27}', b'1', 'Đơn hàng mã số #27 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #27 đã được duyệt', 'approve', 25),
(168, '2026-07-11 19:14:10.000000', '{\"total_price\":6.383E7,\"order_id\":27}', b'1', 'Đơn hàng mã số #27 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #27 đã giao thành công', 'approve', 25),
(169, '2026-07-11 19:14:12.000000', '{\"total_price\":6.383E7,\"order_id\":26}', b'1', 'Đơn hàng mã số #26 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #26 đã được duyệt', 'approve', 25),
(170, '2026-07-11 19:14:14.000000', '{\"total_price\":6.383E7,\"order_id\":26}', b'1', 'Đơn hàng mã số #26 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #26 đã giao thành công', 'approve', 25),
(171, '2026-07-11 19:14:17.000000', '{\"total_price\":1.513078E7,\"order_id\":25}', b'1', 'Đơn hàng mã số #25 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #25 đã được duyệt', 'approve', 25),
(172, '2026-07-11 19:14:19.000000', '{\"total_price\":1.513078E7,\"order_id\":25}', b'1', 'Đơn hàng mã số #25 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #25 đã giao thành công', 'approve', 25),
(173, '2026-07-11 19:29:41.000000', NULL, b'1', 'Khách hàng btrhai vừa đánh giá 5.0 sao cho sản phẩm Tông đơ Wahl 5 Star Vanish Shaver.', 'Đánh giá sản phẩm mới ⭐', 'system', 6),
(174, '2026-07-11 19:30:29.000000', NULL, b'1', 'Quản trị viên Trần Ngọc Hải đã trả lời đánh giá của bạn: ok', 'Phản hồi đánh giá 💬', 'system', 25),
(175, '2026-07-12 09:01:01.000000', NULL, b'1', 'Khách hàng btrhai vừa đặt lịch mới.', 'Đơn đặt lịch mới', 'booking', 6),
(176, '2026-07-12 09:02:09.000000', '{\"cancelled_at\":\"2026-07-12T09:02:09.856259\",\"refund_status\":\"success\",\"service_price\":70000.00,\"cancelled_by\":\"Admin Boss\",\"service_name\":\"Cắt tóc nam\",\"booking_date\":\"2026-07-12\",\"booking_time\":\"21:00\",\"service_duration\":30,\"booking_id\":67,\"cancel_reason\":\"admin_cancel\",\"phone\":\"0907654321\",\"barber_name\":\"Hoàng Minh\",\"branch_name\":\"Quận 3\",\"payment_method\":\"MOMO\",\"email\":\"btrhai@gmail.com\"}', b'1', 'HORNET ROYALE rất xin lỗi vì sự cố ngoài mong muốn. Lịch hẹn của bạn đã bị hủy và đã được hoàn tiền (nếu có). Mong bạn thông cảm và đặt lại lịch vào một thời gian khác.', '❌ Lịch hẹn của bạn đã bị hủy', 'cancel', 25),
(177, '2026-07-12 09:09:32.000000', NULL, b'1', 'nhanh nhanh nha mấy ní', 'Nhận dịp báo cáo THỰC TẬP TỐT NGHIỆP WEB CHƠI LỖ LUÔN', 'system', 25),
(178, '2026-07-12 09:21:45.000000', NULL, b'1', 'GIẢM 15% DỊCH VỤ\n\n--- THÔNG TIN VOUCHER ---\n🎫 Tên voucher: Giảm 15%\n🎟️ Mã voucher: GIAMLUON\n📅 Sự kiện: Toàn Bộ Khách Hàng\n🎯 Áp dụng: Dịch Vụ\n💰 Giảm giá: 15.0%\n⏰ Hạn dùng: 31/07/2026 00:00\n\nℹ️ Chi tiết: Chương trình tri ân toàn bộ khách hàng.', 'GIẢM 15% NÈ', 'system', 25),
(179, '2026-07-12 09:30:41.000000', NULL, b'1', 'Khách hàng btrhai vừa đặt lịch mới.', 'Đơn đặt lịch mới', 'booking', 6),
(180, '2026-07-12 09:32:17.000000', '{\"cancelled_at\":\"2026-07-12T09:32:17.633487300\",\"refund_status\":\"success\",\"service_price\":70000.00,\"cancelled_by\":\"Admin Boss\",\"service_name\":\"Cắt tóc nam\",\"booking_date\":\"2026-07-12\",\"booking_time\":\"09:45\",\"service_duration\":30,\"booking_id\":68,\"cancel_reason\":\"admin_cancel\",\"phone\":\"0907654321\",\"barber_name\":\"Lê Trí\",\"branch_name\":\"Quận 1\",\"payment_method\":\"MOMO\",\"email\":\"haingoctran288@gmail.com\"}', b'1', 'HORNET ROYALE rất xin lỗi vì sự cố ngoài mong muốn. Lịch hẹn của bạn đã bị hủy và đã được hoàn tiền (nếu có). Mong bạn thông cảm và đặt lại lịch vào một thời gian khác.', '❌ Lịch hẹn của bạn đã bị hủy', 'cancel', 25),
(181, '2026-07-12 09:40:24.000000', '{\"chatId\": 15}', b'0', 'Khách hàng dggfg vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 14),
(182, '2026-07-12 09:40:24.000000', '{\"chatId\": 15}', b'0', 'Khách hàng dggfg vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 7),
(183, '2026-07-12 09:40:24.000000', '{\"chatId\": 15}', b'1', 'Khách hàng dggfg vừa gửi tin nhắn cho Lê Trí', 'Yêu cầu tư vấn mới', 'system', 6),
(184, '2026-07-12 09:41:55.000000', NULL, b'1', 'Khách hàng btrhai vừa đặt lịch mới.', 'Đơn đặt lịch mới', 'booking', 6),
(185, '2026-11-02 19:06:57.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(186, '2026-11-02 19:22:40.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(187, '2026-11-02 19:25:15.000000', '{\"total_price\":1.001E7,\"order_id\":33}', b'1', 'Đơn hàng mã số #33 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #33 đã được duyệt', 'approve', 25),
(188, '2026-11-02 19:40:50.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(189, '2026-11-02 19:41:19.000000', '{\"order_branch\":null,\"address\":\"123hcm\",\"total_price\":960000.0,\"payment_status\":\"PAID\",\"created_at\":\"2026-11-02T19:40:50\",\"shipping_fee\":30000.0,\"phone\":\"0907654321\",\"customer_name\":\"mot mot\",\"order_id\":34,\"items\":[{\"productImage\":\"/images/products/keo-cat/keo JASON1.webp\",\"quantity\":5,\"productId\":5,\"price\":186000.0,\"productName\":\"Kéo cắt & tỉa JASON-JS02\"}],\"payment_method\":\"VNPAY\",\"transaction_no\":\"15722987\",\"status\":\"pending\"}', b'1', 'Đơn hàng mã số #34 của bạn đã được thanh toán thành công qua VNPAY và đang chờ xác nhận.', '💳 Thanh toán & Đặt hàng thành công #34', 'approve', 25),
(190, '2026-11-02 19:42:58.000000', '{\"order_branch\":null,\"address\":\"123hcm\",\"total_price\":960000.0,\"payment_status\":\"PAID\",\"created_at\":\"2026-11-02T19:40:50\",\"shipping_fee\":30000.0,\"phone\":\"0907654321\",\"customer_name\":\"mot mot\",\"order_id\":34,\"items\":[{\"productImage\":\"/images/products/keo-cat/keo JASON1.webp\",\"quantity\":5,\"productId\":5,\"price\":186000.0,\"productName\":\"Kéo cắt & tỉa JASON-JS02\"}],\"payment_method\":\"VNPAY\",\"transaction_no\":\"15722987\",\"status\":\"confirmed\"}', b'1', 'Đơn hàng mã số #34 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #34 đã được duyệt', 'approve', 25),
(191, '2026-11-02 19:43:25.000000', '{\"order_branch\":null,\"address\":\"123hcm\",\"total_price\":960000.0,\"payment_status\":\"PAID\",\"created_at\":\"2026-11-02T19:40:50\",\"shipping_fee\":30000.0,\"phone\":\"0907654321\",\"customer_name\":\"mot mot\",\"order_id\":34,\"items\":[{\"productImage\":\"/images/products/keo-cat/keo JASON1.webp\",\"quantity\":5,\"productId\":5,\"price\":186000.0,\"productName\":\"Kéo cắt & tỉa JASON-JS02\"}],\"payment_method\":\"VNPAY\",\"transaction_no\":\"15722987\",\"status\":\"delivered\"}', b'1', 'Đơn hàng mã số #34 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #34 đã giao thành công', 'approve', 25),
(192, '2026-11-02 19:44:43.000000', NULL, b'1', 'Khách hàng mot mot vừa đặt 1 sản phẩm.', 'Đơn đặt hàng mới', 'order', 6),
(193, '2026-11-02 19:45:07.000000', '{\"order_branch\":null,\"address\":\"123hcm\",\"total_price\":735000.0,\"payment_status\":\"PAID\",\"created_at\":\"2026-11-02T19:44:43\",\"shipping_fee\":30000.0,\"phone\":\"0907654321\",\"customer_name\":\"mot mot\",\"order_id\":35,\"items\":[{\"productImage\":\"/images/products/gom-xit/gomxit Session Spray1.webp\",\"quantity\":3,\"productId\":13,\"price\":235000.0,\"productName\":\"Gôm xịt tạo kiểu Session Spray Kevin Murphy\"}],\"payment_method\":\"VNPAY\",\"transaction_no\":\"15722990\",\"status\":\"pending\"}', b'1', 'Đơn hàng mã số #35 của bạn đã được thanh toán thành công qua VNPAY và đang chờ xác nhận.', '💳 Thanh toán & Đặt hàng thành công #35', 'approve', 25),
(194, '2026-11-02 19:47:02.000000', '{\"order_branch\":null,\"address\":\"123hcm\",\"total_price\":735000.0,\"payment_status\":\"PAID\",\"created_at\":\"2026-11-02T19:44:43\",\"shipping_fee\":30000.0,\"phone\":\"0907654321\",\"customer_name\":\"mot mot\",\"order_id\":35,\"items\":[{\"productImage\":\"/images/products/gom-xit/gomxit Session Spray1.webp\",\"quantity\":3,\"productId\":13,\"price\":235000.0,\"productName\":\"Gôm xịt tạo kiểu Session Spray Kevin Murphy\"}],\"payment_method\":\"VNPAY\",\"transaction_no\":\"15722990\",\"status\":\"confirmed\"}', b'1', 'Đơn hàng mã số #35 của bạn đã được duyệt thành công. Cảm ơn quý khách đã tin tưởng và mua sắm sản phẩm tại Hornet Royale!', '✅ Đơn hàng #35 đã được duyệt', 'approve', 25),
(195, '2026-11-02 19:47:45.000000', '{\"order_branch\":null,\"address\":\"123hcm\",\"total_price\":735000.0,\"payment_status\":\"PAID\",\"created_at\":\"2026-11-02T19:44:43\",\"shipping_fee\":30000.0,\"phone\":\"0907654321\",\"customer_name\":\"mot mot\",\"order_id\":35,\"items\":[{\"productImage\":\"/images/products/gom-xit/gomxit Session Spray1.webp\",\"quantity\":3,\"productId\":13,\"price\":235000.0,\"productName\":\"Gôm xịt tạo kiểu Session Spray Kevin Murphy\"}],\"payment_method\":\"VNPAY\",\"transaction_no\":\"15722990\",\"status\":\"delivered\"}', b'1', 'Đơn hàng mã số #35 của bạn đã được giao đến tay bạn. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!', '📦 Đơn hàng #35 đã giao thành công', 'approve', 25),
(196, '2026-11-02 19:49:49.000000', NULL, b'1', 'Khách hàng btrhai vừa đánh giá 5.0 sao cho sản phẩm Gôm xịt tạo kiểu Session Spray Kevin Murphy.', 'Đánh giá sản phẩm mới ⭐', 'system', 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `shipping_fee` double DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `total_price` double DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `cancel_reason` text DEFAULT NULL,
  `cancel_time` datetime(6) DEFAULT NULL,
  `paid_at` datetime(6) DEFAULT NULL,
  `payment_status` varchar(255) DEFAULT NULL,
  `vnp_transaction_no` varchar(255) DEFAULT NULL,
  `created_by_editor` varchar(100) DEFAULT NULL,
  `order_branch` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `address`, `created_at`, `name`, `payment_method`, `phone`, `shipping_fee`, `status`, `total_price`, `user_id`, `cancel_reason`, `cancel_time`, `paid_at`, `payment_status`, `vnp_transaction_no`, `created_by_editor`, `order_branch`) VALUES
(2, 'quan 9 nè bạn', '2026-04-17 18:17:15.000000', 'nguyen van b', 'COD', '0901234567', 30000, 'cancelled', 20600000, 0, 'Tìm được giá tốt hơn', '2026-04-17 18:45:58.000000', NULL, NULL, NULL, NULL, NULL),
(3, 'dnjadbasjdajsdk', '2026-04-21 17:21:01.000000', 'alo mom', 'COD', '0901234567', 30000, 'cancelled', 3105600, 0, 'Hủy bởi Admin', '2026-05-26 18:06:55.000000', NULL, NULL, NULL, NULL, NULL),
(4, 'đường 1, phố 1, tphcm', '2026-05-19 21:07:15.000000', 'timtim', 'MOMO', '0907654321', 30000, 'delivered', 216000, NULL, NULL, NULL, NULL, 'PAID', NULL, NULL, NULL),
(5, 'đường 1, phố 1, tphcm', '2026-05-26 17:49:24.000000', 'timtim', 'COD', '0907654321', 30000, 'cancelled', 265000, NULL, 'Hủy bởi Admin', '2026-05-26 17:49:42.000000', NULL, NULL, NULL, NULL, NULL),
(6, 'đường 1, phố 1, tphcm', '2026-05-26 18:11:58.000000', 'timtim', 'COD', '0907654321', 30000, 'cancelled', 216000, NULL, 'Hủy bởi Admin', '2026-05-26 18:12:13.000000', NULL, NULL, NULL, NULL, NULL),
(7, 'đường 1, phố 1, tphcm', '2026-05-26 18:14:47.000000', 'timtim', 'COD', '0907654321', 30000, 'cancelled', 2385000, NULL, 'Hủy bởi Admin', '2026-05-26 18:34:22.000000', NULL, NULL, NULL, NULL, NULL),
(8, 'đường 1, phố 1, tphcm', '2026-05-26 18:36:56.000000', 'timtim', 'MOMO', '0907654321', 30000, 'cancelled', 4170000, NULL, 'Hủy bởi Admin', '2026-05-26 18:41:18.000000', NULL, NULL, NULL, NULL, NULL),
(9, 'đường 1, phố 1, tphcm', '2026-05-26 18:42:27.000000', 'timtim', 'MOMO', '0907654321', 30000, 'delivered', 417000, NULL, NULL, NULL, '2026-05-26 18:42:48.000000', 'PAID', '4752548292', NULL, NULL),
(10, 'đường 1, phố 1, tphcm', '2026-05-26 18:51:43.000000', 'timtim', 'MOMO', '0907654321', 30000, 'cancelled', 4820000, NULL, 'Hủy bởi Admin', '2026-05-26 18:52:38.000000', '2026-05-26 18:52:07.000000', 'PAID', '4752567629', NULL, NULL),
(11, 'đường 1, phố 1, tphcm', '2026-06-17 19:41:30.000000', 'timtim', 'COD', '0907654321', 30000, 'delivered', 3130000, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 'dfsdfs', '2026-06-17 19:44:12.000000', 'eoiioroewr', 'COD', '0333333333', 30000, 'delivered', 150000, 8, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 'Test', '2026-06-17 19:49:16.000000', 'Test', 'cod', '123456789', NULL, 'cancelled', NULL, NULL, 'Hủy bởi Admin', '2026-06-17 20:06:45.000000', NULL, NULL, NULL, NULL, NULL),
(14, 'Test', '2026-06-17 19:49:49.000000', 'Test', 'cod', '123456789', NULL, 'cancelled', NULL, NULL, 'Hủy bởi Admin', '2026-06-17 20:06:43.000000', NULL, NULL, NULL, NULL, NULL),
(15, 'ẻererere', '2026-06-17 20:16:25.000000', 'ed1', 'COD', '1231231231', 30000, 'delivered', 216000, 7, NULL, NULL, NULL, NULL, NULL, 'ed1', 'CN 1'),
(16, 'đường 1, phố 1, tphcm', '2026-06-17 20:31:19.000000', 'timtim', 'COD', '0907654321', 30000, 'cancelled', 3050156, NULL, 'Hủy test', '2026-06-17 20:31:19.000000', NULL, NULL, NULL, NULL, NULL),
(17, 'ẻererere', '2026-06-17 20:53:56.000000', 'ed1', 'COD', '1231231231', 30000, 'delivered', 24980000, 7, NULL, NULL, NULL, NULL, NULL, 'ed1', 'CN 1'),
(18, 'dfsdfs', '2026-06-17 20:58:31.000000', 'eoiioroewr', 'COD', '0333333333', 30000, 'cancelled', 15000000, 8, 'Hủy bởi Admin', '2026-06-28 15:43:11.000000', NULL, NULL, NULL, 'ed2', 'CN 2'),
(19, '123hcm', '2026-06-28 15:39:36.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 4016000, 25, NULL, NULL, '2026-06-28 15:40:09.000000', 'PAID', '4769220797', NULL, NULL),
(20, 'ẻererere', '2026-07-05 16:11:36.000000', 'ed1', 'COD', '1231231231', 30000, 'delivered', 5020000, 7, NULL, NULL, NULL, NULL, NULL, 'ed1', 'Quận 1'),
(21, '123hcm', '2026-07-10 18:07:45.000000', 'mot mot', 'COD', '0907654321', 30000, 'delivered', 3130000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(22, '123hcm', '2026-07-11 13:49:39.000000', 'mot mot', 'COD', '0907654321', 30000, 'delivered', 15000000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, '123hcm', '2026-07-11 18:43:13.000000', 'mot mot', 'COD', '0907654321', 30000, 'delivered', 9330000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, '123hcm', '2026-07-11 18:48:01.000000', 'mot mot', 'VNPAY', '0907654321', 30000, 'delivered', 1890000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(25, '123hcm', '2026-07-11 18:50:14.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 15130780, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(26, '123hcm', '2026-07-11 18:56:03.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 63830000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(27, '123hcm', '2026-07-11 18:56:08.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 63830000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(28, '123hcm', '2026-07-11 18:58:39.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 31930000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(29, '123hcm', '2026-07-11 19:06:11.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 9600000, 25, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
(30, '123hcm', '2026-07-11 19:06:24.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 9600000, 25, NULL, NULL, NULL, 'FAILED', NULL, NULL, NULL),
(31, '123hcm', '2026-07-11 19:09:00.000000', 'mot mot', 'MOMO', '0907654321', 30000, 'delivered', 774000, 25, NULL, NULL, '2026-07-11 19:09:43.000000', 'PAID', '4776659678', NULL, NULL),
(32, '123hcm', '2026-11-02 19:06:57.000000', 'mot mot', 'VNPAY', '0907654321', 30000, 'pending', 265000, 25, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(33, '123hcm', '2026-11-02 19:22:40.000000', 'mot mot', 'VNPAY', '0907654321', 30000, 'confirmed', 10010000, 25, NULL, NULL, '2026-11-02 19:23:48.000000', 'PAID', '15722974', NULL, NULL),
(34, '123hcm', '2026-11-02 19:40:50.000000', 'mot mot', 'VNPAY', '0907654321', 30000, 'delivered', 960000, 25, NULL, NULL, '2026-11-02 19:41:19.000000', 'PAID', '15722987', NULL, NULL),
(35, '123hcm', '2026-11-02 19:44:43.000000', 'mot mot', 'VNPAY', '0907654321', 30000, 'delivered', 735000, 25, NULL, NULL, '2026-11-02 19:45:07.000000', 'PAID', '15722990', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `price` double DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_name` varchar(255) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `price`, `product_id`, `product_image`, `product_name`, `quantity`, `order_id`) VALUES
(2, 4790000, 9, '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', 'Máy sấy tóc Dreame Pocket Uni AHD54', 3, 2),
(3, 3100000, 2, '/images/products/tong-do/tongdowahl4.webp', 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 2, 2),
(4, 768900, 11, '/images/products/may-lam-toc/mayduoi Philips1.webp', 'Máy uốn tóc và máy duỗi tóc điện Philips', 4, 3),
(5, 186000, 5, '/images/products/keo-cat/keo JASON1.webp', 'Kéo cắt & tỉa JASON-JS02', 1, 4),
(6, 235000, 13, '/images/products/gom-xit/gomxit Session Spray1.webp', 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 1, 5),
(7, 186000, 5, '/images/products/keo-cat/keo JASON1.webp', 'Kéo cắt & tỉa JASON-JS02', 1, 6),
(8, 2355000, 12, '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', 'Máy duỗi tóc ép thẳng ionQ Glossy', 1, 7),
(9, 1035000, 10, '/images/products/may-lam-toc/maysay Masuto1.webp', 'Máy Sấy Tóc Ion Âm Masuto', 4, 8),
(10, 129000, 25, '/images/products/khac/luocdien1.webp', 'Lược điện chải tóc ENZO', 3, 9),
(11, 4790000, 9, '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', 'Máy sấy tóc Dreame Pocket Uni AHD54', 1, 10),
(12, 3100000, 2, '/images/products/tong-do/tongdowahl4.webp', 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 1, 11),
(13, 120000, 28, '/images/products/khac/choiquetkem1.webp', 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 1, 12),
(14, NULL, 1, NULL, NULL, 1, 13),
(15, NULL, 1, NULL, NULL, 1, 14),
(16, 186000, 5, '/images/products/keo-cat/keo JASON1.webp', 'Kéo cắt & tỉa JASON-JS02', 1, 15),
(17, 3020156, 4, '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', 'Tông đơ Wahl Align Cordless Trimmer', 5, 16),
(18, 4990000, 1, '/images/products/tong-do/tongdowahl1.webp', 'Tông đơ WAHL VAPOR LIMITED', 5, 17),
(19, 4990000, 60, '/images/products/tong-do/tongdowahl1.webp', 'Tông đơ WAHL VAPOR LIMITED', 3, 18),
(20, 4990000, 1, '/images/products/tong-do/tongdowahl1.webp', 'Tông đơ WAHL VAPOR LIMITED', 1, 19),
(21, 4990000, 29, '/images/products/tong-do/tongdowahl1.webp', 'Tông đơ WAHL VAPOR LIMITED', 1, 20),
(22, 3100000, 2, '/images/products/tong-do/tongdowahl4.webp', 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 1, 21),
(23, 4990000, 1, '/images/products/tong-do/tongdowahl1.webp', 'Tông đơ WAHL VAPOR LIMITED', 3, 22),
(24, 3100000, 2, '/images/products/tong-do/tongdowahl4.webp', 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3, 23),
(25, 186000, 5, '/images/products/keo-cat/keo JASON1.webp', 'Kéo cắt & tỉa JASON-JS02', 10, 24),
(26, 3020156, 4, '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', 'Tông đơ Wahl Align Cordless Trimmer', 5, 25),
(27, 3190000, 3, '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', 'Tông đơ Wahl 5 Star Vanish Shaver', 20, 26),
(28, 3190000, 3, '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', 'Tông đơ Wahl 5 Star Vanish Shaver', 20, 27),
(29, 3190000, 3, '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', 'Tông đơ Wahl 5 Star Vanish Shaver', 10, 28),
(30, 3190000, 3, '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', 'Tông đơ Wahl 5 Star Vanish Shaver', 3, 29),
(31, 3190000, 3, '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', 'Tông đơ Wahl 5 Star Vanish Shaver', 3, 30),
(32, 186000, 5, '/images/products/keo-cat/keo JASON1.webp', 'Kéo cắt & tỉa JASON-JS02', 4, 31),
(33, 235000, 13, '/images/products/gom-xit/gomxit Session Spray1.webp', 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 1, 32),
(34, 4990000, 1, '/images/products/tong-do/tongdowahl1.webp', 'Tông đơ WAHL VAPOR LIMITED', 2, 33),
(35, 186000, 5, '/images/products/keo-cat/keo JASON1.webp', 'Kéo cắt & tỉa JASON-JS02', 5, 34),
(36, 235000, 13, '/images/products/gom-xit/gomxit Session Spray1.webp', 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 3, 35);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `otp_codes`
--

CREATE TABLE `otp_codes` (
  `id` bigint(20) NOT NULL,
  `code` varchar(6) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `expired_at` datetime(6) NOT NULL,
  `is_used` bit(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `otp_codes`
--

INSERT INTO `otp_codes` (`id`, `code`, `created_at`, `email`, `expired_at`, `is_used`) VALUES
(1, '139438', '2026-05-19 18:10:45.000000', 'timtim2835@gmail.com', '2026-05-19 18:15:45.000000', b'1'),
(2, '672246', '2026-06-23 18:50:51.000000', 'haibinn8386@gmail.com', '2026-06-23 18:55:51.000000', b'1'),
(3, '371304', '2026-06-25 17:26:04.000000', 'haibe280305@gmail.com', '2026-06-25 17:31:04.000000', b'1'),
(4, '155829', '2026-06-25 17:42:28.000000', 'haitrann8386@gmail.com', '2026-06-25 17:44:28.000000', b'1'),
(5, '486758', '2026-06-25 17:43:52.000000', 'haitrann8386@gmail.com', '2026-06-25 17:45:52.000000', b'1'),
(6, '350236', '2026-06-25 17:46:10.000000', 'haitrann8386@gmail.com', '2026-06-25 17:48:10.000000', b'1'),
(7, '181796', '2026-06-25 17:59:02.000000', 'haitrann8386@gmail.com', '2026-06-25 18:01:02.000000', b'1'),
(8, '423353', '2026-06-25 18:25:29.000000', 'haitrann8386@gmail.com', '2026-06-25 18:27:29.000000', b'1'),
(9, '134112', '2026-06-25 18:27:36.000000', 'btrhai111@gmail.com', '2026-06-25 18:29:36.000000', b'1'),
(10, '086742', '2026-06-25 18:58:33.000000', 'ruk45124@gmail.com', '2026-06-25 19:00:33.000000', b'1'),
(11, '258072', '2026-06-25 19:30:58.000000', 'ngocchai225@gmail.com', '2026-06-25 19:32:58.000000', b'1'),
(12, '160644', '2026-06-27 15:07:27.000000', 'hnee8386@gmail.com', '2026-06-27 15:09:27.000000', b'1'),
(13, '750816', '2026-06-27 15:33:37.000000', 'btrhai111@gmail.com', '2026-06-27 15:35:37.000000', b'1'),
(14, '947157', '2026-11-02 18:17:31.000000', 'btrhai111@gmail.com', '2026-11-02 18:19:31.000000', b'1'),
(15, '637396', '2026-11-02 18:19:45.000000', 'btrhai111@gmail.com', '2026-11-02 18:21:45.000000', b'1'),
(16, '098116', '2026-11-03 11:13:26.000000', 'btrhai111@gmail.com', '2026-11-03 11:15:26.000000', b'1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `owner_chat`
--

CREATE TABLE `owner_chat` (
  `id` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `is_read_by_admin` bit(1) DEFAULT NULL,
  `is_read_by_user` bit(1) DEFAULT NULL,
  `sender_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `owner_chat`
--

INSERT INTO `owner_chat` (`id`, `content`, `created_at`, `image_url`, `is_read_by_admin`, `is_read_by_user`, `sender_id`, `user_id`) VALUES
(1, 'tiệm sạch', '2026-07-10 17:29:24.000000', '/uploads/chats/372bf759-3d16-4ae6-9f86-d11e79e77228.jpg', b'1', b'1', 25, 25),
(2, 'ok ní', '2026-07-10 17:37:27.000000', NULL, b'1', b'1', 6, 25),
(3, '', '2026-07-10 17:39:04.000000', '/uploads/chats/68cb0845-3121-4a7c-8ae1-cdd85eb86974.png', b'1', b'1', 6, 25);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `payroll_deductions`
--

CREATE TABLE `payroll_deductions` (
  `id` int(11) NOT NULL,
  `base_daily_salary` decimal(12,2) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `deduction_amount` decimal(12,2) DEFAULT NULL,
  `deduction_date` date NOT NULL,
  `deduction_rate` int(11) NOT NULL,
  `leave_type` enum('ANNUAL_LEAVE','OTHER','PERSONAL','SICK_LEAVE') NOT NULL,
  `note` varchar(255) DEFAULT NULL,
  `salary_type` enum('PAID','UNPAID') NOT NULL,
  `staff_id` int(11) NOT NULL,
  `staff_leave_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `payroll_deductions`
--

INSERT INTO `payroll_deductions` (`id`, `base_daily_salary`, `created_at`, `deduction_amount`, `deduction_date`, `deduction_rate`, `leave_type`, `note`, `salary_type`, `staff_id`, `staff_leave_id`) VALUES
(1, 300000.00, '2026-07-06 20:06:27.000000', 300000.00, '2026-07-06', 100, 'PERSONAL', 'Việc cá nhân - Không lương - Khấu trừ 100%', 'UNPAID', 11, 1),
(2, 300000.00, '2026-07-06 20:06:27.000000', 300000.00, '2026-07-07', 100, 'PERSONAL', 'Việc cá nhân - Không lương - Khấu trừ 100%', 'UNPAID', 11, 1),
(3, 300000.00, '2026-07-06 20:06:27.000000', 300000.00, '2026-07-08', 100, 'PERSONAL', 'Việc cá nhân - Không lương - Khấu trừ 100%', 'UNPAID', 11, 1),
(4, 300000.00, '2026-07-06 20:17:22.000000', 300000.00, '2026-07-06', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 12, 2),
(5, 300000.00, '2026-07-06 20:17:22.000000', 300000.00, '2026-07-07', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 12, 2),
(6, 300000.00, '2026-07-06 20:59:57.000000', 300000.00, '2026-07-06', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 6, 3),
(7, 300000.00, '2026-07-06 20:59:57.000000', 300000.00, '2026-07-07', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 6, 3),
(8, 300000.00, '2026-07-06 20:59:57.000000', 300000.00, '2026-07-08', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 6, 3),
(9, 300000.00, '2026-07-06 20:59:57.000000', 300000.00, '2026-07-09', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 6, 3),
(10, 300000.00, '2026-07-06 20:59:57.000000', 300000.00, '2026-07-10', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 6, 3),
(11, 300000.00, '2026-07-06 21:29:13.000000', 300000.00, '2026-07-06', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 7, 4),
(12, 300000.00, '2026-07-06 21:29:13.000000', 300000.00, '2026-07-07', 100, 'SICK_LEAVE', 'Nghỉ ốm - Không lương - Khấu trừ 100%', 'UNPAID', 7, 4);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `penalties`
--

CREATE TABLE `penalties` (
  `id` int(11) NOT NULL,
  `amount` double DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `penalty_date` date DEFAULT NULL,
  `penalty_type` varchar(255) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `penalties`
--

INSERT INTO `penalties` (`id`, `amount`, `created_at`, `notes`, `penalty_date`, `penalty_type`, `staff_id`) VALUES
(1, 2000000, '2026-07-01 21:26:33.000000', 'dfdfdgdfg', '2026-07-01', 'Trễ', 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `old_price` double DEFAULT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `image1` varchar(255) DEFAULT NULL,
  `image2` varchar(255) DEFAULT NULL,
  `image3` varchar(255) DEFAULT NULL,
  `is_new` tinyint(1) DEFAULT 0,
  `is_sale` tinyint(1) DEFAULT 0,
  `is_best_seller` tinyint(1) DEFAULT 0,
  `category_id` bigint(20) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `stock` int(11) NOT NULL,
  `branch` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `rating` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `old_price`, `description`, `category`, `thumbnail`, `image1`, `image2`, `image3`, `is_new`, `is_sale`, `is_best_seller`, `category_id`, `created_at`, `stock`, `branch`, `sort_order`, `rating`) VALUES
(1, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 3, NULL, 0, 0),
(2, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 95, NULL, 2, NULL),
(3, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 44, NULL, 3, 5),
(4, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 95, NULL, 4, NULL),
(5, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 80, NULL, 5, 5),
(6, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, NULL, 6, NULL),
(7, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, NULL, 7, NULL),
(8, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, NULL, 8, NULL),
(9, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, NULL, 9, NULL),
(10, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, NULL, 10, NULL),
(11, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, NULL, 11, NULL),
(12, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, NULL, 12, NULL),
(13, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 96, NULL, 13, 5),
(14, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, NULL, 14, NULL),
(15, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, NULL, 15, NULL),
(16, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, NULL, 16, NULL),
(17, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, NULL, 17, NULL),
(18, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, NULL, 18, NULL),
(19, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, NULL, 19, NULL),
(20, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, NULL, 20, NULL),
(21, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, NULL, 21, NULL),
(22, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, NULL, 22, NULL),
(23, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, NULL, 23, NULL),
(24, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, NULL, 24, NULL),
(25, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, NULL, 25, NULL),
(26, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, NULL, 26, NULL),
(27, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, NULL, 27, NULL),
(28, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 99, NULL, 28, NULL),
(29, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 99, 'Quận 1', 29, NULL),
(30, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 1', 30, NULL),
(31, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 1', 31, NULL),
(32, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 1', 32, NULL),
(33, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 100, 'Quận 1', 33, NULL),
(34, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 1', 34, NULL),
(35, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 1', 35, NULL),
(36, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 1', 36, NULL),
(37, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 1', 37, NULL),
(38, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 1', 38, NULL),
(39, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 1', 39, NULL),
(40, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 1', 40, NULL),
(41, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 1', 41, NULL),
(42, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 1', 42, NULL),
(43, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 1', 43, NULL),
(44, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 1', 44, NULL),
(45, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 1', 45, NULL),
(46, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 1', 46, NULL),
(47, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 1', 47, NULL),
(48, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 1', 48, NULL),
(49, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 1', 49, NULL),
(50, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 1', 50, NULL),
(51, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 1', 51, NULL),
(52, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 1', 52, NULL),
(53, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 1', 53, NULL),
(54, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 1', 54, NULL),
(55, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 1', 55, NULL),
(56, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 1', 56, NULL),
(60, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 57, NULL),
(61, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 58, NULL),
(62, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 2', 59, NULL),
(63, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 2', 60, NULL),
(64, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 100, 'Quận 2', 61, NULL),
(65, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 62, NULL),
(66, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 63, NULL),
(67, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 2', 64, NULL),
(68, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 2', 65, NULL),
(69, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 2', 66, NULL),
(70, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 2', 67, NULL),
(71, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 2', 68, NULL),
(72, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 2', 69, NULL),
(73, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 70, NULL),
(74, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 2', 71, NULL),
(75, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 2', 72, NULL),
(76, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 2', 73, NULL),
(77, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 2', 74, NULL),
(78, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 2', 75, NULL),
(79, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 2', 76, NULL),
(80, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 2', 77, NULL),
(81, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 2', 78, NULL),
(82, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 2', 79, NULL),
(83, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 80, NULL),
(84, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 2', 81, NULL),
(85, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 2', 82, NULL),
(86, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 2', 83, NULL),
(87, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 2', 84, NULL),
(91, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 85, NULL),
(92, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 86, NULL),
(93, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 3', 87, NULL),
(94, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 3', 88, NULL),
(95, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 100, 'Quận 3', 89, NULL),
(96, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 90, NULL),
(97, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 91, NULL),
(98, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 3', 92, NULL),
(99, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 3', 93, NULL),
(100, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 3', 94, NULL),
(101, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 3', 95, NULL),
(102, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 3', 96, NULL),
(103, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 3', 97, NULL),
(104, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 98, NULL),
(105, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 3', 99, NULL),
(106, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 3', 100, NULL),
(107, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 3', 101, NULL),
(108, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 3', 102, NULL),
(109, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 3', 103, NULL),
(110, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 3', 104, NULL),
(111, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 3', 105, NULL),
(112, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 3', 106, NULL),
(113, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 3', 107, NULL),
(114, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 108, NULL);
INSERT INTO `products` (`id`, `name`, `price`, `old_price`, `description`, `category`, `thumbnail`, `image1`, `image2`, `image3`, `is_new`, `is_sale`, `is_best_seller`, `category_id`, `created_at`, `stock`, `branch`, `sort_order`, `rating`) VALUES
(115, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 3', 109, NULL),
(116, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 3', 110, NULL),
(117, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 3', 111, NULL),
(118, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 3', 112, NULL),
(122, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 113, NULL),
(123, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 114, NULL),
(124, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 7', 115, NULL),
(125, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 7', 116, NULL),
(126, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 100, 'Quận 7', 117, NULL),
(127, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 118, NULL),
(128, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 119, NULL),
(129, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 7', 120, NULL),
(130, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 7', 121, NULL),
(131, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 7', 122, NULL),
(132, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 7', 123, NULL),
(133, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 7', 124, NULL),
(134, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 7', 125, NULL),
(135, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 126, NULL),
(136, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 7', 127, NULL),
(137, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 7', 128, NULL),
(138, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 7', 129, NULL),
(139, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 7', 130, NULL),
(140, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 7', 131, NULL),
(141, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 7', 132, NULL),
(142, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 7', 133, NULL),
(143, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 7', 134, NULL),
(144, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 7', 135, NULL),
(145, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 136, NULL),
(146, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 7', 137, NULL),
(147, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 7', 138, NULL),
(148, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 7', 139, NULL),
(149, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 7', 140, NULL),
(153, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 141, NULL),
(154, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 142, NULL),
(155, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 9', 143, NULL),
(156, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 9', 144, NULL),
(157, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 100, 'Quận 9', 145, NULL),
(158, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 146, NULL),
(159, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 147, NULL),
(160, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 9', 148, NULL),
(161, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 9', 149, NULL),
(162, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 9', 150, NULL),
(163, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 9', 151, NULL),
(164, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 9', 152, NULL),
(165, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 9', 153, NULL),
(166, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 154, NULL),
(167, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 9', 155, NULL),
(168, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 9', 156, NULL),
(169, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 9', 157, NULL),
(170, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 9', 158, NULL),
(171, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 9', 159, NULL),
(172, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, 'Quận 9', 160, NULL),
(173, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 9', 161, NULL),
(174, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, 'Quận 9', 162, NULL),
(175, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, 'Quận 9', 163, NULL),
(176, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 164, NULL),
(177, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, 'Quận 9', 165, NULL),
(178, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, 'Quận 9', 166, NULL),
(179, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, 'Quận 9', 167, NULL),
(180, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 100, 'Quận 9', 168, NULL),
(184, 'Tông đơ WAHL VAPOR LIMITED', 4990000, NULL, '1. Thông tin sản phẩm tông đơ Wahl Vapor Limited\r\nMàu sắc: Galaxy\r\nTrọng lượng : 280g\r\nChiều dài sản phẩm: 17.1cm\r\nLoại pin : lithium\r\nThời gian sạc : 60 phút\r\nThời gian sử dụng : 150 phút\r\nNguồn điện : 100v - 220v\r\nLoại động cơ: Motor không chổi than\r\nXuất xứ: Mỹ\r\n\r\n2. Lưỡi tông đơ\r\nKiểu lưỡi : F32 FADEOUT\r\nF32 FADEOUT : đây là 1 thiết kế lưỡi kiểu mới, gồm có 32 răng thẳng được bo tròn tạo sự mịn màng khi đi trên da đầu, giảm thiểu các vết xước \r\nRăng được thiết kế nhiều hơn 50% và lưỡi nhẹ hơn 6g so với tiêu chuẩn mà vẫn nhanh hơn và mượt hơn khi cắt. \r\nLưỡi điều chỉnh được đến mức số 0\r\nĐộ dài của lưỡi : 0.5mm - 1.2mm\r\nLưỡi cắt được làm từ thép cacbon công nghệ cao với lớp phủ mạ crom PVD và DLC màu đen, có độ bền bỉ chắc chắn, chống gỉ và duy trì độ sắc bén lâu hơn gấp 4 lần.\r\n\r\n3. Thiết kế\r\nThiết kế màu Galaxy Nhám, không mẫu nào giống nhau về họa tiết\r\nCần gạt và vỏ bọc được thiết kế kiểu mới, giúp phù hợp hơn với vị trí đặt tay, mang lại sự thoải mái khi dùng.\r\nTay cầm được bọc 1 lớp cao su chống trơn trượt tăng thêm khả năng kiểm soát và dễ dàng xử lý.\r\n\r\n4. Động cơ\r\nĐộng cơ : 8000 RPM/ 1phút\r\nCông suất ổn định: Động cơ không chổi than tốc độ cao với tính năng kiểm soát tốc độ cung cấp công suất ổn định của 8000 vòng xoay/1 phút cho mọi kiểu tóc và cấu trúc của tóc', 'tong-do', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl1.webp', '/images/products/tong-do/tongdowahl2.webp', '/images/products/tong-do/tongdowahl3.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 169, NULL),
(185, 'Tông đơ Wahl 5 Star Legend Cordless Clipper', 3100000, NULL, '1. Giới thiệu về tông đơ Wahl Legend Cordless\r\nWahl hiện là nhà sản xuất tông đơ lớn nhất thế giới và cũng là nhà sáng chế ra tông đơ điện, tông đơ pin đang được sử dụng phổ biến trên toàn cầu. Tông đơ Wahl Legend Cordless là dòng tông đơ cắt chính chuyên nghiệp thuộc bộ sưu tập 5 sao cao cấp mang tên thương hiệu này. Thông tin chi tiết về tông dơ Wahl Legend Cordless:\r\n+ Phân loại: Tông đơ pin\r\n+ Động cơ: 6500 RPM\r\n+ Loại pin: Lithium-ion\r\n+ Thời gian sạc đầy: 60 phút\r\n+ Thời gian hoạt động liên tục: 100 phút\r\n+ Xuất xứ: Mỹ', 'tong-do', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl4.webp', '/images/products/tong-do/tongdowahl5.webp', '/images/products/tong-do/tongdowahl6.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 170, NULL),
(186, 'Tông đơ Wahl 5 Star Vanish Shaver', 3190000, 3880000, '1. Giới thiệu về tông đơ cạo khô Wahl Vanish\r\n- Wahl Vanish là sản phẩm cạo đầu, cắt sát da đầu, cắt trắng (zero) đến từ thương hiệu tông đơ Wahl - Mỹ.', 'tong-do', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver1.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver2.webp', '/images/products/tong-do/tongdoWahl 5 Star Vanish Shaver3.webp', 1, 1, 1, NULL, NULL, 100, 'Bình Thạnh', 171, NULL),
(187, 'Tông đơ Wahl Align Cordless Trimmer', 3020156, NULL, '1. Giới thiệu về tông đơ chấn viền Wahl A-Lign\r\n+ A-Lign là dòng tông đơ chấn viền chuyên nghiệp cao cấp đến từ thương hiệu tông đơ Wahl', 'tong-do', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer1.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer2.webp', '/images/products/tong-do/tongdoWahl Align Cordless Trimmer3.webp', 1, 0, 0, NULL, NULL, 100, 'Bình Thạnh', 172, NULL),
(188, 'Kéo cắt & tỉa JASON-JS02', 186000, 250000, 'Kéo cắt tóc Nhật Bản cao cấp JS02\r\n\r\n1. Kéo cắt tỉa tóc thép cao cấp Jason 6 inch chuyên dụng tạo mẫu tóc', 'keo-cat', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON1.webp', '/images/products/keo-cat/keo JASON2.webp', '/images/products/keo-cat/keo JASON3.webp', 0, 1, 0, NULL, NULL, 100, 'Bình Thạnh', 173, NULL),
(189, 'Kéo cắt & tỉa TORA', 3685000, NULL, '1. Tổng quan\r\n-Tên sản phẩm: Kéo cắt tóc TORA NB-360S\r\n-Sản xuất: Việt Nam\r\n-Chất liệu: Thép Nhật Nguyên Khối', 'keo-cat', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA1.webp', '/images/products/keo-cat/keo TORA2.webp', '/images/products/keo-cat/keo TORA3.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 174, NULL),
(190, 'Kéo cắt & tỉa AKAFUJI TA 323', 1260000, NULL, '1. Tổng quan\r\n- Tên sản phẩm: AKAFUJI – TA 323\r\nKích thước sản phẩm: 6.0 inches', 'keo-cat', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA1.webp', '/images/products/keo-cat/keo TAKAFUJI TA2.webp', '/images/products/keo-cat/keo TAKAFUJI TA3.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 175, NULL),
(191, 'Kéo cắt & tỉa Titan PC-55N', 1490000, 1980000, '1. Thông tin sản phẩm kéo cắt tóc PC-55n', 'keo-cat', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan1.webp', '/images/products/keo-cat/keo Titan2.webp', '/images/products/keo-cat/keo Titan3.webp', 0, 1, 1, NULL, NULL, 100, 'Bình Thạnh', 176, NULL),
(192, 'Máy sấy tóc Dreame Pocket Uni AHD54', 4790000, 5420000, '1. Thông số kỹ thuật \r\n- Tên sản phẩm: Máy sấy tóc Dreame Pocket Uni', 'may-lam-toc', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni1.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni2.webp', '/images/products/may-lam-toc/maysay Dreame Pocket Uni3.webp', 1, 1, 0, NULL, NULL, 100, 'Bình Thạnh', 177, NULL),
(193, 'Máy Sấy Tóc Ion Âm Masuto', 1035000, NULL, '1. Máy sấy tóc ion âm Masuto SkyAI', 'may-lam-toc', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto1.webp', '/images/products/may-lam-toc/maysay Masuto2.webp', '/images/products/may-lam-toc/maysay Masuto3.webp', 0, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 178, NULL),
(194, 'Máy uốn tóc và máy duỗi tóc điện Philips', 768900, NULL, '1. Keratin Coating: Bề mặt phủ keratin của bàn là phẳng bảo vệ tóc khỏi bị hư hại trong khi duỗi tóc.', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips1.webp', '/images/products/may-lam-toc/mayduoi Philips2.webp', '/images/products/may-lam-toc/mayduoi Philips3.webp', 1, 0, 0, NULL, NULL, 100, 'Bình Thạnh', 179, NULL),
(195, 'Máy duỗi tóc ép thẳng ionQ Glossy', 2355000, NULL, '1. Điểm nổi bật không thể bỏ qua\r\nMáy duỗi tóc ép thẳng ionQ Glossy sở hữu lõi gốm phủ T-Gross tiên tiến', 'may-lam-toc', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy1.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy2.webp', '/images/products/may-lam-toc/mayduoi ionQ Glossy3.webp', 0, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 180, NULL),
(196, 'Gôm xịt tạo kiểu Session Spray Kevin Murphy', 235000, 370000, '1. Giới Thiệu:\r\n- Thương hiệu Kevin Murphy là 1 thương hiệu sản phẩm chăm sóc tóc', 'gom-xit', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray1.webp', '/images/products/gom-xit/gomxit Session Spray2.webp', '/images/products/gom-xit/gomxit Session Spray3.webp', 1, 1, 0, NULL, NULL, 100, 'Bình Thạnh', 181, NULL),
(197, 'Gôm xịt tạo kiểu Groupie Tigi Bed Head Rockaholic', 320000, NULL, 'GROUPIE\r\nGÔM XỊT\r\nKhoá chặt các lọn tóc vào đúng chỗ', 'gom-xit', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi1.webp', '/images/products/gom-xit/gomxit Groupie Tigi2.webp', '/images/products/gom-xit/gomxit Groupie Tigi3.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 182, NULL),
(198, 'Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf', 275000, NULL, '1. Gôm xịt tóc Osis+ Black Super Dry Fix Schwarzkopf 500ml', 'gom-xit', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis1.webp', '/images/products/gom-xit/gomxit Osis2.webp', '/images/products/gom-xit/gomxit Osis3.webp', 0, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 183, NULL),
(199, 'Gôm Xịt Giữ Nếp Linh Hoạt Moroccanoil Luminous Hairspray', 288000, 370000, '1. Moroccanoil Luminous Hairspray Strong là gôm xịt giữ nếp chuyên nghiệp', 'gom-xit', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil1.webp', '/images/products/gom-xit/gomxit Moroccanoil2.webp', '/images/products/gom-xit/gomxit Moroccanoil3.webp', 0, 1, 1, NULL, NULL, 100, 'Bình Thạnh', 184, NULL),
(200, 'Sáp vuốt tóc Brosh Original Pomade', 245000, NULL, '- Brosh Original Pomade là sản phẩm đầu tiên của thương hiệu Brosh', 'sap-vuot', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh1.webp', '/images/products/sap-vuot/sap Brosh2.webp', '/images/products/sap-vuot/sap Brosh3.webp', 0, 0, 0, NULL, NULL, 100, 'Bình Thạnh', 185, NULL),
(201, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand', 1050000, NULL, 'Sáp Vuốt Tóc Hanz De Fuko Quicksand 56 gr', 'sap-vuot', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz1.webp', '/images/products/sap-vuot/sap Hanz2.webp', '/images/products/sap-vuot/sap Hanz3.webp', 0, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 186, NULL),
(202, 'Sáp vuốt tóc Kevin Murphy Rough Rider', 829000, 985000, 'Sáp Vuốt Tóc Kevin Murphy Rough Rider', 'sap-vuot', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough1.webp', '/images/products/sap-vuot/sap Rough2.webp', '/images/products/sap-vuot/sap Rough3.webp', 1, 1, 0, NULL, NULL, 100, 'Bình Thạnh', 187, NULL),
(203, 'Sáp vuốt tóc Babyliss Gold 4', 685000, 820000, '1.Bōsōzoku - phong cách Nhật Bản, điện ảnh, phóng khoáng', 'sap-vuot', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku1.webp', '/images/products/sap-vuot/sap Bosozoku2.webp', '/images/products/sap-vuot/sap Bosozoku3.webp', 0, 1, 1, NULL, NULL, 100, 'Bình Thạnh', 188, NULL),
(204, 'Serum Dầu Dưỡng Tóc Ôliv', 290000, NULL, '1. Bạn có biết dầu ôliu chứa những dưỡng chất vô cùng quý giá dành cho da và tóc', 'duong-toc', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv1.webp', '/images/products/duong-toc/tinhchat oliv2.webp', '/images/products/duong-toc/tinhchat oliv3.webp', 0, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 189, NULL),
(205, 'Tinh chất dưỡng da đầu đa tác động với Glycerin & 1,2-Hexanediol', 182000, NULL, 'Tính năng chính: Công thức với glycerin và 1,2-hexanediol.', 'duong-toc', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol1.webp', '/images/products/duong-toc/tinhchat Hexanediol2.webp', '/images/products/duong-toc/tinhchat Hexanediol3.webp', 0, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 190, NULL),
(206, 'Tinh Chất Dưỡng Tóc GRASSE', 260000, 340000, '- Kiểu dáng thiết kể nhỏ gọn 50ml, màu sắc ấn tượng', 'duong-toc', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE1.webp', '/images/products/duong-toc/tinhchat GRASSE2.webp', '/images/products/duong-toc/tinhchat GRASSE3.webp', 1, 1, 1, NULL, NULL, 100, 'Bình Thạnh', 191, NULL),
(207, 'Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN', 490000, NULL, '1. Serum tinh dầu dưỡng tóc LABENE MOROCCAN ARGAN OIL 50ml', 'duong-toc', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN1.webp', '/images/products/duong-toc/tinhchat MOROCCAN2.webp', '/images/products/duong-toc/tinhchat MOROCCAN3.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 192, NULL),
(208, 'Lược điện chải tóc ENZO', 129000, NULL, '1. THÔNG TIN KỸ THUẬT SỐ：ENZO 742', 'khac', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien1.webp', '/images/products/khac/luocdien2.webp', '/images/products/khac/luocdien3.webp', 1, 0, 0, NULL, NULL, 100, 'Bình Thạnh', 193, NULL),
(209, 'Gel Cạo Râu Chính Hãng SADOER', 121000, NULL, '1. Thông tin chi tiết:\r\nCạo êm, không xước da', 'khac', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER1.webp', '/images/products/khac/gelcaorauSADOER2.webp', '/images/products/khac/gelcaorauSADOER3.webp', 0, 0, 0, NULL, NULL, 100, 'Bình Thạnh', 194, NULL),
(210, 'Dao Cạo Râu Điện mini HYUNDAI Màn Hình lcd', 289000, 387000, '1. Thiết Kế & Ngoại Hình\r\nSiêu nhỏ gọn', 'khac', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI1.webp', '/images/products/khac/maycaorau HYUNDAI2.webp', '/images/products/khac/maycaorau HYUNDAI3.webp', 1, 1, 0, NULL, NULL, 100, 'Bình Thạnh', 195, NULL),
(211, 'Chổi Quét Kem Cạo Râu Chuyên Nghiệp', 120000, NULL, '1. Bộ dụng cụ cạo râu chuyên nghiệp 3 món', 'khac', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem1.webp', '/images/products/khac/choiquetkem2.webp', '/images/products/khac/choiquetkem3.webp', 1, 0, 1, NULL, NULL, 100, 'Bình Thạnh', 196, NULL),
(218, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, NULL, 10, NULL, 197, 0),
(219, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, NULL, 100, NULL, 198, 0),
(220, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, NULL, 100, NULL, 199, 0),
(221, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, '2026-07-05 16:03:25.000000', 10, 'Quận 2', 200, 0),
(222, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, '2026-07-05 16:03:25.000000', 10, 'Bình Thạnh', 201, 0),
(223, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, '2026-07-05 16:03:25.000000', 10, 'Quận 9', 202, 0);
INSERT INTO `products` (`id`, `name`, `price`, `old_price`, `description`, `category`, `thumbnail`, `image1`, `image2`, `image3`, `is_new`, `is_sale`, `is_best_seller`, `category_id`, `created_at`, `stock`, `branch`, `sort_order`, `rating`) VALUES
(224, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, '2026-07-05 16:03:25.000000', 10, 'Quận 3', 203, 0),
(225, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, '2026-07-05 16:03:25.000000', 10, 'Quận 1', 204, 0),
(226, 'Tông đơ Kemei KM-1698', 1050000, NULL, '1/ Ngoại quan sản phẩm:\nMáy có kiểu dáng thon gọn với kích thước phù hợp, giúp người dùng dễ dàng cầm nắm và thao tác một cách thoải mái, vân rãnh chống trượt thao thác dễ dàng không bị mỏi. Vỏ máy được làm từ hợp kim loại chất lượng cao, đảm bảo độ bền, khả năng chịu lực tốt, và chống va đập hiệu quả.\n\n2/ Lưỡi cắt sản phẩm:\nLưỡi cắt của Kemei KM-1698 được làm từ thép không gỉ cao cấp mạ carbon, đảm bảo độ sắc bén và bền bỉ theo thời gian.\nPhía sau phủ lớp mạ carbon:\n\nVậy lưỡi mạ carbon là lưỡi gì? \n\nCarbon: Là lớp phủ Nanocomposite có tính chất độc đáo của kim cương giúp lưỡi sở hữu: độ cứng cao, cắt sắc bén, ít nóng...\n\nLớp mạ này sẽ cho ra màu sắc đen đặc trưng và có ưu điểm là siêu cứng (chỉ sau kim cương), bền bỉ, chống xước tốt, chống va đập, luôn sáng bóng.\n\n+ Lưỡi tông đơ chống xước, chống va đập cho độ bền cao, sử dụng lâu dài\n\n+ Ngoài ra lưỡi cắt cũng tản nhiệt siêu tốt, từ đó giúp hạn chế nóng lưỡi khi sử dụng so với tông đơ lưỡi thường hoạt động ở mức tốc độ này.\n\n+ Lưỡi thiết kế tỉ mỉ, sắc bén giúp bạn trong quá trình cắt tỉa vận hành êm ái, đường cắt sắc nét , tiết kiệm thời gian, công sức hơn.\n\nĐây là loại lưỡi cắt cao cấp chỉ những loại tông đơ tốt nhất mới có thể sỡ hữu, ngoài các tính năng trên lưỡi cắt còn vô cùng chắc chắn, bền bỉ, chống ăn mòn, không gỉ, hiệu quả sẽ tốt hơn so với loại lưỡi thông thường.', 'tong-do', '/uploads/products/875e869b-2f24-4cbf-b6ff-6cd70fe5608e.webp', '/uploads/products/e09379f3-1531-4c2a-a15d-8602faa6a68c.webp', '/uploads/products/eda2e6fd-66e3-4d82-801d-9af319dae2d0.webp', '/uploads/products/9ad7a54b-3f2b-472f-8607-e99296011e0a.webp', 0, 0, 0, NULL, '2026-07-05 16:03:25.000000', 10, 'Quận 7', 205, 0),
(227, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, '2026-07-05 16:04:04.000000', 100, 'Bình Thạnh', 206, 0),
(228, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, '2026-07-05 16:04:04.000000', 100, 'Quận 9', 207, 0),
(229, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, '2026-07-05 16:04:04.000000', 100, 'Quận 7', 208, 0),
(230, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, '2026-07-05 16:04:04.000000', 100, 'Quận 1', 209, 0),
(231, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, '2026-07-05 16:04:04.000000', 100, 'Quận 3', 210, 0),
(232, ' Tông  MAXGROOM1', 250000, NULL, 'CHẤT LƯỢNG TẠO NÊN THƯƠNG HIỆU“\n\n\n\n\n\nPhù hợp cho: Cạo lông toàn thân\n\n\n\nMàn hình LED hiển thị mức pin\n\n\n\nChống nước IPX7 – Có thể rửa toàn bộ, sử dụng khô và ướt\n\n\n\nPin dung lượng lớn: Dung lượng: 600mAh Thời gian sửdụng: 60 phút Thời gian sạc: 90 phút Sạc USB Type-C tiện lợi\n\n\n\nLược căn chỉnh độ dài có thể điều chỉnh: 3mm, 4.5mm, 6mm\n\n\n\nLưỡi dao bằng gốm (ceramic) - Mịn màng, bền bỉ, thân thiện với da và không gây kích ứng Bề mặt lưỡi dao trơn nhẵn, ít ma sát, thích hợp cho da nhạy cảm và vùng kín\n\n\n\nĐộng cơ mạnh mẽ giúp cạo nhanh và hiệu quả\n\n\n\nThiết kế lưỡi dao kép\n\n\n\nKhóa du lịch đảm bảo an toàn khi mang theo\n\n\n\nDung lượng pin: 600mAh\n\n\n\nPhương pháp làm sạch: Rửa toàn thân\n\n\n\nĐiện áp định mức: 5V=1A\n\n\n\nThời gian sạc: 2 giờ\n\n\n\nThời gian sử dụng: 120 phút\n\n\n\nCông suất định mức: 5W', 'tong-do', '/uploads/products/1adcb04e-4aab-4cbf-835f-b1b1217f1e1f.webp', '/uploads/products/0554e170-75f9-4ad2-8a62-d2908a6b16ae.webp', '/uploads/products/6f5e45a4-ab94-41e0-85b7-5de621f51419.webp', '/uploads/products/dfd0fb81-959e-465f-9933-a3d2ed306ac0.webp', 0, 0, 0, NULL, '2026-07-05 16:04:04.000000', 100, 'Quận 2', 211, 0),
(233, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, '2026-07-05 16:04:16.000000', 100, 'Quận 1', 212, 0),
(234, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, '2026-07-05 16:04:16.000000', 100, 'Quận 3', 213, 0),
(235, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, '2026-07-05 16:04:16.000000', 100, 'Quận 7', 214, 0),
(236, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, '2026-07-05 16:04:16.000000', 100, 'Quận 2', 215, 0),
(237, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, '2026-07-05 16:04:16.000000', 100, 'Bình Thạnh', 216, 0),
(238, 'Tông đơ Kemei KM-1837', 850000, NULL, 'ƯU ĐIỂM NỔI BẬT :\nTông đơ sở hữu chức năng 2 mức tốc độ cắt tiện lợi\n\nCho bạn đa dạng sự lựa chọn khi cắt tóc. Có thể sử dụng cho cả trẻ em và người lớn.\n\nLưỡi cắt thiết kế độc đáo với thiết kế lưỡi nghiên giúp tản nhiệt tốt hơn và có thêm nắp cố định có thể tháo rời cho công việc cắt tỉa dễ dàng.\n\nMÀN HÌNH LCD THÔNG MINH\n\n+ Giúp bạn dễ dàng quan sát các thông số kỹ thuật : % Pin còn lại, tốc độ cắt hiện tại, tình trạng sạc pin...\n\n+ Quan sát dễ dàng từ đó kiểm soát việc cắt tóc 1 cách đơn giản hơn.\n\nTHIẾT KẾ ƯU VIỆT GẠT ĐIỀU CHỈNH LƯỠI CẮT :\n\n+ Với thiết kế gạt điều chỉnh lưỡi giúp bạn có thể điều chỉnh độ dài lưỡi cắt , từ đó đa dạng sự lựa chọn và tạo các kiểu tóc khác nhau.', 'tong-do', '/uploads/products/60827076-5214-4a86-a6b5-a3801f8b5879.jpg', '/uploads/products/e7a6fbfe-4225-4c16-83de-4623217150ff.jpg', '/uploads/products/d74381d6-0fe0-47de-a57c-55bc35620e36.webp', '/uploads/products/724a2d17-5267-47be-9d14-a498028f9591.webp', 0, 0, 0, NULL, '2026-07-05 16:04:16.000000', 100, 'Quận 9', 217, 0),
(251, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, '2026-07-05 16:22:45.000000', 100, 'Quận 9', 218, 0),
(252, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, '2026-07-05 16:22:45.000000', 100, 'Quận 1', 219, 0),
(253, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, '2026-07-05 16:22:45.000000', 100, 'Quận 7', 220, 0),
(254, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, '2026-07-05 16:22:45.000000', 100, 'Quận 3', 221, 0),
(255, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, '2026-07-05 16:22:45.000000', 100, 'Quận 2', 222, 0),
(256, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, NULL, 15, NULL, 223, 0),
(257, 'Tông đơ KEMEI KM-1798', 1990000, 2650000, 'SIÊU PHẨM KM-1798 CHUẨN CHUYÊN NGHIỆP - LƯỠI CERAMIC CHỐNG NÓNG - TỐC ĐỘ MAX 9100 RPM\nKemei KM-1798 mang đến sự kết hợp hoàn hảo giữa tốc độ cắt lên đến 9100 RPM và công nghệ lưỡi hạn chế nóng. Nếu bạn cần một chiếc tông đơ có thể làm việc liên tục, hạn chế nóng và sắc bén thì Kemei KM-1798 chính là lựa chọn phù hợp cho bạn.\n\nLưỡi tĩnh phủ DLC: Lớp phủ kim cương nhân tạo giúp lưỡi cứng hơn, chống mài mòn tuyệt đối và giữ độ sắc bén gấp 5 lần lưỡi thép thông thường.\n\nLưỡi động Ceramic: Giúp giảm ma sát tối đa, cách nhiệt tuyệt đối. Bạn có thể cắt liên tục trong thời gian dài mà lưỡi vẫn mát lạnh, không gây rát da đầu khách hàng. Đây là tiêu chuẩn vàng cho các kỹ thuật Fade mịn màng.\n\n7000 RPM: Dành cho tóc mỏng, cắt chi tiết.\n\n8000 RPM: Dành cho tóc thường.\n\n9100 RPM: Tốc độ \"hủy diệt\" giúp đi khung, xả tóc nhanh chóng, dứt khoát chỉ trong một đường tông, không bao giờ có hiện tượng giật hay đứng máy.\n\nQuên đi nỗi lo hết pin giữa chừng. Với viên pin Lithium ion dung lượng thực 3000mAh \n\nHoạt động bền bỉ liên tục lên đến 150 phút.\n\nCông nghệ sạc thông minh: Sạc đầy chỉ trong 2,5 giờ.', 'tong-do', '/uploads/products/28817f0f-54c7-4d3a-867e-b741d902bb8f.webp', '/uploads/products/3a108a7c-1316-493b-8b7f-59a4314f5e73.webp', '/uploads/products/cb2e5c65-c35b-46c1-afe1-b7bca5b1bbaf.webp', '/uploads/products/509907f7-a862-4529-a6cd-34820ca7fc1c.jpg', 0, 1, 0, NULL, '2026-07-05 16:22:45.000000', 100, 'Bình Thạnh', 224, 0),
(265, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, 'Quận 7', 228, 0),
(266, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, 'Quận 1', 231, 0),
(267, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, 'Quận 3', 229, 0),
(268, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, 'Quận 2', 230, 0),
(269, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, 'Quận 9', 227, 0),
(270, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, NULL, 225, 0),
(271, 'Kéo cắt & tỉa Freelader FR601', 580000, 650000, 'Bộ kéo cắt tóc Freelader FR601 chất lượng giá bình dân cho anh em, được làm từ thép S440C, có mạ 1 lớp phủ giúp bề mặt sáng bóng.\n\nThông số Bộ kéo cắt tóc Freelader FR601\nSize :  6 inch\nVật liệu : Thép S440C\nKiểu quai : Quai vênh\nGiao hàng miễn phí toàn quốc với hóa đơn từ 499k\nTư vấn miễn phí 24/7 ( kể cả dịp lễ tết )\nBảo hành sản phẩm 12 tháng\nĐổi trả trong vòng 7 ngày đối với lỗi do nhà sản xuất.\n\nLƯU Ý KHI SỬ DỤNG\n\n- Tránh để kéo rơi rớt trong quá trình sử dụng\n- Không dùng kéo cho các mục đích khách ngoài cắt, tỉa tóc\n- Sử dụng túi đựng kéo chuyên dùng để bảo quản kéo\n- Thường xuyên tra dầu cốt kéo để cốt kéo hoạt động êm\n- Khi kéo có vấn đề hoặc cần mài kéo, hãy tìm đến các địa chỉ mài kéo, phục hồi kéo có uy tín', 'keo-cat', '/uploads/products/e1272155-6138-4463-bbfa-0d227ebffaae.jpg', '/uploads/products/6a77a754-245b-446d-a6be-af8eac469177.jpg', '/uploads/products/dcf5c316-d2c9-4999-97b8-095d4e65f1ec.jpg', '/uploads/products/67aa3ac8-7a77-4b8d-9855-b613ef32749f.jpg', 0, 0, 1, NULL, '2026-07-05 16:55:50.000000', 50, 'Bình Thạnh', 226, 0);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `comment` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `rating` double NOT NULL,
  `replied_at` datetime(6) DEFAULT NULL,
  `replied_by_name` varchar(255) DEFAULT NULL,
  `replied_by_role` varchar(255) DEFAULT NULL,
  `reply` varchar(1000) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `barber_id` int(11) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `booking_id`, `comment`, `created_at`, `order_id`, `rating`, `replied_at`, `replied_by_name`, `replied_by_role`, `reply`, `updated_at`, `barber_id`, `product_id`, `user_id`) VALUES
(1, 46, 'rất oke nè', '2026-06-28 16:39:45.000000', NULL, 5, '2026-06-28 16:40:15.000000', 'Trần Ngọc Hải', 'ADMIN', 'cảm ơn ạ', '2026-06-28 16:40:15.000000', 1, NULL, 25),
(2, NULL, 'rất oke la', '2026-06-28 16:41:17.000000', 19, 5, '2026-06-28 16:41:40.000000', 'Trần Ngọc Hải', 'ADMIN', 'thanks', '2026-06-28 16:41:40.000000', NULL, 1, 25),
(3, 47, 'nét', '2026-06-30 20:26:29.000000', NULL, 5, NULL, NULL, NULL, NULL, NULL, 1, NULL, 25),
(4, NULL, 'good', '2026-07-11 19:10:53.000000', 31, 5, '2026-07-11 19:12:24.000000', 'Trần Ngọc Hải', 'ADMIN', 'thank', '2026-07-11 19:12:24.000000', NULL, 5, 25),
(5, NULL, 'good', '2026-07-11 19:29:41.000000', 30, 5, '2026-07-11 19:30:29.000000', 'Trần Ngọc Hải', 'ADMIN', 'ok', '2026-07-11 19:30:29.000000', NULL, 3, 25),
(6, 66, '', '2026-07-12 09:33:57.000000', NULL, 5, NULL, NULL, NULL, NULL, NULL, 6, NULL, 25),
(7, NULL, 'okkk', '2026-11-02 19:49:49.000000', 35, 5, NULL, NULL, NULL, NULL, NULL, NULL, 13, 25);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `salary_settings`
--

CREATE TABLE `salary_settings` (
  `id` int(11) NOT NULL,
  `commission_rate` double DEFAULT NULL,
  `late_penalty` double DEFAULT NULL,
  `permitted_leave_deduction_rate` double DEFAULT NULL,
  `unpermitted_leave_deduction_rate` double DEFAULT NULL,
  `unpermitted_leave_penalty` double DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `salary_settings`
--

INSERT INTO `salary_settings` (`id`, `commission_rate`, `late_penalty`, `permitted_leave_deduction_rate`, `unpermitted_leave_deduction_rate`, `unpermitted_leave_penalty`) VALUES
(1, 15, 50000, 100, 100, 100000);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `services`
--

CREATE TABLE `services` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `description` text DEFAULT NULL,
  `category_type` varchar(50) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `original_price` decimal(38,2) DEFAULT NULL,
  `service_group` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `duration_minutes` int(11) DEFAULT NULL,
  `gender_type` varchar(50) DEFAULT NULL,
  `service_type` varchar(50) DEFAULT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `service_group_id` int(11) DEFAULT NULL,
  `main_category` varchar(50) DEFAULT NULL,
  `sub_category` varchar(100) DEFAULT NULL,
  `group_id` int(11) DEFAULT NULL,
  `model_type_id` int(11) DEFAULT NULL,
  `model_sort_order` int(11) DEFAULT 0,
  `global_sort_order` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `services`
--

INSERT INTO `services` (`id`, `name`, `price`, `description`, `category_type`, `created_at`, `duration`, `image`, `original_price`, `service_group`, `status`, `sort_order`, `duration_minutes`, `gender_type`, `service_type`, `slug`, `updated_at`, `service_group_id`, `main_category`, `sub_category`, `group_id`, `model_type_id`, `model_sort_order`, `global_sort_order`) VALUES
(1, 'Cắt tóc nam', 70000.00, 'Dịch vụ cắt tóc nam cơ bản giúp bạn sở hữu diện mạo gọn gàng, chỉn chu và phù hợp nhất với khuôn mặt. Tư vấn dáng tóc. Cắt tạo kiểu (Undercut, Layer, Side Part, Buzz cut,...)', 'nam', NULL, 30, 'images\\services\\nam\\single\\cattoc.png', NULL, 'single', 'active', 1, 30, 'male', 'single', 'service-1-1781004234572', '2026-07-01 18:08:33.000000', 1, 'NAM', 'CAT_TOC_CHAM_SOC_DA_RAU', 3, 4, 1, 1),
(2, 'Nhuộm bạch kim', 850000.00, 'Nhuộm bạch kim là đỉnh cao của các màu tóc thời trang, mang lại vẻ ngoài cực kỳ nổi bật, sang chảnh và mang đậm phong cách lai Tây. Đây là quá trình thợ tóc sử dụng kỹ thuật tẩy mạnh (2 - 3 lần) để loại bỏ hoàn toàn sắc tố vàng/cam, đưa tóc về tone nền trắng sáng nhất, sau đó nhuộm hoặc khử màu để tạo ra ánh bạch kim lấp lánh.', 'nam', NULL, 60, 'images\\services\\nam\\single\\nhuomtoc.png', NULL, 'single', 'active', 10, 60, 'male', 'single', 'service-2-1781004234633', '2026-07-01 18:08:33.000000', 1, 'NAM', 'UON_NHUOM_EP_TOC', 3, 5, 3, 2),
(3, 'Uốn Basic', 170000.00, 'Uốn Basic (uốn phồng/uốn xoăn nhẹ) là dịch vụ sử dụng các lô cuốn tròn truyền thống để tạo độ bồng bềnh và lượn sóng tự nhiên cho mái tóc. Trái ngược với phong cách nổi loạn của uốn con sâu, uốn Basic mang lại vẻ ngoài thanh lịch, thư sinh và đậm chất \"soái ca\" Hàn Quốc.', 'nam', NULL, 60, 'images\\services\\nam\\single\\uontoc.png', NULL, 'single', 'active', 7, 60, 'male', 'single', 'service-3-1781004234643', '2026-07-01 18:08:33.000000', 1, 'NAM', 'UON_NHUOM_EP_TOC', 3, 6, 4, 7),
(4, 'Lấy rái tai', 50000.00, 'Lấy ráy tai (hay còn gọi là \"ráy tai nghệ thuật\") là một trong những dịch vụ mang tính thư giãn sâu và lâu đời nhất tại các barber shop. Bằng việc sử dụng bộ dụng cụ chuyên dụng được vệ sinh kỹ lưỡng kết hợp với đôi bàn tay khéo léo của người thợ, dịch vụ này không chỉ dọn sạch bụi bẩn trong ống tai mà còn mang lại cảm giác dễ chịu, \"đã\" đến từng tế bào thần kinh.', 'nam', '2026-05-19 18:57:52.000000', 15, 'images\\services\\nam\\single\\layraytai.png', NULL, 'single', 'active', 18, 15, 'male', 'single', 'service-4-1781004234657', '2026-07-05 15:26:14.000000', 1, 'NAM', 'CAT_TOC_CHAM_SOC_DA_RAU', 3, 4, 16, 8),
(5, 'Gội đầu dưỡng sinh & Massage', 100000.00, 'Gội đầu dưỡng sinh không chỉ đơn thuần là làm sạch tóc, mà là sự kết hợp hoàn hảo giữa chăm sóc tóc bằng thảo mộc tự nhiên và kỹ thuật bấm huyệt, massage trị liệu vùng đầu - cổ - vai - gáy. Đây là dịch vụ \"chữa lành\" hoàn hảo giúp phái mạnh xua tan mọi mệt mỏi, áp lực sau những giờ làm việc căng thẳng.', 'nam', '2026-05-19 18:59:29.000000', 30, 'images\\services\\nam\\single\\goidau.png', NULL, 'single', 'active', 14, 30, 'male', 'single', 'service-5-1781004234667', '2026-07-01 18:08:33.000000', 1, 'NAM', 'CAT_TOC_CHAM_SOC_DA_RAU', 3, 4, 7, 9),
(6, 'Ép side', 100000.00, 'Ép side (hay Down Perm) là công nghệ bôi thuốc uốn lạnh chuyên dụng để ép phẳng phần tóc mai (hai bên side) và tóc gáy vốn thường xuyên bị bung xù, chỉa ra ngoài, giúp chúng ôm sát vào da đầu. Đây là dịch vụ \"quốc dân\" giải quyết nỗi khổ lớn nhất của chất tóc cứng, rễ tre của nam giới Việt Nam.', 'nam', '2026-05-19 19:01:21.000000', 30, 'images\\services\\nam\\single\\epside.png', NULL, 'single', 'active', 4, 30, 'male', 'single', 'service-6-1781004234672', '2026-07-01 18:08:33.000000', 1, 'NAM', 'UON_NHUOM_EP_TOC', 3, 6, 5, 6),
(7, 'Cạo mặt & Cạo râu', 50000.00, 'Cạo mặt & cạo râu là nghệ thuật chăm sóc da mặt truyền thống không thể thiếu của phái mạnh khi đến barber shop. Bằng việc kết hợp giữa lưỡi dao chuyên dụng sắc bén và lớp bọt cạo êm ái, dịch vụ này giúp loại bỏ hoàn toàn râu, lông tơ và lớp tế bào chết, trả lại cho bạn một gương mặt sáng sủa, láng mịn và tràn đầy sức sống.', 'nam', '2026-05-19 19:04:25.000000', 30, 'images\\services\\nam\\single\\caorau+mat.png', NULL, 'single', 'active', 15, 30, 'male', 'single', 'service-7-1781004234680', '2026-07-01 18:08:33.000000', 1, 'NAM', 'CAT_TOC_CHAM_SOC_DA_RAU', 3, 4, 9, 10),
(8, 'Lột mụn cám', 50000.00, 'Lột mụn cám (thường áp dụng cho vùng mũi và hai bên cánh mũi) là dịch vụ sử dụng các loại gel hoặc mặt nạ chuyên dụng để lấy đi các nốt mụn cám, mụn đầu đen và sợi bã nhờn cứng đầu tích tụ sâu trong lỗ chân lông. Đây là bước chăm sóc nhanh gọn giúp gương mặt phái mạnh sạch sẽ và mịn màng hơn rõ rệt.', 'nam', '2026-05-19 19:09:22.000000', 15, 'images\\services\\nam\\single\\dapmatna.png', NULL, 'single', 'active', 16, 15, 'male', 'single', 'service-8-1781004234695', '2026-07-01 18:08:33.000000', 1, 'NAM', 'CAT_TOC_CHAM_SOC_DA_RAU', 3, 4, 11, 11),
(9, 'Dưỡng râu chuyên sâu', 150000.00, 'Dưỡng râu chuyên sâu (Beard Grooming/Beard Treatment) là dịch vụ chăm sóc cao cấp dành riêng cho những quý ông nuôi râu (râu cằm, râu quai nón). Dịch vụ này sử dụng các sản phẩm tinh dầu và dưỡng chất chuyên dụng kết hợp với liệu pháp nhiệt để nuôi dưỡng sợi râu từ sâu bên trong, đồng thời chăm sóc vùng da dưới râu – nơi vốn rất dễ bị thô ráp, bong tróc và ngứa ngáy.', 'nam', '2026-05-19 19:11:01.000000', 30, 'images\\services\\nam\\single\\duongrau.png', NULL, 'single', 'active', 17, 30, 'male', 'single', 'service-9-1781004234707', '2026-07-01 18:08:33.000000', 1, 'NAM', 'CAT_TOC_CHAM_SOC_DA_RAU', 3, 4, 12, 12),
(16, 'Uốn con sâu', 600000.00, 'Uốn con sâu là kỹ thuật xoắn tóc và quấn giấy bạc, tạo ra các lọn xoăn nhỏ, nhọn và bồng bềnh như những chú con sâu. Đây là kiểu tóc đại diện cho phong cách đường phố, bụi bặm và cực \"chất\" dành cho phái mạnh.', 'nam', '2026-06-30 18:32:55.000000', 120, '/uploads/services/dffa9c60-bea9-4914-af59-4f23ed9188da.png', NULL, NULL, 'active', 2, NULL, 'male', NULL, NULL, '2026-07-01 18:08:33.000000', NULL, 'NAM', NULL, NULL, 6, 1, 5),
(17, 'Tẩy tóc', 300000.00, 'Tẩy tóc hiểu đơn giản là quá trình \"xóa\" đi màu đen nguyên bản của tóc để tạo một lớp nền trắng hoặc vàng sáng. Đây là tấm vé bắt buộc nếu bạn muốn sở hữu những gam màu rực rỡ.', 'nam', '2026-06-30 19:20:29.000000', 45, '/uploads/services/f3debda1-3c41-46ed-a902-3fe48a8c73ce.png', NULL, NULL, 'active', 11, NULL, 'male', NULL, NULL, '2026-07-01 18:08:33.000000', NULL, 'NAM', NULL, NULL, 5, 1, 3),
(18, 'Nhuộm basic', 250000.00, 'Nhuộm tóc là dịch vụ thay đổi màu tóc tự nhiên bằng thuốc nhuộm chuyên dụng, giúp bạn định hình phong cách, làm sáng da hoặc che đi khuyết điểm tóc bạc. Từ các tone màu lịch lãm, công sở (nâu hạt dẻ, nâu đen, đỏ cherry,...), nhuộm tóc luôn là cách nhanh nhất để làm mới bản thân.', 'nam', '2026-06-30 19:31:25.000000', 45, '/uploads/services/c890bc45-9c7f-43fd-95a4-707784003c3f.png', NULL, NULL, 'active', 12, NULL, 'male', NULL, NULL, '2026-07-01 18:08:33.000000', NULL, 'NAM', NULL, NULL, 5, 2, 4),
(19, 'Sấy vuốt tạo kiểu', 20000.00, 'Dịch vụ sấy vuốt tạo kiểu (hay thường gọi là Styling) tại các barbershop không chỉ đơn thuần là làm khô tóc và bôi sáp, mà là một quy trình kỹ thuật giúp tối ưu hóa phom dáng, tạo độ phồng (volume) và kết cấu lọn tóc (texture) đẹp nhất cho nam giới.', 'nam', '2026-06-30 20:46:14.000000', 15, '/uploads/services/4fefb7cd-3e71-4419-a6db-124b0e4d3ce3.png', NULL, NULL, 'active', 13, NULL, 'male', NULL, NULL, '2026-07-01 18:08:33.000000', NULL, 'NAM', NULL, NULL, 4, 14, 13),
(20, 'Cắt tóc nữ', 150000.00, 'Dịch vụ cắt tóc nữ cơ bản và chuyên sâu giúp bạn sở hữu diện mạo gọn gàng, thời thượng và phù hợp nhất với khuôn mặt. Bằng kỹ thuật chia lớp (sectioning) tỉ mỉ và tư vấn dáng tóc từ các thợ lành nghề, chúng tôi sẽ giúp bạn định hình phong cách cá nhân từ những kiểu tóc kinh điển đến xu hướng hiện đại nhất (Layer bồng bềnh, Bob cá tính, Pixie năng động hay mái bay Hàn Quốc).', 'nam', '2026-06-30 21:52:07.000000', 45, '/uploads/services/02fd7c88-4946-4df1-b89b-c0fa0d6ce3e1.png', NULL, NULL, 'active', 1, NULL, 'male', NULL, NULL, '2026-07-01 18:08:33.000000', NULL, 'NU', NULL, NULL, 8, 2, 14),
(21, 'Uốn basic', 600000.00, 'Dịch vụ uốn Basic là giải pháp hoàn hảo giúp phái đẹp sở hữu mái tóc xoăn phồng bồng bềnh tự nhiên mà không lỗi mốt. Bằng việc sử dụng kỹ thuật đi trục uốn cơ bản kết hợp thuốc uốn chất lượng cao giàu dưỡng chất, dịch vụ này tạo ra các sóng tóc mềm mại (uốn cụp đuôi, uốn xoăn sóng nhẹ, uốn lọn to), giúp mái tóc mỏng xẹp trở nên dày dặn và có sức sống hơn rõ rệt. Toàn bộ quy trình được thợ kiểm tra kỹ lưỡng nồng độ thuốc nhằm đảm bảo tóc lên sóng chuẩn phom mà vẫn giữ được độ ẩm mượt, không bị khô cháy.', 'nam', '2026-06-30 22:04:20.000000', 120, '/uploads/services/24c4396b-40d0-4eab-b959-165937f2c402.png', NULL, NULL, 'active', 4, NULL, 'male', NULL, NULL, '2026-07-01 18:08:58.000000', NULL, 'NU', NULL, NULL, 9, 1, 18),
(22, 'Nhuộm basic', 350000.00, 'Dịch vụ nhuộm Basic là lựa chọn hoàn hảo giúp phái đẹp sở hữu một màu tóc mới đều màu, thời trang và tôn da một cách an toàn nhất. Khách hàng có thể thoải mái lựa chọn các tông màu kinh điển như nâu hạt dẻ, nâu sô-cô-la, nâu trà sữa trầm, đỏ rượu vang,... mà hoàn toàn không cần trải qua quá trình tẩy tóc đau rát. Sử dụng dòng thuốc nhuộm organic cao cấp giàu dưỡng chất và độ cân bằng pH chuẩn, dịch vụ này giúp các hạt màu thấm sâu một cách nhẹ nhàng, vừa mang lại sắc tóc bóng mượt, chuẩn màu, vừa bảo vệ tối đa cấu trúc sợi tóc từ bên trong.', 'nam', '2026-06-30 22:18:53.000000', 60, '/uploads/services/485804a9-b120-445d-9a66-73cb65c2010c.png', NULL, NULL, 'active', 7, NULL, 'male', NULL, NULL, '2026-07-01 19:01:11.000000', NULL, 'NU', NULL, NULL, 10, 3, 21),
(23, 'Uốn Hippie', 700000.00, 'Nếu bạn đang tìm kiếm một phong cách đột phá, hoài cổ nhưng đầy phóng khoáng và cá tính, thì uốn Hippie chính là câu trả lời xuất sắc nhất. Bằng kỹ thuật đi trục uốn size nhỏ chuyên dụng sát chân tóc, dịch vụ này tạo nên những lọn xoăn tít bồng bềnh từ gốc đến ngọn, mang lại hiệu ứng mái tóc dày dặn, bồng bềnh gấp 3 lần thông thường. Chúng tôi sử dụng dòng thuốc uốn định hình phân tử cao cấp kết hợp cốt dưỡng chuyên sâu, giúp các lọn xù mì lên sóng cực kỳ rõ nét, có độ nẩy cao mà vẫn giữ được sự mềm mại, không bị bông xù xơ xác như các kỹ thuật uốn thông thường.', 'nam', '2026-06-30 22:28:51.000000', 150, '/uploads/services/ebbacfc9-5e20-4aa5-b35f-90889337db9e.png', NULL, NULL, 'active', 2, NULL, 'male', NULL, NULL, '2026-07-01 18:08:56.000000', NULL, 'NU', NULL, NULL, 9, 2, 15),
(24, 'Uốn Sóng Lơi', 600000.00, 'Uốn Sóng Lơi Hàn Quốc là đỉnh cao của nghệ thuật tạo kiểu tóc, mang lại vẻ đẹp thanh lịch, nhẹ nhàng và đầy chất thơ cho phái đẹp. Khác với các kiểu uốn lọn cứng nhắc, kỹ thuật uốn sóng lơi sử dụng các trục cuốn cỡ lớn kết hợp phương pháp định hình phom tóc đa tầng, tạo ra các đường sóng lượn vô cùng mềm mại, ngẫu hứng và tự nhiên. Dịch vụ sử dụng dòng sản phẩm thuốc uốn giàu chất béo và keratin, giúp khóa chặt độ ẩm trong lõi tóc, mang lại độ bóng bẩy, mượt mà và cảm giác bồng bềnh mỗi khi bạn chuyển động.', 'nam', '2026-06-30 22:36:27.000000', 120, '/uploads/services/1484545b-6791-4bea-8fde-2732e9cf7b6b.png', NULL, NULL, 'active', 3, NULL, 'male', NULL, NULL, '2026-07-01 18:08:57.000000', NULL, 'NU', NULL, NULL, 9, 3, 16),
(25, 'Nhuộm bạch kim', 1200000.00, 'Nhuộm Bạch Kim là tuyên ngôn đỉnh cao của sự sang chảnh, thời thượng và cá tính đột phá dành riêng cho phái đẹp. Để tạo nên sắc bạch kim trong trẻo, đạt độ sáng hoàn hảo và sạch ánh vàng như ý muốn, mái tóc sẽ được trải qua quy trình bóc tách sắc tố và khử vàng chuyên sâu bằng công nghệ hạt màu phân tử siêu nhỏ. Salon sử dụng dòng thuốc tẩy và thuốc nhuộm organic thế hệ mới chứa màng bảo vệ lipid, kết hợp tinh chất phục hồi liên kết lõi tóc, giúp hạt màu bạch kim bám chặt, bóng bẩy mà vẫn giữ được độ đàn hồi, hạn chế tối đa tình trạng khô sơ hay đứt gãy sợi tóc.', 'nam', '2026-06-30 22:37:55.000000', 180, '/uploads/services/88ec3e55-fd89-42df-ab19-94dede9d0ebe.png', NULL, NULL, 'active', 6, NULL, 'male', NULL, NULL, '2026-07-01 19:01:11.000000', NULL, 'NU', NULL, NULL, 10, 1, 19),
(26, 'Phục hồi Keratin', 550000.00, 'Phục hồi Keratin là giải pháp \"cứu cánh\" tối cao dành cho những mái tóc hư tổn nặng, bông xù, khô xơ hoặc bị mủn do lạm dụng hóa chất và tẩy nhuộm nhiều lần. Bằng việc đưa các phân tử Keratin đậm đặc vào sâu trong tủy tóc, kết hợp kỹ thuật khóa nhiệt chuyên dụng, dịch vụ này giúp bù đắp hoàn toàn các khoảng trống bị lồi lõm trên sợi tóc, làm phẳng bề mặt và bao bọc bảo vệ lớp biểu bì bên ngoài. Ngay sau khi thực hiện, mái tóc sẽ lập tức \"hồi sinh\", trở nên thẳng mượt, bóng bẩy, giảm bông xù đến 80% và tràn đầy sức sống.', 'nam', '2026-07-01 18:01:04.000000', 60, '/uploads/services/002cdc94-3fdd-406d-ac41-5e36f55dac1e.png', NULL, NULL, 'active', 8, NULL, 'male', NULL, NULL, '2026-07-01 18:59:50.000000', NULL, 'NU', NULL, NULL, 11, 1, 22),
(27, 'Phủ lụa Nano', 420000.00, 'Phủ lụa Nano là công nghệ phục hồi tiên tiến sử dụng các hạt tinh chất dưỡng siêu nhỏ (kích thước Nano) gồm silk protein và collagen để thẩm thấu sâu qua các khe hở biểu bì tóc. Dịch vụ này giúp bao phủ một lớp màng lụa satin mỏng nhẹ quanh từng sợi tóc, khóa chặt độ ẩm và sửa chữa các vùng tóc bị khô xơ, chẻ ngọn. Khác với các phương pháp phục hồi nặng đô, phủ lụa Nano không làm thay đổi cấu trúc xoăn tự nhiên của tóc mà tập trung tối đa vào việc trả lại độ bóng bẩy, mềm mại như nhung và cảm giác tơi xốp, nhẹ đầu cho phái đẹp.', 'nam', '2026-07-01 18:02:52.000000', 60, '/uploads/services/6433ad8b-76b5-4504-a566-8aa08b151ef6.png', NULL, NULL, 'active', 9, NULL, 'male', NULL, NULL, '2026-07-01 18:59:50.000000', NULL, 'NU', NULL, NULL, 11, 2, 23),
(28, 'Hấp Collagen', 200000.00, 'Hấp Collagen là liệu trình chăm sóc tóc định kỳ hoàn hảo giúp nhanh chóng bù đắp lượng nước và dưỡng chất bị mất đi do tác động của khói bụi, ánh nắng và nhiệt độ sấy hàng ngày. Dưới tác động nhẹ nhàng của máy kích nhiệt hoặc máy hấp nano, các đại phân tử Collagen thủy phân sẽ mở khóa biểu bì, thấm sâu vào thân tóc để nuôi dưỡng và khôi phục độ đàn hồi tự nhiên. Mái tóc sau khi hấp sẽ lập tức lấy lại vẻ mềm mại, suôn mượt, giảm hẳn tình trạng thô ráp và xơ rối khi chạm vào.', 'nam', '2026-07-01 18:04:02.000000', 45, '/uploads/services/ec704d83-178e-4335-bd3d-ce3e5c9227a3.png', NULL, NULL, 'active', 10, NULL, 'male', NULL, NULL, '2026-07-01 18:59:50.000000', NULL, 'NU', NULL, NULL, 11, 3, 24),
(29, 'Duỗi tóc nữ', 500000.00, 'Giải pháp lý tưởng mang lại mái tóc suôn thẳng thời thượng nhưng vẫn giữ được độ bồng bềnh và cúp nhẹ tự nhiên ở đuôi tóc. Kỹ thuật đi máy nhiệt bo tròn giúp tóc không bị đơ cứng, ôm trọn và làm thon gọn đường nét gương mặt.', 'nam', '2026-07-01 18:07:46.000000', 90, '/uploads/services/a3f226fd-f473-41e7-a4ed-52c56608044a.png', NULL, NULL, 'active', 5, NULL, 'male', NULL, NULL, '2026-07-01 18:08:58.000000', NULL, 'NU', NULL, NULL, 9, 4, 17),
(30, 'Hút mụn cám & Đắp mặt nạ mát lạnh', 70000.00, 'Dịch vụ combo 2 trong 1 giúp làm sạch và phục hồi da mặt tức thì một cách nhẹ nhàng. Đầu tiên, thợ sẽ sử dụng máy hút mụn chân không chuyên dụng để nhẹ nhàng giải phóng các nốt mụn cám, mụn đầu đen bám dai dẳng ở vùng mũi và cằm, trả lại sự thông thoáng cho lỗ chân lông. Ngay sau đó, bạn sẽ được trải nghiệm cảm giác sảng khoái tột độ với lớp mặt nạ dưỡng chất mát lạnh (trà xanh/nha đam/bùn khoáng), giúp làm dịu da nhanh chóng, giảm đỏ và se khít các lỗ chân lông vừa được làm sạch.', 'nam', '2026-07-01 18:26:50.000000', 30, '/uploads/services/fca119fe-6e73-4aac-9575-4dafd14d4a84.png', NULL, NULL, 'active', 11, NULL, 'male', NULL, NULL, '2026-07-01 18:59:50.000000', NULL, 'NU', NULL, NULL, 12, 1, 25),
(31, 'Gel lột mụn đầu đen vùng mũi', 45000.00, 'Giải pháp nhanh chóng và hiệu quả bậc nhất để dọn sạch hoàn toàn các nốt mụn đầu đen và mụn cám bám sâu, cứng đầu ở vùng cánh mũi. Bằng cách thoa một lớp gel chuyên dụng có độ bám dính cao, các cồi mụn và lớp tế bào chết sần sùi sẽ được liên kết chặt chẽ vào lớp gel. Khi lớp gel khô và được kéo nhẹ ra, toàn bộ chân mụn đầu đen sẽ bị cuốn phăng theo, trả lại cho bạn vùng da mũi mịn màng, sạch thoáng, không còn cảm giác lợn gợn hay xù xì khi chạm vào.', 'nam', '2026-07-01 18:28:42.000000', 15, '/uploads/services/7798a393-19bc-4a82-a7c6-0502ec35cde2.png', NULL, NULL, 'active', 12, NULL, 'male', NULL, NULL, '2026-07-01 18:59:49.000000', NULL, 'NU', NULL, NULL, 12, 2, 26),
(32, 'Massage mặt thư giãn', 60000.00, 'Liệu trình \"nuông chiều\" làn da hoàn hảo giúp giải tỏa căng thẳng và phục hồi năng lượng tức thì sau những giờ làm việc mệt mỏi. Sử dụng dòng kem massage dịu nhẹ giàu độ ẩm kết hợp với kỹ thuật ấn huyệt, miết cơ chuyên nghiệp của kỹ thuật viên, dịch vụ này giúp kích thích lưu thông máu, giảm quầng thâm và tình trạng tích nước trên khuôn mặt. Từng động tác vuốt nâng cơ nhẹ nhàng không chỉ giúp làn da trở nên hồng hào, săn chắc mà còn đem lại cảm giác êm ái, thư thái tột đỉnh, khiến bạn dễ dàng chìm vào giấc ngủ sâu.', 'nam', '2026-07-01 18:38:26.000000', 30, '/uploads/services/f06db095-2e39-4099-a317-38a4f74e609f.png', NULL, NULL, 'active', 13, NULL, 'male', NULL, NULL, '2026-07-01 18:59:49.000000', NULL, 'NU', NULL, NULL, 12, 3, 27),
(33, 'Nhuộm Highlight', 350000.00, 'Dịch vụ nhuộm bốc lai là phương pháp tuyệt vời để làm mới mái tóc, giúp bạn sở hữu một diện mạo đầy cá tính và có chiều sâu mà không cần phải tẩy nhuộm toàn bộ da đầu. Thợ tóc sẽ khéo léo chọn lọc và tách từng tép tóc nhỏ (ở phần mái, hai bên mai hoặc đan xen đều cả đầu), sau đó bọc giấy bạc để nâng nền/tẩy sáng và nhuộm các tông màu nổi bật như vàng chanh, bạch kim, hồng khói, xanh dương... tương phản hoàn toàn với nền tóc trầm nguyên bản.', 'nam', '2026-07-01 18:59:32.000000', 60, '/uploads/services/7851631c-0b62-44e3-b134-056a480df04d.png', NULL, NULL, 'active', 14, NULL, 'male', NULL, NULL, '2026-07-01 19:01:11.000000', NULL, 'NU', NULL, NULL, 10, 2, 20);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service_categories`
--

CREATE TABLE `service_categories` (
  `id` int(11) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `service_categories`
--

INSERT INTO `service_categories` (`id`, `code`, `name`) VALUES
(1, 'NAM', 'Dịch vụ cho Nam'),
(2, 'NU', 'Dịch vụ cho Nữ');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `service_groups`
--

CREATE TABLE `service_groups` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) DEFAULT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `service_groups`
--

INSERT INTO `service_groups` (`id`, `created_at`, `description`, `image`, `is_active`, `name`, `slug`, `sort_order`, `updated_at`) VALUES
(1, '2026-06-09 16:06:48.000000', 'Nhóm dịch vụ Cắt tóc', NULL, b'1', 'Cắt tóc', 'cắt-tóc', 0, '2026-06-09 16:06:48.000000'),
(2, '2026-06-09 16:06:48.000000', 'Nhóm dịch vụ Combo', NULL, b'1', 'Combo', 'combo', 0, '2026-06-09 16:06:48.000000'),
(3, '2026-06-30 17:23:28.000000', NULL, NULL, b'1', 'NAM', NULL, 3, '2026-06-30 17:23:28.000000');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff`
--

CREATE TABLE `staff` (
  `id` int(11) NOT NULL,
  `avatar` varchar(500) DEFAULT NULL,
  `branch` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `is_active` bit(1) DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `order_count` int(11) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `rating` double DEFAULT NULL,
  `specialty` varchar(100) DEFAULT NULL,
  `work_status` enum('PLANNED_LEAVE','RESIGNED','UNPLANNED_LEAVE','WORKING') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `staff`
--

INSERT INTO `staff` (`id`, `avatar`, `branch`, `email`, `experience_years`, `is_active`, `name`, `order_count`, `phone`, `rating`, `specialty`, `work_status`) VALUES
(1, '/uploads/staff/3edfbb5f-f8dd-417c-acb4-30037ade1b5b.png', 'Quận 1', 'tri1@gmail.com', 5, b'1', 'Lê Trí', 0, '0123456711', 0, 'Cắt tóc cổ điển', NULL),
(2, '/uploads/staff/a50671da-4261-49ee-aaa4-c546c4d8c80a.png', 'Quận 1', 'hoang1@gmail.com', 4, b'1', 'Minh Hoàng', 0, '0123456712', 0, 'Chuyên gia uốn tóc', NULL),
(3, '/uploads/staff/3984aef5-03f1-4029-9d8e-b4b75180380e.png', 'Quận 1', 'sang1@gmail.com', 5, b'1', 'Văn Sang', 0, '0123456713', 0, 'Cắt tạo kiểu hiện đại ', NULL),
(4, '/uploads/staff/ce1dae1e-ea17-4d9a-9d1d-3f7420f907b2.png', 'Quận 1', 'vinh1@gmail.com', 3, b'1', 'Vinh Trần', 0, '0123456714', 0, 'Cắt tạo kiểu hiện đại', NULL),
(5, '/uploads/staff/415508b0-2f6b-4127-a036-ee54868418b3.png', 'Quận 1', 'huy1@gmail.com', 5, b'1', 'Vũ Huy', 0, '0123456715', 0, 'Nhuộm màu thời trang ', NULL),
(6, '/uploads/staff/ee2a34a3-ae96-4d2d-b3ab-c89a846774a8.png', 'Quận 2', 'hoang2@gmail.com', 5, b'1', 'Đình Hoàng', 0, '0123456721', 5, 'Điêu khắc tóc', 'WORKING'),
(7, '/uploads/staff/40ef24bc-faf5-4246-8346-faa1dedb2d53.png', 'Quận 2', 'vuong2@gmail.comvuong', 4, b'1', 'Khang Vương', 0, '0123456721', 0, 'Nhuộm màu thời trang', 'WORKING'),
(8, '/uploads/staff/710448d7-fd73-4869-98f5-057068ac0171.png', 'Quận 2', 'trong2@gmail.com', 4, b'1', 'Minh Trọng', 0, '0123456723', 0, 'Cắt tạo kiểu hiện đại', NULL),
(9, '/uploads/staff/d4c165f8-c1f8-4c59-9bbc-37a353e277e6.png', 'Quận 2', 'vu2@gmail.com', 3, b'1', 'Minh Vũ', 0, '0123456724', 0, 'Nhuộm màu thời trang', NULL),
(10, '/uploads/staff/9cedc80a-987e-4fdc-82c0-0d8326e1100e.png', 'Quận 2', 'vinh2@gmail.com', 5, b'1', 'Trung Vinh', 0, '0123456725', 0, 'Điêu khắc tóc', NULL),
(11, '/uploads/staff/2f47d7e3-9104-45e6-9b7e-db341a3f6318.png', 'Quận 3', 'hoang3@gmail.com', 5, b'1', 'Hoàng Minh', 0, '0123456731', 0, 'Cắt tóc cổ điển', 'WORKING'),
(12, '/uploads/staff/864d90b7-8d7c-45a1-94e7-155c87d02891.png', 'Quận 3', 'khang3@gmail.com', 4, b'1', 'Khang Trần', 0, '0123456732', 0, 'Nhuộm màu thời trang', 'WORKING'),
(13, '/uploads/staff/02230616-7d31-4ca6-bdb6-888c9a24223d.png', 'Quận 3', 'nam3@gmail.com', 4, b'1', 'Nguyễn Nam', 0, '0123456733', 0, 'Điêu khắc tóc', NULL),
(14, '/uploads/staff/9d9794be-8d29-40e1-b304-d9e8ef7bfd39.png', 'Quận 3', 'thinh3@gmail.com', 5, b'1', 'Thịnh Trần', 0, '0123456734', 0, 'Cắt tạo kiểu hiện đại', NULL),
(15, '/uploads/staff/6c8460db-98e9-411e-a4f3-006511fdb5c9.png', 'Quận 3', 'binh3@gmail.com', 6, b'1', 'Văn Bình', 0, '0123456735', 0, 'Chuyên gia uốn tóc', NULL),
(16, '/uploads/staff/0ad6e68a-9fc8-4089-b6cf-6bd7d14cfa37.png', 'Quận 7', 'chung7@gmail.com', 0, b'1', 'Lê Chung', 0, '0123456771', 0, 'Điêu khắc tóc', NULL),
(17, '/uploads/staff/392373ac-11ac-47d0-aa9a-7f285b20821f.png', 'Quận 7', 'manh7@gmail.com', 4, b'1', 'Mạnh Nguyễn', 0, '0123456772', 0, 'Nhuộm màu thời trang', NULL),
(18, '/uploads/staff/ab8885da-a3eb-4776-90bb-983cef57ad16.png', 'Quận 7', 'thang7@gmail.com', 5, b'1', 'Thắng Trần', 0, '0123456773', 0, 'Cắt tạo kiểu hiện đại', NULL),
(19, '/uploads/staff/312c30e4-4d20-4d80-8314-5530351a6373.png', 'Quận 7', 'phuong7@gmail.com', 4, b'1', 'Văn Phương', 0, '0123456774', 0, 'Cắt tóc cổ điển', NULL),
(20, '/uploads/staff/7f9b8f26-b350-441d-8fb8-8c22f35f3c11.png', 'Quận 7', NULL, 5, b'1', 'Vinh Quang', 0, '0123456775', 0, 'Chuyên gia uốn tóc', NULL),
(21, '/uploads/staff/71129f9d-2927-48a8-bff0-7782d275e92f.png', 'Quận 9', 'long9@gmail.com', 4, b'1', 'Long Quỳnh', 0, '0123456791', 0, 'Cắt tóc cổ điển', NULL),
(22, '/uploads/staff/abb427ea-37a1-400a-85ff-e622bdb6712b.png', 'Quận 9', 'quang9@gmail.com', 5, b'1', 'Nguyễn Quang', 0, '0123456792', 0, 'Nhuộm màu thời trang', NULL),
(23, '/uploads/staff/98205ee9-7253-4108-919e-4b908759f70c.png', 'Quận 9', 'phuc9@gmail.com', 4, b'1', 'Phúc Vũ', 0, '0123456793', 0, 'Cắt tạo kiểu hiện đại', NULL),
(24, '/uploads/staff/1fa911f0-f9dc-4106-be39-2f94fdc271a7.png', 'Quận 9', 'sang9@gmail.com', 6, b'1', 'Sang Trần', 0, '0123456794', 0, 'Nhuộm màu thời trang', NULL),
(25, '/uploads/staff/828c1c03-67dc-41b8-b2ae-02c012d895a3.png', 'Quận 9', 'tri9@gmail.com', 6, b'1', 'Trí Lê', 0, '0123456795', 0, 'Cắt tóc cổ điển', NULL),
(26, '/uploads/staff/4f3d70e3-2197-43e1-8932-498d80e30d04.png', 'Bình Thạnh', 'hiepbt@gmail.com', 6, b'1', 'Hiệp Lê', 0, '0123456701', 0, 'Nhuộm màu thời trang', NULL),
(27, '/uploads/staff/ec849199-c657-4ba4-afea-956133aa4a4a.png', 'Bình Thạnh', 'phongbt@gmail.com', 4, b'1', 'Nguyễn Phong', 0, '0123456702', 0, 'Cắt tạo kiểu hiện đại', NULL),
(28, '/uploads/staff/cb10565f-d00a-41ad-b6d4-771d50d2954b.png', 'Bình Thạnh', 'thanhbt@gmail.com', 5, b'1', 'Phúc Thành', 0, '0123456703', 0, 'Cắt tóc cổ điển', NULL),
(29, '/uploads/staff/5fa6cf4f-9346-4104-a01e-4fdb1ac8dd16.png', 'Bình Thạnh', 'khangbt@gmail.com', 5, b'1', 'Thanh Khang', 0, '0123456704', 0, 'Chuyên gia uốn tóc', NULL),
(30, '/uploads/staff/59f1346b-c4a4-481e-b728-38ce29fe4ccf.png', 'Bình Thạnh', 'vinhbt@gmail.com', 6, b'1', 'Tuấn Vinh', 0, '0123456705', 0, 'Điêu khắc tóc', NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `staff_leave`
--

CREATE TABLE `staff_leave` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(100) DEFAULT NULL,
  `end_date` date NOT NULL,
  `ip_created` varchar(50) DEFAULT NULL,
  `leave_status` enum('ACTIVE','CANCELLED','FINISHED') NOT NULL,
  `leave_type` enum('ANNUAL_LEAVE','OTHER','PERSONAL','SICK_LEAVE') NOT NULL,
  `reason` text DEFAULT NULL,
  `salary_type` enum('PAID','UNPAID') NOT NULL,
  `start_date` date NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `staff_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `staff_leave`
--

INSERT INTO `staff_leave` (`id`, `created_at`, `created_by`, `end_date`, `ip_created`, `leave_status`, `leave_type`, `reason`, `salary_type`, `start_date`, `updated_at`, `staff_id`) VALUES
(1, '2026-07-06 20:06:26.000000', 'adminql', '2026-07-08', '0:0:0:0:0:0:0:1', 'FINISHED', 'PERSONAL', 'test', 'UNPAID', '2026-07-06', '2026-07-10 17:02:38.000000', 11),
(2, '2026-07-06 20:17:21.000000', 'adminql', '2026-07-07', '0:0:0:0:0:0:0:1', 'FINISHED', 'SICK_LEAVE', 'đau đầu', 'UNPAID', '2026-07-06', '2026-07-10 17:02:38.000000', 12),
(3, '2026-07-06 20:59:57.000000', 'adminql', '2026-07-10', '0:0:0:0:0:0:0:1', 'FINISHED', 'SICK_LEAVE', 'okkkkkk', 'UNPAID', '2026-07-06', '2026-07-11 18:11:37.000000', 6),
(4, '2026-07-06 21:29:13.000000', 'EDITOR (ed2)', '2026-07-07', '0:0:0:0:0:0:0:1', 'FINISHED', 'SICK_LEAVE', 'okkk', 'UNPAID', '2026-07-06', '2026-07-10 17:02:38.000000', 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `system_transaction_logs`
--

CREATE TABLE `system_transaction_logs` (
  `id` bigint(20) NOT NULL,
  `action_type` varchar(50) NOT NULL,
  `actor_ip` varchar(50) DEFAULT NULL,
  `actor_username` varchar(100) DEFAULT NULL,
  `booking_id` int(11) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `error_message` text DEFAULT NULL,
  `refund_amount` decimal(12,2) DEFAULT NULL,
  `refund_id` varchar(100) DEFAULT NULL,
  `result` varchar(20) DEFAULT NULL,
  `staff_leave_id` int(11) DEFAULT NULL,
  `staff_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `system_transaction_logs`
--

INSERT INTO `system_transaction_logs` (`id`, `action_type`, `actor_ip`, `actor_username`, `booking_id`, `created_at`, `description`, `error_message`, `refund_amount`, `refund_id`, `result`, `staff_leave_id`, `staff_id`) VALUES
(1, 'LEAVE_CREATED', '0:0:0:0:0:0:0:1', 'adminql', NULL, '2026-07-06 20:06:26.000000', 'Admin tạo kỳ nghỉ 2026-07-06 đến 2026-07-08 cho nhân viên Hoàng Minh', NULL, NULL, NULL, 'SUCCESS', 1, 11),
(2, 'REFUND_SUCCESS', '0:0:0:0:0:0:0:1', 'adminql', 62, '2026-07-06 20:06:27.000000', 'Hoàn tiền thành công booking #62 do nhân viên nghỉ', NULL, 20000.00, NULL, 'SUCCESS', 1, 11),
(3, 'LEAVE_CREATED', '0:0:0:0:0:0:0:1', 'adminql', NULL, '2026-07-06 20:17:21.000000', 'Admin tạo kỳ nghỉ 2026-07-06 đến 2026-07-07 cho nhân viên Khang Trần', NULL, NULL, NULL, 'SUCCESS', 2, 12),
(4, 'REFUND_SUCCESS', '0:0:0:0:0:0:0:1', 'adminql', 63, '2026-07-06 20:17:22.000000', 'Hoàn tiền thành công booking #63 do nhân viên nghỉ', NULL, 20000.00, NULL, 'SUCCESS', 2, 12),
(5, 'LEAVE_CREATED', '0:0:0:0:0:0:0:1', 'adminql', NULL, '2026-07-06 20:59:57.000000', 'Admin tạo kỳ nghỉ 2026-07-06 đến 2026-07-10 cho nhân viên Đình Hoàng', NULL, NULL, NULL, 'SUCCESS', 3, 6),
(6, 'REFUND_SUCCESS', '0:0:0:0:0:0:0:1', 'adminql', 64, '2026-07-06 20:59:57.000000', 'Hoàn tiền thành công booking #64 do nhân viên nghỉ', NULL, 20000.00, NULL, 'SUCCESS', 3, 6),
(7, 'LEAVE_CREATED', '0:0:0:0:0:0:0:1', 'EDITOR (ed2)', NULL, '2026-07-06 21:29:13.000000', 'Admin tạo kỳ nghỉ 2026-07-06 đến 2026-07-07 cho nhân viên Khang Vương', NULL, NULL, NULL, 'SUCCESS', 4, 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `role` varchar(20) DEFAULT 'USER',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(100) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `blocked_at` datetime(6) DEFAULT NULL,
  `blocked_by` int(11) DEFAULT NULL,
  `blocked_reason` varchar(255) DEFAULT NULL,
  `is_blocked` bit(1) DEFAULT NULL,
  `is_cash_payment_locked` bit(1) DEFAULT NULL,
  `branch` varchar(100) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `employee_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `phone`, `role`, `created_at`, `email`, `avatar`, `blocked_at`, `blocked_by`, `blocked_reason`, `is_blocked`, `is_cash_payment_locked`, `branch`, `birthday`, `employee_id`) VALUES
(6, 'adminql', '$2b$10$PtzckiuOWvb39pwy0Bnjk.bji5S8ZM.H9sr2B57ckmz97xTQmrUpO', 'Trần Ngọc Hải', '0900900909', 'ADMIN', '2026-06-09 13:28:55', 'ngochai123@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', NULL, NULL, NULL),
(7, 'ed1', '$2a$10$7Ocav9kIp/6TI8PJvrEnJ.LXNJPPKMZsRACdw3QZUD3nixa7JnkKu', 'CN 1', '0901111111', 'EDITOR', '2026-06-09 13:54:55', 'cn1@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 1', NULL, NULL),
(8, 'ed2', '$2a$10$654BZs7.uxtSxSjQOqnVg.NUtPrbXFw/w/xOH6ye3qqO.WG3l6xLq', 'CN 2', '0902222222', 'EDITOR', '2026-06-09 13:55:42', 'cn2@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 2', NULL, NULL),
(9, 'ed3', '$2a$10$yYrvYc8H29XiiAgINEp9ye0HnwjpL/PaDz6XAf7AnYx8IQGZCrZ1i', 'CN 3', '0903333333', 'EDITOR', '2026-06-09 13:56:30', 'cn3@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 3', NULL, NULL),
(10, 'ed7', '$2a$10$ONB60XPtNM9DsA0uv5BtiuQ22v3efqDuoHSuc8ELd3Wngc9t5PjW6', 'CN 7', '0907777777', 'EDITOR', '2026-06-09 13:58:34', 'cn7@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 7', NULL, NULL),
(11, 'ed9', '$2a$10$zoeyt.EloWNiO71QnvL6W.kwRKvgQzeT8nLQYQp2WR.DvU8yy00Vi', 'CN 9', '0909999999', 'EDITOR', '2026-06-09 14:00:18', 'cn9@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 9', NULL, NULL),
(12, 'edbt', '$2a$10$S7/8MA33mq4Qu.kRemYO4.veZjP89AL63hvYuvVaN4p8JVTBmx1oW', 'CN BT', '0900000000', 'EDITOR', '2026-06-09 14:01:53', 'cnbt@gmail.com', NULL, NULL, NULL, NULL, b'0', b'0', 'Bình Thạnh', NULL, NULL),
(14, 'LETRI', '$2a$10$pEa0QCFp4biudCJlDv1Kb.fUM2irEu0ms.GCqCgLHcFu3xD/4ntHq', 'LE TRI', NULL, 'EMPLOYEE', '2026-06-21 11:36:10', NULL, NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 1', NULL, 1),
(25, 'btrhai', '$2a$10$.vKzNXcveeUidKW3AbwUru5rBKrLwS9FbViASpb6I3SxcAoc7.6RW', 'btrhai', NULL, 'USER', '2026-06-27 08:33:58', 'btrhai111@gmail.com', '/uploads/users/9856ef76-d84e-4ade-ab80-4718ac85a51f.png', NULL, NULL, NULL, b'0', b'0', NULL, '2026-06-27', NULL),
(26, 'DINHHOANG', '$2a$10$SDwkSY2G3LzhoqLejwQzkOgQI2zwgOCOlgLYo3DRoW9N1PUmRsOru', 'DINH HOANG', NULL, 'EMPLOYEE', '2026-07-11 11:25:49', NULL, NULL, NULL, NULL, NULL, b'0', b'0', 'Quận 2', NULL, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `apply_to` varchar(50) NOT NULL,
  `code` varchar(100) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `max_discount` double DEFAULT NULL,
  `min_order_value` double DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` datetime DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `total_quantity` int(11) NOT NULL,
  `used_quantity` int(11) DEFAULT NULL,
  `value` double NOT NULL,
  `voucher_type` varchar(50) NOT NULL,
  `issue_type` varchar(50) DEFAULT 'MANUAL',
  `membership_level` varchar(50) DEFAULT NULL,
  `campaign_start_date` datetime DEFAULT NULL,
  `campaign_end_date` datetime DEFAULT NULL,
  `birth_month` int(11) DEFAULT NULL,
  `notification_message` text DEFAULT NULL,
  `notification_title` varchar(255) DEFAULT NULL,
  `user_limit` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `vouchers`
--

INSERT INTO `vouchers` (`id`, `apply_to`, `code`, `created_at`, `end_date`, `max_discount`, `min_order_value`, `name`, `start_date`, `status`, `total_quantity`, `used_quantity`, `value`, `voucher_type`, `issue_type`, `membership_level`, `campaign_start_date`, `campaign_end_date`, `birth_month`, `notification_message`, `notification_title`, `user_limit`) VALUES
(15, 'SERVICE', 'SN', '2026-06-25 19:55:17.000000', '2026-06-30 00:00:00', 0, 0, 'sn', '2026-06-25 00:00:00', 'DELETED', 0, 5, 20, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(16, 'SERVICE', 'HV', '2026-06-25 20:00:32.000000', '2026-06-30 00:00:00', 0, 0, 'hv', '2026-06-25 00:00:00', 'DELETED', 0, 12, 15, 'PERCENTAGE', 'MEMBERSHIP', 'NGOI_SAO_MOI', NULL, NULL, NULL, NULL, NULL, NULL),
(17, 'SERVICE', 'ADAD', '2026-06-25 20:25:09.000000', '2026-06-30 00:00:00', 0, 0, 'sadas', '2026-06-25 00:00:00', 'DELETED', 0, 0, 10, 'PERCENTAGE', 'MANUAL', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(18, 'SERVICE', 'GGGG', '2026-06-27 15:14:00.000000', '2026-06-30 00:00:00', 0, 0, 'hhghg', '2026-06-27 00:00:00', 'DELETED', 0, 5, 10, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, 6, NULL, NULL, NULL),
(19, 'SERVICE', 'HBDJUN', '2026-06-27 15:46:14.000000', '2026-06-30 00:00:00', 0, 0, 'Quà Sinh Nhật Từ HORNET ROYALE', '2026-06-27 00:00:00', 'DELETED', 0, 1, 15, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(20, 'SERVICE', 'GFGGFGFGG', '2026-06-27 15:59:48.000000', '2026-06-30 00:00:00', 0, 0, 'gfgfg', '2026-06-30 00:00:00', 'DELETED', 0, 1, 10, 'PERCENTAGE', 'MANUAL', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(21, 'SERVICE', 'TEST', '2026-06-27 16:18:28.000000', '2026-06-27 16:19:00', 0, 0, 'test', '2026-06-27 00:00:00', 'DELETED', 0, 1, 10, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, 6, NULL, NULL, NULL),
(22, 'SERVICE', 'GIAM', '2026-06-27 16:20:45.000000', '2026-06-27 16:31:00', 0, 0, 'Ép side', '2026-06-27 00:00:00', 'DELETED', 0, 1, 10, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(23, 'ALL', 'TEST1', '2026-06-27 16:31:42.000000', '2026-06-27 16:36:00', 0, 0, 'test1', '2026-06-27 00:00:00', 'DELETED', 0, 1, 10, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(24, 'SERVICE', 'TEST2', '2026-06-27 16:36:21.000000', '2026-06-27 16:38:00', 0, 0, 'test2', '2026-06-27 00:00:00', 'DELETED', 0, 1, 10, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, 6, NULL, NULL, NULL),
(25, 'ALL', 'TEST4', '2026-06-27 16:41:20.000000', '2026-06-30 00:00:00', 0, 0, 'testt4', '2026-06-27 00:00:00', 'DELETED', 0, 1, 5, 'PERCENTAGE', 'BIRTHDAY', NULL, NULL, NULL, 6, NULL, NULL, NULL),
(26, 'ALL', 'TEST99', '2026-06-27 17:37:29.000000', NULL, 0, 0, 'Test', NULL, 'DELETED', 0, 0, 10, 'PERCENTAGE', 'MANUAL', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(27, 'ALL', 'THU', '2026-06-27 17:46:50.000000', '2026-06-30 00:00:00', 0, 0, 'thunghiem', '2026-06-27 00:00:00', 'DELETED', 100, 1, 20, 'PERCENTAGE', 'CLAIMABLE', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(28, 'ALL', 'TEST123', '2026-06-28 14:34:06.000000', '2026-06-30 00:00:00', 0, 0, 'test123', '2026-06-28 00:00:00', 'DELETED', 90, 1, 20, 'PERCENTAGE', 'CLAIMABLE', NULL, NULL, NULL, NULL, NULL, NULL, 3),
(29, 'SERVICE', 'TEST111', '2026-06-28 14:51:07.000000', '2026-06-30 00:00:00', 0, 0, 'test111', '2026-06-28 00:00:00', 'DELETED', 50, 1, 10, 'PERCENTAGE', 'CLAIMABLE', NULL, NULL, NULL, NULL, NULL, NULL, 1),
(30, 'SERVICE', 'TEST222', '2026-06-28 15:01:30.000000', '2026-06-30 00:00:00', 0, 0, 'test222', '2026-06-28 00:00:00', 'DELETED', 3, 1, 15, 'PERCENTAGE', 'CLAIMABLE', NULL, NULL, NULL, NULL, NULL, NULL, 3),
(31, 'ALL', 'TESTWWW', '2026-07-05 14:55:15.000000', '2026-07-30 00:00:00', 0, 0, 'testwww', '2026-07-05 00:00:00', 'DELETED', 0, 1, 20, 'PERCENTAGE', 'MEMBERSHIP', 'NGUOI_CUA_CONG_CHUNG', NULL, NULL, NULL, NULL, NULL, 3),
(32, 'ALL', 'GIAMGIAM', '2026-07-12 09:08:20.000000', '2026-07-31 00:00:00', 0, 0, 'Giảm 20% cho tất cả mặt hàng hoặc sản phẩm', '2026-07-12 00:00:00', 'DELETED', 0, 1, 20, 'PERCENTAGE', 'ALL_CUSTOMERS', NULL, NULL, NULL, NULL, 'nhanh nhanh nha mấy ní', 'Nhận dịp báo cáo THỰC TẬP TỐT NGHIỆP WEB CHƠI LỖ LUÔN', 5),
(33, 'SERVICE', 'GIAMLUON', '2026-07-12 09:21:30.000000', '2026-07-31 00:00:00', 0, 0, 'Giảm 15%', '2026-07-12 00:00:00', 'DELETED', 0, 1, 15, 'PERCENTAGE', 'ALL_CUSTOMERS', NULL, NULL, NULL, NULL, 'GIẢM 15% DỊCH VỤ', 'GIẢM 15% NÈ', 3);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `voucher_campaigns`
--

CREATE TABLE `voucher_campaigns` (
  `id` int(11) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `status` varchar(20) DEFAULT NULL,
  `trigger_type` varchar(100) NOT NULL,
  `trigger_value` varchar(255) DEFAULT NULL,
  `voucher_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `addresses`
--
ALTER TABLE `addresses`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `advance_salaries`
--
ALTER TABLE `advance_salaries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2a2qtl6cmi9fiv7jx2w6ehmca` (`staff_id`);

--
-- Chỉ mục cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `service_id` (`service_id`),
  ADD KEY `FKs17arm200d80obkinfr6glrte` (`staff_id`);

--
-- Chỉ mục cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD KEY `FKhhofk6n050slfqp0v6e65axk3` (`service_id`),
  ADD KEY `FK1etky587qu1tqlr3t1r7w59gx` (`booking_id`);

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `customer_chats`
--
ALTER TABLE `customer_chats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKota7vmf206bsx1tadpo2mhd7w` (`barber_id`),
  ADD KEY `FKc0779wm50l5oa12hrbf86tgdp` (`user_id`);

--
-- Chỉ mục cho bảng `customer_vouchers`
--
ALTER TABLE `customer_vouchers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKs901syq6quyetn24uxns53m79` (`user_id`),
  ADD KEY `FK2vrl0hpkjsm5ttw4oa5irlcj` (`voucher_id`);

--
-- Chỉ mục cho bảng `experience_salaries`
--
ALTER TABLE `experience_salaries`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `knowledge_articles`
--
ALTER TABLE `knowledge_articles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKphcb66mrlel5au1osetfs7qqm` (`slug`);

--
-- Chỉ mục cho bảng `model_types`
--
ALTER TABLE `model_types`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbwjn73bbyw2pofsnhflrasdxr` (`category_id`);

--
-- Chỉ mục cho bảng `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2ekcvhoda942ko6q78x55cns` (`voucher_id`);

--
-- Chỉ mục cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`);

--
-- Chỉ mục cho bảng `otp_codes`
--
ALTER TABLE `otp_codes`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `owner_chat`
--
ALTER TABLE `owner_chat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKewqm2oauvupxhp11nry7qf0fg` (`sender_id`),
  ADD KEY `FKfpitikisews9v0pwo4lbvgh5h` (`user_id`);

--
-- Chỉ mục cho bảng `payroll_deductions`
--
ALTER TABLE `payroll_deductions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2x6pecmoj3rhc6kheogm037j8` (`staff_id`),
  ADD KEY `FK7xjr8v7m9awda5r39b3qersq8` (`staff_leave_id`);

--
-- Chỉ mục cho bảng `penalties`
--
ALTER TABLE `penalties`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK2sc1jvu68ax1jds36emd1t47` (`staff_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK5m9nvwh6vm8g6uv4dt3900t55` (`barber_id`),
  ADD KEY `FKpl51cejpw4gy5swfar8br9ngi` (`product_id`),
  ADD KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`);

--
-- Chỉ mục cho bảng `salary_settings`
--
ALTER TABLE `salary_settings`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `services`
--
ALTER TABLE `services`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKjl3x5dre97vd530e6nn4q836j` (`service_group_id`),
  ADD KEY `FK81jrm61rwf206pns9prnw1qg5` (`group_id`),
  ADD KEY `FKmxqfbd4xr2jb8dkhy4rdddehh` (`model_type_id`);

--
-- Chỉ mục cho bảng `service_categories`
--
ALTER TABLE `service_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKof410cn7nuk3pa4bfy0c4c16i` (`code`);

--
-- Chỉ mục cho bảng `service_groups`
--
ALTER TABLE `service_groups`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `staff`
--
ALTER TABLE `staff`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `staff_leave`
--
ALTER TABLE `staff_leave`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKdvradjxkf65w0118rxae5bas` (`staff_id`);

--
-- Chỉ mục cho bảng `system_transaction_logs`
--
ALTER TABLE `system_transaction_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK192x3icd0l02i6bichtuirffi` (`staff_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- Chỉ mục cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK30ftp2biebbvpik8e49wlmady` (`code`);

--
-- Chỉ mục cho bảng `voucher_campaigns`
--
ALTER TABLE `voucher_campaigns`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK7i2gsva238je6e3fmsgmcr328` (`voucher_id`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `addresses`
--
ALTER TABLE `addresses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `advance_salaries`
--
ALTER TABLE `advance_salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=70;

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT cho bảng `customer_chats`
--
ALTER TABLE `customer_chats`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT cho bảng `customer_vouchers`
--
ALTER TABLE `customer_vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT cho bảng `experience_salaries`
--
ALTER TABLE `experience_salaries`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `knowledge_articles`
--
ALTER TABLE `knowledge_articles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `model_types`
--
ALTER TABLE `model_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `news`
--
ALTER TABLE `news`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT cho bảng `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=197;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT cho bảng `otp_codes`
--
ALTER TABLE `otp_codes`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `owner_chat`
--
ALTER TABLE `owner_chat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `payroll_deductions`
--
ALTER TABLE `payroll_deductions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT cho bảng `penalties`
--
ALTER TABLE `penalties`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=272;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `salary_settings`
--
ALTER TABLE `salary_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT cho bảng `services`
--
ALTER TABLE `services`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `service_categories`
--
ALTER TABLE `service_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `service_groups`
--
ALTER TABLE `service_groups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `staff`
--
ALTER TABLE `staff`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `staff_leave`
--
ALTER TABLE `staff_leave`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `system_transaction_logs`
--
ALTER TABLE `system_transaction_logs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT cho bảng `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT cho bảng `voucher_campaigns`
--
ALTER TABLE `voucher_campaigns`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `advance_salaries`
--
ALTER TABLE `advance_salaries`
  ADD CONSTRAINT `FK2a2qtl6cmi9fiv7jx2w6ehmca` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Các ràng buộc cho bảng `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `FKs17arm200d80obkinfr6glrte` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Các ràng buộc cho bảng `booking_services`
--
ALTER TABLE `booking_services`
  ADD CONSTRAINT `FK1etky587qu1tqlr3t1r7w59gx` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`id`),
  ADD CONSTRAINT `FKhhofk6n050slfqp0v6e65axk3` FOREIGN KEY (`service_id`) REFERENCES `services` (`id`);

--
-- Các ràng buộc cho bảng `customer_chats`
--
ALTER TABLE `customer_chats`
  ADD CONSTRAINT `FKc0779wm50l5oa12hrbf86tgdp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKota7vmf206bsx1tadpo2mhd7w` FOREIGN KEY (`barber_id`) REFERENCES `staff` (`id`);

--
-- Các ràng buộc cho bảng `customer_vouchers`
--
ALTER TABLE `customer_vouchers`
  ADD CONSTRAINT `FK2vrl0hpkjsm5ttw4oa5irlcj` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`),
  ADD CONSTRAINT `FKs901syq6quyetn24uxns53m79` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `model_types`
--
ALTER TABLE `model_types`
  ADD CONSTRAINT `FKbwjn73bbyw2pofsnhflrasdxr` FOREIGN KEY (`category_id`) REFERENCES `service_categories` (`id`);

--
-- Các ràng buộc cho bảng `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `FK2ekcvhoda942ko6q78x55cns` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`);

--
-- Các ràng buộc cho bảng `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`);

--
-- Các ràng buộc cho bảng `owner_chat`
--
ALTER TABLE `owner_chat`
  ADD CONSTRAINT `FKewqm2oauvupxhp11nry7qf0fg` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKfpitikisews9v0pwo4lbvgh5h` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `payroll_deductions`
--
ALTER TABLE `payroll_deductions`
  ADD CONSTRAINT `FK2x6pecmoj3rhc6kheogm037j8` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `FK7xjr8v7m9awda5r39b3qersq8` FOREIGN KEY (`staff_leave_id`) REFERENCES `staff_leave` (`id`);

--
-- Các ràng buộc cho bảng `penalties`
--
ALTER TABLE `penalties`
  ADD CONSTRAINT `FK2sc1jvu68ax1jds36emd1t47` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FK5m9nvwh6vm8g6uv4dt3900t55` FOREIGN KEY (`barber_id`) REFERENCES `staff` (`id`),
  ADD CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `services`
--
ALTER TABLE `services`
  ADD CONSTRAINT `FK81jrm61rwf206pns9prnw1qg5` FOREIGN KEY (`group_id`) REFERENCES `service_groups` (`id`),
  ADD CONSTRAINT `FKjl3x5dre97vd530e6nn4q836j` FOREIGN KEY (`service_group_id`) REFERENCES `service_groups` (`id`),
  ADD CONSTRAINT `FKmxqfbd4xr2jb8dkhy4rdddehh` FOREIGN KEY (`model_type_id`) REFERENCES `model_types` (`id`);

--
-- Các ràng buộc cho bảng `staff_leave`
--
ALTER TABLE `staff_leave`
  ADD CONSTRAINT `FKdvradjxkf65w0118rxae5bas` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Các ràng buộc cho bảng `system_transaction_logs`
--
ALTER TABLE `system_transaction_logs`
  ADD CONSTRAINT `FK192x3icd0l02i6bichtuirffi` FOREIGN KEY (`staff_id`) REFERENCES `staff` (`id`);

--
-- Các ràng buộc cho bảng `voucher_campaigns`
--
ALTER TABLE `voucher_campaigns`
  ADD CONSTRAINT `FK7i2gsva238je6e3fmsgmcr328` FOREIGN KEY (`voucher_id`) REFERENCES `vouchers` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
