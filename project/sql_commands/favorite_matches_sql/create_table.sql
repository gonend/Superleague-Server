
IF OBJECT_ID('dbo.FavoriteMatches', 'U') IS NOT NULL
DROP TABLE dbo.FavoriteMatches
GO
-- Create the table in the specified schema
CREATE TABLE dbo.FavoriteMatches
(
    UserId int NOT NULL,
    MatchId int NOT NULL
);
GO