// "use client";
// import { useState, useRef, useEffect, useCallback } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
// import { MapPin, X, Search } from "lucide-react";

// interface LocationSelectorProps {
//   latitude: number;
//   longitude: number;
//   location: string;
//   onLocationSelect: (lat: number, lng: number, address: string) => void;
// }

// const mapContainerStyle = {
//   width: "100%",
//   height: "calc(100vh - 280px)",
// };

// const defaultCenter = {
//   lat: 28.2735062,
//   lng: 70.0711656,
// };

// const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
//   "places",
// ];

// export default function LocationSelector({
//   latitude,
//   longitude,
//   location,
//   onLocationSelect,
// }: LocationSelectorProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [mapCenter, setMapCenter] = useState(
//     latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter
//   );
//   const [markerPosition, setMarkerPosition] =
//     useState<google.maps.LatLngLiteral | null>(
//       latitude && longitude ? { lat: latitude, lng: longitude } : null
//     );
//   const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId | undefined>(
//     undefined
//   );
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedLocation, setSelectedLocation] = useState(location || "");
//   const [predictions, setPredictions] = useState<
//     google.maps.places.AutocompletePrediction[]
//   >([]);
//   const mapRef = useRef<google.maps.Map>();
//   const autocompleteServiceRef =
//     useRef<google.maps.places.AutocompleteService>();
//   const placesServiceRef = useRef<google.maps.places.PlacesService>();
//   const inputRef = useRef<HTMLInputElement>(null);

//   const { isLoaded, loadError } = useJsApiLoader({
//     id: "google-map-script",
//     googleMapsApiKey: "AIzaSyDUXawG1l_BPsK3wkmBs7n9mLPaJgznrTU",
//     libraries: libraries,
//   });

//   const onMapLoad = useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//     placesServiceRef.current = new google.maps.places.PlacesService(map);
//   }, []);

//   useEffect(() => {
//     if (isLoaded) {
//       autocompleteServiceRef.current =
//         new google.maps.places.AutocompleteService();
//     }
//   }, [isLoaded]);

//   const handleSearch = () => {
//     if (searchQuery && placesServiceRef.current) {
//       const request = {
//         query: searchQuery,
//         fields: ["name", "geometry", "formatted_address"],
//       };
//       placesServiceRef.current.findPlaceFromQuery(
//         request,
//         (results, status) => {
//           if (
//             status === google.maps.places.PlacesServiceStatus.OK &&
//             results &&
//             results[0]
//           ) {
//             const place = results[0];
//             if (place.geometry && place.geometry.location) {
//               const newPosition = {
//                 lat: place.geometry.location.lat(),
//                 lng: place.geometry.location.lng(),
//               };
//               setMapCenter(newPosition);
//               setMarkerPosition(newPosition);
//               mapRef.current?.panTo(newPosition);
//               mapRef.current?.setZoom(15);
//               updateLocationInfo(newPosition, place.formatted_address || "");
//             }
//           }
//         }
//       );
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setSearchQuery(value);
//     if (value.length > 2 && autocompleteServiceRef.current) {
//       autocompleteServiceRef.current.getPlacePredictions(
//         { input: value },
//         (predictions, status) => {
//           if (
//             status === google.maps.places.PlacesServiceStatus.OK &&
//             predictions
//           ) {
//             setPredictions(predictions);
//           } else {
//             setPredictions([]);
//           }
//         }
//       );
//     } else {
//       setPredictions([]);
//     }
//   };

//   const handlePredictionSelect = (
//     prediction: google.maps.places.AutocompletePrediction
//   ) => {
//     setSearchQuery(prediction.description);
//     setPredictions([]);
//     if (placesServiceRef.current) {
//       placesServiceRef.current.getDetails(
//         {
//           placeId: prediction.place_id,
//           fields: ["geometry", "formatted_address"],
//         },
//         (place, status) => {
//           if (
//             status === google.maps.places.PlacesServiceStatus.OK &&
//             place &&
//             place.geometry &&
//             place.geometry.location
//           ) {
//             const newPosition = {
//               lat: place.geometry.location.lat(),
//               lng: place.geometry.location.lng(),
//             };
//             setMapCenter(newPosition);
//             setMarkerPosition(newPosition);
//             mapRef.current?.panTo(newPosition);
//             mapRef.current?.setZoom(15);
//             updateLocationInfo(newPosition, place.formatted_address || "");
//           }
//         }
//       );
//     }
//   };

//   const handleMapClick = (e: google.maps.MapMouseEvent) => {
//     if (e.latLng) {
//       const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
//       setMarkerPosition(newPosition);
//       updateLocationInfo(newPosition);
//     }
//   };

