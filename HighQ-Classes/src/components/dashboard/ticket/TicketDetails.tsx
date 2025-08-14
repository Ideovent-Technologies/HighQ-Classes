import React, { useEffect, useState } from "react";
import { SupportTicket } from "@/types/SupportTicket";
import SupportTicketService from "@/API/services/SupportTicket";
import { useParams, useNavigate } from "react-router-dom";

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    setLoading(true);
    const res = await SupportTicketService.getTicketById(id!);
    if (res.success && res.ticket) {
      setTicket(res.ticket);
    }
    setLoading(false);
  };

  const changeStatus = async (status: "pending" | "in_progress" | "resolved") => {
    if (!ticket?._id) return;
    const res = await SupportTicketService.updateTicketStatus(ticket._id, status);
    if (res.success) {
      setTicket({ ...ticket, status });
    }
  };

  useEffect(() => {
    fetchTicket();
  }, [id]);

  if (loading) return <p>Loading ticket...</p>;
  if (!ticket) return <p>Ticket not found.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto border rounded shadow">
      <h2 className="text-xl font-bold mb-4">Ticket Details</h2>
      <p><strong>Name:</strong> {ticket.name}</p>
      <p><strong>Email:</strong> {ticket.email}</p>
      <p><strong>Role:</strong> {ticket.role}</p>
      <p><strong>Subject:</strong> {ticket.subject}</p>
      <p><strong>Message:</strong> {ticket.message}</p>
      {ticket.fileUrl && (
        <p>
          <strong>File:</strong>{" "}
          <a href={ticket.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
            {ticket.fileName || "View Attachment"}
          </a>
        </p>
      )}
      <div className="mt-4">
        <label>Status: </label>
        <select
          value={ticket.status}
          onChange={(e) => changeStatus(e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <button
        onClick={() => navigate("/dashboard/UserSupport")}
        className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
      >
        Back to List
      </button>
    </div>
  );
};

export default TicketDetail;
