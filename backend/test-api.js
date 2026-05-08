// Script para probar la API de marcas y modelos
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3000/api/v1/brands-models';

async function testAPI() {
    console.log('🧪 Testing Brands & Models API...\n');

    try {
        // Test 1: Get all brands
        console.log('1. Testing GET /brands');
        const brandsResponse = await fetch(`${API_BASE}/brands`);
        console.log(`   Status: ${brandsResponse.status} ${brandsResponse.statusText}`);
        
        if (brandsResponse.ok) {
            const brandsData = await brandsResponse.json();
            console.log('   ✅ Success:', brandsData.success);
            console.log('   📊 Data count:', brandsData.data ? brandsData.data.length : 0);
            if (brandsData.data && brandsData.data.length > 0) {
                console.log('   📋 Sample brand:', brandsData.data[0]);
            }
        } else {
            console.log('   ❌ Failed');
            const errorText = await brandsResponse.text();
            console.log('   Error:', errorText);
        }

        console.log('\n2. Testing POST /brands (create new brand)');
        const createResponse = await fetch(`${API_BASE}/brands`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: 'TestBrand_' + Date.now() }),
        });
        console.log(`   Status: ${createResponse.status} ${createResponse.statusText}`);
        
        if (createResponse.ok) {
            const createData = await createResponse.json();
            console.log('   ✅ Success:', createData.success);
            console.log('   📋 Created brand:', createData.data);
        } else {
            console.log('   ❌ Failed');
            const errorText = await createResponse.text();
            console.log('   Error:', errorText);
        }

        console.log('\n3. Testing GET /models/brand/1');
        const modelsResponse = await fetch(`${API_BASE}/models/brand/1`);
        console.log(`   Status: ${modelsResponse.status} ${modelsResponse.statusText}`);
        
        if (modelsResponse.ok) {
            const modelsData = await modelsResponse.json();
            console.log('   ✅ Success:', modelsData.success);
            console.log('   📊 Data count:', modelsData.data ? modelsData.data.length : 0);
        } else {
            console.log('   ❌ Failed');
            const errorText = await modelsResponse.text();
            console.log('   Error:', errorText);
        }

    } catch (error) {
        console.error('❌ Connection error:', error.message);
        console.log('\n💡 Make sure the backend server is running on http://localhost:3001');
    }
}

testAPI();
