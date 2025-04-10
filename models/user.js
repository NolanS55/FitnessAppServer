const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  personal: {
    weight: { type: Number, required: true },
    height: { type: Number, required: true },
    age: { type: Number, required: true },
    gender: { type: Number, required: true },
    birthDate: { type: Date, required: true },
    location: { type: String, required: true },
    tarWeight: { type: Number, required: true },
    dayCal: { type: Number, required: true }
  },
  daily: {
    date: { type: Date },
    meals: [{
      amount: { type: Number },
      name: { type: String },
      cals: { type: Number },
      barcode: { type: String },
      nutrition: { type: Object } // Nutritional info could be structured further
    }]
  },
  calHistory: [{
    date: { type: Date },
    meals: [{
      amount: { type: Number },
      name: { type: String },
      cals: { type: Number },
      barcode: { type: String },
      nutrition: { type: Object }
    }]
  }],
  dailyEx: [{
    dateTime: { type: String },
    calsBurned: { type: Number },
    type: { type: String },
    time: { type: String },
    distance: { type: Number },
    route: [[Number]]
  }],
  exHistory: [{
    dateTime: { type: Date },
    calsBurned: { type: Number },
    type: { type: String },
    time: { type: String },
    distance: { type: Number },
    route: [[Number]]
  }]
});

module.exports = mongoose.model('User', userSchema);