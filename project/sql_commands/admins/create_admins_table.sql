
IF OBJECT_ID('dbo.Admins', 'U') IS NOT NULL
DROP TABLE dbo.Admins
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Admins
(
    UserId int NOT NULL
);
GO