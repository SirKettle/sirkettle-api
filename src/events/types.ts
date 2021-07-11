export interface IMapInfo {
  query: string;
  zoom: number;
}

export interface IEvent {
  id: string;
  title: string;
  date: string;
  dateEnd: string;
  when: string;
  summary: string;
  description: string;
  links?: string[];
  googleMaps?: IMapInfo;
}
