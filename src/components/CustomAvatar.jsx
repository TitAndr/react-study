/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { Avatar, Button } from "@nextui-org/react";
import helper from "../utils/helper";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { GlobalContext } from "../context/GlobalState";

const CustomAvatar = ({
  forPopup,
  image,
  imgCallback,
  fallbackImg,
  withoutEdit,
  withoutShowFallback,
}) => {
  const { setNotification } = useContext(GlobalContext);
  const [photo, setPhoto] = useState(image || null);
  const fileRef = useRef();

  const removePhoto = () => {
    setPhoto(null);
    imgCallback(null);
    fileRef.current.value = "";
  };

  const onSelectImg = (img, error) => {
    if (!img && error) {
      setNotification({ type: "error", message: error });
      return;
    }

    setPhoto(img);
  };

  useEffect(() => {
    imgCallback && photo ? imgCallback(photo) : null;
  }, [photo]);

  useEffect(() => {
    setPhoto(image);
  }, [image]);

  return (
    <div
      className={`relative flex justify-center items-center ${
        forPopup ? "w-[150px]" : ""
      }`}
    >
      <Avatar
        isBordered
        showFallback={!withoutShowFallback}
        color={!forPopup ? "success" : ""}
        className={`${!forPopup ? "w-[150px] h-[150px]" : "w-[90px] h-[90px]"}`}
        src={photo || fallbackImg}
      />
      {!withoutEdit ? (
        <>
          <Button
            isIconOnly
            radius="full"
            color="primary"
            size="sm"
            className="absolute bottom-0 right-0 cursor-pointer z-10"
            onClick={() => fileRef.current.click()}
          >
            <img src={helper.getImgUrl("edit.svg")} width={30} alt="edit" />
          </Button>
          {photo && typeof photo === "string" ? (
            <Button
              isIconOnly
              radius="full"
              color="danger"
              size="sm"
              className="absolute bottom-0 left-0 cursor-pointer z-10"
              onClick={removePhoto}
            >
              <img
                src={helper.getImgUrl("cancel.svg")}
                width={30}
                alt="cancel"
              />
            </Button>
          ) : (
            <></>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => helper.onFilePicked(e, onSelectImg)}
            className="hidden"
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default memo(CustomAvatar);
