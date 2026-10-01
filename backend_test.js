const http = require('http');

const BASE_URL = 'http://localhost:8080';

// Helper to make requests
function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };

    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            body: data ? JSON.parse(data) : null,
            headers: res.headers
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            body: data,
            headers: res.headers
          });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log("=== Starting Backend API Tests ===");
  let failed = false;

  const assert = (condition, message) => {
    if (!condition) {
      console.error(`❌ FAIL: ${message}`);
      failed = true;
    } else {
      console.log(`✅ PASS: ${message}`);
    }
  };

  try {
    // 0. OTP Flow Tests
    const otpEmail = `otp_${Date.now()}@example.com`;
    const otpSend = await request('POST', '/api/send-otp', { email: otpEmail });
    assert(otpSend.statusCode === 200, 'POST /api/send-otp returns 200');
    assert(otpSend.body.otp !== undefined, 'POST /api/send-otp generates otp code');

    const otpVerify = await request('POST', '/api/verify-otp', { email: otpEmail, otp: otpSend.body.otp });
    assert(otpVerify.statusCode === 200, 'POST /api/verify-otp returns 200 for correct otp');

    // 1. Onboarding
    const onboarding = await request('GET', '/api/onboarding');
    assert(onboarding.statusCode === 200, 'GET /api/onboarding status is 200');
    assert(Array.isArray(onboarding.body), 'GET /api/onboarding returns array');

    // 2. Signup
    const testEmail = `test_${Date.now()}@example.com`;
    const signup = await request('POST', '/api/signup', {
      username: `testuser_${Date.now()}`,
      email: testEmail,
      password: 'password123',
      role: 'student'
    });
    assert(signup.statusCode === 201, 'POST /api/signup returns 201 Created');
    assert(signup.body.success === true, 'POST /api/signup returns success: true');

    // 3. Login
    const login = await request('POST', '/api/login', {
      email: testEmail,
      password: 'password123'
    });
    assert(login.statusCode === 200, 'POST /api/login returns 200 OK');
    assert(login.body.success === true, 'POST /api/login returns user details');

    // 4. Student profile (public lookup)
    const profile = await request('GET', `/api/student/profile?email=${testEmail}`, null, {
      'Authorization': 'Bearer mock_token'
    });
    assert(profile.statusCode === 200, 'GET /api/student/profile returns 200 OK');
    assert(profile.body.email === testEmail, 'GET /api/student/profile returns correct email');

    // 5. Courses
    const courses = await request('GET', '/api/courses');
    assert(courses.statusCode === 200, 'GET /api/courses returns 200 OK');

    // 6. Jobs
    const jobs = await request('GET', '/api/jobs');
    assert(jobs.statusCode === 200, 'GET /api/jobs returns 200 OK');

    // 7. Leaderboard
    const leaderboard = await request('GET', '/api/leaderboard');
    assert(leaderboard.statusCode === 200, 'GET /api/leaderboard returns 200 OK');

    // 8. Success Showcase
    const showcaseCreate = await request('POST', '/api/success-showcase/create', {
      id: 'story_test_123',
      studentName: 'Aria Taylor',
      company: 'Partner Company',
      role: 'Backend Intern @ Stripe',
      story: 'Aria completed her training and started as a backend software engineering intern at Stripe.',
      avatar: 'data:image/png;base64,avatar_mock_data',
      logo: 'data:image/png;base64,logo_mock_data',
      statusState: 'Published'
    });
    assert(showcaseCreate.statusCode === 201, 'POST /api/success-showcase/create returns 201 Created');
    assert(showcaseCreate.body.success === true, 'POST /api/success-showcase/create returns success: true');

    const showcaseList = await request('GET', '/api/success-showcase');
    assert(showcaseList.statusCode === 200, 'GET /api/success-showcase status is 200');
    assert(Array.isArray(showcaseList.body), 'GET /api/success-showcase returns array');
    assert(showcaseList.body.some(s => s.id === 'story_test_123'), 'GET /api/success-showcase returns the newly created success story');

    // 9. Quiz Creation and Retrieval Tests
    const testQuizTitle = `Integration Quiz ${Date.now()}`;
    const quizPayload = {
      title: testQuizTitle,
      duration: '45 mins',
      questions: 1,
      group: 'Group A',
      questionsList: [
        {
          text: 'What is 5 + 5?',
          options: ['8', '9', '10', '11'],
          correctIndex: 2,
          difficulty: 1,
          tags: ['Arithmetic']
        }
      ]
    };
    
    const quizCreate = await request('POST', '/api/tests/create', quizPayload, {
      'Authorization': 'Bearer mock_token'
    });
    assert(quizCreate.statusCode === 201, 'POST /api/tests/create returns 201 Created');
    assert(quizCreate.body.success === true, 'POST /api/tests/create returns success: true');
    assert(quizCreate.body.test !== undefined, 'POST /api/tests/create returns created test object');
    
    const quizList = await request('GET', '/api/tests?group=Group A');
    assert(quizList.statusCode === 200, 'GET /api/tests returns 200 OK');
    assert(Array.isArray(quizList.body), 'GET /api/tests returns an array');
    
    const retrievedQuiz = quizList.body.find(t => t.title === testQuizTitle);
    assert(retrievedQuiz !== undefined, 'GET /api/tests returns the newly published quiz');
    assert(retrievedQuiz.group === 'Group A', 'Retrieved quiz has the correct target group');
    assert(retrievedQuiz.questionsList && retrievedQuiz.questionsList.length === 1, 'Retrieved quiz has the correct questionsList');
    assert(retrievedQuiz.questionsList[0].text === 'What is 5 + 5?', 'Retrieved quiz question text is correct');

    if (failed) {
      console.error("=== Some backend validation tests failed! ===");
      process.exit(1);
    } else {
      console.log("=== All backend validation tests passed successfully! ===");
    }
  } catch (err) {
    console.error("Test execution encountered an error:", err);
    process.exit(1);
  }
}

runTests();
