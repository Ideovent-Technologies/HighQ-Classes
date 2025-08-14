// Test script to check registration
const timestamp = Date.now();
const testData = {
    name: "Jane Smith",
    email: `jane${timestamp}@example.com`,
    password: "Test123456",
    mobile: "98765" + String(timestamp).slice(-5),
    gender: "female",
    dateOfBirth: "2000-01-01",
    parentName: "John Smith",
    parentContact: "98765" + String(timestamp + 1).slice(-5),
    grade: "12th",
    schoolName: "Test School",
    address: "123 Main Street",
    role: "student"
};

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(testData)
})
    .then(response => response.json())
    .then(data => {
        console.log('Registration result:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
