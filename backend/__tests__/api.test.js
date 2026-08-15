import { jest } from '@jest/globals';
import request from 'supertest';

const mockCategoryFindMany = jest.fn();
const mockProductFindMany = jest.fn();
const mockProductCount = jest.fn();

jest.unstable_mockModule('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn(),
}));

jest.unstable_mockModule('@prisma/client', () => ({
  PrismaClient: jest.fn(() => ({
    category: {
      findMany: mockCategoryFindMany,
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    product: {
      findMany: mockProductFindMany,
      count: mockProductCount,
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  })),
}));

const { default: app } = await import('../app.js');

describe('Health endpoint', () => {
  it('GET /health returns 200 with ok status', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('ecommerce-backend');
    expect(res.body.timestamp).toBeDefined();
  });
});

describe('CORS policy', () => {
  it('allows the production frontend origin', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'https://eyouth-31005141801597-shop-sphere-q.vercel.app');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin'])
      .toBe('https://eyouth-31005141801597-shop-sphere-q.vercel.app');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('does not allow an untrusted origin', async () => {
    const res = await request(app)
      .get('/health')
      .set('Origin', 'https://attacker.example');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('allows requests without an Origin header', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Categories API', () => {
  beforeEach(() => {
    mockCategoryFindMany.mockReset();
  });

  it('GET /api/categories returns all categories', async () => {
    const categories = [
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Clothing' },
    ];
    mockCategoryFindMany.mockResolvedValue(categories);

    const res = await request(app).get('/api/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(categories);
    expect(mockCategoryFindMany).toHaveBeenCalledTimes(1);
  });
});

describe('Products API', () => {
  beforeEach(() => {
    mockProductFindMany.mockReset();
    mockProductCount.mockReset();
  });

  it('GET /api/products returns all products without search', async () => {
    const products = [
      {
        id: 'p1',
        name: 'iPhone 16 Pro',
        price: 1199.99,
        description: 'Flagship phone',
        imageUrl: null,
        categoryId: '1',
        category: { id: '1', name: 'Electronics' },
        createdAt: new Date().toISOString(),
      },
      {
        id: 'p2',
        name: 'Leather Jacket',
        price: 249.99,
        description: 'Premium jacket',
        imageUrl: null,
        categoryId: '2',
        category: { id: '2', name: 'Clothing' },
        createdAt: new Date().toISOString(),
      },
    ];

    mockProductFindMany.mockResolvedValue(products);
    mockProductCount.mockResolvedValue(2);

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.pagination.total).toBe(2);
    expect(res.body.pagination.page).toBe(1);
  });

  it('GET /api/products filters by search query', async () => {
    const products = [
      {
        id: 'p1',
        name: 'iPhone 16 Pro',
        price: 1199.99,
        description: 'Flagship phone',
        imageUrl: null,
        categoryId: '1',
        category: { id: '1', name: 'Electronics' },
        createdAt: new Date().toISOString(),
      },
    ];

    mockProductFindMany.mockResolvedValue(products);
    mockProductCount.mockResolvedValue(1);

    const res = await request(app).get('/api/products?search=iPhone');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('iPhone 16 Pro');
    expect(mockProductFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { name: { contains: 'iPhone', mode: 'insensitive' } },
      })
    );
  });
});
