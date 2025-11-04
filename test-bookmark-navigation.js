/**
 * Test script for bookmark navigation functionality
 * This script tests the API endpoints for fetching bookmarked items by ID
 * 
 * Usage:
 * 1. Set your API base URL and access token
 * 2. Run: node test-bookmark-navigation.js
 */

const API_BASE_URL = 'https://unquestioned-gunnar-medially.ngrok-free.dev';
const ACCESS_TOKEN = 'YOUR_ACCESS_TOKEN_HERE'; // Replace with actual token

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  };
  
  if (ACCESS_TOKEN && ACCESS_TOKEN !== 'YOUR_ACCESS_TOKEN_HERE') {
    headers['Authorization'] = `Bearer ${ACCESS_TOKEN}`;
  }
  
  const options = {
    method,
    headers,
  };
  
  if (body && method !== 'GET') {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    return { status: 'error', error: error.message };
  }
}

// Test functions
async function testGetUserBookmarks() {
  console.log('\n📚 Testing: Get User Bookmarks');
  console.log('='.repeat(50));
  
  const result = await apiCall('/api/bookmarks?limit=10');
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  if (result.data && result.data.bookmarks) {
    console.log(`\n✅ Found ${result.data.bookmarks.length} bookmarks`);
    return result.data.bookmarks;
  }
  
  return [];
}

async function testGetJudgementById(judgementId) {
  console.log('\n⚖️ Testing: Get Judgement by ID');
  console.log('='.repeat(50));
  console.log('Judgement ID:', judgementId);
  
  const result = await apiCall(`/api/judgements/${judgementId}`);
  console.log('Status:', result.status);
  console.log('Response:', JSON.stringify(result.data, null, 2));
  
  return result.status === 200 || result.status === 'error';
}

async function testGetCentralActById(actId) {
  console.log('\n📜 Testing: Get Central Act by ID');
  console.log('='.repeat(50));
  console.log('Act ID:', actId);
  
  // Try direct ID endpoint
  let result = await apiCall(`/api/acts/central-acts/${actId}`);
  console.log('Direct ID endpoint - Status:', result.status);
  
  if (result.status !== 200) {
    // Fallback: search by filtering
    console.log('Trying fallback: search with filter...');
    result = await apiCall(`/api/acts/central-acts?limit=100`);
    if (result.data && result.data.data) {
      const found = result.data.data.find(act => act.id === parseInt(actId) || act.id === actId);
      if (found) {
        console.log('✅ Found act via search:', found.short_title || found.long_title);
        return true;
      }
    }
  } else {
    console.log('✅ Found act via direct endpoint');
    return true;
  }
  
  console.log('❌ Act not found');
  return false;
}

async function testGetStateActById(actId) {
  console.log('\n📜 Testing: Get State Act by ID');
  console.log('='.repeat(50));
  console.log('Act ID:', actId);
  
  // Try direct ID endpoint
  let result = await apiCall(`/api/acts/state-acts/${actId}`);
  console.log('Direct ID endpoint - Status:', result.status);
  
  if (result.status !== 200) {
    // Fallback: search by filtering
    console.log('Trying fallback: search with filter...');
    result = await apiCall(`/api/acts/state-acts?limit=100`);
    if (result.data && result.data.data) {
      const found = result.data.data.find(act => act.id === parseInt(actId) || act.id === actId);
      if (found) {
        console.log('✅ Found act via search:', found.short_title || found.long_title);
        return true;
      }
    }
  } else {
    console.log('✅ Found act via direct endpoint');
    return true;
  }
  
  console.log('❌ Act not found');
  return false;
}

async function testGetMappingById(mappingId, mappingType) {
  console.log('\n🔗 Testing: Get Mapping by ID');
  console.log('='.repeat(50));
  console.log('Mapping ID:', mappingId);
  console.log('Mapping Type:', mappingType);
  
  // Try direct ID endpoint
  let result = await apiCall(`/api/law_mapping/${mappingId}`);
  console.log('Direct ID endpoint - Status:', result.status);
  
  if (result.status !== 200) {
    // Fallback: search by filtering
    console.log('Trying fallback: search with filter...');
    result = await apiCall(`/api/law_mapping?mapping_type=${mappingType}&limit=100`);
    if (result.data && result.data.data) {
      const found = result.data.data.find(
        mapping => mapping.id === parseInt(mappingId) || mapping.id === mappingId
      );
      if (found) {
        console.log('✅ Found mapping via search:', found.subject || found.title);
        return true;
      }
    }
  } else {
    console.log('✅ Found mapping via direct endpoint');
    return true;
  }
  
  console.log('❌ Mapping not found');
  return false;
}

// Main test function
async function runTests() {
  console.log('🧪 Bookmark Navigation API Tests');
  console.log('='.repeat(50));
  
  // Step 1: Get user bookmarks
  const bookmarks = await testGetUserBookmarks();
  
  if (bookmarks.length === 0) {
    console.log('\n⚠️ No bookmarks found. Please create some bookmarks first.');
    return;
  }
  
  // Step 2: Test navigation for each bookmark type
  console.log('\n\n🔍 Testing Navigation for Each Bookmark Type');
  console.log('='.repeat(50));
  
  for (const bookmark of bookmarks) {
    const item = bookmark.item || bookmark;
    const bookmarkType = bookmark.type;
    const itemId = item.id;
    
    console.log(`\n📌 Testing Bookmark: ${bookmarkType} (ID: ${itemId})`);
    
    switch (bookmarkType) {
      case 'judgement':
        await testGetJudgementById(itemId);
        break;
      case 'central_act':
        await testGetCentralActById(itemId);
        break;
      case 'state_act':
        await testGetStateActById(itemId);
        break;
      case 'bsa_iea_mapping':
        await testGetMappingById(itemId, 'bsa_iea');
        break;
      case 'bns_ipc_mapping':
        await testGetMappingById(itemId, 'bns_ipc');
        break;
      case 'bnss_crpc_mapping':
        await testGetMappingById(itemId, 'bnss_crpc');
        break;
      default:
        console.log(`⚠️ Unknown bookmark type: ${bookmarkType}`);
    }
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log('\n\n✅ All tests completed!');
  console.log('='.repeat(50));
}

// Run tests if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  // For Node.js environment
  const fetch = require('node-fetch');
  global.fetch = fetch;
  runTests().catch(console.error);
} else {
  // For browser environment
  console.log('To run tests in browser, open browser console and call: runTests()');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testGetUserBookmarks,
    testGetJudgementById,
    testGetCentralActById,
    testGetStateActById,
    testGetMappingById,
    runTests
  };
}

