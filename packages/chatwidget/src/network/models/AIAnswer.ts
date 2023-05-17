import { Choice } from '../../types'

export default class AIAnswer {

    choices: Choice[] = []
    createdAt: number = 0

    constructor(createdAt: number, choices: Choice[]) {
        this.createdAt = createdAt
        this.choices = choices
    }

    getChoices = () => {
        return this.choices
    }

    getCreatedAt = () => {
        return this.createdAt
    }
}