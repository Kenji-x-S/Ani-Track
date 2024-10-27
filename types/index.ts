export interface MapProps {
  initialValue: LatLng;
  open: boolean;
  setMapCoordinates: (coordinates: LatLng, place: any) => void;
  handleClose: () => void;
}
export interface AlertInterface {
  open: boolean;
  title?: string;
  description?: string;
  callback?: () => void;
}
export interface LatLng {
  lat: number;
  lng: number;
}
