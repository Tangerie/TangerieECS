import ComponentManager from "./ComponentManager";
import { Entity } from "./Entity";
import { EntityFactory } from "./EntityFactory";
import EntityManager from "./EntityManager";
import SystemManager from "./SystemManager";

export interface IWorld {
    tick : number;
    delta : number;
    Update(delta : number) : void;
    instantiate(number : number, ...factories : EntityFactory<World>[]) : number[];
}

export default class World implements IWorld {
    protected static _current : World | undefined;

    static get current() {
        if(!this._current) throw new Error("No world created");
        return this._current;
    }

    private _tick : number = 0;
    private _delta : number = 1;

    public readonly components : ComponentManager;
    public readonly entities : EntityManager;
    public readonly systems : SystemManager;

    protected constructor() {
        this.components = new ComponentManager();
        this.entities = new EntityManager();
        this.systems = new SystemManager(this);
    }

    get tick() { return this._tick }

    get delta() { return this._delta }

    Update(delta : number) {
        this._delta = delta;

        this.systems.run();

        this._tick++;
    }


    instantiate(number : number = 1, ...factories : EntityFactory<World>[]) {
        const ids = new Array<Entity>(number);

        for(let i = 0; i < number; i++) {
            const entity = ids[i] = this.entities.createEntity();
            for(const factory of factories) {
                factory(entity, this);
            }
        }

        return ids;
    }
}