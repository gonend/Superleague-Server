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

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (1, 8628, 85, 'Sarit Hollander', '2021-05-25 10:00:00')
GO

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (2, 2905, 8628, 'Tslil Brami', '2021-05-28 12:00:00')
GO


INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (3, 939, 8628,'Gonen Davidi', '2021-06-01 14:00:00')
GO

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (3, 2394, 85, 'Sapir Berman', '2021-06-01 18:00:00')
GO


INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (4, 2905, 939, 'Sarit Hollander', '2021-07-06 18:00:00')
GO

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (4, 8628, 2394, 'Gonen Davidi', '2021-07-07 18:00:00')
GO


INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (5, 85, 939, 'Sapir Berman', '2021-07-08 18:00:00')
GO

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (5, 2394, 2905, 'Sarit Hollander', '2021-08-26 18:00:00')
GO


INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (6, 85, 2905, 'Tslil Brami', '2021-09-25 18:00:00')
GO

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (6, 939, 2394,'Gonen Davidi', '2021-09-25 18:00:00')
GO

INSERT INTO Matches
   ([RoundId],[HomeTeamId],[AwayTeamId],[RefereeName], [StartTime])
VALUES
   (5, 8628, 85, 'Sarit Holl', '2021-05-26 18:00:00')
GO