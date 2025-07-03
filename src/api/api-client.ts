
import { getAuth } from '@react-native-firebase/auth';
import { getApp } from '@react-native-firebase/app';


export const apiClient = async(url: string, bodyData: object, options: RequestInit = {}, method: string, queryParams: Record<string, string> = {}) => {
    
    let token = "";
    const auth = getAuth(getApp());
    const user = auth.currentUser
    
    if (user) {
    console.log("token is", token)
      token = await user.getIdToken();
    }


    const headers = {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
        ...options.headers  
    }

    const queryString = new URLSearchParams(queryParams).toString()

    const finalUrl = queryString? `${url}?${queryString}` : url


    console.log(`${finalUrl}`)


    const response = await fetch(`${finalUrl}`, {
        method,
        ...options,
        headers,
        ...(Object.keys(bodyData).length > 0 ? {body: JSON.stringify(bodyData)} : {})
    })

/*     console.log(response) */

    
/*     if(!response.ok) {
        throw new Error(`error: ${response.status}`)
    } */

    const data = await response.json();

    return {
        data, 
    };

}

