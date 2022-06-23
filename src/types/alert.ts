export interface IAlertItem {
  id?: any;
  type?: "success" | "warning" | "danger" | "info";
  title?: string;
  message: string;
  secondTimeout?: number;
  isHover?: boolean;
}

export interface IAlertPayload {
  type?: "success" | "warning" | "danger" | "info";
  title?: string;
  message: string;
}
