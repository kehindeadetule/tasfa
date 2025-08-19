const API_BASE_URL = "https://tasfa-be.onrender.com";

async function testQueueSystem() {
  console.log("🧪 Testing Redis Queue System...\n");

  try {
    // Test 1: Check queue status
    console.log("1. Testing queue status endpoint...");
    const queueResponse = await fetch(`${API_BASE_URL}/api/votes/queue-status`);
    const queueData = await queueResponse.json();

    if (queueData.success) {
      console.log("✅ Queue status endpoint working");
      console.log("   - Redis connected:", queueData.data.redis.connected);
      console.log("   - Queue stats:", queueData.data.queue);
    } else {
      console.log("❌ Queue status endpoint failed:", queueData.message);
    }

    // Test 2: Submit a test vote
    console.log("\n2. Testing vote submission...");
    const voteData = {
      firstName: "Test",
      lastName: "User",
      school: "Test School",
      awardCategory: "Best Actor",
    };

    const voteResponse = await fetch(`${API_BASE_URL}/api/votes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
      },
      body: JSON.stringify(voteData),
    });

    const voteResult = await voteResponse.json();

    if (voteResult.success) {
      console.log("✅ Vote submission working");
      if (voteResult.data?.queued) {
        console.log("   - Vote queued successfully");
        console.log("   - Job ID:", voteResult.data.jobId);
        console.log("   - Estimated count:", voteResult.data.estimatedCount);
      } else {
        console.log("   - Vote processed directly");
      }
    } else {
      console.log("❌ Vote submission failed:", voteResult.message);
    }

    // Test 3: Check session debug
    console.log("\n3. Testing session debug endpoint...");
    const sessionResponse = await fetch(
      `${API_BASE_URL}/api/votes/session-debug`
    );
    const sessionData = await sessionResponse.json();

    if (sessionData.success) {
      console.log("✅ Session debug endpoint working");
      console.log("   - Session ID:", sessionData.data.sessionId);
      console.log("   - User agent:", sessionData.data.userAgent);
    } else {
      console.log("❌ Session debug endpoint failed:", sessionData.message);
    }

    console.log("\n🎉 Queue system test completed!");
  } catch (error) {
    console.error("❌ Test failed with error:", error.message);
  }
}

// Run the test
testQueueSystem();
