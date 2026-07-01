//DTO (Data Transfer Object): definiamo la forma dei dati che arrivano dal FE in una richiesta HTTP.

export class RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string; //in automatico è "USER"
}