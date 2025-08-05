-- Migration script to fix attachment name column length issue
-- This fixes the "Data too long for column 'name'" error

-- Increase the name column size from varchar(64) to varchar(255)
ALTER TABLE `attachments` MODIFY COLUMN `name` varchar(255) NOT NULL COMMENT '文件名';

-- Optional: Also increase the path column size if needed for consistency
-- ALTER TABLE `attachments` MODIFY COLUMN `path` varchar(500) NOT NULL COMMENT '文件路径'; 