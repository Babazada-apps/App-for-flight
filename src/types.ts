export interface Flight {
  id: string;
  userId?: string;
  aircraft: string;
  tailNumber: string;
  callSign: string;
  crew: string;
  purpose: string;
  departureAerodrome: string;
  arrivalAerodrome: string;
  departureTime: string;
  arrivalTime: string;
  totalFlightTime: string;
  createdAt: number;
  updatedAt: number;
}
