// Copy and paste this comprehensive command into your browser's developer console
// This will clear ALL voting data including the structure you showed with votingStatus, participants, etc.

(function () {
  console.log("🧹 Starting comprehensive voting data clear...");

  let totalCleared = 0;
  const clearedKeys = [];

  // Get all localStorage keys
  const allKeys = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) {
      allKeys.push(key);
    }
  }

  console.log(`📊 Found ${allKeys.length} total localStorage items`);

  // Clear keys by prefix and content
  allKeys.forEach((key) => {
    let shouldClear = false;
    let reason = "";

    // Check for known voting prefixes
    if (key.startsWith("voting_state_")) {
      shouldClear = true;
      reason = "voting_state_ prefix";
    } else if (key.startsWith("tasfa_vote_")) {
      shouldClear = true;
      reason = "tasfa_vote_ prefix";
    } else if (
      key.toLowerCase().includes("vote") ||
      key.toLowerCase().includes("voting") ||
      key.toLowerCase().includes("tasfa")
    ) {
      shouldClear = true;
      reason = "contains vote/voting/tasfa";
    } else {
      // Check the actual data content
      try {
        const value = localStorage.getItem(key);
        if (value) {
          const parsed = JSON.parse(value);

          // Check if it contains voting-related data structure
          if (parsed && typeof parsed === "object") {
            const hasVotingData =
              parsed.votingStatus !== undefined ||
              parsed.participants !== undefined ||
              parsed.category !== undefined ||
              parsed.timestamp !== undefined ||
              parsed.canVote !== undefined ||
              parsed.pendingCategories !== undefined ||
              parsed.voteTimestamps !== undefined ||
              parsed.votedCategories !== undefined;

            if (hasVotingData) {
              shouldClear = true;
              reason = "contains voting data structure";
            }
          }
        }
      } catch (e) {
        // If JSON parsing fails, check if it's a string containing voting keywords
        const value = localStorage.getItem(key);
        if (
          value &&
          typeof value === "string" &&
          (value.toLowerCase().includes("vote") ||
            value.toLowerCase().includes("voting") ||
            value.toLowerCase().includes("tasfa"))
        ) {
          shouldClear = true;
          reason = "string contains voting keywords";
        }
      }
    }

    if (shouldClear) {
      localStorage.removeItem(key);
      totalCleared++;
      clearedKeys.push({ key, reason });
      console.log(`🗑️ Removed: ${key} (${reason})`);
    }
  });

  console.log(`\n✅ COMPREHENSIVE CLEAR COMPLETE!`);
  console.log(`📊 Total items cleared: ${totalCleared}`);
  console.log(`📊 Items remaining: ${localStorage.length}`);

  if (totalCleared > 0) {
    console.log(`\n📋 Cleared items:`);
    clearedKeys.forEach((item) => {
      console.log(`   - ${item.key} (${item.reason})`);
    });
  }

  console.log(
    "\n🎉 All voting data has been cleared! Users can now vote fresh."
  );

  return {
    totalCleared,
    itemsRemaining: localStorage.length,
    clearedKeys,
  };
})();
