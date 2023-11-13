import { CircularProgress } from "@nextui-org/react";
import { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";

const Loading = () => {
  const { loading } = useContext(GlobalContext);

  return loading ? (
    <div className="absolute top-0 left-0 flex justify-center items-center w-[100vw] h-[100vh] bg-default-400 z-[1000] opacity-25">
      <CircularProgress
        className="z-[1000]"
        strokeWidth={3}
        classNames={{
          svg: "w-64 h-64 drop-shadow-md",
        }}
      />
    </div>
  ) : (
    <></>
  );
};

export default Loading;
