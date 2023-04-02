module.exports = {
    // Dùng cho list
    mutipleMogooseToObject: function (mongooses) {
        return mongooses.map((mongoose) => mongoose.toObject());
    },
    //  Dùng cho một document
    mongooseToObject: function (mongoose) {
        return mongoose ? mongoose.toObject() : mongoose;
    },
};
