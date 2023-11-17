import { ReactElement, useEffect, useState } from "react";
import { useUser } from "../../../../hooks/useCustomContext";
import "./FetchDataPage.css";
import { useFetch } from "../../../../hooks/useFetch";
import { Service } from "../ServicePage";
import { capitalizeFirstLetter } from "../../../../utils/funcs";
import LoadingCircle from "../../../utils/loadingCircle/LoadingCircle";
import { Authority, Role, User } from "../../../../utils/models";

type InnerProps<T> = {
  service: Service;
  dataName: "users" | "roles" | "authorities";
  dataCard: (data: T) => ReactElement;
};

type FetchDataPageProps = {
  dataType: "user" | "role" | "authority";
};

function UsersPage() {
  const userCard = ({ id, username, email }: User) => (
    <div className="data-card" key={id}>
      <div className="data-title">{username}</div>
      <div className="data-field">{email}</div>
    </div>
  );

  return (
    <Inner dataName="users" service="Authentication" dataCard={userCard} />
  );
}

//<div className="data-field">{authorities}</div>

function RolesPage() {
  const roleCard = ({ name, id }: Role) => (
    <div className="data-card" key={id}>
      <div className="data-title">{name}</div>
    </div>
  );

  return (
    <Inner dataName="roles" service="Authentication" dataCard={roleCard} />
  );
}

function AuthoritiesPage() {
    const authorityCard = ({ id, authority }: Authority) => (
      <div className="data-card" key={id}>
        <div className="data-title">{authority}</div>
      </div>
    );
  
    return (
      <Inner dataName="authorities" service="Authentication" dataCard={authorityCard} />
    );
  }

function Inner<T>({ service, dataName, dataCard }: InnerProps<T>) {
  const [data, setData] = useState<T[]>();
  const { token } = useUser();
  const { doFetch, isLoading } = useFetch({
    service,
    onData: (data) => {
      data
        .json()
        .then((res) => {
          if (data.status === 200) {
            const dataRes = res as T[];
            setData(dataRes);
          } else throw Error(res.error);
        })
        .catch((error) => {
          console.log("Error parsing " + dataName + ": " + error);
          setData(undefined);
        });
    },
    onError: (error) => {
      console.log("Error fetching " + dataName + ": " + error);
      setData(undefined);
    },
  });

  useEffect(() => {
    doFetch({
      endpoint: "api/" + dataName,
      fetchParams: {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      },
    });
  }, [token]);

  return (
    <div className="data-page">
      <h1>{capitalizeFirstLetter(dataName) + " List"}</h1>
      <div className="data-list">
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


export default function FetchDataPage({dataType}:FetchDataPageProps){

    switch (dataType) {
        case "user": return <UsersPage/>
        case "role": return <RolesPage/>
        case "authority": return <AuthoritiesPage/>
    }
}
