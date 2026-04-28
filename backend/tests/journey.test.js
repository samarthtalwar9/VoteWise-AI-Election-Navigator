const request = require('supertest');
const app = require('../src/index');
const GuidanceAgent = require('../src/agents/GuidanceAgent');
const TimelineAgent = require('../src/agents/TimelineAgent');

// Mock Firebase Admin to prevent auth failures in tests
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    credential: { cert: jest.fn() },
    auth: jest.fn(() => ({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'testUser' })
    })),
    firestore: jest.fn(() => ({}))
}));

// Mock the AI Agents to prevent hitting real API limits
jest.mock('../src/agents/GuidanceAgent');
jest.mock('../src/agents/TimelineAgent');

describe('POST /api/journey', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if required fields are missing', async () => {
        const response = await request(app)
            .post('/api/journey')
            .send({ age: 25 }); // Missing location and firstTimeVoter
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Missing required fields');
    });

    it('should return 400 if age is invalid', async () => {
        const response = await request(app)
            .post('/api/journey')
            .send({ age: -5, location: 'Texas', firstTimeVoter: true });
        
        expect(response.status).toBe(400);
        expect(response.body.error).toBe('Invalid age provided.');
    });

    it('should return underage fallback if age < 18', async () => {
        const response = await request(app)
            .post('/api/journey')
            .send({ age: 16, location: 'Texas', firstTimeVoter: true });
        
        expect(response.status).toBe(200);
        expect(response.body.next_step).toContain('not yet eligible');
        expect(response.body.timeline).toEqual([]);
        
        // Ensure AI was not called for underage users
        expect(GuidanceAgent.determineNextStep).not.toHaveBeenCalled();
    });

    it('should successfully generate a journey for a valid user', async () => {
        GuidanceAgent.determineNextStep.mockResolvedValue({
            next_step: "Register to vote",
            explanation: "You must register before voting."
        });
        
        TimelineAgent.generateTimeline.mockResolvedValue({
            timeline: ["Deadline: Oct 1"]
        });

        const response = await request(app)
            .post('/api/journey')
            .send({ age: 25, location: 'New York', firstTimeVoter: true });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('next_step', 'Register to vote');
        expect(response.body.timeline).toHaveLength(1);
        expect(response.body.timeline[0]).toBe('Deadline: Oct 1');
        
        expect(GuidanceAgent.determineNextStep).toHaveBeenCalledWith({
            age: 25, location: 'New York', firstTimeVoter: true, language: undefined
        });
        expect(TimelineAgent.generateTimeline).toHaveBeenCalledWith({
            location: 'New York', next_step: 'Register to vote', language: undefined
        });
    });
});
