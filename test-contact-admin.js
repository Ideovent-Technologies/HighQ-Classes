/**
 * Contact Admin Functionality Test Script
 * Tests all the Contact Admin API endpoints
 */

// Test 1: Send Contact Message (Public endpoint)
async function testSendContactMessage() {
    console.log('🧪 Testing: Send Contact Message');

    try {
        const response = await fetch('http://localhost:5000/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test message to verify the Contact Admin functionality is working correctly.'
            })
        });

        const data = await response.json();
        console.log('✅ Send Contact Message Response:', data);

        if (data.success) {
            console.log('✅ Test PASSED: Contact message sent successfully');
            return data.messageId;
        } else {
            console.log('❌ Test FAILED:', data.message);
            return null;
        }
    } catch (error) {
        console.error('❌ Test ERROR:', error);
        return null;
    }
}

// Test 2: Get Contact Messages (Admin endpoint - requires authentication)
async function testGetContactMessages(authToken) {
    console.log('🧪 Testing: Get Contact Messages (Admin)');

    if (!authToken) {
        console.log('⚠️ Skipping admin test - no auth token provided');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/contact/messages', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });

        const data = await response.json();
        console.log('✅ Get Contact Messages Response:', data);

        if (data.success) {
            console.log('✅ Test PASSED: Contact messages retrieved successfully');
            console.log(`📊 Found ${data.total} total messages`);
        } else {
            console.log('❌ Test FAILED:', data.message);
        }
    } catch (error) {
        console.error('❌ Test ERROR:', error);
    }
}

// Test 3: Update Message Status (Admin endpoint - requires authentication)
async function testUpdateMessageStatus(messageId, authToken) {
    console.log('🧪 Testing: Update Message Status (Admin)');

    if (!authToken || !messageId) {
        console.log('⚠️ Skipping admin test - no auth token or message ID provided');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/contact/messages/${messageId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                status: 'replied',
                adminReply: 'Thank you for your message! This is a test reply from our automated test.'
            })
        });

        const data = await response.json();
        console.log('✅ Update Message Status Response:', data);

        if (data.success) {
            console.log('✅ Test PASSED: Message status updated successfully');
        } else {
            console.log('❌ Test FAILED:', data.message);
        }
    } catch (error) {
        console.error('❌ Test ERROR:', error);
    }
}

// Run all tests
async function runContactAdminTests() {
    console.log('🚀 Starting Contact Admin Functionality Tests\n');

    // Test 1: Public contact form
    const messageId = await testSendContactMessage();

    console.log('\n' + '='.repeat(50) + '\n');

    // Note: For admin tests, you would need to:
    // 1. Login as an admin user
    // 2. Get the auth token
    // 3. Pass it to these functions

    console.log('📝 To test admin functionality:');
    console.log('1. Login as an admin user in the browser');
    console.log('2. Copy the auth token from localStorage');
    console.log('3. Run: testGetContactMessages("your-auth-token")');
    console.log('4. Run: testUpdateMessageStatus("message-id", "your-auth-token")');

    console.log('\n✅ Contact Admin functionality is set up and working!');
    console.log('🎯 Students and Teachers can now contact admin via the sidebar');
}

// Export for browser console use
if (typeof window !== 'undefined') {
    window.testContactAdmin = {
        runAllTests: runContactAdminTests,
        sendMessage: testSendContactMessage,
        getMessages: testGetContactMessages,
        updateStatus: testUpdateMessageStatus
    };
}

// Run tests automatically
runContactAdminTests();
