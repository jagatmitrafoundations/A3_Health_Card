const validateInsuranceRegistration = (data) => {
  const errors = {};

  // Company Information Validation
  if (!data.companyInfo?.companyName || data.companyInfo.companyName.trim() === '') {
    errors.companyName = 'Company name is required';
  }

  if (!data.companyInfo?.irdaiNumber || data.companyInfo.irdaiNumber.trim() === '') {
    errors.irdaiNumber = 'IRDAI Registration Number is required';
  }

  if (!data.companyInfo?.cin || data.companyInfo.cin.trim() === '') {
    errors.cin = 'Corporate Identification Number (CIN) is required';
  } else if (data.companyInfo.cin.length !== 21) {
    errors.cin = 'CIN must be exactly 21 characters';
  }

  if (data.companyInfo?.officialWebsite && data.companyInfo.officialWebsite.trim() !== '') {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(data.companyInfo.officialWebsite)) {
      errors.officialWebsite = 'Please enter a valid website URL';
    }
  }

  // Administrator Validation
  if (!data.administrator?.fullName || data.administrator.fullName.trim() === '') {
    errors.adminName = 'Administrator full name is required';
  }

  if (!data.administrator?.email || data.administrator.email.trim() === '') {
    errors.adminEmail = 'Administrator email is required';
  } else {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(data.administrator.email)) {
      errors.adminEmail = 'Please enter a valid corporate email address';
    }
  }

  if (!data.administrator?.phone || data.administrator.phone.trim() === '') {
    errors.adminPhone = 'Administrator phone number is required';
  } else if (!/^\d{10,15}$/.test(data.administrator.phone)) {
    errors.adminPhone = 'Phone number must be 10-15 digits';
  }

  if (!data.administrator?.password || data.administrator.password.length < 12) {
    errors.password = 'Password must be at least 12 characters long';
  }

  // Verification Validation
  if (!data.verification?.isEmailVerified) {
    errors.emailVerification = 'Please verify the administrator email address';
  }

  if (!data.verification?.isPhoneVerified) {
    errors.phoneVerification = 'Please verify the administrator phone number';
  }

  // Compliance Validation
  if (!data.compliance?.baaAgreementAccepted) {
    errors.baaAgreement = 'You must agree to the Business Associate Agreement';
  }

  return errors;
};

module.exports = { validateInsuranceRegistration };