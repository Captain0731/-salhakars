#!/bin/bash

# Test script for bookmark navigation functionality using curl
# This script tests the API endpoints for fetching bookmarked items by ID
#
# Usage:
#   1. Set your API base URL and access token below
#   2. Make the script executable: chmod +x test-bookmark-navigation.sh
#   3. Run: ./test-bookmark-navigation.sh

API_BASE_URL="https://unquestioned-gunnar-medially.ngrok-free.dev"
ACCESS_TOKEN="YOUR_ACCESS_TOKEN_HERE"  # Replace with actual token

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🧪 Bookmark Navigation API Tests${NC}"
echo "=================================================="

# Function to make API calls
api_call() {
    local endpoint=$1
    local method=${2:-GET}
    
    if [ "$ACCESS_TOKEN" != "YOUR_ACCESS_TOKEN_HERE" ] && [ -n "$ACCESS_TOKEN" ]; then
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $ACCESS_TOKEN" \
            -H "ngrok-skip-browser-warning: true" \
            "${API_BASE_URL}${endpoint}"
    else
        curl -s -X "$method" \
            -H "Content-Type: application/json" \
            -H "ngrok-skip-browser-warning: true" \
            "${API_BASE_URL}${endpoint}"
    fi
}

# Test 1: Get User Bookmarks
echo -e "\n${BLUE}📚 Testing: Get User Bookmarks${NC}"
echo "=================================================="
bookmarks_response=$(api_call "/api/bookmarks?limit=10")
echo "$bookmarks_response" | jq '.' 2>/dev/null || echo "$bookmarks_response"

# Extract bookmark IDs for testing
judgement_ids=$(echo "$bookmarks_response" | jq -r '.bookmarks[] | select(.type == "judgement") | .item.id' 2>/dev/null)
central_act_ids=$(echo "$bookmarks_response" | jq -r '.bookmarks[] | select(.type == "central_act") | .item.id' 2>/dev/null)
state_act_ids=$(echo "$bookmarks_response" | jq -r '.bookmarks[] | select(.type == "state_act") | .item.id' 2>/dev/null)
bsa_iea_ids=$(echo "$bookmarks_response" | jq -r '.bookmarks[] | select(.type == "bsa_iea_mapping") | .item.id' 2>/dev/null)
bns_ipc_ids=$(echo "$bookmarks_response" | jq -r '.bookmarks[] | select(.type == "bns_ipc_mapping") | .item.id' 2>/dev/null)
bnss_crpc_ids=$(echo "$bookmarks_response" | jq -r '.bookmarks[] | select(.type == "bnss_crpc_mapping") | .item.id' 2>/dev/null)

# Test 2: Get Judgement by ID
if [ -n "$judgement_ids" ]; then
    first_judgement_id=$(echo "$judgement_ids" | head -n 1)
    echo -e "\n${BLUE}⚖️ Testing: Get Judgement by ID${NC}"
    echo "=================================================="
    echo "Judgement ID: $first_judgement_id"
    judgement_response=$(api_call "/api/judgements/${first_judgement_id}")
    status=$(echo "$judgement_response" | jq -r '.title // .error // "Unknown"' 2>/dev/null)
    if [ "$status" != "Unknown" ] && [ "$status" != "null" ]; then
        echo -e "${GREEN}✅ Successfully fetched judgement${NC}"
        echo "$judgement_response" | jq '.' 2>/dev/null || echo "$judgement_response"
    else
        echo -e "${RED}❌ Failed to fetch judgement${NC}"
        echo "$judgement_response"
    fi
fi

# Test 3: Get Central Act by ID
if [ -n "$central_act_ids" ]; then
    first_central_act_id=$(echo "$central_act_ids" | head -n 1)
    echo -e "\n${BLUE}📜 Testing: Get Central Act by ID${NC}"
    echo "=================================================="
    echo "Central Act ID: $first_central_act_id"
    
    # Try direct ID endpoint
    central_act_response=$(api_call "/api/acts/central-acts/${first_central_act_id}")
    status=$(echo "$central_act_response" | jq -r '.short_title // .error // "Unknown"' 2>/dev/null)
    
    if [ "$status" != "Unknown" ] && [ "$status" != "null" ]; then
        echo -e "${GREEN}✅ Successfully fetched central act via direct endpoint${NC}"
        echo "$central_act_response" | jq '.' 2>/dev/null || echo "$central_act_response"
    else
        echo -e "${YELLOW}⚠️ Direct endpoint failed, trying search fallback...${NC}"
        # Fallback: search
        search_response=$(api_call "/api/acts/central-acts?limit=100")
        found=$(echo "$search_response" | jq -r ".data[] | select(.id == ${first_central_act_id}) | .short_title" 2>/dev/null)
        if [ -n "$found" ]; then
            echo -e "${GREEN}✅ Found central act via search: $found${NC}"
        else
            echo -e "${RED}❌ Failed to fetch central act${NC}"
        fi
    fi
fi

