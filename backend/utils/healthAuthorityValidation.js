const validateHealthAuthorityRegistration = (data) => {
  const errors = {};

  // Authority Information Validation
  if (!data.authorityInfo?.authorityName || data.authorityInfo.authorityName.trim() === '') {
    errors.authorityName = 'Authority name is required';
  }

  if (!data.authorityInfo?.jurisdiction || data.authorityInfo.jurisdiction.trim() === '') {
    errors.jurisdiction = 'Jurisdiction is required';
  } else {
    const validJurisdictions = ['National', 'State', 'Local', 'Regional'];
    if (!validJurisdictions.includes(data.authorityInfo.jurisdiction)) {
      errors.jurisdiction = 'Invalid jurisdiction type';
    }
  }

  if (!data.authorityInfo?.authorityRegNumber || data.authorityInfo.authorityRegNumber.trim() === '') {
    errors.authorityRegNumber = 'Official registration number is required';
  }

  if (data.authorityInfo?.officialWebsite && data.authorityInfo.officialWebsite.trim() !== '') {
    const urlPattern = /^https?:\/\/.+/;
    if (!urlPattern.test(data.authorityInfo.officialWebsite)) {
      errors.officialWebsite = 'Please enter a valid website URL (must start with http:// or https://)';
    }
  }

  // Representative Validation
  if (!data.representative?.fullName || data.representative.fullName.trim() === '') {
    errors.repName = 'Representative full name is required';
  }

  if (!data.representative?.title || data.representative.title.trim() === '') {
    errors.repTitle = 'Representative title is required';
  }

  if (!data.representative?.govEmployeeId || data.representative.govEmployeeId.trim() === '') {
    errors.repGovId = 'Government Employee ID is required';
  }

  if (!data.representative?.email || data.representative.email.trim() === '') {
    errors.repEmail = 'Representative email is required';
  } else {
    const govEmailPattern = /\.gov(?:\.[a-z]{2})?$/;
    if (!govEmailPattern.test(data.representative.email)) {
      errors.repEmail = 'Email must be a valid government email address (.gov domain)';
    }
  }

  if (!data.representative?.phone || data.representative.phone.trim() === '') {
    errors.repPhone = 'Representative phone number is required';
  } else if (!/^\d{10,15}$/.test(data.representative.phone)) {
    errors.repPhone = 'Phone number must be 10-15 digits';
  }

  if (!data.representative?.password || data.representative.password.length < 12) {
    errors.password = 'Password must be at least 12 characters long';
  }

  // Verification Validation
  if (!data.verification?.isEmailVerified) {
    errors.emailVerification = 'Please verify the representative email address';
  }

  if (!data.verification?.isPhoneVerified) {
    errors.phoneVerification = 'Please verify the representative phone number';
  }

  // Compliance Validation
  if (!data.compliance?.dataUseAgreementAccepted) {
    errors.dataUseAgreement = 'You must agree to the Public Sector Data Use Policy';
  }

  if (!data.compliance?.twoFactorEnabled) {
    errors.twoFactorEnabled = 'Multi-Factor Authentication is mandatory for government accounts';
  }

  return errors;
};

module.exports = { validateHealthAuthorityRegistration };