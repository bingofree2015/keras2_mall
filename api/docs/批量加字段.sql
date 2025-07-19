DECLARE
 v_sql CLOB;
 v_table user_tables.TABLE_NAME%TYPE;
 CURSOR p_cursor IS SELECT TABLE_NAME FROM USER_TABLES t WHERE t.TABLE_NAME NOT IN('YX_SJCJ_JK','YX_SJCJ_JK_RZ','YX_SJCJ_JK_RZMX'); 
BEGIN
  OPEN p_cursor;
  LOOP 
    FETCH p_cursor INTO v_table;
    EXIT WHEN p_cursor%NOTFOUND;
    v_sql := 'ALTER TABLE '||v_table||' ADD RKRQ DATE';
    EXECUTE IMMEDIATE v_sql;
    v_sql :='comment on column '||v_table||'.RKRQ is ''入库日期''';
     EXECUTE IMMEDIATE v_sql;
  END LOOP;
END;






declare @tablename varchar(50)
       ,@sql varchar(1000)
       ,@dbname varchar(50)
set @dbname=DB_NAME()

declare addcolumn_Cusor cursor  for select name from sys.tables 

open addcolumn_Cusor
fetch next from addcolumn_Cusor into @tablename
while(@@fetch_status=0)
begin

set @sql='IF NOT EXISTS (SELECT 1 FROM '+@dbname+'.dbo.SYSCOLUMNS WHERE ID=OBJECT_ID('''+@dbname+'.dbo.'+@tablename+''') AND NAME=''created_at'')'
set @sql += 'alter table '+@tablename+' add created_at datetime default(getdate())'

set @sql+='IF NOT EXISTS (SELECT 1 FROM '+@dbname+'.dbo.SYSCOLUMNS WHERE ID=OBJECT_ID('''+@dbname+'.dbo.'+@tablename+''') AND NAME=''updated_at'')'
set @sql += 'alter table '+@tablename+' add updated_at datetime default(getdate())'

exec(@sql)

fetch next from addcolumn_Cusor into @tablename
end
close addcolumn_Cusor
deallocate addcolumn_Cusor





DROP PROCEDURE IF EXISTS batchAddColumns;
DELIMITER $$
 
 CREATE PROCEDURE batchAddColumns()
BEGIN
  DECLARE s_tablename VARCHAR(100);
 
 /*显示表的数据库中的所有表
 SELECT table_name FROM information_schema.tables WHERE table_schema='coupon_mall' Order by table_name ;
 */
 
#显示所有
 DECLARE cur_table_structure CURSOR
 FOR 
 SELECT table_name 
 FROM INFORMATION_SCHEMA.TABLES 
 WHERE table_schema = 'coupon_mall' AND table_name NOT IN (
 SELECT t.table_name  FROM (
	 SELECT table_name,column_name FROM information_schema.columns 
	 WHERE table_name IN ( 
		SELECT table_name 
		FROM INFORMATION_SCHEMA.TABLES 
		WHERE table_schema = 'coupon_mall')
	 ) t WHERE t.column_name='created_at' 
 );
 
 DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET s_tablename = NULL;
 
 OPEN cur_table_structure;
 
 FETCH cur_table_structure INTO s_tablename;
 
 WHILE ( s_tablename IS NOT NULL) DO
  SET @MyQuery=CONCAT("alter table `",s_tablename,"` add COLUMN `created_at` datetime NOT NULL DEFAULT NOW() COMMENT '添加时间'");

  
  PREPARE msql FROM @MyQuery;
  
  EXECUTE msql ;#USING @c; 
   
  FETCH cur_table_structure INTO s_tablename;
  END WHILE;
 CLOSE cur_table_structure;
 
 
END;
 $$
 