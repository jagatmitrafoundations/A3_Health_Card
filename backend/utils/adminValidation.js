const validateAdminRegistration = (data) => {
  const errors = {};

  // Identity Validation
  if (!data.identity?.fullName || data.identity.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  }

  if (!data.identity?.employeeId || data.identity.employeeId.trim() === '') {
    errors.employeeId = 'Employee ID is required';
  }

  if (!data.identity?.adminRole || data.identity.adminRole.trim() === '') {
    errors.adminRole = 'Admin role/designation is required';
  }

  // Credentials Validation
  if (!data.credentials?.adminEmail || data.credentials.adminEmail.trim() === '') {
    errors.adminEmail = 'Official email address is required';
  } else {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailPattern.test(data.credentials.adminEmail)) {
      errors.adminEmail = 'Please enter a valid official email address';
    }
  }

  if (!data.credentials?.adminPhone || data.credentials.adminPhone.trim() === '') {
    errors.adminPhone = 'Contact phone number is required';
  } else if (!/^\d{10,15}$/.test(data.credentials.adminPhone)) {
    errors.adminPhone = 'Phone number must be 10-15 digits';
  }

  if (!data.credentials?.password || data.credentials.password.length < 12) {
    errors.password = 'Password must be at least 12 characters long for security';
  } else {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{12,}$/;
    if (!passwordPattern.test(data.credentials.password)) {
      errors.password = 'Password must include uppercase, lowercase, number, and special character';
    }
  }

  // Verification Validation
  if (!data.verification?.isEmailVerified) {
    errors.emailVerification = 'Please verify your email address';
  }

  if (!data.verification?.isPhoneVerified) {
    errors.phoneVerification = 'Please verify your phone number';
  }

  // Authorization Validation
  if (!data.authorization?.authorizationCode || data.authorization.authorizationCode.trim() === '') {
    errors.authorizationCode = 'Authorization code is required to create an admin account';
  } else if (data.authorization.authorizationCode.length < 10) {
    errors.authorizationCode = 'Please enter a valid authorization code';
  }

  if (!data.authorization?.agreedToPolicy) {
    errors.agreedToPolicy = 'You must agree to the Data Handling Policy';
  }

  // Two-Factor Authentication is mandatory for admins
  if (data.authorization?.twoFactorEnabled === false) {
    errors.twoFactorEnabled = 'Two-Factor Authentication is mandatory for admin accounts';
  }

  return errors;
};

module.exports = { validateAdminRegistration };