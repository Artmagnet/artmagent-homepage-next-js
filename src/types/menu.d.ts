 declare interface Menu {
  id: string;
  name: string;
  menuId?: string | number;
  active?: boolean;
  categories?: Menu[];
  timeStamp?: string;
}
