export class OtpEntity {
  constructor(
    public email:string,
    public otp:string,
    public role:string
  ) {}
}