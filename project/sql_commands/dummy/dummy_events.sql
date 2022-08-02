IF OBJECT_ID('dbo.Events', 'U') IS NOT NULL
DROP TABLE dbo.Events
GO
-- Create the table in the specified schema
CREATE TABLE dbo.Events
(
    MatchId INT NOT NULL,
    Minute INT NOT NULL,
    EventType VARCHAR(255),
    Descrip VARCHAR(255)
);
GO

INSERT INTO Events VALUES
   ( 1, 10, 'yellowCard', 'Ronaldo yellow card')
GO

INSERT INTO Events VALUES
   ( 1, 26, 'foul', 'Messi foul')
GO

INSERT INTO Events VALUES
   ( 1, 50, 'goal', 'Eden Ben Basat scored')
GO

INSERT INTO Events VALUES
   ( 1, 87, 'offside', 'Tom caught in offside')
GO

-- Match 2
INSERT INTO Events VALUES
   ( 2, 3, 'foul', 'Bad tackle by Haziza')
GO

INSERT INTO Events VALUES
   ( 2, 4, 'redCard', 'Haziza red card')
GO

INSERT INTO Events VALUES
   ( 2, 50, 'substitution', 'Cheri out, Dunio in')
GO

INSERT INTO Events VALUES
   ( 2, 61, 'injury', 'Awad injured')
GO

-- Match 3
INSERT INTO Events VALUES
   ( 3, 47, 'goal', 'Zlatan scored')
GO

INSERT INTO Events VALUES
   ( 3, 60, 'substitution', 'Zlatan out, Yossi in')
GO

INSERT INTO Events VALUES
   ( 3, 78, 'substitution', 'Yossi out, Gonen in')
GO

INSERT INTO Events VALUES
   ( 3, 94, 'goal', 'Gonen scored')
GO

-- Match 4
INSERT INTO Events VALUES
   ( 4, 12, 'goal', 'Tslil scored')
GO

INSERT INTO Events VALUES
   ( 4, 14, 'goal', 'Tslil scored')
GO

INSERT INTO Events VALUES
   ( 4, 40, 'substitution', 'Tslil out, Holli in')
GO

INSERT INTO Events VALUES
   ( 4, 62, 'injury', 'Daniel injured')
GO

-- Match 11
INSERT INTO Events VALUES
   ( 11, 12, 'goal', 'Tslil scored')
GO

INSERT INTO Events VALUES
   ( 11, 14, 'goal', 'Tslil scored')
GO

INSERT INTO Events VALUES
   ( 11, 40, 'substitution', 'Tslil out, Holli in')
GO

INSERT INTO Events VALUES
   ( 11, 62, 'injury', 'Daniel injured')
GO