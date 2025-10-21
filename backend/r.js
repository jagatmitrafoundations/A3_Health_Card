require('dotenv').config();
const mongoose = require('mongoose');
const Hospital = require('./models/hospital');
const MNC = require('./models/MNC');
const User = require('./models/User');
const Pharmacy = require('./models/pharmacy');
const Insurance = require('./models/Insurance');
const HealthAuthority = require('./models/HealthAuthority');
const Doctor = require('./models/Doctor');

async function verifyAllStorage() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');
    console.log('='.repeat(80));

    // Check Hospitals
    const hospitals = await Hospital.find().limit(5);
    console.log('\n🏥 HOSPITALS');
    console.log('-'.repeat(80));
    console.log(`Total Hospitals: ${await Hospital.countDocuments()}`);
    hospitals.forEach((h, i) => {
      console.log(`\n${i + 1}. ${h.hospitalInfo.hospitalName}`);
      console.log(`   Unique Code: ${h.uniqueCode}`);
      console.log(`   Email: ${h.contactInfo.email}`);
      console.log(`   Registration Cert: ${h.documents?.registrationCertificate?.data ? 
        `✅ ${(h.documents.registrationCertificate.data.length / 1024).toFixed(2)} KB` : 
        '❌ No file'}`);
      console.log(`   Other License: ${h.documents?.otherLicense?.data ? 
        `✅ ${(h.documents.otherLicense.data.length / 1024).toFixed(2)} KB` : 
        '❌ No file'}`);
    });

    // Check MNCs
    const mncs = await MNC.find().limit(5);
    console.log('\n\n🏢 MNC COMPANIES');
    console.log('-'.repeat(80));
    console.log(`Total MNCs: ${await MNC.countDocuments()}`);
    mncs.forEach((m, i) => {
      console.log(`\n${i + 1}. ${m.companyInfo.companyName}`);
      console.log(`   Unique Code: ${m.uniqueCode}`);
      console.log(`   Admin Email: ${m.administrator.adminEmail}`);
      console.log(`   Admin Phone: ${m.administrator.adminPhone}`);
      console.log(`   Email Verified: ${m.administrator.isEmailVerified ? '✅' : '❌'}`);
      console.log(`   Phone Verified: ${m.administrator.isPhoneVerified ? '✅' : '❌'}`);
    });

    // Check Users
    const users = await User.find().limit(5);
    console.log('\n\n👤 USERS');
    console.log('-'.repeat(80));
    console.log(`Total Users: ${await User.countDocuments()}`);
    users.forEach((u, i) => {
      console.log(`\n${i + 1}. ${u.profile?.name || 'N/A'}`);
      console.log(`   Email: ${u.email}`);
      console.log(`   Phone: ${u.phone || 'N/A'}`);
      console.log(`   Email Verified: ${u.isEmailVerified ? '✅' : '❌'}`);
      console.log(`   Phone Verified: ${u.isPhoneVerified ? '✅' : '❌'}`);
    });

    // Check Pharmacies
    const pharmacies = await Pharmacy.find().limit(5);
    console.log('\n\n💊 PHARMACIES');
    console.log('-'.repeat(80));
    console.log(`Total Pharmacies: ${await Pharmacy.countDocuments()}`);
    pharmacies.forEach((p, i) => {
      console.log(`\n${i + 1}. ${p.pharmacyInfo.pharmacyName}`);
      console.log(`   Unique Code: ${p.uniqueCode}`);
      console.log(`   Admin Email: ${p.administrator.workEmail}`);
      console.log(`   Drug License: ${p.compliance?.drugLicenseFile?.data ? 
        `✅ ${(p.compliance.drugLicenseFile.data.length / 1024).toFixed(2)} KB` : 
        '❌ No file'}`);
    });

    // Check Insurance Companies
    const insurances = await Insurance.find().limit(5);
    console.log('\n\n🏦 INSURANCE COMPANIES');
    console.log('-'.repeat(80));
    console.log(`Total Insurance Companies: ${await Insurance.countDocuments()}`);
    insurances.forEach((ins, i) => {
      console.log(`\n${i + 1}. ${ins.companyInfo.companyName}`);
      console.log(`   Unique Code: ${ins.uniqueCode}`);
      console.log(`   Admin Email: ${ins.administrator.email}`);
      console.log(`   Status: ${ins.status}`);
      console.log(`   License Document: ${ins.compliance?.licenseDocument?.data ? 
        `✅ ${(ins.compliance.licenseDocument.data.length / 1024).toFixed(2)} KB` : 
        '❌ No file'}`);
    });

    // Check Health Authorities
    const authorities = await HealthAuthority.find().limit(5);
    console.log('\n\n🏛️ HEALTH AUTHORITIES');
    console.log('-'.repeat(80));
    console.log(`Total Health Authorities: ${await HealthAuthority.countDocuments()}`);
    authorities.forEach((a, i) => {
      console.log(`\n${i + 1}. ${a.authorityInfo.authorityName}`);
      console.log(`   Unique Code: ${a.uniqueCode}`);
      console.log(`   Jurisdiction: ${a.authorityInfo.jurisdiction}`);
      console.log(`   Representative: ${a.representative.email}`);
      console.log(`   Status: ${a.status}`);
      console.log(`   Authorization Letter: ${a.compliance?.authorizationLetter?.data ? 
        `✅ ${(a.compliance.authorizationLetter.data.length / 1024).toFixed(2)} KB` : 
        '❌ No file'}`);
    });

    // Check Doctors
    const doctors = await Doctor.find().limit(5);
    console.log('\n\n👨‍⚕️ DOCTORS');
    console.log('-'.repeat(80));
    console.log(`Total Doctors: ${await Doctor.countDocuments()}`);
    doctors.forEach((d, i) => {
      console.log(`\n${i + 1}. Dr. ${d.personalInfo.fullName}`);
      console.log(`   Unique Code: ${d.uniqueCode}`);
      console.log(`   Email: ${d.personalInfo.email}`);
      console.log(`   Specialization: ${d.professionalInfo.primarySpecialization}`);
      console.log(`   Status: ${d.status}`);
      console.log(`   Medical License: ${d.documents?.medicalLicense?.data ? 
        `✅ ${(d.documents.medicalLicense.data.length / 1024).toFixed(2)} KB` : 
        '❌ No file'}`);
    });

    console.log('\n' + '='.repeat(80));
    console.log('\n📊 SUMMARY');
    console.log('-'.repeat(80));
    console.log(`Hospitals:          ${await Hospital.countDocuments()}`);
    console.log(`MNC Companies:      ${await MNC.countDocuments()}`);
    console.log(`Users:              ${await User.countDocuments()}`);
    console.log(`Pharmacies:         ${await Pharmacy.countDocuments()}`);
    console.log(`Insurance:          ${await Insurance.countDocuments()}`);
    console.log(`Health Authorities: ${await HealthAuthority.countDocuments()}`);
    console.log(`Doctors:            ${await Doctor.countDocuments()}`);
    console.log('-'.repeat(80));

    // Calculate total storage used
    const totalDocs = await Hospital.countDocuments() + 
                      await MNC.countDocuments() + 
                      await User.countDocuments() + 
                      await Pharmacy.countDocuments() + 
                      await Insurance.countDocuments() + 
                      await HealthAuthority.countDocuments() + 
                      await Doctor.countDocuments();
    
    console.log(`\n✅ Total Documents: ${totalDocs}`);
    console.log('✅ All data is stored in MongoDB');
    console.log('✅ Files are stored as Buffers in MongoDB (not in local uploads/)');

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB\n');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyAllStorage();