export interface CreatingPostState {
    state: boolean,
    action: string
}

export interface PollOption {
    optionId: number
    value: string
    errorMessage: string
}