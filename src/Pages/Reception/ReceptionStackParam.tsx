/* eslint-disable @typescript-eslint/no-explicit-any */
import { Responses } from "../../services";

export type RootStackParamList = {
  GoodPage: undefined;
  ScanPage: undefined | { onGoBack?: (model: any) => void };
  BoxPage: { box: Responses.GoodModel; onGoBack?: (id: string) => void };
  Difference: { onGoBack?: () => void };
  Pdf: { taskId: number; PlanNum: string };
  UploadPhoto: { onGoBack?: () => void };
};
