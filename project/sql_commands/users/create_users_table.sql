
IF OBJECT_ID('dbo.Users', 'U') IS NOT NULL
DROP TABLE dbo.Users
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Users
(
    UserId int IDENTITY(1,1) NOT NULL,
    UserName VARCHAR(255) NOT NULL,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL,
    UserPassword VARCHAR(255) NOT NULL,
    Email VARCHAR(255) NOT NULL,
    ProfilePicture VARCHAR(255) NOT NULL,
);
GO