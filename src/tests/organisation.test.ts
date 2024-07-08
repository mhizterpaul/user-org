import request, {Response} from 'supertest';
import app from '../app'; // replace with your actual import
import jwt from 'jsonwebtoken'

describe('Organization Data Access', () => {
  let user1:Response, user2:Response, org1Id: string;

  beforeAll(async () => {
    user1 = await request(app)
      .post('/auth/register')
      .send({
        userId: 'user1',
        firstName: 'User',
        lastName: 'One',
        email: 'someemail@gmail.com',
        password: 'password',
        phone: '1234567890'})
        .expect(201);
    user2 = await request(app)
      .post('/auth/register')
      .send({
        userId: 'user2',
        firstName: 'User',
        lastName: 'Two',
        email: 'anotheremail@yahoo.com',
        password: 'password',
        phone: '1234567890'})
        .expect(201);
    org1Id = await app.get('/api/organisations')
      .set('Authorization', `Bearer ${user1.body.data.accessToken}`)
      .then((res: Response) => res.body.data.organisation[0].orgId);
  });
  it('should not allow a user to access data from organizations they do not have access to', async () => {

    // Each user should have a default organization, we're assuming the organization id is in the user object
    const org2Id = await app.get('/api/organisations')
    .set('Authorization', `Bearer ${user2.body.data.accessToken}`)
    .then((res: Response) => res.body.data.organisation[0].orgId);

    // Try to access the second organization using the token of the first user
    const res = await request(app)
      .get(`/api/organisations/${org2Id}`)
      .set('Authorization', `Bearer ${user1.body.data.accessToken}`);

    // We expect a 403 Forbidden response
    expect(res.statusCode).toEqual(403);
  });
  it('should return 401 if the token has expired', async () => {
  // Generate an expired token
  const expiredToken = jwt.sign({ id: user1.body.data.user.userId }, process.env.JWTSECRET||'secret', { expiresIn: '-1h' });

  // Try to access the organization with the expired token
  const res = await request(app)
    .get(`/organisations/${org1Id}`)
    .set('Authorization', `Bearer ${expiredToken}`);
  expect(res.statusCode).toEqual(401);
});
});