
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

CREATE TABLE `product` (
  `plant_ID` int(11) NOT NULL AUTO_INCREMENT,
  `plant_name` varchar(100) NOT NULL,
  `plant_description` text NOT NULL,
  `plant_price` decimal(10,0) NOT NULL,
  `plant_rating` decimal(5,1) NOT NULL,
  `plant_image` text NOT NULL,
  `plant_category` varchar(100) NOT NULL,
  PRIMARY KEY (`plant_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `product` (`plant_ID`, `plant_name`, `plant_description`, `plant_price`, `plant_rating`, `plant_image`, `plant_category`) VALUES
(1, 'Philodendron', 'Lush green leaves with heart-shaped foliage. Requires indirect sunlight and moderate watering.', 25, 4.5, 'http://localhost/easyplant/api-prettyplant/images/1.png', 'small'),
(2, 'Snake Plant', 'Tall, upright leaves with variegated patterns. Low maintenance, suitable for low light conditions.', 30, 4.2, 'http://localhost/easyplant/api-prettyplant/images/2.png', 'medium'),
(3, 'Peace Lily', 'Dark green leaves with elegant white flowers. Prefers low light and moderate watering.', 35, 4.4, 'http://localhost/easyplant/api-prettyplant/images/3.png', 'large'),
(4, 'Spider Plant', 'Long, arching leaves with small white flowers. Easy to care for, thrives in indirect light.', 20, 4.0, 'http://localhost/easyplant/api-prettyplant/images/4.png', 'small'),
(5, 'Fiddle Leaf Fig', 'Large, violin-shaped leaves. Requires bright, indirect light and regular watering.', 50, 4.6, 'http://localhost/easyplant/api-prettyplant/images/5.png', 'medium'),
(6, 'ZZ Plant', 'Glossy, dark green leaves with a waxy texture. Tolerates low light and infrequent watering.', 40, 4.3, 'http://localhost/easyplant/api-prettyplant/images/6.png', 'large'),
(7, 'Pothos', 'Heart-shaped leaves with trailing vines. Adaptable to various light conditions and easy to propagate.', 25, 4.1, 'http://localhost/easyplant/api-prettyplant/images/7.png', 'small'),
(8, 'Monstera Deliciosa', 'Large, fenestrated leaves with iconic splits. Requires bright, indirect light and moderate watering.', 45, 4.7, 'http://localhost/easyplant/api-prettyplant/images/8.png', 'medium'),
(9, 'Aloe Vera', 'Succulent with fleshy, serrated leaves. Prefers bright light and minimal watering.', 15, 4.2, 'http://localhost/easyplant/api-prettyplant/images/9.png', 'small'),
(10, 'Dracaena Marginata', 'Tall, slender leaves with red-edged margins. Thrives in bright, indirect light and moderate humidity.', 30, 4.3, 'http://localhost/easyplant/api-prettyplant/images/10.png', 'medium'),
(11, 'Chinese Money Plant', 'Circular, coin-shaped leaves on upright stems. Enjoys bright, indirect light and regular watering.', 35, 4.5, 'http://localhost/easyplant/api-prettyplant/images/11.png', 'large'),
(12, 'Calathea Orbifolia', 'Large, round leaves with silver and green stripes. Requires bright, indirect light and high humidity.', 40, 4.4, 'http://localhost/easyplant/api-prettyplant/images/12.png', 'medium'),
(13, 'Boston Fern', 'Lacy, arching fronds with a feathery appearance. Prefers indirect light and high humidity.', 25, 4.1, 'http://localhost/easyplant/api-prettyplant/images/13.png', 'large'),
(14, 'Parlor Palm', 'Feathery, palm-like leaves in a compact growth habit. Thrives in low to moderate light and regular watering.', 20, 4.0, 'http://localhost/easyplant/api-prettyplant/images/14.png', 'small'),
(15, 'English Ivy', 'Small, lobed leaves with trailing vines. Adaptable to various light conditions and moderate watering.', 30, 4.2, 'http://localhost/easyplant/api-prettyplant/images/15.png', 'medium'),
(16, 'Rubber Plant', 'Dark green, glossy leaves with a rubbery texture. Prefers bright, indirect light and moderate watering.', 35, 4.3, 'http://localhost/easyplant/api-prettyplant/images/16.png', 'large'),
(17, 'Bird of Paradise', 'Large, banana-like leaves with vibrant orange and blue flowers. Requires bright, indirect light and regular watering.', 50, 4.5, 'http://localhost/easyplant/api-prettyplant/images/17.png', 'medium'),
(18, 'Philodendron Brasil', 'Heart-shaped leaves with green and yellow variegation. Adaptable to various light conditions and easy to care for.', 25, 4.2, 'http://localhost/easyplant/api-prettyplant/images/18.png', 'small'),
(19, 'Spider Plant Variegated', 'Long, arching leaves with green and white striped patterns. Thrives in indirect light and moderate watering.', 20, 4.0, 'http://localhost/easyplant/api-prettyplant/images/19.png', 'small'),
(20, 'ZZ Plant Raven', 'Dark green, nearly black leaves with a waxy texture. Tolerates low light and infrequent watering.', 40, 4.4, 'http://localhost/easyplant/api-prettyplant/images/20.png', 'medium');
-- --------------------------------------------------------
CREATE TABLE variation (
  `variation_id` int(11) NOT NULL AUTO_INCREMENT,
  `plant_ID` int(11) NOT NULL,
  `pot_color` VARCHAR(255),
  `plant_image` TEXT,
  PRIMARY KEY (variation_id),
  FOREIGN KEY (plant_ID) REFERENCES product(plant_ID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO variation (plant_id, pot_color, plant_image) VALUES 
(1, 'pink', 'http://localhost/easyplant/api-prettyplant/images/1-pink.png'), 
(1, 'black', 'http://localhost/easyplant/api-prettyplant/images/1-black.png'), 
(1, 'blue', 'http://localhost/easyplant/api-prettyplant/images/1-blue.png'), 
(4, 'red', 'http://localhost/easyplant/api-prettyplant/images/4-red.png'), 
(4, 'blue', 'http://localhost/easyplant/api-prettyplant/images/4-blue.png'), 
(4, 'gray', 'http://localhost/easyplant/api-prettyplant/images/4-gray.png'), 
(5, 'blue', 'http://localhost/easyplant/api-prettyplant/images/5-blue.png'), 
(5, 'pink', 'http://localhost/easyplant/api-prettyplant/images/5-pink.png'), 
(8, 'yellow', 'http://localhost/easyplant/api-prettyplant/images/8-yellow.png'), 
(8, 'red', 'http://localhost/easyplant/api-prettyplant/images/8-red.png'), 
(9, 'green', 'http://localhost/easyplant/api-prettyplant/images/9-green.png'), 
(9, 'black', 'http://localhost/easyplant/api-prettyplant/images/9-black.png'), 
(10, 'black', 'http://localhost/easyplant/api-prettyplant/images/10-black.png'), 
(10, 'blue', 'http://localhost/easyplant/api-prettyplant/images/10-blue.png');


CREATE TABLE `user` (
  `user_ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` text NOT NULL,
   PRIMARY KEY (`user_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `user` (`user_ID`, `username`, `email`, `password`) VALUES
(1, 'sikey', 'octucube2004@gmail.com', '$2y$10$/L9.YPL2MCcij3UirfKTFOB39OxKR/shJYQHDiJaK4acpE6izozGm'),
(2, 'test', 'test', '$2y$10$UZWCmZrO9HHtJCU6T0FA2.t5GPaalbVrChctUZ3j57vkED.dv8yKG');

ALTER TABLE `user`
  ADD INDEX `idx_user_ID` (`user_ID`);

CREATE TABLE `cart` (
  `cart_ID` int(11) NOT NULL,
  `plant_ID` int(11) NOT NULL,
  `user_ID` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  PRIMARY KEY (`cart_ID`),
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`plant_ID`) REFERENCES `product` (`plant_ID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_ID`) REFERENCES `user` (`user_ID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


INSERT INTO `cart` (`cart_ID`, `plant_ID`, `user_ID`, `quantity`) VALUES
(1, 7, 2, 4),
(2, 2, 1, 6),
(3, 3, 1, 10);

ALTER TABLE `cart`
  ADD KEY `toCartProduct` (`plant_ID`),
  ADD KEY `toCartUser` (`user_ID`);


COMMIT;