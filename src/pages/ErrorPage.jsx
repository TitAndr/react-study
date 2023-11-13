import { useTranslation } from "react-i18next";

const ErrorPage = () => {
  const { t } = useTranslation();

  return (
    <div id="notfound">
      <div className="notfound">
        <div className="notfound-404">
          <h1>404</h1>
        </div>
        <h2 className="text-red">{t("error.Title")}</h2>
        <p>{t("error.Text")}</p>
      </div>
    </div>
  );
};

export default ErrorPage;
