import { createContext, useContext, useEffect, useState } from "react"
import realmInstance from "../services/realm"



type RealmContextType = {
    data: any[] | null
    setData: (data: any[]) => void
    updateData: (newData: any) => void
}

const RealmContext = createContext<RealmContextType | undefined>(undefined);

export const RealmProvider = ({children}: {children: React.ReactNode}) => {


    const [data, setData] = useState<any[]>([]); 


    const updateData = (newData: any) => {
        realmInstance.write(() => {
            const existingData = realmInstance.objects(newData.schema)[0]

            if(existingData) {

                Object.keys(newData).forEach(key => {
                    existingData[key] = newData[key]
                })

            } else {
                realmInstance.create(newData.schema, newData)
            }

        })
    }


    return (
        <RealmContext.Provider value={{data, setData, updateData}}>
            {children}
        </RealmContext.Provider>
    )
}


export const useRealm = (schema: string) => {
    const context = useContext(RealmContext)

    if(!context) {
        throw new Error("useRealm must be used within a RealmProvider")
    }

    const {data, setData, updateData} = context


    useEffect(() => {
        const dataResults = realmInstance.objects(schema);
      
        const dataListener = () => {
          const dataArray = dataResults.slice(); 
          setData(dataArray);
        };
      
        dataResults.addListener(dataListener);
      
        return () => {
          dataResults.removeListener(dataListener); 
        };
      }, [schema]);
      

      return {data, setData, updateData}
}