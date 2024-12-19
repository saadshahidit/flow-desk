export interface Activity {
  _id: string;
  task: string;
  user: { _id: string; name: string };
  action: string;
  createdAt: string;
}
