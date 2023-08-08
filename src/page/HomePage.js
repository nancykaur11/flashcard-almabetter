import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { CreateGroup } from "../components/CreateGroup";
import { CreateTerm } from "../components/CreateTeam";
import { Toast } from "../components/design/Popup";
import { Button } from "../components/design/Button";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../store/features/cards";
import { generate_UniqueId } from "../utils/uniqueGenerator";

const flashcardSchema = Yup.object().shape({
  groups: Yup.object().shape({
    group_Id: Yup.string().required(),
    group: Yup.string()
      .min(2, "Minimum character length is 2")
      .max(20, "You have reached the max length")
      .required("Required"),
  }),
  terms: Yup.array().of(
    Yup.object().shape({
      card_Id: Yup.string().required(),
      term: Yup.string()
        .min(10, "Minimum character length is 10")
        .max(200, "You have reached the max length")
        .required("Required"),
      defination: Yup.string()
        .min(10, "Minimum character length is 10")
        .max(2000, "You have reached the max length")
        .required("Required"),
    })
  ),
});

export function CreateFlashcard() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.theme);
  const [toast, setToast] = useState(false);

  const handleSubmit = (values, { resetForm }) => {
    dispatch(add(values));
    resetForm();
    setToast(true);
    setTimeout(() => {
      setToast(false);
    }, 2000);
  };

  return (
    <Formik
      initialValues={{
        groups: {
          group_Id: generate_UniqueId("group"),
          group: "",
          groupDesc: "",
          Profile: null,
        },
        terms: [
          {
            card_Id: generate_UniqueId("card"),
            term: "",
            defination: "",
            image: null,
          },
        ],
      }}
      validationSchema={flashcardSchema}
      onSubmit={handleSubmit}
      validateOnMount
    >
      {({ values, isValid, setFieldValue, dirty }) => (
        <Form autoComplete="false">
          <section
            className={`mb-10 flex flex-col gap-10 transition-all duration-700 ${
              theme ? "bg-white-100" : "bg-slate-900"
            }`}
          >
            {toast && (
              <Toast
                fn={() => setToast(false)}
                toastClass={!toast ? "-translate-y-96" : "translate-y-0"}
              />
            )}

            <CreateGroup values={values} setFieldValue={setFieldValue} />

            <CreateTerm setFieldValue={setFieldValue} values={values} />
          </section>

          <div
            className={`mx-auto text-center transition-all duration-700 ${
              theme ? "bg-white-100" : "bg-slate-900"
            }`}
          >
            <Button
              data-testid="submit-form"
              disabled={!isValid}
              type="submit"
              btnclass={`font-semibold rounded-md text-white text-xl px-14 py-4 ${
                !isValid ? "bg-red-200" : "bg-red-600"
              }`}
              text={"Create Flashcard"}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
