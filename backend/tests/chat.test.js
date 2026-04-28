const request = require('supertest');
const app = require('../src/index');
const QueryAgent = require('../src/agents/QueryAgent');

// Mock Firebase Admin
jest.mock('firebase-admin', () => ({
    initializeApp: jest.fn(),
    credential: { cert: jest.fn() },
    auth: jest.fn(() => ({
        verifyIdToken: jest.fn().mockResolvedValue({ uid: 'testUser' })
    })),
    firestore: jest.fn(() => ({
        collection: jest.fn(() => ({
            add: jest.fn().mockResolvedValue(true)
        }))
    }))
}));

// Mock the AI Agent
jest.mock('../src/agents/QueryAgent');

describe('POST /api/chat', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if query is missing', async () => {
        const response = await request(app)
            .post('/api/chat')
            .send({}); // Missing query
        
        expect(response.status).toBe(400);
        expect(response.body.error).toContain('Missing required field: query');
    });

    it('should successfully answer a valid query', async () => {
        QueryAgent.handleQuery.mockResolvedValue({
            answer: "You can register at vote.gov."
        });

        const response = await request(app)
            .post('/api/chat')
            .send({ query: 'How do I register?', context: { location: 'NY' } });
        
        expect(response.status).toBe(200);
        expect(response.body.answer).toBe('You can register at vote.gov.');
        
        expect(QueryAgent.handleQuery).toHaveBeenCalledWith({
            query: 'How do I register?', context: { location: 'NY' }, language: undefined
        });
    });

    it('should handle AI failures gracefully via global error handler', async () => {
        QueryAgent.handleQuery.mockRejectedValue(new Error("AI Down"));

        const response = await request(app)
            .post('/api/chat')
            .send({ query: 'Hello?' });
        
        // Custom error handler returns 500
        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Internal Server Error');
    });
});
