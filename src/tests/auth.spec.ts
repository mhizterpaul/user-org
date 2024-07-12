import request, {Response} from 'supertest';
import app from '../app';

describe('/auth/register endpoint', () => {

    const dummyUser: {[key: string]: string}= {
        userId: 'user3',
        firstName: 'User',
        lastName: 'Want',
        email: 'someemaidjl@gmail.com',
        password: 'password',
        phone: '1234567890'}

    it(`It Should Register User Successfully with Default organisation:`, async () => {

    //Ensure a user is registered successfully when no organisation details are provided

    //Verify the default organisation name is correctly generated (e.g., "John's organisation" for a user with the first name "John").
 
    //Check that the response contains the expected user details and access token. using /auth/login and /auth/register should return an accessToken

    const user1:Response = await request(app)
      .post('/auth/register')
      .send(dummyUser)
        .expect(201);
    
    const userData = {...user1.body.data};
    delete userData.accessToken;
    expect(user1.body.data.accessToken).toBeDefined();
    expect(userData).toBe(dummyUser);

    const org1Id = await app.get('/api/organisations')
      .set('Authorization', `Bearer ${user1.body.data.accessToken}`)
      .then((res: Response) => res.body.data.organisation[0].orgId);

    expect(org1Id).toEqual('User\'s organisation');


  });

  it('It Should Log the user in successfully', async () => {

    //Ensure a user is logged in successfully when a valid credential is provided and fails otherwise.

    //Check that the response contains the expected user details and access token.
    const user1: Response = await request(app)
        .post('/auth/login')
        .send({
            email: 'someemail@gmail.com',
            password: 'password'})
            .expect(200);
        
    const userData = {...user1.body.data};
    delete userData.accessToken;
    expect(user1.body.data.accessToken).toBeDefined();
    expect(userData).toBe(dummyUser);

  });

  it('It Should Fail If Required Fields Are Missing', async () => {
    /*Test cases for each required field (firstName, lastName, email, password) missing.

    Verify the response contains a status code of 422 and appropriate error messages. 
    It Should Fail if there’s Duplicate Email or UserID:

    Attempt to register two users with the same email.

    Verify the response contains a status code of 422 and appropriate error messages.*/
    for(const element of ['firstName', 'lastName', 'email', 'password']){

       
      const user = {...dummyUser}
      delete user[element];
      const user1: Response = await request(app)
        .post('/auth/register')
        .send(user)
        .expect(422);

      expect(user1.body.errors[0].message).toBeDefined();
    }
    
    const dummyUser2 = {
      userId: 'user4',
      firstName: 'User',
      lastName: 'Two',
      email: 'someemail@gmail.com',
      password: 'password',
      phone: '1234567890'}
      
    const user2:Response = await request(app)
      .post('/auth/register')
      .send(dummyUser2)
        .expect(422);


  });
});