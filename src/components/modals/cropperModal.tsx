import React, { useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { Button } from "../ui/button";
import { getCroppedImg } from "@/utils/croppedImage";

function CropperModal(props: {
  open: boolean;
  onClose: () => void;
  image: string | null;
  onConfirm: (image: string) => void;
  aspect: number;
}) {
  const { open, onClose, image, onConfirm, aspect} = props;

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedPixels(croppedAreaPixels);
  };

  const handleConfrim = async () => {
    if (croppedPixels && image) {
      try {
        const croppedImage = await getCroppedImg(image, croppedPixels);
        croppedImage && onConfirm(croppedImage);
      } catch (e) {
        throw e;
      }
    }
    return undefined;
  };

  useEffect(() => {
    if (!open || !image) {
      onClose();
    }
  }, [open, image, onClose]);

  return (
    <>
      {image && (
        <div className="fixed left-0 top-0 z-50  flex h-full w-full flex-col items-center justify-center backdrop-blur-lg ">
          <div className="h-full w-full p-5">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={aspect || 1}
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
            <Button className="w-full text-lg" onClick={() =>  void handleConfrim()}>
              Confirm
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export default CropperModal;
