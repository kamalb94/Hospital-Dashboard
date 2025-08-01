const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const sequelize = require('./db')
const port = process.env.PORT || 4580;
const userRoutes = require('./routes/userRoutes')
const patientRoutes = require('./routes/patientRoutes')
const doctorRoutes = require('./routes/doctorRoutes')
const appointmentRoutes = require('./routes/appointmentRoutes')
const roomRoutes = require('./routes/roomRoutes')
const bedRoutes = require('./routes/bedRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
dotenv.config();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/room', roomRoutes);
app.use('/api/v1/bed', bedRoutes);
app.use('/api/v1/analytics', analyticsRoutes);


// app.get('/ping', (req, res) => {
//   console.log("/ping route hit");
//   res.send("pong");
// });


const startServer = async () => {
    try{
        await sequelize.authenticate();
        console.log('database connected successfully!');

        app.listen(port, (req, res) => {
          console.log(`Server is running on port ${port}`);
        });

    }catch(err){
        console.log(err);
    }
}

startServer();