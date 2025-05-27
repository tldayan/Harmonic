import { UpdateMode } from "realm";
import realmInstance from "../../../services/realm";



export const saveUserAddressToRealm = (userAddress: UserAddress) => {
    console.log(userAddress)
    try {
        realmInstance.write(() => {
            realmInstance.create('UserAddress', userAddress, UpdateMode.Modified);
        });
        console.log("✅ Done saving user address to Realm");
    } catch (error) {
        console.log("❌ Error saving user address to Realm:", error);
    }
}