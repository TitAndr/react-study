/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useContext, useState } from "react";
import { supabase } from "../supabase/index";
import { GlobalContext } from "../context/GlobalState";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Link,
  Radio,
  RadioGroup,
} from "@nextui-org/react";
import CustomAvatar from "../components/CustomAvatar";
import helper from "../utils/helper";
import LanguageSwitch from "../components/LanguageSwitch";
import Validation from "../utils/validation";
import { useTranslation } from "react-i18next";
import CustomInput from "../components/CustomInput";

const Auth = ({ openReset }) => {
  const { t } = useTranslation();
  const { setLoading, createInitData, setNotification } =
    useContext(GlobalContext);

  const { handleField, getError, isValid, hideMessages, purgeFields } =
    Validation();
  const [isNew, setIsNew] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    name: "",
    email: "",
    gender: "male",
  });

  const [passwords, setPasswords] = useState({
    password: "",
    confirm: "",
  });

  const handleLogin = async () => {
    if (
      !isValid(null, [
        { state: loginInfo, setState: setLoginInfo },
        { state: passwords, setState: setPasswords },
      ])
    ) {
      return;
    }

    setLoading(true);

    if (isNew) {
      await createInitData(
        { ...loginInfo },
        {
          password: passwords.confirm,
        }
      );
      setLoading(false);
      changeUser();

      return;
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginInfo.email,
        password: passwords.password,
      });

      if (error) {
        setNotification({ type: "error", message: error?.message || error });
      }
    }

    setLoading(false);
    clearAll();
  };

  const changeUser = () => {
    setIsNew(!isNew);
    clearAll();
    hideMessages();
    purgeFields();
  };

  const clearAll = () => {
    [loginInfo, passwords].forEach((i) => {
      Object.keys(i).forEach((k) => {
        if (k === "gender") {
          i[k] = "male";
        } else {
          i[k] = "";
        }
      });
    });
  };

  const getContent = () => {
    if (isNew) {
      return (
        <>
          <CustomInput
            isRequired
            label={t("auth.Name")}
            value={loginInfo.name}
            errorMessage={getError("name", loginInfo, "required")}
            onChange={(e) => {
              handleField("name", e.target.value, setLoginInfo);
            }}
          />
          <CustomInput
            isRequired
            type="email"
            label={t("auth.Email")}
            endContent="MailIcon"
            value={loginInfo.email}
            errorMessage={getError("email", loginInfo, "required|email")}
            onChange={(e) => {
              handleField("email", e.target.value, setLoginInfo);
            }}
          />
          <RadioGroup
            orientation="horizontal"
            className="gender"
            value={loginInfo.gender}
            onChange={(e) =>
              handleField("gender", e.target.value, setLoginInfo)
            }
          >
            <Radio color="success" value="male">
              {t("auth.Male")}
            </Radio>
            <Radio color="danger" value="female">
              {t("auth.Female")}
            </Radio>
          </RadioGroup>
          <CustomInput
            isRequired
            type="password"
            label={t("auth.Password")}
            value={passwords.password}
            endContent="LockIcon"
            errorMessage={getError(
              "password",
              passwords,
              "required|uppercase|lowercase|hasNumbers|specificCharecters|min:6|max:256"
            )}
            onChange={(e) => {
              handleField("password", e.target.value, setPasswords);
            }}
          />
          <CustomInput
            isRequired
            type="password"
            label={t("auth.ConfirmPassword")}
            value={passwords.confirm}
            endContent="LockIcon"
            errorMessage={
              isNew
                ? getError(
                    "confirm",
                    passwords,
                    `required|sameAs:${passwords.password}`
                  )
                : null
            }
            onChange={(e) => {
              handleField("confirm", e.target.value, setPasswords);
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <CustomInput
            isRequired
            type="email"
            label={t("auth.Email")}
            endContent="MailIcon"
            value={loginInfo.email}
            errorMessage={getError("email", loginInfo, "required|email")}
            onChange={(e) => {
              handleField("email", e.target.value, setLoginInfo);
            }}
          />
          <CustomInput
            isRequired
            type="password"
            label={t("auth.Password")}
            value={passwords.password}
            endContent="LockIcon"
            errorMessage={getError(
              "password",
              passwords,
              "required|min:6|max:256"
            )}
            onChange={(e) => {
              handleField("password", e.target.value, setPasswords);
            }}
          />
          <Link
            href="#"
            color="danger"
            size="sm"
            className="justify-end"
            onClick={openReset}
          >
            {t("auth.ForgotPassword")}
          </Link>
        </>
      );
    }
  };

  return (
    <div className="login">
      <div className="max-[630px]:hidden absolute top-2 left-2">
        <LanguageSwitch isLogin />
      </div>
      <Card
        className={`login-form w-[390px] max-h-[95vh] ${
          isNew ? "min-h-[680px] max-[630px]:min-h-[730px]" : "min-h-[550px]"
        }`}
      >
        <CardHeader className="flex flex-col gap-2 pt-5 justify-center items-center relative">
          <div className="hidden max-[630px]:flex justify-start w-full mb-4">
            <LanguageSwitch />
          </div>
          <CustomAvatar
            image={helper.getImgUrl(`${loginInfo?.gender || "male"}.png`)}
            withoutEdit
            forPopup
          />
          <h1 className="font-bold m-none text-[2rem] px-2 text-center">
            {t(`auth.${isNew ? "NewTilte" : "Tilte"}`)}
          </h1>
        </CardHeader>
        <CardBody
          className={`py-0 px-[1.25rem] gap-${
            isNew ? 3 : 5
          } overflow-hidden max-w-[400px]`}
        >
          <Divider />
          {getContent()}
          <Divider className="my-4" />
        </CardBody>
        <CardFooter className="flex-col">
          <Button
            radius="full"
            color="success"
            className="w-[230px] h-[40px] font-bold text-white text-medium"
            onClick={handleLogin}
          >
            {t(`auth.${isNew ? "SignUp" : "LogIn"}`)}
          </Button>
          <div className="flex items-center justify-center gap-3 mt-3 mb-2">
            <span>{t(`auth.${isNew ? "HaveAccount" : "NewUser"}`)}</span>
            <span
              onClick={changeUser}
              className="cursor-pointer text-success-500 hover:text-success-300 font-bold"
            >
              {t(`auth.${isNew ? "LogInText" : "CreateAccount"}`)}
            </span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Auth;
