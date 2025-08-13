import React, { useEffect, useState } from "react";
import { SupportTicket } from "@/types/SupportTicket";
import SupportTicketService from "@/API/services/SupportTicket";
import { useNavigate } from "react-router-dom";

const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    setLoading(true);
    const res = await SupportTicketService.getAllTickets();
    if (res.success && res.tickets) {
      setTickets(res.tickets);
    }
    setLoading(false);
  };

  const changeStatus = async (id: string, status: "pending" | "in_progress" | "resolved") => {
    const res = await SupportTicketService.updateTicketStatus(id, status);
    if (res.success) {
      setTickets(prev => prev.map(t => (t._id === id ? { ...t, status } : t)));
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Support Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found.</p>
      ) : (
        <table className="w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Subject</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket._id}>
                <td className="border p-2">{ticket.name}</td>
                <td className="border p-2">{ticket.email}</td>
                <td className="border p-2">{ticket.subject}</td>
                <td className="border p-2">
                  <select
                    value={ticket.status}
                    onChange={(e) => changeStatus(ticket._id!, e.target.value as any)}
                    className="border px-2 py-1 rounded"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button
                    onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TicketList;
