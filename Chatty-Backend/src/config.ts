import dotenv from "dotenv";

dotenv.config({});

class Config {
  public DATABASE_URL: string | undefined;
  public JWT_TOKEN: string | undefined;
  public SECRET_KEY_ONE: string | undefined;
  public SECRET_KEY_TWO: string | undefined;
  public CLIENT_URL: string | undefined;
  public NODE_ENV: string | undefined;
  public JWT_SECRET: string | undefined;
  public PORT: string | undefined;
  public JWT_EXPIRES_IN: string | undefined;

  constructor() {
    this.DATABASE_URL = process.env.DATABASE_URL;
    this.JWT_TOKEN = process.env.JWT_TOKEN || "1234";
    this.SECRET_KEY_ONE = process.env.SECRET_KEY_ONE || "";
    this.SECRET_KEY_TWO = process.env.SECRET_KEY_TWO || "";
    this.CLIENT_URL = process.env.CLIENT_URL || "";
    this.JWT_SECRET = process.env.JWT_SECRET || "";
    this.PORT = process.env.PORT || "5000";
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "";
  }

  public validateConfig(): void {
    console.log(this);

    for (const [key, value] of Object.entries(this)) {
      if (value === undefined) {
        throw new Error(`Configuration ${key} is undefined.`);
      }
    }
  }
}
export const config: Config = new Config();
