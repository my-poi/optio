export const errors: { [key: number]: { code: number, error: string } } = {};
errors[1] = { code: 1, error: 'Nie podano danych uwierzytelniających.' };
errors[2] = { code: 2, error: 'Nie podano tokena.' };
errors[3] = { code: 3, error: 'Nie udało się uwierzytelnić tokena.' };
