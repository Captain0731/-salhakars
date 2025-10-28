#!/usr/bin/env node

// Simple script to test API connectivity
const endpoints = [
  'https://752ce8b44879.ngrok-free.app',
  'http://localhost:8000',
  'https://api.legalplatform.com',
  'https://legal-api.herokuapp.com'
];

async function testEndpoint(url) {
  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(`${url}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      },
      timeout: 5000
    });
    
    if (response.ok) {
      console.log(`✅ ${url} - OK (${response.status})`);
      return true;
    } else {
      console.log(`❌ ${url} - Failed (${response.status})`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${url} - Error: ${error.message}`);
    return false;
  }
}

async function testAllEndpoints() {
  console.log('🔍 Testing API endpoints...\n');
  
  const results = await Promise.all(endpoints.map(testEndpoint));
  const workingEndpoints = endpoints.filter((_, index) => results[index]);
  
  console.log('\n📊 Results:');
  if (workingEndpoints.length > 0) {
    console.log('✅ Working endpoints:');
    workingEndpoints.forEach(endpoint => console.log(`   - ${endpoint}`));
  } else {
    console.log('❌ No working endpoints found');
    console.log('\n💡 Suggestions:');
    console.log('   1. Check if your ngrok tunnel is running');
    console.log('   2. Verify your local server is running on port 8000');
    console.log('   3. Check your internet connection');
    console.log('   4. Contact your API provider');
  }
}

testAllEndpoints().catch(console.error);
