export class Email {
  constructor(email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    this.email = email;
  }

  toString() {
    return this.email;
  }
}
