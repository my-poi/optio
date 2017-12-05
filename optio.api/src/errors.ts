export const errors: { [key: number]: { code: number, error: string } } = {};
errors[1] = { code: 1, error: 'No credentials provided.' };
errors[2] = { code: 2, error: 'No token provided.' };
errors[3] = { code: 3, error: 'Failed to authenticate token.' };
