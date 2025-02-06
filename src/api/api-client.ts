
import { getDataMMKV } from "../services/storage-service";
import * as Keychain from 'react-native-keychain';


export const apiClient = async(url: string, bodyData: object, options: RequestInit = {}, method: string, queryParams: Record<string, string> = {}) => {
    
    const tokenObj = await Keychain.getGenericPassword()
    let token = ""

    if(tokenObj) {
        console.log(tokenObj.password)
        token = tokenObj.password
    }
    
    const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers  
    }

    const queryString = new URLSearchParams(queryParams).toString()

    const finalUrl = queryString? `${url}?${queryString}` : url

/*     const UserUUID = getDataMMKV("UserUUID")
    const OrganizationUUID = getDataMMKV("OrganizationUUID") */
/*     const queryParams = (UserUUID && OrganizationUUID) ? `?userUUID=${UserUUID}&organizationUUID=${OrganizationUUID}` : "" */
    console.log(`${finalUrl}`)


    const response = await fetch(`${finalUrl}`, {
        method,
        ...options,
        headers,
        ...(Object.keys(bodyData).length > 0 ? {body: JSON.stringify(bodyData)} : {})
    })


    if(!response.ok) {
        throw new Error(`error: ${response.status}`)
    }

    return response.json()

}

