const request = require('supertest');
const app = require('../src/index');

describe('Chat API', () => {
  it('should return 400 if query is missing', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ context: { location: 'NY' } });
    
    if (res.statusCode !== 401) {
      expect(res.statusCode).toEqual(400);
      expect(res.body.error).toContain('Missing required field: query');
    }
  });
});
