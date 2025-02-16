import { PollOption } from "../../types/post-types"


export const filterOptions = (options : PollOption[]) => {

    let seen = new Set()
    let filtered = options.filter((eachOption) => {

        if(eachOption.value && !seen.has(eachOption.value)) {
            seen.add(eachOption.value)
            return true
        }
            
        return false

    })

    return filtered


}