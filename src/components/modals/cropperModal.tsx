import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Button } from "../ui/button";
import { getCroppedImg } from "@/utils/croppedImage";

function CropperModal(props: {
  open: boolean;
  onClose: () => void;
  image: string | null;
  onConfirm: (image: string) => void;
}) {
  const { open, onClose, image, onConfirm } = props;

  if (!open || !image) return null;
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);

  const onCropComplete = async (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedPixels(croppedAreaPixels);
  };

  const handleConfrim = async () => {
    if (croppedPixels) {
      try {
        const croppedImage = await getCroppedImg(image, croppedPixels);
        croppedImage && onConfirm(croppedImage);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="fixed left-0 top-0 z-50  flex h-full w-full flex-col items-center justify-center backdrop-blur-lg ">
      <div className="h-full w-full p-5">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          style={{
            containerStyle: {
              position: "relative",
              height: "100%",
              width: "100%",
            },
          }}
        />
      </div>
      <div className="flex w-full max-w-4xl gap-2 p-2 ">
        <Button
          className="w-full text-lg"
          variant={"destructive"}
          onClick={() => onClose()}
        >
          Cancel
        </Button>
        <Button className="w-full text-lg" onClick={handleConfrim}>
          Confirm
        </Button>
      </div>
    </div>
  );
}

export default CropperModal;
