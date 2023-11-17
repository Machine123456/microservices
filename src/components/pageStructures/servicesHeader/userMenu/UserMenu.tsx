import { useState } from "react";
import { useLanguage, useUser } from "../../../../hooks/useCustomContext";
import UserDropDown from "../../../dropDownMenu/userDropDown/UserDropDown";
import LoadingCircle from "../../../utils/loadingCircle/LoadingCircle";
import "./UserMenu.css";
import PopupMenu from "../../../utils/popupMenu/PopupMenu";
import FormToggle from "../../../forms/formToggle/FormToggle";
import { FormType } from "../../../forms/formToggle/FormToggle.hooks";
import { ClickBtn3 } from "../../../utils/buttons/customBtn/CustomBtn";

export default function UserMenu() {
  const { isLoading, user } = useUser();
  const { textData } = useLanguage();

  const [popup, setPoput] = useState<FormType | undefined>(undefined);

  return (
    <div className="user-menu">
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          {(!user || user.id === -1) && (
            <>
              <ClickBtn3
                text={textData.loginForm.form.title}
                onClick={() => setPoput(FormType.Login)}
              />
              <ClickBtn3
                text={textData.registrationForm.form.title}
                onClick={() => setPoput(FormType.Registration)}
              />
            </>
          )}
          <UserDropDown user={user} />
        </>
      )}

      {popup && (
        <PopupMenu onExitClick={() => setPoput(undefined)}>
          <FormToggle startForm={popup} onSucess={() => setPoput(undefined)} />
        </PopupMenu>
      )}
    </div>
  );
}
