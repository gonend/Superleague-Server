
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