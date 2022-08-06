import { Entity } from "./Entity";
import { EntityFactory } from "./EntityFactory";

export default class EntityManager {
    private entities : Entity[] = [];
    private index = 0;

    createEntity() {
        const i = this.index++;
        this.entities.push(i);
        return i;
    }
}