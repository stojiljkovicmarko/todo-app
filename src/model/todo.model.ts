export enum ProjectStatus {
  Active,
  Finished,
  Overdue,
}

export interface Todo {
  id: string;
  text: string;
  status: ProjectStatus;
  priority: string;
  date: string;
  createdOn: Date;
  fullDate: Date;
  isEditable: boolean;
}