import Menu from "./Menu";

const Sidebar = () => {
  return (
    <div className="h-[100vh] w-[260px] hidden smd:flex flex-col justify-between bg-[#080325] pb-5">
      <Menu />
    </div>
  );
};

export default Sidebar;
