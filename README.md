# DEEL BACKEND TASK

  

💫 Welcome! 🎉


To start the application you need to do next steps:

1. npm install
2. npm run seed
3. npm start

The server will run on 3001 port.

After the application is running, you can reach the swagger using the link: http://localhost:3001/swagger

## Some technical details:

2. ***GET*** `/contracts` - Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated contracts.

I decided to add query parameters **limit** and **offset** to avoid huge responses. But if you going to use this method for unloading to other tools it would be more correct to implement streams. But I decided not to complicate my decision and chose **limit-offset**.

4. ***POST*** `/jobs/:job_id/pay` - Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the client's balance to the contractor balance.

I've used transaction for this method. But there could be the situation when somebody decides to pay two different contractors at almost same time. So probably user balance after this could become negative.

I see three ways to solve this problem:

1. We can add a migration and add a constraint so that the balance field is always non-negative. But I need some more time to implement this.
2. We can use 'SELECT FOR UPDATE' statement, but sqlite doesn't support this statement.
3. We can use semaphors and store it in some shared memory storage, as Redis. So only one client at one moment could paid for the job. But I also need more time for this case.
