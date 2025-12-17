import express from "express";
import {
    createAppointment,
    getAppointments,
    deleteAppointment
} from "../controller/appointment.controller.js";

const router = express.Router();

router.route("/")
    .post(createAppointment)
    .get(getAppointments);

router.route("/:id")
    .delete(deleteAppointment);

export default router;
