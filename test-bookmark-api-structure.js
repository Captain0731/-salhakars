// Test script to understand bookmark API structure
const API_BASE_URL = 'https://unquestioned-gunnar-medially.ngrok-free.dev';

// Note: This script requires authentication token
// Run this in browser console after logging in, or use curl with auth token

async function testBookmarkAPI() {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    console.error('No auth token found. Please login first.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/bookmarks?limit=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    const data = await response.json();
    console.log('📋 Bookmark API Response Structure:');
    console.log(JSON.stringify(data, null, 2));
    
    // Analyze different bookmark types
    if (data.bookmarks && Array.isArray(data.bookmarks)) {
      console.log('\n🔍 Analyzing bookmark types:');
      
      const types = {};
      data.bookmarks.forEach((bookmark, index) => {
        const type = bookmark.type;
        if (!types[type]) {
          types[type] = {
            count: 0,
            sample: bookmark
          };
        }
        types[type].count++;
      });

      console.log('\n📊 Bookmark Types Found:');
      Object.keys(types).forEach(type => {
        console.log(`\n${type}:`);
        console.log(`  Count: ${types[type].count}`);
        console.log(`  Sample structure:`, JSON.stringify(types[type].sample, null, 2));
        
        // Check item structure
        const item = types[type].sample.item || types[type].sample;
        console.log(`  Item fields:`, Object.keys(item));
        console.log(`  Title fields found:`, {
          title: item.title,
          short_title: item.short_title,
          long_title: item.long_title,
          subject: item.subject,
          name: item.name,
          bns_section: item.bns_section,
          ipc_section: item.ipc_section,
          bsa_section: item.bsa_section,
          iea_section: item.iea_section
        });
      });
    }
  } catch (error) {
    console.error('Error testing bookmark API:', error);
  }
}

// Also test individual act/mapping endpoints
async function testActAPI() {
  const token = localStorage.getItem('access_token');
  
  try {
    // Test central act
    const centralResponse = await fetch(`${API_BASE_URL}/api/acts/central-acts?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const centralData = await centralResponse.json();
    console.log('\n📜 Central Act Structure:');
    console.log(JSON.stringify(centralData, null, 2));

    // Test state act
    const stateResponse = await fetch(`${API_BASE_URL}/api/acts/state-acts?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const stateData = await stateResponse.json();
    console.log('\n📜 State Act Structure:');
    console.log(JSON.stringify(stateData, null, 2));

    // Test BNS IPC mapping
    const mappingResponse = await fetch(`${API_BASE_URL}/api/law-mappings/bns-ipc?limit=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
    const mappingData = await mappingResponse.json();
    console.log('\n🗺️ BNS IPC Mapping Structure:');
    console.log(JSON.stringify(mappingData, null, 2));

  } catch (error) {
    console.error('Error testing act/mapping APIs:', error);
  }
}

// Run tests
console.log('🧪 Running bookmark API structure tests...');
console.log('Run testBookmarkAPI() and testActAPI() in browser console after logging in');

