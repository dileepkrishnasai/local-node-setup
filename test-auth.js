const fetch = require('node-fetch');

// Test the /lookupData endpoint with and without authentication
async function testLookupData() {
  const baseUrl = 'http://localhost:3005';

  console.log('Testing /lookupData endpoint...\n');

  // Test 1: Without authentication (should fail)
  console.log('1. Testing WITHOUT authentication:');
  try {
    const response = await fetch(`${baseUrl}/lookupData`);
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: With invalid token (should fail)
  console.log('2. Testing WITH invalid token:');
  try {
    const response = await fetch(`${baseUrl}/lookupData`, {
      headers: {
        Authorization: 'Bearer invalid_token_123'
      }
    });
    const data = await response.json();
    console.log(`   Status: ${response.status}`);
    console.log(`   Response:`, data);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Get a valid token first
  console.log('3. Getting a valid token:');
  try {
    const tokenResponse = await fetch(`${baseUrl}/token`);
    const tokenData = await tokenResponse.json();
    console.log(`   Status: ${tokenResponse.status}`);
    console.log(`   Token: ${tokenData.accessToken}`);

    // Test 4: With valid token (should succeed)
    console.log('\n4. Testing WITH valid token:');
    const lookupResponse = await fetch(`${baseUrl}/lookupData`, {
      headers: {
        Authorization: `Bearer ${tokenData.accessToken}`
      }
    });
    const lookupData = await lookupResponse.json();
    console.log(`   Status: ${lookupResponse.status}`);
    console.log(`   Response:`, lookupData);
  } catch (error) {
    console.log(`   Error: ${error.message}`);
  }
}

// Run the test
testLookupData().catch(console.error); 