import { MMKVLoader }from "react-native-mmkv-storage";

export const MMKV = new MMKVLoader().initialize()



export const saveDataMMKV = (data: Record<string, string>) => {
    for(const [key, value] of Object.entries(data)) {
        MMKV.setString(key, value)
    }
}


export const getDataMMKV = (key: string): string | null => {
    return MMKV.getString(key) ?? null
}

export const deleteDataMMKV = (key: string) => {
    MMKV.removeItem(key)
}
