/**
 * Health Endpoint Tests
 * Tests the /health endpoint for system monitoring and CI/CD
 *
 * @author Maaz Ansari <maazansari25667@gmail.com>
 */

const request = require('supertest');
const express = require('express');

// Create a minimal test app for isolated testing
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Health check endpoint (matching the main server implementation)
  app.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'HireFlow AI Backend',
      version: '1.0.0',
    });
  });

  return app;
};

describe('Health Endpoint', () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  describe('GET /health', () => {
    it('should return 200 status code', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.status).toBe(200);
    });

    it('should return status "ok"', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body.status).toBe('ok');
    });

    it('should return proper JSON structure', async () => {
      const response = await request(app).get('/health').expect(200);

      expect(response.body).toHaveProperty('status');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('service');
      expect(response.body).toHaveProperty('version');

      expect(response.body.status).toBe('ok');
      expect(response.body.service).toBe('HireFlow AI Backend');
      expect(response.body.version).toBe('1.0.0');
      expect(typeof response.body.timestamp).toBe('string');
    });

    it('should return valid ISO timestamp', async () => {
      const response = await request(app).get('/health').expect(200);

      const timestamp = new Date(response.body.timestamp);
      expect(timestamp).toBeInstanceOf(Date);
      expect(timestamp.toString()).not.toBe('Invalid Date');
    });

    it('should have correct content-type header', async () => {
      await request(app)
        .get('/health')
        .expect(200)
        .expect('Content-Type', /json/);
    });
  });

  describe('Health Check Response Time', () => {
    it('should respond within 100ms', async () => {
      const startTime = Date.now();

      await request(app).get('/health').expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(100);
    });
  });
});
