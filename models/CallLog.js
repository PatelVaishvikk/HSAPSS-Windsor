import mongoose from 'mongoose';

const callLogSchema = new mongoose.Schema(
    {
        student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, required: true },
        notes: { type: String, required: false },
        needs_follow_up: { type: Boolean, default: false },
        follow_up_date: { type: Date, required: false },
    },
    { timestamps: true }
);

const CallLog = mongoose.models.CallLog || mongoose.model('CallLog', callLogSchema);

export default CallLog;
