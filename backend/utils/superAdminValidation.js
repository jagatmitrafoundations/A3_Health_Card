const validateSuperAdminRegistration = (data) => {
  const errors = {};

  // Identity Validation
  if (!data.identity?.fullName || data.identity.fullName.trim() === '') {
    errors.fullName = 'Full name is required';
  }

  if (!data.identity?.employeeId || data.identity.employeeId.trim() === '') {
    errors.employeeId = 'Employee ID is required';
  }

  if (!data.identity?.officialTitle || data.identity.officialTitle.trim() === '') {
    errors.officialTitle = 'Official title/designation is required';
  }

  // Credentials Validation
  if (!data.credentials?.adminEmail || data.credentials.adminEmail.trim() === '') {
    errors.adminEmail = 'Official corporate email is required';
  } else {
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    if (!emailPattern.test(data.credentials.adminEmail)) {
      errors.adminEmail = 'Please enter a valid corporate email address';
    }
  }

  if (!data.credentials?.adminPhone || data.credentials.adminPhone.trim() === '') {
    errors.adminPhone = 'Secure contact phone is required';
  } else if (!/^\d{10,15}$/.test(data.credentials.adminPhone)) {
    errors.adminPhone = 'Phone number must be 10-15 digits';
  }

  if (!data.credentials?.password || data.credentials.password.length < 14) {
    errors.password = 'Password must be at least 14 characters long for Super Admin accounts';
  } else {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{14,}$/;
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
  if (!data.authorization?.masterKey || data.authorization.masterKey.trim() === '') {
    errors.masterKey = 'Master Authorization Key is required to create a Super Admin account';
  } else if (data.authorization.masterKey.length < 16) {
    errors.masterKey = 'Please enter a valid Master Authorization Key';
  }

  if (!data.authorization?.fiduciaryAcknowledgment) {
    errors.fiduciaryAcknowledgment = 'You must acknowledge your fiduciary duty';
  }

  // Two-Factor Authentication is mandatory for Super Admin
  if (data.authorization?.twoFactorEnabled === false) {
    errors.twoFactorEnabled = 'Multi-Factor Authentication is mandatory for Super Admin accounts';
  }

  return errors;
};

module.exports = { validateSuperAdminRegistration };

