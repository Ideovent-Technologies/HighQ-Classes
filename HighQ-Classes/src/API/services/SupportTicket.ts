import { SupportTicket } from "@/types/SupportTicket";
import api from "../Axios";

class SupportTicketService {
  async createTicket(ticketData: FormData) {
    try {
      const response = await api.post("/support", ticketData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { success: true, ticket: response.data.ticket };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to create support ticket",
      };
    }
  }

  async getAllTickets() {
    try {
      const response = await api.get("/support");
      return { success: true, tickets: response.data.tickets };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch tickets" };
    }
  }

  async getMyTickets() {
    try {
      const response = await api.get("/support/my");
      return { success: true, tickets: response.data.tickets };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch my tickets" };
    }
  }

  async getTicketById(id: string) {
    try {
      const response = await api.get(`/support/${id}`);
      return { success: true, ticket: response.data.ticket };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch ticket" };
    }
  }

  async updateTicketStatus(id: string, status: "pending" | "in_progress" | "resolved") {
    try {
      const response = await api.patch(`/support/${id}/status`, { status });
      return { success: true, updatedTicket: response.data.updatedTicket };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to update ticket status" };
    }
  }

  async deleteTicket(id: string) {
    try {
      await api.delete(`/support/${id}`);
      return { success: true, message: "Ticket deleted successfully" };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to delete ticket" };
    }
  }
}

export default new SupportTicketService();
