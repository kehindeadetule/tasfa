// Copy and paste this command into your browser's developer console to clear all frontend voting data

(function () {
  console.log("🧹 Clearing all frontend voting data...");

  let votingStateCount = 0;
  let tasfaVoteCount = 0;

  // Clear all voting_state_ keys
  const votingStateKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("voting_state_")) {
      votingStateKeys.push(key);
    }
  }

  votingStateKeys.forEach((key) => {
    localStorage.removeItem(key);
    votingStateCount++;
    console.log(`🗑️ Removed voting state: ${key}`);
  });

  // Clear all tasfa_vote_ keys
  const tasfaVoteKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("tasfa_vote_")) {
      tasfaVoteKeys.push(key);
    }
  }

  tasfaVoteKeys.forEach((key) => {
    localStorage.removeItem(key);
    tasfaVoteCount++;
    console.log(`🗑️ Removed tasfa vote: ${key}`);
  });

  console.log(
    `✅ Successfully cleared ${votingStateCount} voting state records`
  );
  console.log(`✅ Successfully cleared ${tasfaVoteCount} tasfa vote records`);
  console.log("🎉 All frontend voting data cleared! Users can now vote fresh.");
  console.log("📝 Note: Backend data has already been cleared as mentioned.");

  return {
    votingStateCleared: votingStateCount,
    tasfaVoteCleared: tasfaVoteCount,
    totalCleared: votingStateCount + tasfaVoteCount,
  };
})();
