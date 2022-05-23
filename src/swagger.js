module.exports = {
  swagger: '2.0',
  info: {
    title: 'Deel Test API',
    version: '1.0.0',
  },
  consumes: [
    'application/json',
  ],
  produces: [
    'application/json',
  ],
  paths: {
    '/contracts/{id}': {
      get: {
        operationId: 'getContractById',
        summary: 'Return the contract only if it belongs to the profile calling',
        tags: ['contracts'],
        parameters: [{
          in: 'path',
          name: 'id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: true,
          description: 'Numeric ID of contract to get. Must be positive',
        }, {
          in: 'header',
          name: 'profile_id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: true,
          description: "User's id",
        }],
        produces: [
          'application/json',
        ],
        responses: {
          200: {
            description: '200 response',
            examples: {
              'application/json': '{}',
            },
          },
        },
      },
    },
    '/contracts': {
      get: {
        operationId: 'getContractsForSingleUser',
        summary: 'Returns a list of contracts belonging to a user (client or contractor)',
        description: 'The list only contains non terminated contracts',
        tags: ['contracts'],
        parameters: [{
          in: 'qeury',
          name: 'limit',
          schema: {
            example: 1000,
            type: 'number',
          },
          required: false,
          description: 'Maximum amount of contracts in answer',
        }, {
          in: 'qeury',
          name: 'offset',
          schema: {
            example: 0,
            type: 'number',
          },
          required: false,
          description: 'Amount of contracts that should be skipped in answer',
        }, {
          in: 'header',
          name: 'profile_id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: true,
          description: "User's id",
        }],
        produces: [
          'application/json',
        ],
        responses: {
          200: {
            description: '200 response',
            examples: {
              'application/json': '{}',
            },
          },
        },
      },
    },
    '/jobs/unpaid': {
      get: {
        operationId: 'getUnpaidJobs',
        summary: 'Get all unpaid jobs for a user',
        description: 'Get all unpaid jobs for a user (<b>either</b> a client or contractor), for <b>active contracts only</b>',
        tags: ['jobs'],
        parameters: [{
          in: 'qeury',
          name: 'limit',
          schema: {
            example: 1000,
            type: 'number',
          },
          required: false,
          description: 'Maximum amount of contracts in answer',
        }, {
          in: 'qeury',
          name: 'offset',
          schema: {
            example: 0,
            type: 'number',
          },
          required: false,
          description: 'Amount of contracts that should be skipped in answer',
        }, {
          in: 'header',
          name: 'profile_id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: true,
          description: "User's id",
        }],
        produces: [
          'application/json',
        ],
        responses: {
          200: {
            description: '200 response',
            examples: {
              'application/json': '{}',
            },
          },
        },
      },
    },
    '/jobs/{job_id}/pay': {
      post: {
        operationId: 'payForJob',
        summary: 'Pay for a job',
        description: 'Pay for a job, a client can only pay if his balance greate or equal the amount to pay.\n'
          + 'The amount moves from the client\'s balance to the contractor balance',
        tags: ['jobs'],
        parameters: [{
          in: 'path',
          name: 'job_id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: false,
          description: 'Numeric id of the job',
        }, {
          in: 'header',
          name: 'profile_id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: true,
          description: "User's id",
        }],
        produces: [
          'application/json',
        ],
        responses: {
          202: {
            description: 'Payment Accepted',
            examples: {
              'application/json': '{}',
            },
          },
          409: {
            description: 'Payment can\'t be proceeded',
            examples: {
              'application/text': 'The job has already been paid',
            },
          },
        },
      },
    },
    '/balances/deposit/{amount}': {
      post: {
        operationId: 'depositToBalance',
        summary: 'Deposits money into the the the balance of a client',
        description: 'Deposits money into the the the balance of a client.\n'
          + 'A client can\'t deposit more than 25% his total of jobs to pay. (at the deposit moment)',
        tags: ['balance'],
        parameters: [{
          in: 'path',
          name: 'amount',
          schema: {
            example: 10,
            type: 'number',
          },
          required: false,
          description: 'Amount of money. Must be positive',
        }, {
          in: 'header',
          name: 'profile_id',
          schema: {
            example: 1,
            type: 'number',
          },
          required: true,
          description: "User's id",
        }],
        produces: [
          'application/json',
        ],
        responses: {
          202: {
            description: 'Deposit Accepted',
            examples: {
              'application/json': '{}',
            },
          },
          409: {
            description: 'Deposit can\'t be proceeded',
            examples: {
              'application/text': 'You can\'t deposit more than 25% total of your jobs to pay',
            },
          },
        },
      },
    },
    '/admin/best-profession': {
      get: {
        operationId: 'adminGetBestProfession',
        summary: 'Returns the profession that earned the most money',
        description: 'Returns the profession that earned the most money '
          + 'for any contactor that worked in the query time range',
        tags: ['admin'],
        parameters: [{
          in: 'query',
          name: 'start',
          schema: {
            type: 'string',
            format: 'date',
            example: '2019-10-10',
          },
          required: false,
          description: 'Start date. Must be in format YYYY-MM-DD',
        }, {
          in: 'query',
          name: 'end',
          schema: {
            type: 'string',
            format: 'date',
            example: '2023-10-10',
          },
          required: false,
          description: 'End date. Must be in format YYYY-MM-DD',
        }],
        produces: [
          'application/json',
        ],
        responses: {
          200: {
            description: 'Deposit Accepted',
            examples: 'programmer',
          },
          409: {
            description: 'Smth went wrong',
            examples: {
              'application/text': 'Maybe wrong period of time',
            },
          },
        },
      },
    },
    '/admin/best-clients': {
      get: {
        operationId: 'adminGetBestProfession',
        summary: 'Returns the profession that earned the most money',
        description: 'Returns the profession that earned the most money '
          + 'for any contactor that worked in the query time range',
        tags: ['admin'],
        parameters: [{
          in: 'query',
          name: 'start',
          schema: {
            type: 'string',
            format: 'date',
            example: '2019-10-10',
          },
          required: false,
          description: 'Start date. Must be in format YYYY-MM-DD',
        }, {
          in: 'query',
          name: 'end',
          schema: {
            type: 'string',
            format: 'date',
            example: '2023-10-10',
          },
          required: false,
          description: 'End date. Must be in format YYYY-MM-DD',
        }, {
          in: 'query',
          name: 'limit',
          schema: {
            example: 2,
            default: 2,
            type: 'number',
          },
          required: false,
          description: 'Limit the clients in answer',
        }],
        produces: [
          'application/json',
        ],
        responses: {
          200: {
            examples: {
              'application/json': [{
                id: 4,
                fullName: 'Ash Kethcum',
                paid: 2020,
              },
              {
                id: 1,
                fullName: 'Harry Potter',
                paid: 442,
              }],
            },
          },
          409: {
            description: 'Smth went wrong',
            examples: {
              'application/text': 'Maybe wrong period of time',
            },
          },
        },
      },
    },
  },
};
