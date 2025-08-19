// Clear all frontend voting data script
// Run this script to clear vote counts, timestamps, and voted categories from localStorage

console.log("🧹 Clearing all frontend voting data...");

// Function to clear all localStorage voting data
function clearAllVotingData() {
  try {
    // Clear all keys that start with voting_state_
    const votingStateKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("voting_state_")) {
        votingStateKeys.push(key);
      }
    }

    // Clear all keys that start with tasfa_vote_
    const tasfaVoteKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("tasfa_vote_")) {
        tasfaVoteKeys.push(key);
      }
    }

    // Remove all voting state keys
    votingStateKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🗑️  Removed voting state: ${key}`);
    });

    // Remove all tasfa vote keys
    tasfaVoteKeys.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`🗑️  Removed tasfa vote: ${key}`);
    });

    console.log(`✅ Cleared ${votingStateKeys.length} voting state records`);
    console.log(`✅ Cleared ${tasfaVoteKeys.length} tasfa vote records`);
    console.log(
      "🎉 All frontend voting data cleared! Users can now vote fresh."
    );
  } catch (error) {
    console.error("❌ Error clearing voting data:", error);
  }
}

// Execute the clearing function
clearAllVotingData();
