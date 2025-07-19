/*
 Navicat Premium Data Transfer

 Source Server         : local
 Source Server Type    : MySQL
 Source Server Version : 50725
 Source Host           : localhost:8889
 Source Schema         : coupon_mall

 Target Server Type    : MySQL
 Target Server Version : 50725
 File Encoding         : 65001

 Date: 11/12/2019 10:12:37
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '商品ID',
  `bn` varchar(30) DEFAULT NULL COMMENT '商品编码',
  `name` varchar(200) DEFAULT NULL COMMENT '商品名称',
  `brief` varchar(255) DEFAULT NULL COMMENT '商品简介',
  `price` decimal(10,2) DEFAULT NULL COMMENT '商品价格',
  `cost_price` decimal(10,2) DEFAULT NULL COMMENT '成本价',
  `mkt_price` decimal(10,2) DEFAULT NULL COMMENT '市场价',
  `attachment_id` bigint(32) DEFAULT NULL COMMENT '默认图片 图片id',
  `goods_cat_id` int(10) unsigned DEFAULT NULL COMMENT '商品分类ID 关联category.id',
  `goods_type_id` int(10) unsigned DEFAULT NULL COMMENT '商品类别ID 关联goods_type.id',
  `brand_id` int(10) unsigned DEFAULT NULL COMMENT '品牌ID 关联brand.id',
  `is_nomal_virtual` tinyint(1) unsigned DEFAULT '1' COMMENT '虚拟正常商品 1=正常 2=虚拟',
  `marketable` tinyint(1) unsigned DEFAULT '1' COMMENT '上架标志 1=上架 2=下架',
  `stock` int(8) unsigned DEFAULT '0' COMMENT '库存',
  `freeze_stock` int(8) unsigned DEFAULT '0' COMMENT '冻结库存',
  `weight` decimal(10,2) unsigned DEFAULT NULL COMMENT '重量',
  `unit` varchar(20) DEFAULT NULL COMMENT '商品单位',
  `intro` longtext COMMENT '商品详情',
  `specs` json DEFAULT NULL COMMENT '商品规格序列化',
  `params` json DEFAULT NULL COMMENT '参数序列化',
  `comment_count` int(10) unsigned DEFAULT '0' COMMENT '评论次数',
  `view_count` int(10) unsigned DEFAULT '0' COMMENT '浏览次数',
  `buy_count` int(10) unsigned DEFAULT '0' COMMENT '购买次数',
  `up_time` datetime DEFAULT NULL COMMENT '上架时间',
  `down_time` datetime DEFAULT NULL COMMENT '下架时间',
  `sort` smallint(5) unsigned DEFAULT '100' COMMENT '商品排序 越小越靠前',
  `is_recommend` tinyint(1) unsigned DEFAULT '2' COMMENT '是否推荐，1是，2不是推荐',
  `is_hot` tinyint(1) unsigned DEFAULT '2' COMMENT '是否热门，1是，2否',
  `label_ids` varchar(10) DEFAULT NULL COMMENT '标签id逗号分隔',
  `new_spec` text COMMENT '自定义规格名称',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '添加时间',
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `is_hot` (`is_hot`) USING BTREE,
  KEY `is_recommend` (`is_recommend`) USING BTREE,
  KEY `sort` (`sort`) USING BTREE,
  KEY `mktprice` (`mkt_price`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 ROW_FORMAT=COMPACT COMMENT='商品表';

-- ----------------------------
-- Records of goods
-- ----------------------------
BEGIN;
INSERT INTO `goods` VALUES (4, 'zhanlang_007', '这是一件狼衣', '好彣', 10.00, 12.00, 0.00, 179, 6, 3, 4, 1, 1, 40, 0, 2.00, 'kg', '<p><img style=\"max-width: 380px;\" src=\"http://127.0.0.1:8080/upload/attachment/image/f67221cgf3i.png\" /></p>', '[{\"id\": 12, \"name\": \"颜色\", \"sort\": 1, \"values\": [{\"id\": 30, \"sort\": 0, \"value\": \"玫瑰金\", \"checked\": true}, {\"id\": 29, \"sort\": 0, \"value\": \"白\", \"checked\": true}, {\"id\": 28, \"sort\": 0, \"value\": \"银\"}]}, {\"id\": 14, \"name\": \"产地\", \"sort\": 3, \"values\": [{\"id\": 34, \"sort\": 0, \"value\": \"中国大陆\", \"checked\": true}, {\"id\": 36, \"sort\": 0, \"value\": \"新加坡\", \"checked\": true}, {\"id\": 35, \"sort\": 0, \"value\": \"越南\"}]}]', '[{\"id\": 5, \"name\": \"尺寸\", \"type\": \"radio\", \"values\": \"S\", \"optionalValues\": \"S M L XL XXL XXXL\"}]', 0, 0, 0, '2019-10-11 11:15:57', '2019-10-11 11:15:56', 0, 1, 1, '', '', '2019-09-25 16:06:04', '2019-10-11 18:09:33');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