# Test 4: Get State Act by ID
if [ -n "$state_act_ids" ]; then
    first_state_act_id=$(echo "$state_act_ids" | head -n 1)
    echo -e "\n${BLUE}📜 Testing: Get State Act by ID${NC}"
    echo "=================================================="
    echo "State Act ID: $first_state_act_id"
    
    # Try direct ID endpoint
    state_act_response=$(api_call "/api/acts/state-acts/${first_state_act_id}")
    status=$(echo "$state_act_response" | jq -r '.short_title // .error // "Unknown"' 2>/dev/null)
    
    if [ "$status" != "Unknown" ] && [ "$status" != "null" ]; then
        echo -e "${GREEN}✅ Successfully fetched state act via direct endpoint${NC}"
        echo "$state_act_response" | jq '.' 2>/dev/null || echo "$state_act_response"
    else
        echo -e "${YELLOW}⚠️ Direct endpoint failed, trying search fallback...${NC}"
        # Fallback: search
        search_response=$(api_call "/api/acts/state-acts?limit=100")
        found=$(echo "$search_response" | jq -r ".data[] | select(.id == ${first_state_act_id}) | .short_title" 2>/dev/null)
        if [ -n "$found" ]; then
            echo -e "${GREEN}✅ Found state act via search: $found${NC}"
        else
            echo -e "${RED}❌ Failed to fetch state act${NC}"
        fi
    fi
fi

# Test 5: Get BSA-IEA Mapping by ID
if [ -n "$bsa_iea_ids" ]; then
    first_bsa_iea_id=$(echo "$bsa_iea_ids" | head -n 1)
    echo -e "\n${BLUE}🔗 Testing: Get BSA-IEA Mapping by ID${NC}"
    echo "=================================================="
    echo "Mapping ID: $first_bsa_iea_id"
    
    # Try direct ID endpoint
    mapping_response=$(api_call "/api/law_mapping/${first_bsa_iea_id}")
    status=$(echo "$mapping_response" | jq -r '.subject // .error // "Unknown"' 2>/dev/null)
    
    if [ "$status" != "Unknown" ] && [ "$status" != "null" ]; then
        echo -e "${GREEN}✅ Successfully fetched mapping via direct endpoint${NC}"
        echo "$mapping_response" | jq '.' 2>/dev/null || echo "$mapping_response"
    else
        echo -e "${YELLOW}⚠️ Direct endpoint failed, trying search fallback...${NC}"
        # Fallback: search
        search_response=$(api_call "/api/law_mapping?mapping_type=bsa_iea&limit=100")
        found=$(echo "$search_response" | jq -r ".data[] | select(.id == ${first_bsa_iea_id}) | .subject" 2>/dev/null)
        if [ -n "$found" ]; then
            echo -e "${GREEN}✅ Found mapping via search: $found${NC}"
        else
            echo -e "${RED}❌ Failed to fetch mapping${NC}"
        fi
    fi
fi

# Test 6: Get BNS-IPC Mapping by ID
if [ -n "$bns_ipc_ids" ]; then
    first_bns_ipc_id=$(echo "$bns_ipc_ids" | head -n 1)
    echo -e "\n${BLUE}🔗 Testing: Get BNS-IPC Mapping by ID${NC}"
    echo "=================================================="
    echo "Mapping ID: $first_bns_ipc_id"
    
    # Try direct ID endpoint
    mapping_response=$(api_call "/api/law_mapping/${first_bns_ipc_id}")
    status=$(echo "$mapping_response" | jq -r '.subject // .error // "Unknown"' 2>/dev/null)
    
    if [ "$status" != "Unknown" ] && [ "$status" != "null" ]; then
        echo -e "${GREEN}✅ Successfully fetched mapping via direct endpoint${NC}"
        echo "$mapping_response" | jq '.' 2>/dev/null || echo "$mapping_response"
    else
        echo -e "${YELLOW}⚠️ Direct endpoint failed, trying search fallback...${NC}"
        # Fallback: search
        search_response=$(api_call "/api/law_mapping?mapping_type=bns_ipc&limit=100")
        found=$(echo "$search_response" | jq -r ".data[] | select(.id == ${first_bns_ipc_id}) | .subject" 2>/dev/null)
        if [ -n "$found" ]; then
            echo -e "${GREEN}✅ Found mapping via search: $found${NC}"
        else
            echo -e "${RED}❌ Failed to fetch mapping${NC}"
        fi
    fi
fi

# Test 7: Get BNSS-CrPC Mapping by ID
if [ -n "$bnss_crpc_ids" ]; then
    first_bnss_crpc_id=$(echo "$bnss_crpc_ids" | head -n 1)
    echo -e "\n${BLUE}🔗 Testing: Get BNSS-CrPC Mapping by ID${NC}"
    echo "=================================================="
    echo "Mapping ID: $first_bnss_crpc_id"
    
    # Try direct ID endpoint
    mapping_response=$(api_call "/api/law_mapping/${first_bnss_crpc_id}")
    status=$(echo "$mapping_response" | jq -r '.subject // .error // "Unknown"' 2>/dev/null)
    
    if [ "$status" != "Unknown" ] && [ "$status" != "null" ]; then
        echo -e "${GREEN}✅ Successfully fetched mapping via direct endpoint${NC}"
        echo "$mapping_response" | jq '.' 2>/dev/null || echo "$mapping_response"
    else
        echo -e "${YELLOW}⚠️ Direct endpoint failed, trying search fallback...${NC}"
        # Fallback: search
        search_response=$(api_call "/api/law_mapping?mapping_type=bnss_crpc&limit=100")
        found=$(echo "$search_response" | jq -r ".data[] | select(.id == ${first_bnss_crpc_id}) | .subject" 2>/dev/null)
        if [ -n "$found" ]; then
            echo -e "${GREEN}✅ Found mapping via search: $found${NC}"
        else
            echo -e "${RED}❌ Failed to fetch mapping${NC}"
        fi
    fi
fi

echo -e "\n${GREEN}✅ All tests completed!${NC}"
echo "=================================================="

