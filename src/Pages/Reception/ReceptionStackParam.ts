import { Responses } from "../../services";

export type RootStackParamList = {
  GoodPage: undefined;
  BoxPage: { box: Responses.GoodModel; onGoBack?: (id: string) => void };
  DifferencePage: { onGoBack?: () => void };
  PhotoPage: { onGoBack?: () => void };
  ScanPage: undefined | { onGoBack?: (data: string) => void };
  PdfPage: undefined;
};
