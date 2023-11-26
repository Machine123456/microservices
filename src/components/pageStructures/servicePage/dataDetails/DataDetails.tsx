import "./DataDetails.css";

import { ReactElement } from "react";
import { Service } from "../ServicePage";
import { Authority, FetchDataType, Role, User } from "../../../../utils/models";
import { capitalizeFirstLetter } from "../../../../utils/funcs";
import LoadingCircle from "../../../utils/loadingCircle/LoadingCircle";
import { useParams } from "react-router-dom";
import { ImgBtn1 } from "../../../utils/buttons/customBtn/CustomBtn";
import { useDataFetch } from "../ServicePage.hooks";

type DataDetailsProps = {
    dataType: FetchDataType
};

function DataDetails({ dataType }: DataDetailsProps) {

    const userDetail = ({ username, email }: User) => (
        <>
            <div className="data-title">{username}</div>
            <div className="data-field">{email}</div>
        </>
    );

    const roleDetail = ({ name }: Role) => (
        <>
            <div className="data-title">{name}</div>
        </>
    );

    const authorityDetail = ({ authority }: Authority) => (
        <>
            <div className="data-title">{authority}</div>
        </>
    );

    switch (dataType) {
        case "user": return <Inner dataName="users" service="Authentication" dataDetail={userDetail} />
        case "role": return <Inner dataName="roles" service="Authentication" dataDetail={roleDetail} />
        case "authority": return <Inner dataName="authorities" service="Authentication" dataDetail={authorityDetail} />
    }
}

type InnerProps<T> = {
    service: Service;
    dataName: "users" | "roles" | "authorities";
    dataDetail: (data: T) => ReactElement;
};

function Inner<T>({ service, dataName, dataDetail }: InnerProps<T>) {

    const { id } = useParams();
    const {data,isLoading,refreshData} = useDataFetch<T>(
        {
            dataName,
            service,
            dataParams: new Map<string, string>([["id", id ?? "-1"]])
        });

    return (
        <div className="details-page">
            <div className="details-header">
                <h1>{capitalizeFirstLetter(dataName) + " Detail"}</h1>
                {!isLoading && <ImgBtn1 imgSrc="/refresh.png" onClick={() => refreshData} />}
            </div>

            <div className="details-content">
                {isLoading ? (
                    <LoadingCircle />
                ) : !data ? (<div className="empty-message">{"Error fetching " + dataName}</div>)
                    : (<div className="data-card">{dataDetail(data)}</div>)
                }
            </div>
        </div>
    );
}


export default DataDetails;


