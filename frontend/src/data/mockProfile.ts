export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  memberSince: string;
}

export const mockCustomer: Customer = {
  id: "CUST-8392",
  name: "Sarah Jenkins",
  email: "sarah.jenkins@example.com",
  phone: "+1 (555) 123-4567",
  avatar: "https://i.pravatar.cc/150?img=5",
  memberSince: "2021-03-15T00:00:00Z",
};