//   const updateLocationInfo = (
//     position: google.maps.LatLngLiteral,
//     address?: string
//   ) => {
//     if (isLoaded) {
//       if (address) {
//         setSelectedLocation(address);
//       } else {
//         const geocoder = new window.google.maps.Geocoder();
//         geocoder.geocode({ location: position }, (results, status) => {
//           if (status === "OK" && results && results[0]) {
//             const formattedAddress = results[0].formatted_address;
//             setSelectedLocation(formattedAddress);
//           } else {
//             console.error(
//               "Geocode was not successful for the following reason: " + status
//             );
//             const fallbackAddress = `${position.lat.toFixed(
//               6
//             )}, ${position.lng.toFixed(6)}`;
//             setSelectedLocation(fallbackAddress);
//           }
//         });
//       }
//     }
//   };

//   const handleSave = () => {
//     console.log(markerPosition, "markerPosition");
//     if (markerPosition) {
//       onLocationSelect(
//         markerPosition.lat,
//         markerPosition.lng,
//         selectedLocation
//       );
//     }
//     setIsOpen(false);
//   };

//   const toggleMapType = () => {
//     if (isLoaded) {
//       setMapTypeId((prev) =>
//         prev === window.google.maps.MapTypeId.ROADMAP
//           ? window.google.maps.MapTypeId.SATELLITE
//           : window.google.maps.MapTypeId.ROADMAP
//       );
//     }
//   };

//   if (loadError) return <div>Error loading maps</div>;
//   if (!isLoaded) return <div>Loading maps</div>;

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         <Button>
//           <MapPin className="mr-2 h-4 w-4" />
//           Select Location
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="max-w-full w-full h-[calc(100vh-40px)] p-0">
//         <div className="flex flex-col h-full">
//           <DialogHeader className="p-4 bg-background">
//             <div className="flex items-center justify-between">
//               <DialogTitle>Select Location</DialogTitle>
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsOpen(false)}
//               >
//                 <span className="sr-only">Close</span>
//               </Button>
//             </div>
//           </DialogHeader>
//           <div className="p-4 bg-background">
//             <div className="flex items-center gap-2">
//               <div className="relative flex-grow">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 " />
//                 <Input
//                   ref={inputRef}
//                   type="text"
//                   placeholder="Search Google Maps"
//                   className="pl-10 pr-4 py-2 w-full text-lg"
//                   value={searchQuery}
//                   onChange={handleInputChange}
//                 />
//                 {predictions.length > 0 && (
//                   <ul className="absolute z-10 w-full bg-primary border border-gray-300 mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
//                     {predictions.map((prediction) => (
//                       <li
//                         key={prediction.place_id}
//                         className="px-4 py-2  cursor-pointer"
//                         onClick={() => handlePredictionSelect(prediction)}
//                       >
//                         {prediction.description}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//               <Button onClick={handleSearch}>Search</Button>
//             </div>
//           </div>
//           <div className="flex-grow relative">
//             <div className="absolute top-4 right-4 z-10">
//               <Button onClick={toggleMapType}>
//                 {mapTypeId === window.google.maps.MapTypeId.ROADMAP
//                   ? "Satellite"
//                   : "Map"}
//               </Button>
//             </div>
//             <GoogleMap
//               mapContainerStyle={mapContainerStyle}
//               center={mapCenter}
//               zoom={14}
//               onClick={handleMapClick}
//               onLoad={onMapLoad}
//               options={{
//                 mapTypeId: mapTypeId,
//                 mapTypeControl: false,
//                 streetViewControl: false,
//                 fullscreenControl: false,
//               }}
//             >
//               {markerPosition && <Marker position={markerPosition} />}
//             </GoogleMap>
//           </div>
//           <div className="p-4 bg-background">
//             <div className="mb-4">
//               <label
//                 htmlFor="selected-location"
//                 className="block text-sm font-medium text-gray-700 mb-1"
//               >
//                 Selected Location
//               </label>
//               <Input
//                 id="selected-location"
//                 type="text"
//                 value={selectedLocation}
//                 readOnly
//                 className="w-full"
//               />
//             </div>
//             <Button onClick={handleSave} className="w-full">
//               Save Location
//             </Button>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import { MapPin, X, Search } from "lucide-react";

