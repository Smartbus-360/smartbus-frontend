import Banner from "./components/Banner";
import { getUser } from "../../../config/authService.js";
import Settings from "./components/Settings";

const ProfileOverview = () => {
  const user = getUser();
  
  return (
    <div className="flex w-full flex-col">
      <div className="w-full mt-3 text-center flex h-fit flex-col">
        <div className="col-span-4 text-center">
          <Banner user={user} />
        </div>
      </div>
      <div className="w-full flex flex-col">
        <Settings user={user} />
      </div>
    </div>
  );
};

export default ProfileOverview;
