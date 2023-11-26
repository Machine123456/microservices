import "./DataList.css";

import { ReactElement } from "react";
import { Service } from "../ServicePage";
import { Authority, FetchDataType, Role, User } from "../../../../utils/models";
import { capitalizeFirstLetter } from "../../../../utils/funcs";
import LoadingCircle from "../../../utils/loadingCircle/LoadingCircle";
import { useNavigate } from "react-router-dom";
import { ImgBtn1 } from "../../../utils/buttons/customBtn/CustomBtn";
import { useDataFetch } from "../ServicePage.hooks";

type DataListProps = {
  dataType: FetchDataType;
};

function DataList({ dataType }: DataListProps) {

  const navigate = useNavigate();

  const userCard = ({ id, username, email }: User) => (
    <div className="data-card" key={id} onClick={() => navigate(id.toString(), { relative: "path" })}>
      <div className="data-title">{username}</div>
      <div className="data-field">{email}</div>
    </div>
  );

  const roleCard = ({ id, name }: Role) => (
    <div className="data-card" key={id} onClick={() => navigate(id.toString(), { relative: "path" })}>
      <div className="data-title">{name}</div>
    </div>
  );

  const authorityCard = ({ id, authority }: Authority) => (
    <div className="data-card" key={id} onClick={() => navigate(id.toString(), { relative: "path" })}>
      <div className="data-title">{authority}</div>
    </div>
  );

  switch (dataType) {
    case "user": return <Inner dataName="users" service="Authentication" dataCard={userCard} />
    case "role": return <Inner dataName="roles" service="Authentication" dataCard={roleCard} />
    case "authority": return <Inner dataName="authorities" service="Authentication" dataCard={authorityCard} />
  }
}

type InnerProps<T> = {
  service: Service;
  dataName: "users" | "roles" | "authorities";
  dataCard: (data: T) => ReactElement;
};

function Inner<T>({ service, dataName, dataCard }: InnerProps<T>) {

  const {data,isLoading,refreshData} = useDataFetch<T[]>({dataName,service});
 
  return (
    <div className="list-page">
      <div className="list-header">
        <h1> {capitalizeFirstLetter(dataName) + " List"} </h1>
        {!isLoading && <ImgBtn1 imgSrc="/refresh.png" onClick={() => refreshData} />}
      </div>
      <div className="list-content">
        {isLoading ? (
          <LoadingCircle />
        ) : !data ? (
          <div className="empty-message">{"Error fetching " + dataName}</div>
        ) : data.length === 0 ? (
          <div className="empty-message">{"No " + dataName + " found."}</div>
        ) : (
          data.map(dataCard)
        )}
      </div>
    </div>
  );
}


export default DataList;


