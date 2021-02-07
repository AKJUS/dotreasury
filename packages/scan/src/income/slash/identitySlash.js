const { Modules, IdentityEvents } = require("../../utils/constants");

function handleIdentitySlash(event, sort, allBlockEvents, blockIndexer) {
  const {
    event: { data: treasuryDepositData },
    phase,
  } = event; // get deposit event data
  if (sort >= allBlockEvents.length - 1 || phase.isNull) {
    return;
  }

  const nextEvent = allBlockEvents[sort - 1];
  const {
    event: { section, method },
  } = nextEvent;
  if (
    section !== Modules.Identity ||
    method !== IdentityEvents.IdentityKilled
  ) {
    return;
  }

  const identityKilledEventData = nextEvent.event.data.toJSON();
  const treasuryDepositEventData = treasuryDepositData.toJSON();
  const balance = (treasuryDepositEventData || [])[0];

  const data = {
    indexer: blockIndexer,
    section,
    method,
    balance,
    treasuryDepositEventData,
    identityKilledEventData,
  };
}

module.exports = {
  handleIdentitySlash,
};