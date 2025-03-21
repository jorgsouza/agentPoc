export class Ticket {
  constructor(ticketId) {
    if (!/^[A-Z]+-\d+$/.test(ticketId)) {
      throw new Error("Invalid Ticket ID format");
    }
    this.ticketId = ticketId;
  }

  toString() {
    return this.ticketId;
  }
}
