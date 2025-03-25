import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    
    status: {
        type: String,
        enum: ['Pending', 'Completed', 'inProgress'],
        default: 'Pending'
    },
    dueDate: Date,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    
},{timestamps:true})

const Task = mongoose.model('Task', taskSchema);
export default Task;