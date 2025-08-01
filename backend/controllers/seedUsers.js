const { faker } = require('@faker-js/faker');
const sequelize = require('../db');
const User = require('../models/userModel');
const Patient = require('../models/patientModel');
const { Doctor, Appointment, Bed, Room } = require('../models');

const ROLES = ['admin', 'doctor', 'nurse', 'lab', 'receptionist', 'patient'];
const SPECIALIZATIONS = [
  'Cardiology',
  'Neurology',
  'Orthopedics',
  'Dermatology',
  'Pediatrics',
  'Radiology'
];

// Ensure valid 10-digit number
const generatePhone = () => {
  return '9' + faker.string.numeric(9); // Ensures it starts with 9 and has 10 digits
};

const generateUser = (role) => {
  const gender = faker.helpers.arrayElement(['Male', 'Female', 'Other']);
  const fullName = faker.person.fullName({ sex: gender.toLowerCase() });
  const email = faker.internet.email({ firstName: fullName.split(' ')[0] });
  const phone = generatePhone();

  return {
    fullName,
    email,
    password: faker.internet.password({ length: 10 }),
    phone,
    gender,
    dob: faker.date.birthdate({ min: 18, max: 65, mode: 'age' }),
    address: faker.location.streetAddress(),
    bloodGroup: faker.helpers.arrayElement(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-']),
    role,
    specialization: role === 'doctor' ? faker.helpers.arrayElement(SPECIALIZATIONS) : null,
    profileImage: faker.image.avatar(),
    isActive: true,
  };
};


const seedUsers = async (req, res) => {
  try {
    await sequelize.sync({ force: false });

    const users = [];

    for (let i = 0; i < 150; i++) {
      users.push(generateUser('patient'));
    }

    const remainingRoles = ['admin', 'doctor', 'doctor', 'nurse', 'nurse', 'lab', 'receptionist'];
    for (let i = 0; i < 50; i++) {
      const role = faker.helpers.arrayElement(remainingRoles);
      users.push(generateUser(role));
    }

    await User.bulkCreate(users, { validate: true });

    console.log('200 users seeded successfully');
    if (req && res) {
      return res.status(200).json({ message: '200 users seeded successfully' });
    }
  } catch (error) {
    console.error('Failed to seed users:', error);
    if (req && res) {
      return res.status(500).json({ error: error.message });
    }
  }
};


const diseasesList = [
  'Hypertension',
  'Diabetes',
  'Asthma',
  'Arthritis',
  'Migraine',
  'Allergy - Dust',
  'Thyroid',
  'Acne',
  'Back Pain',
  'Depression',
];

// Function to generate random comma-separated diseases
const generateRandomDiseases = () => {
  const count = Math.floor(Math.random() * 3) + 1;
  return faker.helpers.arrayElements(diseasesList, count).join(', ');
};

// Controller function to seed 150 patients
const seedPatients = async (req, res) => {
  try {
    await sequelize.sync();

    const users = await User.findAll({
      where: { role: 'patient' },
      limit: 150,
      order: sequelize.random(),
    });

    const patients = users.map(user => ({
      userId: user.id,
      medicalHistory: faker.lorem.paragraph(),
      diseases: generateRandomDiseases(),
      emergencyContact: faker.phone.number('98########'),
    }));

    await Patient.bulkCreate(patients);

    return res.status(200).json({ message: '150 patients seeded successfully' });
  } catch (err) {
    console.error('Error seeding patients:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const seedDoctors = async (req, res) => {
  try {
    await sequelize.sync();

    // Fetch 50 random users with role = doctor
    const users = await User.findAll({
      where: { role: 'doctor' },
      limit: 50,
      order: sequelize.random(),
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users with role doctor found' });
    }

    const doctors = users.map(user => ({
      userId: user.id,
      licenseNumber: faker.string.uuid(),
      specialization: faker.person.jobType(),
      experience: faker.number.int({ min: 1, max: 40 }),
    }));

    const inserted = await Doctor.bulkCreate(doctors);

    // Optional check from DB to verify actual rows
    const doctorCount = await Doctor.count({
      where: {
        userId: users.map(u => u.id),
      },
    });

    return res.status(200).json({
      message: `${inserted.length} doctors seeded successfully`,
      verifiedDoctorCount: doctorCount,
    });
  } catch (err) {
    console.error('Error seeding doctors:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const diseaseAppointmentReasons = {
  Hypertension: [
    "Follow-up for blood pressure management",
    "Routine check-up for hypertension",
    "Blood pressure monitoring and medication review"
  ],
  Diabetes: [
    "Consultation for blood sugar levels",
    "Follow-up for diabetes management",
    "Diabetes check-up and medication review"
  ],
  Asthma: [
    "Asthma check-up",
    "Follow-up for asthma management",
    "Consultation for asthma-related symptoms"
  ],
  Arthritis: [
    "Consultation for joint pain",
    "Follow-up on arthritis treatment",
    "Routine check-up for arthritis management"
  ],
  Migraine: [
    "Consultation for migraine treatment",
    "Follow-up for migraine management",
    "Routine check-up for migraine prevention"
  ],
  "Allergy - Dust": [
    "Consultation for dust allergy",
    "Follow-up for allergy treatment",
    "Allergy test and medication review"
  ],
  Thyroid: [
    "Thyroid function test consultation",
    "Follow-up on thyroid medication",
    "Consultation for thyroid disease management"
  ],
  Acne: [
    "Consultation for acne treatment",
    "Follow-up for acne management",
    "Routine check-up for acne treatment"
  ],
  "Back Pain": [
    "Consultation for back pain",
    "Follow-up on back pain treatment",
    "Back pain physical therapy consultation"
  ],
  Depression: [
    "Consultation for depression treatment",
    "Follow-up for mental health management",
    "Psychiatric consultation for depression"
  ]
};

const seedAppointments = async (req, res) => {
  try {
    await sequelize.sync();

    const patients = await Patient.findAll();
    const doctors = await Doctor.findAll();

    const appointments = [];

    for (let i = 0; i < 150; i++) {
      const patient = patients[Math.floor(Math.random() * patients.length)];
      const doctor = doctors[Math.floor(Math.random() * doctors.length)];

      const appointmentDate = faker.date.future(); // Random future date

      const reason = `${faker.helpers.arrayElement(diseasesList)} checkup`; // Add disease from the list

      const appointment = {
        patientId: patient.id,
        doctorId: doctor.id,
        appointmentDate: appointmentDate,
        reason: reason,
      };

      appointments.push(appointment);
    }

    await Appointment.bulkCreate(appointments);

    return res.status(200).json({
      message: `${appointments.length} appointments seeded successfully`,
    });
  } catch (err) {
    console.error('Error seeding appointments:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const seedRooms = async (req, res) => {
  const rooms = [];

  const roomConfigs = [
    { type: 'General', count: 5, bedsPerRoom: 6 },
    { type: 'Semi-Private', count: 5, bedsPerRoom: 4 },
    { type: 'Private', count: 10, bedsPerRoom: 1 },
    { type: 'ICU', count: 3, bedsPerRoom: 5 },
    { type: 'Emergency', count: 2, bedsPerRoom: 5 },
  ];

  try {
    for (const config of roomConfigs) {
      for (let i = 0; i < config.count; i++) {
        const roomData = {
          roomNumber: faker.string.alphanumeric(5).toUpperCase(),
          type: config.type,
          totalBeds: config.bedsPerRoom,
          floor: faker.number.int({ min: 1, max: 5 }),
          notes: faker.lorem.sentence(),
        };

        const room = await Room.create(roomData);
        rooms.push(room);
      }
    }

    return res.status(201).json({
      success: true,
      message: `${rooms.length} rooms created successfully.`,
      createdRoomsCount: rooms.length,
    });

  } catch (error) {
    console.error('Error seeding rooms:', error);
    return res.status(500).json({
      success: false,
      message: 'An error occurred while seeding rooms.',
      error: error.message,
    });
  }
};



const seedBeds = async (req, res) => {
  try {
    const rooms = await Room.findAll();
    const beds = [];

    for (const room of rooms) {
      const bedPromises = [];

      for (let i = 0; i < room.totalBeds; i++) {
        bedPromises.push(
          Bed.create({
            bedNumber: `${room.roomNumber}-${i + 1}`,
            status: 'Available',
            pricePerDay: faker.number.float({ min: 500, max: 3000 }),
            roomId: room.id, // 🔥 Associate bed with room
          })
        );
      }

      const createdBeds = await Promise.all(bedPromises);
      beds.push(...createdBeds);

      console.log(`Created ${createdBeds.length} beds for room ${room.roomNumber} (${room.type})`);
    }

    console.log(`✅ ${beds.length} total beds created and assigned to rooms.`);
    return res.status(200).json({ message: `${beds.length} beds created and assigned to rooms.` });
  } catch (err) {
    console.error('❌ Error seeding beds:', err);
    return res.status(500).json({ error: 'Error seeding beds' });
  }
};


const assignRoomsAndBeds = async (req, res) => {
  try {
    const unassignedPatients = await Patient.findAll({
      where: {
        roomId: null,
        bedId: null,
      },
    });

    // Fetch available beds with associated room type
    const allAvailableBeds = await Bed.findAll({
      where: { status: 'Available' },
      include: {
        model: Room,
        as: 'room',
        required: true,
      },
    });

    // Categorize available beds by room type
    const categorizedBeds = {
      ICU: [],
      Emergency: [],
      General: [],
    };

    for (const bed of allAvailableBeds) {
      const roomType = bed.room?.type;

      if (roomType === 'ICU') {
        categorizedBeds.ICU.push(bed);
      } else if (roomType === 'Emergency') {
        categorizedBeds.Emergency.push(bed);
      } else if (['General', 'Private', 'Semi-Private'].includes(roomType)) {
        categorizedBeds.General.push(bed);
      }
    }

    let assignedCount = 0;

    for (const patient of unassignedPatients) {
      let bedToAssign = null;

      // Try to assign in priority order: ICU > Emergency > General
      if (categorizedBeds.ICU.length > 0) {
        bedToAssign = categorizedBeds.ICU.shift();
      } else if (categorizedBeds.Emergency.length > 0) {
        bedToAssign = categorizedBeds.Emergency.shift();
      } else if (categorizedBeds.General.length > 0) {
        bedToAssign = categorizedBeds.General.shift();
      }

      if (bedToAssign) {
        await patient.update({
          roomId: bedToAssign.roomId,
          bedId: bedToAssign.id,
        });

        await bedToAssign.update({ status: 'Occupied' });
        assignedCount++;
      } else {
        break; // No more beds available
      }
    }

    res.status(200).json({
      message: `Finished assigning ${assignedCount} beds.`,
      totalPatients: unassignedPatients.length,
      availableBeds: {
        ICU: categorizedBeds.ICU.length,
        Emergency: categorizedBeds.Emergency.length,
        General: categorizedBeds.General.length,
      },
    });
  } catch (error) {
    console.error('Error assigning beds:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports = { seedUsers, seedPatients, seedDoctors, seedAppointments, seedRooms, seedBeds, assignRoomsAndBeds };
