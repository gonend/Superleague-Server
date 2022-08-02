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
);
GO

INSERT INTO Scores
   ([MatchId],[HomeGoals],[AwayGoals])
VALUES
   ( 1, 0, 1)
GO

INSERT INTO Scores
   ([MatchId],[HomeGoals],[AwayGoals])
VALUES
   ( 2, 0, 0)
GO

INSERT INTO Scores
   ([MatchId],[HomeGoals],[AwayGoals])
VALUES
   ( 3, 1, 1)
GO

INSERT INTO Scores
   ([MatchId],[HomeGoals],[AwayGoals])
VALUES
   ( 4, 0, 2)
GO

INSERT INTO Scores
   ([MatchId],[HomeGoals],[AwayGoals])
VALUES
   ( 11, 0, 2)
GO
