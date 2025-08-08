// Test script to verify student dashboard API
const http = require('http');

const testStudentDashboard = async () => {
    try {
        console.log('🔐 Testing student login...');

        // First login as student
        const loginData = JSON.stringify({
            email: 'sneha.patel@student.com',
            password: 'Password@123'
        });

        const loginOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(loginData)
            }
        };

        const loginPromise = new Promise((resolve, reject) => {
            const req = http.request(loginOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve({ status: res.statusCode, data: response });
                    } catch (e) {
                        reject(e);
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.write(loginData);
            req.end();
        });

        const loginResponse = await loginPromise;

        if (loginResponse.status !== 200) {
            console.error('❌ Login failed:', loginResponse.data);
            return;
        }

        console.log('✅ Student login successful!');
        console.log('User role:', loginResponse.data.data?.role);

        const token = loginResponse.data.token;
        console.log('🔑 Token received:', token ? 'Yes' : 'No');

        // Now test dashboard endpoint
        console.log('\n📊 Testing student dashboard...');

        const dashboardOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/student/dashboard',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const dashboardPromise = new Promise((resolve, reject) => {
            const req = http.request(dashboardOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        resolve({ status: res.statusCode, data: response });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: data });
                    }
                });
            });

            req.on('error', (err) => {
                reject(err);
            });

            req.end();
        });

        const dashboardResponse = await dashboardPromise;

        if (dashboardResponse.status === 200) {
            console.log('✅ Dashboard fetch successful!');
            console.log('Dashboard data keys:', Object.keys(dashboardResponse.data));
            console.log('Greeting:', dashboardResponse.data.greeting);
            console.log('Dashboard data structure:', JSON.stringify(dashboardResponse.data, null, 2));
        } else {
            console.error('❌ Dashboard fetch failed:', dashboardResponse);
        }

    } catch (error) {
        console.error('❌ Test failed:', error);
    }
};

testStudentDashboard();
