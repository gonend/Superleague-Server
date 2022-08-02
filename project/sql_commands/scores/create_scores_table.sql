-- Create a new table called 'Scores' in schema 'dbo'
-- Drop the table if it already exists
IF OBJECT_ID('dbo.Scores', 'U') IS NOT NULL
DROP TABLE dbo.Scores
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Scores
(
    MatchId INT NOT NULL PRIMARY KEY, -- primary key column
    HomeGoals INT NOT NULL,
    AwayGoals INT NOT NULL
    -- specify more columns here
);
GO