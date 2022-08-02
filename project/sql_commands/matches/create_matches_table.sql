-- Create a new table called 'Matches' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Matches', 'U') IS NOT NULL
DROP TABLE dbo.Matches
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Matches
(
    MatchId INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
    LeagueId INT NOT NULL DEFAULT(271),
    SeasonId INT NOT NULL DEFAULT(17328),
    RoundId INT NOT NULL,
    HomeTeamId INT NOT NULL,
    AwayTeamId INT NOT NULL,
    RefereeName VARCHAR(255),
    StartTime VARCHAR(255)
);
GO