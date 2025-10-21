require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');



//const verifyFirebase = require('./middleware/verifyFirebase');

const authRoutes = require('./routes/auth');
const superAdminAuthRoutes = require('./routes/authSuperAdmin');
const authUnified = require('./routes/authUnified');
const insuranceAuthRoutes = require('./routes/authInsurance');
const mncAuthRoutes = require('./routes/authMNC');
const authSignupRoutes = require('./routes/authSignup');
const medicalRoutes = require('./routes/medical');
const hospitalAuthRoutes = require('./routes/auth.hospital');
const pharmacyRoutes = require('./routes/auth.pharmacy');
const adminAuthRoutes = require('./routes/authAdmin');
const healthAuthorityRoutes = require('./routes/authHealthAuthority');
const doctorAuthRoutes = require('./routes/authDoctor'); // Add this line
const profileRoutes = require('./routes/profile'); // <-- ADD THIS LINE

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL, // Your future Netlify URL
  'http://localhost:5173'    // Your local Vite frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
};

app.use(cors(corsOptions)); // Use the new corsOptions


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use('/uploads', express.static(path.join(__dirname, process.env.UPLOAD_DIR || 'uploads')));

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Mongo connected'))
  .catch(err => console.error('Mongo connect error', err));

app.use('/api/auth', authRoutes);
app.use('/api/auth/mnc', mncAuthRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api/signup', authSignupRoutes);
app.use('/api/auth/healthauthority', healthAuthorityRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/auth/superadmin', superAdminAuthRoutes);
app.use('/api/auth/hospital', hospitalAuthRoutes);
app.use('/api/auth/pharmacy', pharmacyRoutes);
app.use('/api/auth/doctor', doctorAuthRoutes); 
app.use('/api/auth', authUnified);
app.use('/api/auth/insurance', insuranceAuthRoutes);
app.use('/api/profile', profileRoutes); // <-- ADD THIS LINE

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));

//git clone --no-checkout https://github.com/jagatmitrafoundations/JagatMitra-Care.git
//cd JagatMitra-Care
//git sparse-checkout set frontend