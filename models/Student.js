import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    {
        student_index: { type: Number, required: true, unique: true },
        first_name: { type: String, required: true },
        last_name: { type: String, required: true },
        mail_id: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, default: 'N/A' },
    },
    { timestamps: true }
);

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

export default Student;
