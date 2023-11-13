/* eslint-disable no-prototype-builtins */
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import SimpleReactValidator from "simple-react-validator";

const Validation = () => {
  const { t } = useTranslation();

  const additionalValidation = {
    validators: {
      sameAs: {
        message: t("main.RuleSame"),
        rule: (val, params) => (params[0] ? params[0] === val : true),
      },
      isUnique: {
        message: t("main.RuleUnique"),
        rule: (val, params) => {
          return params && typeof val === "string"
            ? !params.find((p) => p.toLowerCase() === val.toLowerCase())
            : true;
        },
      },
      uppercase: {
        rule: (val) =>
          val && typeof val === "string" ? /[A-Z]/g.test(val) : true,
        message: t("main.RulePasswordCapitalLetters"),
      },
      lowercase: {
        rule: (val) =>
          val && typeof val === "string" ? /[a-z]/g.test(val) : true,
        message: t("main.RulePasswordLowercaseLetters"),
      },
      hasNumbers: {
        rule: (val) =>
          val && typeof val === "string" ? /[0-9]/g.test(val) : true,
        message: t("main.RulePasswordNumbers"),
      },
      specificCharecters: {
        rule: (val) =>
          val && typeof val === "string" ? /\W|_/g.test(val) : true,
        message: t("main.RulePasswordSpecificCharacters"),
      },
    },
  };

  const validator = useRef(
    new SimpleReactValidator({
      ...additionalValidation,
    })
  );

  const handleField = (field, value, setState, isSimple) => {
    const fieldName = field.split("|")[0];
    !isSimple
      ? setState((v) => ({ ...v, [fieldName]: value }))
      : setState(value);
    validator.current.showMessageFor("field");
  };

  const getError = (field, value, rules) => {
    const fieldName = field.split("|")[0];

    const error = rules.includes("required")
      ? validator.current.message(
          field,
          value[fieldName] !== undefined ? value[fieldName] : value,
          rules
        )
      : null;

    value.invalid = !!error;

    return error;
  };

  const isValid = (setState, entities) => {
    if (!validator.current.allValid()) {
      if (!Array.isArray(entities) && setState) {
        setState((v) => ({ ...v, invalid: true }));
      } else if (entities) {
        Object.keys(validator.current.errorMessages).forEach((k) => {
          const f = entities.find((e) => e.state.hasOwnProperty(k));
          if (f) {
            f.setState((v) => ({ ...v, invalid: true }));
          }
        });
      }
      validator.current.showMessages();
      return false;
    }
    return true;
  };

  return {
    handleField,
    getError,
    isValid,
    hideMessages: validator.current.hideMessages.bind(validator.current),
    purgeFields: validator.current.purgeFields.bind(validator.current),
  };
};

export default Validation;
