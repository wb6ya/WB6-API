import request from 'supertest';
import app from '../index';
import mongoose from 'mongoose';

describe('API Tests', () => {
  beforeAll(async () => {
    // Avoid connecting to DB in simple tests, or mock it.
    // Assuming the app doesn't block routes if not connected immediately, or we can just test 404 routes.
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});
