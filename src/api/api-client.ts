import * as Keychain from 'react-native-keychain';


export const apiClient = async(url: string, bodyData: object, options: RequestInit = {}, method: string, queryParams: Record<string, string> = {}) => {
    
    const tokenObj = await Keychain.getGenericPassword()
    let token = ""

    if(tokenObj) {
        token = tokenObj.password
    }
    console.log("token is", token)
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

    console.log(response)

    
/*     if(!response.ok) {
        throw new Error(`error: ${response.status}`)
    } */

    const data = await response.json();

    return {
        data, 
    };

}

