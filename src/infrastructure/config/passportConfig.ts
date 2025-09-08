import { container } from "tsyringe";
import { IGoogleAuthService } from "domain/services/IGoogleAuthService";

export const passportSet = async (): Promise<boolean> => {
  try {
    const passportSetup = container.resolve<IGoogleAuthService>("IGoogleAuthService");
    await passportSetup.initializeStrategy();
    return true;
  } catch (err) {
    console.error("❌ Error in passport setup:", err);
    return false;
  }
};
