const request = require('supertest');
const app = require('../src/index');

describe('VoteWise API Tests', () => {
  it('should return 400 if required fields are missing on /api/journey', async () => {
    const res = await request(app)
      .post('/api/journey')
      .send({ location: 'Delhi' }); // missing age and firstTimeVoter
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 for invalid age on /api/journey', async () => {
    const res = await request(app)
      .post('/api/journey')
      .send({ age: -5, location: 'Delhi', firstTimeVoter: true });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if query is missing on /api/chat', async () => {
    const res = await request(app)
      .post('/api/chat')
      .send({ context: {} });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
