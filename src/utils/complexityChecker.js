export const checkComplexity = (password) => {
  const requirements = [
    { label: 'Length', met: password.length >= 12 },
    { label: 'Uppercase', met: /[A-Z]/.test(password) },
    { label: 'Lowercase', met: /[a-z]/.test(password) },
    { label: 'Number', met: /[0-9]/.test(password) },
    { label: 'Special Character', met: /[!@#$%&*\-+()]/.test(password) },
  ];

  return {
    requirements,
    isAllMet: requirements.every((req) => req.met),
  };
};