interface LocationSelectorProps {
  latitude: number;
  longitude: number;
  location: string;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

const libraries: ("places" | "drawing" | "geometry" | "visualization")[] = [
  "places",
];

export default function LocationSelector({
  latitude,
  longitude,
  location,
  onLocationSelect,
}: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState(
    latitude && longitude
      ? { lat: latitude, lng: longitude }
      : { lat: 28.2735062, lng: 70.0711656 }
  );
  const [markerPosition, setMarkerPosition] =
    useState<google.maps.LatLngLiteral | null>(
      latitude && longitude ? { lat: latitude, lng: longitude } : null
    );
  const [mapTypeId, setMapTypeId] = useState<google.maps.MapTypeId | undefined>(
    undefined
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(location || "");
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([]);
  const mapRef = useRef<google.maps.Map>();
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService>();
  const placesServiceRef = useRef<google.maps.places.PlacesService>();
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyDUXawG1l_BPsK3wkmBs7n9mLPaJgznrTU",
    libraries: libraries,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    placesServiceRef.current = new google.maps.places.PlacesService(map);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      autocompleteServiceRef.current =
        new google.maps.places.AutocompleteService();
    }
  }, [isLoaded]);

  const handleSearch = () => {
    if (searchQuery && placesServiceRef.current) {
      const request = {
        query: searchQuery,
        fields: ["name", "geometry", "formatted_address"],
      };
      placesServiceRef.current.findPlaceFromQuery(
        request,
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results[0]
          ) {
            const place = results[0];
            if (place.geometry && place.geometry.location) {
              const newPosition = {
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
              };
              setMapCenter(newPosition);
              setMarkerPosition(newPosition);
              mapRef.current?.panTo(newPosition);
              mapRef.current?.setZoom(15);
              updateLocationInfo(newPosition, place.formatted_address || "");
            }
          }
        }
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 2 && autocompleteServiceRef.current) {
      autocompleteServiceRef.current.getPlacePredictions(
        { input: value },
        (predictions, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
        }
      );
    } else {
      setPredictions([]);
    }
  };

  const handlePredictionSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    setSearchQuery(prediction.description);
    setPredictions([]);
    if (placesServiceRef.current) {
      placesServiceRef.current.getDetails(
        {
          placeId: prediction.place_id,
          fields: ["geometry", "formatted_address"],
        },
        (place, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            place &&
            place.geometry &&
            place.geometry.location
          ) {
            const newPosition = {
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            };
            setMapCenter(newPosition);
            setMarkerPosition(newPosition);
            mapRef.current?.panTo(newPosition);
            mapRef.current?.setZoom(15);
            updateLocationInfo(newPosition, place.formatted_address || "");
          }
        }
      );
    }
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newPosition = { lat: e.latLng.lat(), lng: e.latLng.lng() };
      setMarkerPosition(newPosition);
      updateLocationInfo(newPosition);
    }
  };

  const updateLocationInfo = (
    position: google.maps.LatLngLiteral,
    address?: string
  ) => {
    if (isLoaded) {
      if (address) {
        setSelectedLocation(address);
      } else {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === "OK" && results && results[0]) {
            const formattedAddress = results[0].formatted_address;
            setSelectedLocation(formattedAddress);
          } else {
            console.error(
              "Geocode was not successful for the following reason: " + status
            );
            const fallbackAddress = `${position.lat.toFixed(
              6
            )}, ${position.lng.toFixed(6)}`;
            setSelectedLocation(fallbackAddress);
          }
        });
      }
    }
  };

  const handleSave = () => {
    if (markerPosition) {
      onLocationSelect(
        markerPosition.lat,
        markerPosition.lng,
        selectedLocation
      );
    }
    setIsOpen(false);
  };

  const toggleMapType = () => {
    if (isLoaded) {
      setMapTypeId((prev) =>
        prev === window.google.maps.MapTypeId.ROADMAP
          ? window.google.maps.MapTypeId.SATELLITE
          : window.google.maps.MapTypeId.ROADMAP
      );
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <MapPin className="mr-2 h-4 w-4" />
          Select Location
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-full w-full h-[calc(100vh-40px)] p-0 sm:max-w-[90vw] sm:h-[90vh]">
        <div className="flex flex-col h-full">
          <DialogHeader className="p-4 bg-background">
            <div className="flex items-center justify-between">
              <DialogTitle>Select Location</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </DialogHeader>
          <div className="p-4 bg-background">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-grow w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search Google Maps"
                  className="pl-10 pr-4 py-2 w-full text-base sm:text-lg"
                  value={searchQuery}
                  onChange={handleInputChange}
                />
                {predictions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-background border border-input mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
                    {predictions.map((prediction) => (
                      <li
                        key={prediction.place_id}
                        className="px-4 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer"
                        onClick={() => handlePredictionSelect(prediction)}
                      >
                        {prediction.description}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Button onClick={handleSearch} className="w-full sm:w-auto">
                Search
              </Button>
            </div>
          </div>
          <div className="flex-grow relative">
            <div className="absolute top-4 right-4 z-10">
              <Button onClick={toggleMapType} size="sm">
                {mapTypeId === window.google.maps.MapTypeId.ROADMAP
                  ? "Satellite"
                  : "Map"}
              </Button>
            </div>
            <GoogleMap
              mapContainerStyle={{
                width: "100%",
                height: "100%",
                minHeight: "300px",
              }}
              center={mapCenter}
              zoom={14}
              onClick={handleMapClick}
              onLoad={onMapLoad}
              options={{
                mapTypeId: mapTypeId,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  position: google.maps.ControlPosition.RIGHT_TOP,
                },
              }}
            >
              {markerPosition && <Marker position={markerPosition} />}
            </GoogleMap>
          </div>
          <div className="p-4 bg-background flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex-grow">
              <label
                htmlFor="selected-location"
                className="block text-sm font-medium text-foreground mb-1"
              >
                Selected Location
              </label>
              <Input
                id="selected-location"
                type="text"
                value={selectedLocation}
                readOnly
                className="w-full"
              />
            </div>
            <Button onClick={handleSave} className="w-full sm:w-auto sm:ml-4">
              Save Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
