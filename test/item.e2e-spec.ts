import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ItemModule } from '../src/item/item.module';
import { ItemType } from '../src/common/types';
import exp from 'constants';

describe('Item Module (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'sqlite',
            database: 'db.sqlite',
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
        }),
        ItemModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/items (POST) should create an item', async () => {
    const createItemDto = {
      name: 'Test Item',
      type: ItemType.BREAD,
      price: 5.99,
      ageInDays: 2,
    };

    await request(app.getHttpServer())
      .post('/item')
      .send(createItemDto)
      .expect(201)
      .then((response) => {
        const { id, name, price, ageInDays } = response.body;
        expect(id).toBeDefined();
        expect(name).toBe(createItemDto.name);
        expect(price).toBe(createItemDto.price);
        expect(ageInDays).toBe(createItemDto.ageInDays);
      });
  });

  it('/items (GET) should retrieve all items', async () => {
    const response = await request(app.getHttpServer())
      .get('/item')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'Test Item',
          type: ItemType.BREAD,
          price: 5.99,
          ageInDays: 2,
        }),
      ]),
    );
  });

  it('/items/:id (GET) should retrieve an item', async () => {
    const createItemDto = {
      name: 'Test Item',
      type: ItemType.BREAD,
      price: 5.99,
      ageInDays: 2,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/item')
      .send(createItemDto)
      .expect(201);

    const itemId = createResponse.body.id;

    const response = await request(app.getHttpServer())
      .get(`/item/${itemId}`)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Test Item',
        type: ItemType.BREAD,
        price: 5.99,
        ageInDays: 2,
      }),
    );
  });

  it('/items/:id (PATCH) should update an item', async () => {
    const createItemDto = {
      name: 'Test Item',
      type: ItemType.BREAD,
      price: 5.99,
      ageInDays: 2,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/item')
      .send(createItemDto)
      .expect(201);

    const itemId = createResponse.body.id;

    const updateItemDto = {
      name: 'Updated Test Item',
      price: 10.99,
    };

    const response = await request(app.getHttpServer())
      .patch(`/item/${itemId}`)
      .send(updateItemDto)
      .expect(200);

    expect(response.body).toEqual(
      expect.objectContaining({
        name: 'Updated Test Item',
        price: 10.99,
      }),
    );
  });

  it('/items/:id (DELETE) should remove an item', async () => {
    const createItemDto = {
      name: 'Test Item',
      type: ItemType.BREAD,
      price: 5.99,
      ageInDays: 2,
    };

    const createResponse = await request(app.getHttpServer())
      .post('/item')
      .send(createItemDto)
      .expect(201);

    const itemId = createResponse.body.id;

    await request(app.getHttpServer()).delete(`/item/${itemId}`).expect(200);

    await request(app.getHttpServer()).get(`/item/${itemId}`).expect(404);
  });
});
