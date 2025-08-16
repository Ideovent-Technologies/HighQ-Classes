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

  useEffect(() => {
    fetchTickets();
  }, []);

  if (loading) return <p>Loading tickets...</p>;
  if (!tickets.length) return <p>No tickets found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">All Tickets</h2>
      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="p-4 border rounded shadow hover:bg-gray-50 cursor-pointer"
            onClick={() => navigate(`/admin/tickets/${ticket._id}`)}
          >
            <p><strong>{ticket.subject}</strong></p>
            <p>{ticket.name} - {ticket.email}</p>
            <p>Status: <span className="capitalize">{ticket.status}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketList;
