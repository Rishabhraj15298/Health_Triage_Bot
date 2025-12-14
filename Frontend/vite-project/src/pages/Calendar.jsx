import { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, X } from "lucide-react";

export default function Calendar() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      title: "Annual Checkup",
      doctor: "Dr. Sarah Johnson",
      date: "2024-12-20",
      time: "10:00 AM",
      type: "In-Person",
      status: "Confirmed",
    },
    {
      id: 2,
      title: "Follow-up Consultation",
      doctor: "Dr. Michael Chen",
      date: "2024-12-25",
      time: "2:30 PM",
      type: "Tele-Consult",
      status: "Pending",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    title: "",
    doctor: "",
    date: "",
    time: "",
    type: "In-Person",
  });

  const handleAddAppointment = () => {
    if (
      newAppointment.title &&
      newAppointment.doctor &&
      newAppointment.date &&
      newAppointment.time
    ) {
      setAppointments([
        ...appointments,
        {
          ...newAppointment,
          id: appointments.length + 1,
          status: "Pending",
        },
      ]);
      setNewAppointment({
        title: "",
        doctor: "",
        date: "",
        time: "",
        type: "In-Person",
      });
      setShowAddModal(false);
    }
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter((apt) => apt.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 border-green-500/30 text-green-400";
      case "Pending":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400";
      case "Cancelled":
        return "bg-red-500/10 border-red-500/30 text-red-400";
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400";
    }
  };

  const getTypeColor = (type) => {
    return type === "Tele-Consult"
      ? "bg-blue-500/10 border-blue-500/30 text-blue-400"
      : "bg-purple-500/10 border-purple-500/30 text-purple-400";
  };

  return (
    <div className="max-w-6xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8 text-blue-400" />
            Appointments
          </h1>
          <p className="text-gray-400">
            Manage your upcoming medical appointments
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          <Plus className="w-5 h-5" />
          Add Appointment
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-12 text-center">
            <CalendarIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No appointments scheduled</p>
            <p className="text-gray-500 text-sm mt-1">
              Click "Add Appointment" to schedule your first appointment
            </p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="w-6 h-6 text-blue-400" />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {appointment.title}
                      </h3>
                      <p className="text-gray-400 mb-3">{appointment.doctor}</p>

                      <div className="flex flex-wrap gap-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <CalendarIcon className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">
                            {new Date(appointment.date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">{appointment.time}</span>
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${getTypeColor(
                            appointment.type
                          )}`}
                        >
                          {appointment.type}
                        </span>

                        <span
                          className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAppointment(appointment.id)}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Appointment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                Add Appointment
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Appointment Title
                </label>
                <input
                  type="text"
                  value={newAppointment.title}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, title: e.target.value })
                  }
                  className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="e.g., Annual Checkup"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  value={newAppointment.doctor}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, doctor: e.target.value })
                  }
                  className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  placeholder="e.g., Dr. Sarah Johnson"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, date: e.target.value })
                    }
                    className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment({ ...newAppointment, time: e.target.value })
                    }
                    className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={newAppointment.type}
                  onChange={(e) =>
                    setNewAppointment({ ...newAppointment, type: e.target.value })
                  }
                  className="w-full bg-[#0A0A0F] border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                >
                  <option value="In-Person">In-Person</option>
                  <option value="Tele-Consult">Tele-Consult</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddAppointment}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all hover:scale-105"
                >
                  Add Appointment
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
