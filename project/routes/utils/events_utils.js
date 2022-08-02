const DButils = require("./DButils");

// add event to DB
async function addEvent(matchId, minute, eventType, description) {
  await DButils.execQuery(
    `insert into dbo.Events values (${matchId},${minute},'${eventType}','${description}')`
  );
}

exports.addEvent = addEvent;
