import Appointment from "../models/appointment.model.js";

/**
 * @desc Create new appointment
 * @route POST /api/appointments
 * @access Private
 */
export const createAppointment = async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { title, doctor, date, time, type } = req.body;

        if (!title || !doctor || !date || !time) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        const appointment = await Appointment.create({
            clerkUserId,
            title,
            doctor,
            date,
            time,
            type: type || "In-Person",
            status: "Pending"
        });

        return res.status(201).json({
            success: true,
            message: "Appointment scheduled successfully",
            data: appointment
        });
    } catch (error) {
        console.error("Create Appointment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to schedule appointment"
        });
    }
};

/**
 * @desc Get all appointments for user
 * @route GET /api/appointments
 * @access Private
 */
export const getAppointments = async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;

        const appointments = await Appointment.find({ clerkUserId }).sort({ date: 1 });

        return res.status(200).json({
            success: true,
            count: appointments.length,
            data: appointments
        });
    } catch (error) {
        console.error("Get Appointments Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch appointments"
        });
    }
};

/**
 * @desc Delete appointment
 * @route DELETE /api/appointments/:id
 * @access Private
 */
export const deleteAppointment = async (req, res) => {
    try {
        const clerkUserId = req.auth.userId;
        const { id } = req.params;

        const appointment = await Appointment.findOneAndDelete({
            _id: id,
            clerkUserId
        });

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found or unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Appointment cancelled successfully"
        });
    } catch (error) {
        console.error("Delete Appointment Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to cancel appointment"
        });
    }
};
