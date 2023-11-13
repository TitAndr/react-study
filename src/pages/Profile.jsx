import { Divider, RadioGroup, Radio, Button } from "@nextui-org/react";
import CustomAvatar from "../components/CustomAvatar";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalState";
import helper from "../utils/helper";
import Validation from "../utils/validation";
import { useTranslation } from "react-i18next";
import CustomInput from "../components/CustomInput";

const Profile = () => {
  const { t } = useTranslation();
  const { user, saveUser, updateAuth } = useContext(GlobalContext);
  const [currentUser, setCurrentUser] = useState(user || {});
  const [gender, setGender] = useState(user?.gender || "male");
  const [password, setPassword] = useState({
    new: "",
    confirm: "",
  });
  const { handleField, getError, isValid } = Validation();

  const onCallback = async (type) => {
    if (!isValid(setCurrentUser)) {
      return;
    }

    if (currentUser.email !== user.email || password.confirm) {
      await updateAuth({
        email: currentUser.email,
        password: password.confirm,
      });
    }

    helper.save(type, saveUser, {
      newEntity: currentUser,
      oldEntity: user,
    });
  };

  useEffect(() => {
    setCurrentUser(user || {});
    setGender(user?.gender);
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-around h-[65vh] gap-6 min-h-[740px] mobile:max-h-[600px] mobile:min-h-[480px]">
      {user ? (
        <CustomAvatar
          image={user?.photo}
          imgCallback={(img) => setCurrentUser((p) => ({ ...p, photo: img }))}
          fallbackImg={gender + `.png`}
        />
      ) : (
        <></>
      )}
      <div className="w-full flex flex-col justify-around gap-4 mobile:flex-row desktop:max-w-[960px]">
        <div className="mobile:max-w-[400px] w-full gap-4 flex flex-col">
          <CustomInput
            isRequired
            type="text"
            label={t("profile.Name")}
            value={currentUser.name}
            errorMessage={getError("name", currentUser, "required")}
            onChange={(e) => {
              handleField("name", e.target.value, setCurrentUser);
            }}
          />
          <CustomInput
            isRequired
            type="email"
            label={t("profile.Email")}
            endContent="MailIcon"
            value={currentUser.email}
            errorMessage={getError("email", currentUser, "required|email")}
            onChange={(e) => {
              handleField("email", e.target.value, setCurrentUser);
            }}
          />
          <Divider />
          <RadioGroup
            label={t("profile.Gender")}
            orientation="horizontal"
            className="gender"
            value={currentUser.gender}
            onChange={(e) => {
              setCurrentUser((p) => ({ ...p, gender: e.target.value }));
              setGender(e.target.value);
            }}
          >
            <Radio color="success" value="male">
              {t("profile.Male")}
            </Radio>
            <Radio color="danger" value="female">
              {t("profile.Female")}
            </Radio>
          </RadioGroup>
        </div>
        <div className="mobile:max-w-[400px] w-full gap-4 flex flex-col">
          <CustomInput
            isRequired={!!password.new}
            type="password"
            label={t("profile.Password")}
            value={password.new}
            endContent="LockIcon"
            errorMessage={getError(
              "new",
              password,
              "uppercase|lowercase|hasNumbers|specificCharecters|min:6|max:256"
            )}
            onChange={(e) => {
              handleField("new", e.target.value, setPassword);
            }}
          />
          <CustomInput
            isRequired={!!password.new}
            type="password"
            label={t("profile.ConfirmPassword")}
            value={password.confirm}
            isDisabled={!password.new}
            endContent="LockIcon"
            errorMessage={getError(
              "confirm",
              password,
              `${password.new ? "required|" : ""}sameAs:${password.new}`
            )}
            onChange={(e) => {
              handleField("confirm", e.target.value, setPassword);
            }}
          />
          <div className="flex justify-end gap-6 mt-8">
            <Button
              radius="full"
              color="success"
              variant="bordered"
              className="save min-[490px]:w-3/4 w-full font-bold text-[1rem] hover:text-white hover:bg-success-500"
              onPress={() => onCallback("save")}
            >
              {t("profile.Save")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
